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

        queue<int> readyQueue;
        vector<bool> inQueue(n, false);
        int currentTime = 0;
        int completedCount = 0;

        for (int i = 0; i < n; ++i) {
            if (processes[i].arrivalTime <= currentTime) {
                readyQueue.push(i);
                inQueue[i] = true;
            }
        }

        if (readyQueue.empty()) {
            int earliestArrival = processes[0].arrivalTime;
            addTimelineSegment("IDLE", currentTime, earliestArrival);
            currentTime = earliestArrival;
            for (int i = 0; i < n; ++i) {
                if (processes[i].arrivalTime <= currentTime) {
                    readyQueue.push(i);
                    inQueue[i] = true;
                }
            }
        }

        while (completedCount < n) {
            if (readyQueue.empty()) {
                int nextArrival = 2e9;
                for (int i = 0; i < n; ++i) {
                    if (processes[i].remainingTime > 0 && processes[i].arrivalTime < nextArrival) {
                        nextArrival = processes[i].arrivalTime;
                    }
                }
                
                if (nextArrival != 2e9) {
                    addTimelineSegment("IDLE", currentTime, nextArrival);
                    currentTime = nextArrival;
                    for (int i = 0; i < n; ++i) {
                        if (!inQueue[i] && processes[i].remainingTime > 0 && processes[i].arrivalTime <= currentTime) {
                            readyQueue.push(i);
                            inQueue[i] = true;
                        }
                    }
                }
                continue;
            }

            int idx = readyQueue.front();
            readyQueue.pop();

            Process& p = processes[idx];
            
            if (p.startTime == -1) {
                p.startTime = currentTime;
            }

            int executionTime = min(quantum, p.remainingTime);
            addTimelineSegment(p.id, currentTime, currentTime + executionTime);
            
            currentTime += executionTime;
            p.remainingTime -= executionTime;

            for (int i = 0; i < n; ++i) {
                if (!inQueue[i] && processes[i].arrivalTime <= currentTime && processes[i].remainingTime > 0) {
                    readyQueue.push(i);
                    inQueue[i] = true;
                }
            }

            if (p.remainingTime > 0) {
                readyQueue.push(idx);
            } else {
                p.completionTime = currentTime;
                completedCount++;
            }
        }

        calculateMetrics();
    }
};
