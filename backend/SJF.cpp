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
        int currentTime = 0;

        while (numCompleted < n) {
            int selectedIdx = -1;
            int minBurst = 2e9;

            for (int i = 0; i < n; ++i) {
                if (!isCompleted[i] && processes[i].arrivalTime <= currentTime) {
                    if (processes[i].burstTime < minBurst) {
                        minBurst = processes[i].burstTime;
                        selectedIdx = i;
                    } 
                    else if (processes[i].burstTime == minBurst) {
                        if (processes[i].arrivalTime != processes[selectedIdx].arrivalTime) {
                            if (processes[i].arrivalTime < processes[selectedIdx].arrivalTime) {
                                  selectedIdx = i;
                            }
                        } else if (processes[i].id < processes[selectedIdx].id) {
                            selectedIdx = i;
                        }
                    }
                }
            }

            if (selectedIdx == -1) {
                int nextArrival = 2e9;
                for (int i = 0; i < n; ++i) {
                    if (!isCompleted[i] && processes[i].arrivalTime < nextArrival) {
                        nextArrival = processes[i].arrivalTime;
                    }
                }
                
                if (nextArrival != 2e9) {
                    addTimelineSegment("IDLE", currentTime, nextArrival);
                    currentTime = nextArrival;
                }
            } else {
                Process& p = processes[selectedIdx];
                p.startTime = currentTime;
                p.completionTime = currentTime + p.burstTime;
                
                addTimelineSegment(p.id, currentTime, p.completionTime);
                currentTime = p.completionTime;
                isCompleted[selectedIdx] = true;
                numCompleted++;
            }
        }

        calculateMetrics();
    }
};
