#ifndef SCHEDULER_H
#define SCHEDULER_H

#include "Process.h"
#include <vector>
#include <string>

using namespace std;

class Scheduler {
protected:
    vector<Process> processes;
    vector<GanttSegment> timeline;
    double avgWaitingTime = 0.0;
    double avgTurnaroundTime = 0.0;

public:
    Scheduler(const vector<Process>& procs) : processes(procs) {
        for (auto& p : processes) {
            p.remainingTime = p.burstTime;
        }
    }

    virtual ~Scheduler() = default;

    virtual void run() = 0;

    const vector<Process>& getProcesses() const { return processes; }
    const vector<GanttSegment>& getTimeline() const { return timeline; }
    double getAvgWaitingTime() const { return avgWaitingTime; }
    double getAvgTurnaroundTime() const { return avgTurnaroundTime; }

    void calculateMetrics() {
        int totalWaitingTime = 0;
        int totalTurnaroundTime = 0;
        for (auto& p : processes) {
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            
            if (p.waitingTime < 0) {
                p.waitingTime = 0;
            }
            
            totalWaitingTime += p.waitingTime;
            totalTurnaroundTime += p.turnaroundTime;
        }
        
        if (!processes.empty()) {
            avgWaitingTime = static_cast<double>(totalWaitingTime) / processes.size();
            avgTurnaroundTime = static_cast<double>(totalTurnaroundTime) / processes.size();
        }
    }

    void addTimelineSegment(const string& processId, int start, int end) {
        if (start >= end) return;
        
        if (!timeline.empty() && timeline.back().processId == processId && timeline.back().endTime == start) {
            timeline.back().endTime = end;
        } else {
            timeline.push_back({processId, start, end});
        }
    }
};

#endif
