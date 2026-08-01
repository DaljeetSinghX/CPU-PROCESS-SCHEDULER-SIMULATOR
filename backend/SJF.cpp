#include "Scheduler.h"
#include <algorithm>
#include <vector>

using namespace std;

class SJFScheduler : public Scheduler {
public:
    SJFScheduler(const vector<Process>& procs) : Scheduler(procs) {}

    void run() override {
        if (processes.empty()) return;

        int numCompleted = 0;
        int n = processes.size();
        vector<bool> isCompleted(n, false);
        vector<bool> arrived(n, false);
        int currentTime = 0;
        int runningIdx = -1;
        string lastProcessId = "";

        while (numCompleted < n) {
            // 1. Log arrivals at currentTime
            vector<string> rqNames;
            for (int i = 0; i < n; ++i) {
                if (!isCompleted[i] && processes[i].arrivalTime <= currentTime) {
                    if (!arrived[i]) {
                        arrived[i] = true;
                        addEvent(currentTime, "ARRIVAL", processes[i].id,
                                 processes[i].id + " arrived and added to ready pool", {},
                                 runningIdx != -1 ? processes[runningIdx].id : "IDLE",
                                 runningIdx != -1 ? processes[runningIdx].remainingTime : 0);
                    }
                    if (i != runningIdx) {
                        rqNames.push_back(processes[i].id);
                    }
                }
            }

            // 2. Dispatch if CPU idle
            if (runningIdx == -1) {
                int selectedIdx = -1;
                int minBurst = 2e9;

                for (int i = 0; i < n; ++i) {
                    if (!isCompleted[i] && processes[i].arrivalTime <= currentTime) {
                        if (processes[i].burstTime < minBurst) {
                            minBurst = processes[i].burstTime;
                            selectedIdx = i;
                        } 
                        else if (processes[i].burstTime == minBurst) {
                            if (selectedIdx == -1 || processes[i].arrivalTime < processes[selectedIdx].arrivalTime) {
                                selectedIdx = i;
                            } else if (processes[i].arrivalTime == processes[selectedIdx].arrivalTime && processes[i].id < processes[selectedIdx].id) {
                                selectedIdx = i;
                            }
                        }
                    }
                }

                if (selectedIdx == -1) {
                    addEvent(currentTime, "IDLE", "IDLE", "CPU is IDLE (waiting for shortest job arrival)", {}, "IDLE", 0);
                    addTimelineSegment("IDLE", currentTime, currentTime + 1);
                    currentTime++;
                    continue;
                } else {
                    runningIdx = selectedIdx;
                    Process& p = processes[runningIdx];
                    if (p.startTime == -1) {
                        p.startTime = currentTime;
                    }

                    if (!lastProcessId.empty() && lastProcessId != p.id) {
                        contextSwitches++;
                    }
                    lastProcessId = p.id;

                    vector<string> currentRq;
                    for (int i = 0; i < n; ++i) {
                        if (!isCompleted[i] && i != runningIdx && processes[i].arrivalTime <= currentTime) {
                            currentRq.push_back(processes[i].id);
                        }
                    }
                    addEvent(currentTime, "DISPATCH", p.id,
                             "CPU selected " + p.id + " (Shortest Burst: " + to_string(p.burstTime) + ")", currentRq,
                             p.id, p.remainingTime);
                }
            }

            // 3. Execute 1 tick
            Process& p = processes[runningIdx];
            int startTime = currentTime;
            p.remainingTime--;
            currentTime++;
            addTimelineSegment(p.id, startTime, currentTime);

            vector<string> currentRq;
            for (int i = 0; i < n; ++i) {
                if (!isCompleted[i] && i != runningIdx && processes[i].arrivalTime <= currentTime) {
                    currentRq.push_back(processes[i].id);
                }
            }

            if (p.remainingTime > 0) {
                addEvent(currentTime, "EXECUTE", p.id,
                         "Executing " + p.id + " (remaining: " + to_string(p.remainingTime) + " ticks)", currentRq,
                         p.id, p.remainingTime, p.burstTime - p.remainingTime, p.burstTime);
            } else {
                p.completionTime = currentTime;
                isCompleted[runningIdx] = true;
                numCompleted++;
                addEvent(currentTime, "COMPLETE", p.id,
                         p.id + " completed execution", currentRq,
                         "IDLE", 0, p.burstTime, p.burstTime);
                runningIdx = -1;

            }
        }

        calculateMetrics();
    }
};
