#include <iostream>
#include <vector>
#include <string>
#include <iomanip>

#include "Process.h"
#include "Scheduler.h"

#include "FCFS.cpp"
#include "SJF.cpp"
#include "RoundRobin.cpp"
#include "Priority.cpp"

using namespace std;

void printAlgorithmJSON(const string& name, const Scheduler& scheduler) {
    cout << "  \"" << name << "\": {\n";
    
    cout << "    \"processes\": [\n";
    const auto& procs = scheduler.getProcesses();
    for (size_t i = 0; i < procs.size(); ++i) {
        const auto& p = procs[i];
        cout << "      {\n";
        cout << "        \"id\": \"" << p.id << "\",\n";
        cout << "        \"arrivalTime\": " << p.arrivalTime << ",\n";
        cout << "        \"burstTime\": " << p.burstTime << ",\n";
        cout << "        \"priority\": " << p.priority << ",\n";
        cout << "        \"startTime\": " << p.startTime << ",\n";
        cout << "        \"completionTime\": " << p.completionTime << ",\n";
        cout << "        \"waitingTime\": " << p.waitingTime << ",\n";
        cout << "        \"turnaroundTime\": " << p.turnaroundTime << "\n";
        cout << "      }" << (i + 1 < procs.size() ? "," : "") << "\n";
    }
    cout << "    ],\n";
    
    cout << "    \"timeline\": [\n";
    const auto& timeline = scheduler.getTimeline();
    for (size_t i = 0; i < timeline.size(); ++i) {
        const auto& seg = timeline[i];
        cout << "      {\n";
        cout << "        \"processId\": \"" << seg.processId << "\",\n";
        cout << "        \"startTime\": " << seg.startTime << ",\n";
        cout << "        \"endTime\": " << seg.endTime << "\n";
        cout << "      }" << (i + 1 < timeline.size() ? "," : "") << "\n";
    }
    cout << "    ],\n";
    
    cout << "    \"avgWaitingTime\": " << fixed << setprecision(2) << scheduler.getAvgWaitingTime() << ",\n";
    cout << "    \"avgTurnaroundTime\": " << fixed << setprecision(2) << scheduler.getAvgTurnaroundTime() << "\n";
    cout << "  }";
}

int main() {
    int rrQuantum = 4;
    
    if (!(cin >> rrQuantum)) {
        cerr << "Error reading scheduler logic quantum inputs\n";
        return 1;
    }

    int n = 0;
    if (!(cin >> n) || n <= 0) {
        cerr << "Error reading process count or count is invalid\n";
        return 1;
    }

    vector<Process> processes;
    for (int i = 0; i < n; ++i) {
        Process p;
        if (cin >> p.id >> p.arrivalTime >> p.burstTime >> p.priority) {
            processes.push_back(p);
        } else {
            cerr << "Error reading process entry number: " << i + 1 << "\n";
            return 1;
        }
    }

    FCFSScheduler fcfs(processes);
    fcfs.run();

    SJFScheduler sjf(processes);
    sjf.run();

    RoundRobinScheduler rr(processes, rrQuantum);
    rr.run();

    PriorityScheduler priority(processes);
    priority.run();

    cout << "{\n";
    printAlgorithmJSON("FCFS", fcfs);
    cout << ",\n";
    printAlgorithmJSON("SJF", sjf);
    cout << ",\n";
    printAlgorithmJSON("RR", rr);
    cout << ",\n";
    printAlgorithmJSON("Priority", priority);
    cout << "\n}\n";

    return 0;
}
