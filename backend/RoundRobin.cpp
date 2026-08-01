#include "Scheduler.h"
#include <queue>
#include <algorithm>

using namespace std;

class RoundRobinScheduler : public Scheduler {
private:
    int quantum;

public:
    RoundRobinScheduler(const vector<Process>& procs, int tmQuantum)
        : Scheduler(procs), quantum(tmQuantum) {}

    void run() override {
        if (processes.empty()) return;

        int n = processes.size();
        sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
            if (a.arrivalTime != b.arrivalTime) {
                return a.arrivalTime < b.arrivalTime;
            }
            return a.id < b.id;
        });

        vector<int> readyQueue; // indices in processes
        vector<bool> inQueue(n, false);
        int currentTime = 0;
        int completedCount = 0;
        int runningIdx = -1;
        int currentSlice = 0;
        string lastProcessId = "";

        // Check initial arrivals
        for (int i = 0; i < n; ++i) {
            if (processes[i].arrivalTime <= currentTime) {
                readyQueue.push_back(i);
                inQueue[i] = true;
                vector<string> rqNames;
                for (int idx : readyQueue) rqNames.push_back(processes[idx].id);
                addEvent(currentTime, "ARRIVAL", processes[i].id,
                         processes[i].id + " arrived and added to ready queue", rqNames, "IDLE", 0);
            }
        }

        while (completedCount < n) {
            // Check for new arrivals at currentTime (not inQueue yet)
            for (int i = 0; i < n; ++i) {
                if (!inQueue[i] && processes[i].remainingTime > 0 && processes[i].arrivalTime <= currentTime) {
                    readyQueue.push_back(i);
                    inQueue[i] = true;
                    vector<string> rqNames;
                    for (int idx : readyQueue) rqNames.push_back(processes[idx].id);
                    addEvent(currentTime, "ARRIVAL", processes[i].id,
                             processes[i].id + " arrived and added to ready queue", rqNames,
                             runningIdx != -1 ? processes[runningIdx].id : "IDLE",
                             runningIdx != -1 ? processes[runningIdx].remainingTime : 0);
                }
            }

            // Dispatch if CPU idle
            if (runningIdx == -1) {
                if (!readyQueue.empty()) {
                    runningIdx = readyQueue.front();
                    readyQueue.erase(readyQueue.begin());
                    currentSlice = 0;

                    Process& p = processes[runningIdx];
                    if (p.startTime == -1) {
                        p.startTime = currentTime;
                    }

                    if (!lastProcessId.empty() && lastProcessId != p.id) {
                        contextSwitches++;
                    }
                    lastProcessId = p.id;

                    vector<string> rqNames;
                    for (int idx : readyQueue) rqNames.push_back(processes[idx].id);
                    addEvent(currentTime, "DISPATCH", p.id,
                             "CPU selected " + p.id + " (Time Slice: 0/" + to_string(quantum) + ")", rqNames,
                             p.id, p.remainingTime, currentSlice, quantum);
                } else {
                    vector<string> rqNames;
                    addEvent(currentTime, "IDLE", "IDLE", "CPU is IDLE (waiting for process arrival)", rqNames, "IDLE", 0);
                    addTimelineSegment("IDLE", currentTime, currentTime + 1);
                    currentTime++;
                    continue;
                }
            }

            // Execute 1 tick
            Process& p = processes[runningIdx];
            int startTime = currentTime;
            p.remainingTime--;
            currentSlice++;
            currentTime++;
            addTimelineSegment(p.id, startTime, currentTime);

            // Check arrivals during this tick
            vector<int> newlyArrived;
            for (int i = 0; i < n; ++i) {
                if (!inQueue[i] && processes[i].remainingTime > 0 && processes[i].arrivalTime <= currentTime) {
                    newlyArrived.push_back(i);
                    inQueue[i] = true;
                }
            }

            vector<string> rqNames;
            for (int idx : readyQueue) rqNames.push_back(processes[idx].id);
            for (int idx : newlyArrived) {
                rqNames.push_back(processes[idx].id);
                addEvent(currentTime, "ARRIVAL", processes[idx].id,
                         processes[idx].id + " arrived and added to ready queue", rqNames,
                         p.id, p.remainingTime);
            }
            for (int idx : newlyArrived) {
                readyQueue.push_back(idx);
            }

            if (p.remainingTime == 0) {
                p.completionTime = currentTime;
                completedCount++;
                inQueue[runningIdx] = false;
                vector<string> endRqNames;
                for (int idx : readyQueue) endRqNames.push_back(processes[idx].id);
                addEvent(currentTime, "COMPLETE", p.id,
                         p.id + " completed execution", endRqNames,
                         "IDLE", 0, currentSlice, quantum);
                runningIdx = -1;

            } else if (currentSlice >= quantum) {
                // Quantum expired -> Preempt
                readyQueue.push_back(runningIdx);
                vector<string> endRqNames;
                for (int idx : readyQueue) endRqNames.push_back(processes[idx].id);
                addEvent(currentTime, "PREEMPT", p.id,
                         p.id + " quantum expired (" + to_string(quantum) + " ticks). Preempted back to ready queue.",
                         endRqNames, p.id, p.remainingTime, currentSlice, quantum);
                runningIdx = -1;
            } else {
                vector<string> endRqNames;
                for (int idx : readyQueue) endRqNames.push_back(processes[idx].id);
                addEvent(currentTime, "EXECUTE", p.id,
                         "Executing " + p.id + " (Time Slice: " + to_string(currentSlice) + "/" + to_string(quantum) + ")",
                         endRqNames, p.id, p.remainingTime, currentSlice, quantum);
            }
        }

        calculateMetrics();
    }
};
