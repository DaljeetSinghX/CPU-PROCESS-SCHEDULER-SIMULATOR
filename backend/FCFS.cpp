#include "Scheduler.h"
#include <algorithm>

using namespace std;

class FCFSScheduler : public Scheduler {
public:
    FCFSScheduler(const vector<Process>& procs) : Scheduler(procs) {}

    void run() override {
        if (processes.empty()) return;

        sort(processes.begin(), processes.end(), [](const Process& a, const Process& b) {
            if (a.arrivalTime != b.arrivalTime) {
                return a.arrivalTime < b.arrivalTime;
            }
            return a.id < b.id;
        });

        int currentTime = 0;
        for (auto& p : processes) {
            if (currentTime < p.arrivalTime) {
                addTimelineSegment("IDLE", currentTime, p.arrivalTime);
                currentTime = p.arrivalTime;
            }

            p.startTime = currentTime;
            p.completionTime = currentTime + p.burstTime;
  
            addTimelineSegment(p.id, currentTime, p.completionTime);
 
            currentTime = p.completionTime;
        }

        calculateMetrics();
    }
};
