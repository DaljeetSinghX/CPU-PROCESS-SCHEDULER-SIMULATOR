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
    vector<Event> events;
    double avgWaitingTime = 0.0;
    double avgTurnaroundTime = 0.0;
    double avgResponseTime = 0.0;
    double cpuUtilization = 100.0;
    int contextSwitches = 0;

public:
    Scheduler(const vector<Process>& procs) : processes(procs) {
        for (auto& p : processes) {
            p.remainingTime = p.burstTime;
            p.startTime = -1;
            p.responseTime = -1;
        }
    }

    virtual ~Scheduler() = default;

    virtual void run() = 0;

    const vector<Process>& getProcesses() const { return processes; }
    const vector<GanttSegment>& getTimeline() const { return timeline; }
    const vector<Event>& getEvents() const { return events; }
    double getAvgWaitingTime() const { return avgWaitingTime; }
    double getAvgTurnaroundTime() const { return avgTurnaroundTime; }
    double getAvgResponseTime() const { return avgResponseTime; }
    double getCpuUtilization() const { return cpuUtilization; }
    int getContextSwitches() const { return contextSwitches; }

    void addEvent(int tick, const string& type, const string& processId, const string& message, const vector<string>& readyQueue, const string& runningProcessId = "", int remainingBurst = 0, int timeSlice = 0, int totalTimeSlice = 0) {
        events.push_back({tick, type, processId, message, readyQueue, runningProcessId, remainingBurst, timeSlice, totalTimeSlice});
    }

    void calculateMetrics() {
        int totalWaitingTime = 0;
        int totalTurnaroundTime = 0;
        int totalResponseTime = 0;
        int totalBusyTime = 0;
        int maxCompletionTime = 0;

        for (auto& p : processes) {
            p.turnaroundTime = p.completionTime - p.arrivalTime;
            p.waitingTime = p.turnaroundTime - p.burstTime;
            if (p.waitingTime < 0) p.waitingTime = 0;

            if (p.startTime != -1) {
                p.responseTime = p.startTime - p.arrivalTime;
                if (p.responseTime < 0) p.responseTime = 0;
            } else {
                p.responseTime = 0;
            }

            totalWaitingTime += p.waitingTime;
            totalTurnaroundTime += p.turnaroundTime;
            totalResponseTime += p.responseTime;
            totalBusyTime += p.burstTime;
            if (p.completionTime > maxCompletionTime) {
                maxCompletionTime = p.completionTime;
            }
        }

        if (!processes.empty()) {
            avgWaitingTime = static_cast<double>(totalWaitingTime) / processes.size();
            avgTurnaroundTime = static_cast<double>(totalTurnaroundTime) / processes.size();
            avgResponseTime = static_cast<double>(totalResponseTime) / processes.size();
        }

        if (maxCompletionTime > 0) {
            cpuUtilization = (static_cast<double>(totalBusyTime) / maxCompletionTime) * 100.0;
        } else {
            cpuUtilization = 0.0;
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
