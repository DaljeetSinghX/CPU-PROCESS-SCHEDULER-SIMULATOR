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

    int remainingTime = 0;
    int tempArrival = 0;
};

struct GanttSegment {
    string processId;
    int startTime;
    int endTime;
};

#endif
