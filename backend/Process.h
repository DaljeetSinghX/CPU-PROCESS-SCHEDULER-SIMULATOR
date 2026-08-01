#ifndef PROCESS_H
#define PROCESS_H

#include <string>

using namespace std;

struct Process {
    string id;
    int arrivalTime;
    int burstTime;
    int priority;

    int startTime = -1;
    int completionTime = 0;
    int waitingTime = 0;
    int turnaroundTime = 0;
    int responseTime = -1;

    int remainingTime = 0;
    int tempArrival = 0;
};

struct GanttSegment {
    string processId;
    int startTime;
    int endTime;
};

struct Event {
    int tick;
    string type;          // "ARRIVAL", "DISPATCH", "EXECUTE", "PREEMPT", "COMPLETE", "IDLE", "CONTEXT_SWITCH"
    string processId;
    string message;
    vector<string> readyQueue;
    string runningProcessId;
    int remainingBurst;
    int timeSlice;        // current time slice used in RR or current execution tick
    int totalTimeSlice;   // quantum or total burst
};


#endif
