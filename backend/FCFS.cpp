#include "Scheduler.h"
#include <algorithm>

using namespace std;

class FCFSScheduler : public Scheduler {
public:
    FCFSScheduler(const vector<Process>& procs) : Scheduler(procs) {}

    void run() override {
        if (processes.empty()) return;

        int n = processes.size();
        sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
            if (a.arrivalTime != b.arrivalTime) {
                return a.arrivalTime < b.arrivalTime;
            }
            return a.id < b.id;
        });

        int currentTime = 0;
        int completedCount = 0;
        vector<int> readyQueue; // indices in processes
        vector<bool> arrived(n, false);
        int runningIdx = -1;
        string lastProcessId = "";

        while (completedCount < n) {
            // 1. Check arrivals at currentTime
            for (int i = 0; i < n; ++i) {
                if (!arrived[i] && processes[i].arrivalTime <= currentTime) {
                    arrived[i] = true;
                    readyQueue.push_back(i);
                    vector<string> rqNames;
                    for (int idx : readyQueue) rqNames.push_back(processes[idx].id);
                    addEvent(currentTime, "ARRIVAL", processes[i].arrivalTime == currentTime ? processes[i].id : "", 
                             processes[i].id + " arrived and added to ready queue", rqNames, 
                             runningIdx != -1 ? processes[runningIdx].id : "IDLE", 
                             runningIdx != -1 ? processes[runningIdx].remainingTime : 0);
                }
            }

            // 2. Dispatch if CPU idle
            if (runningIdx == -1) {
                if (!readyQueue.empty()) {
                    runningIdx = readyQueue.front();
                    readyQueue.erase(readyQueue.begin());

                    if (processes[runningIdx].startTime == -1) {
                        processes[runningIdx].startTime = currentTime;
                    }

                    if (!lastProcessId.empty() && lastProcessId != processes[runningIdx].id) {
                        contextSwitches++;
                    }
                    lastProcessId = processes[runningIdx].id;

                    vector<string> rqNames;
                    for (int idx : readyQueue) rqNames.push_back(processes[idx].id);
                    addEvent(currentTime, "DISPATCH", processes[runningIdx].id,
                             "CPU selected " + processes[runningIdx].id + " for execution", rqNames,
                             processes[runningIdx].id, processes[runningIdx].remainingTime);
                } else {
                    vector<string> rqNames;
                    addEvent(currentTime, "IDLE", "IDLE", "CPU is IDLE (waiting for process arrival)", rqNames, "IDLE", 0);
                    addTimelineSegment("IDLE", currentTime, currentTime + 1);
                    currentTime++;
                    continue;
                }
            }

            // 3. Execute 1 tick
            Process& p = processes[runningIdx];
            int startTime = currentTime;
            p.remainingTime--;
            currentTime++;
            addTimelineSegment(p.id, startTime, currentTime);

            vector<string> rqNames;
            for (int idx : readyQueue) rqNames.push_back(processes[idx].id);

            // Check if arrived right at currentTime before event logging for completion
            for (int i = 0; i < n; ++i) {
                if (!arrived[i] && processes[i].arrivalTime == currentTime) {
                    arrived[i] = true;
                    readyQueue.push_back(i);
                    rqNames.push_back(processes[i].id);
                    addEvent(currentTime, "ARRIVAL", processes[i].id, 
                             processes[i].id + " arrived and added to ready queue", rqNames, 
                             p.id, p.remainingTime);
                }
            }

            if (p.remainingTime > 0) {
                addEvent(currentTime, "EXECUTE", p.id,
                         "Executing " + p.id + " (remaining: " + to_string(p.remainingTime) + " ticks)", rqNames,
                         p.id, p.remainingTime, p.burstTime - p.remainingTime, p.burstTime);
            } else {
                p.completionTime = currentTime;
                completedCount++;
                addEvent(currentTime, "COMPLETE", p.id,
                         p.id + " completed execution", rqNames,
                         "IDLE", 0, p.burstTime, p.burstTime);
                runningIdx = -1;

            }
        }

        calculateMetrics();
    }
};
