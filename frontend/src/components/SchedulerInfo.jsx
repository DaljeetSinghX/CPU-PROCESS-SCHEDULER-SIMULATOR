import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BookOpen, CheckCircle, XCircle } from 'lucide-react';

export const SchedulerInfo = () => {
  const { algorithm } = useSimulation();

  const ALGO_THEORY = {
    FCFS: {
      title: 'First-Come, First-Served (FCFS)',
      type: 'Non-Preemptive',
      complexity: 'O(N log N) (Sorting by arrival time)',
      starvation: 'No',
      rule: 'Executes processes strictly in the order they arrive in the ready queue.',
      overview: 'FCFS is the simplest CPU scheduling algorithm. When a process enters the ready queue, its Process Control Block (PCB) is linked to the tail of the queue. The CPU is allocated to the process at the head of the queue.',
      advantages: [
        'Simple to implement and easy to understand.',
        'Zero starvation; every process eventually gets CPU time.',
        'Minimal overhead as context switches only occur when a process terminates.'
      ],
      disadvantages: [
        'Convoy Effect: Short processes queued behind a long process suffer huge waiting times.',
        'Poor average waiting time and turnaround time.',
        'Not suitable for interactive or time-sharing operating systems.'
      ],
      osUseCase: 'Used in simple embedded batch processing systems and secondary job scheduling in mainframe operating systems.'
    },
    SJF: {
      title: 'Shortest Job First (SJF)',
      type: 'Non-Preemptive',
      complexity: 'O(N log N) (Min-heap or priority selection)',
      starvation: 'Yes (Long processes)',
      rule: 'Selects the process with the shortest CPU burst time among all arrived processes.',
      overview: 'SJF associates with each process the length of its next CPU burst. When the CPU becomes available, it is assigned to the process that has the smallest CPU burst. If two processes have equal burst times, FCFS tie-breaking is applied.',
      advantages: [
        'Provably optimal for minimizing average waiting time for a given set of processes.',
        'High throughput for small jobs.'
      ],
      disadvantages: [
        'Starvation: Long processes may wait indefinitely if short processes continuously arrive.',
        'Impossible to know exact CPU burst duration in advance in general-purpose OS.'
      ],
      osUseCase: 'Long-term job schedulers in batch processing systems where burst times can be estimated from historic job statistics.'
    },
    RR: {
      title: 'Round Robin (RR)',
      type: 'Preemptive',
      complexity: 'O(N) (FIFO queue push/pop per time slice)',
      starvation: 'No',
      rule: 'Allocates CPU time in cyclic fixed time quanta (slices). Preempts process when quantum expires.',
      overview: 'Designed for time-sharing systems. The ready queue is treated as a circular queue. The CPU scheduler goes around the queue, allocating CPU to each process for a time interval of up to 1 time quantum.',
      advantages: [
        'Excellent response time for interactive systems.',
        'Fair distribution of CPU time among all processes.',
        'No starvation.'
      ],
      disadvantages: [
        'High Context Switch Overhead if quantum is set too small.',
        'Degenerates into FCFS if quantum is set extremely large.'
      ],
      osUseCase: 'General-purpose multitasking desktop & mobile OS kernels (Linux CFS, Windows NT Scheduler, macOS).'
    },
    Priority: {
      title: 'Priority Scheduling',
      type: 'Non-Preemptive (or Preemptive)',
      complexity: 'O(N log N) (Priority queue ordering)',
      starvation: 'Yes (Low priority processes)',
      rule: 'CPU is allocated to the process with the highest priority (lower integer value = higher priority).',
      overview: 'A priority is associated with each process, and the CPU is allocated to the process with the highest priority. Equal-priority processes are scheduled in FCFS order. In this simulator, lower numerical values represent higher priority.',
      advantages: [
        'Allows critical system tasks to execute ahead of background tasks.',
        'Flexible mechanism for enforcing resource policies.'
      ],
      disadvantages: [
        'Indefinite Blocking / Starvation: Low-priority processes may never execute.',
        'Can lead to Priority Inversion unless aging techniques are implemented.'
      ],
      osUseCase: 'Real-Time Operating Systems (RTOS like FreeRTOS, VxWorks) and Linux real-time scheduling classes (SCHED_FIFO, SCHED_RR).'
    }
  };

  const currentInfo = ALGO_THEORY[algorithm] || ALGO_THEORY.FCFS;

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl max-w-5xl mx-auto space-y-6">
      
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs sm:text-sm font-bold text-purple-400 uppercase tracking-wider block mb-1">
            Algorithm Theory & Deep Dive
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 flex items-center gap-2.5">
            <BookOpen className="w-6 h-6 text-purple-400" />
            {currentInfo.title}
          </h2>
        </div>

        <div className="flex items-center gap-2.5">
          <span className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full border ${
            currentInfo.type.includes('Preemptive')
              ? 'bg-purple-500/10 text-purple-300 border-purple-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            {currentInfo.type}
          </span>
          <span className={`px-3.5 py-1.5 text-xs sm:text-sm font-bold rounded-full border ${
            currentInfo.starvation === 'Yes'
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          }`}>
            Starvation Risk: {currentInfo.starvation}
          </span>
        </div>
      </div>

      {/* Rule Box */}
      <div className="bg-slate-950 p-5 rounded-xl border border-purple-500/30 shadow-inner">
        <span className="text-xs sm:text-sm font-bold text-purple-300 uppercase tracking-wider block mb-1.5">Scheduling Rule</span>
        <p className="text-sm sm:text-base text-slate-100 font-bold leading-relaxed">{currentInfo.rule}</p>
      </div>

      {/* Overview */}
      <div>
        <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-2">Overview</h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium">{currentInfo.overview}</p>
      </div>

      {/* Advantages vs Disadvantages */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div className="bg-emerald-950/20 border border-emerald-500/20 p-5 rounded-xl">
          <h4 className="text-sm sm:text-base font-extrabold text-emerald-400 flex items-center gap-2 mb-3">
            <CheckCircle className="w-5 h-5" />
            Advantages
          </h4>
          <ul className="space-y-2.5 text-sm sm:text-base text-slate-200">
            {currentInfo.advantages.map((adv, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-emerald-400 font-black">•</span>
                <span className="font-medium">{adv}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-rose-950/20 border border-rose-500/20 p-5 rounded-xl">
          <h4 className="text-sm sm:text-base font-extrabold text-rose-400 flex items-center gap-2 mb-3">
            <XCircle className="w-5 h-5" />
            Disadvantages
          </h4>
          <ul className="space-y-2.5 text-sm sm:text-base text-slate-200">
            {currentInfo.disadvantages.map((dis, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="text-rose-400 font-black">•</span>
                <span className="font-medium">{dis}</span>
              </li>
            ))}
          </ul>
        </div>

      </div>

      {/* OS Real World Use Case & Complexity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
          <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider block mb-1">Time Complexity</span>
          <span className="text-sm sm:text-base font-mono font-extrabold text-purple-300">{currentInfo.complexity}</span>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
          <span className="text-xs sm:text-sm font-bold text-slate-400 uppercase tracking-wider block mb-1">Real-World OS Application</span>
          <span className="text-sm sm:text-base text-slate-200 font-medium">{currentInfo.osUseCase}</span>
        </div>
      </div>

    </div>
  );
};

export default SchedulerInfo;
