import React from 'react';
import { Award, Hourglass, SkipForward } from 'lucide-react';

export default function ResultsTable({ data }) {
  if (!data || !data.processes || data.processes.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        No simulation results. Run the simulation to view calculated process metrics.
      </div>
    );
  }

  const sortedProcesses = [...data.processes].sort((a, b) => {
    const aMatch = a.id.match(/^P(\d+)$/);
    const bMatch = b.id.match(/^P(\d+)$/);
    if (aMatch && bMatch) {
      return parseInt(aMatch[1], 10) - parseInt(bMatch[1], 15);
    }
    return a.id.localeCompare(b.id);
  });

  return (
    <div className="space-y-6">
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center gap-4 hover:border-slate-700 transition-colors group">
          <div className="p-3 bg-violet-500/10 rounded-xl text-violet-400 border border-violet-500/20 group-hover:scale-105 transition-transform duration-300">
            <Hourglass className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average Waiting Time</span>
            <span className="text-3xl font-bold font-mono text-slate-100 mt-1 block">
              {data.avgWaitingTime.toFixed(2)} <span className="text-sm font-normal text-slate-400">ticks</span>
            </span>
          </div>
        </div>

        <div className="relative overflow-hidden bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center gap-4 hover:border-slate-700 transition-colors group">
          <div className="p-3 bg-indigo-500/10 rounded-xl text-indigo-400 border border-indigo-500/20 group-hover:scale-105 transition-transform duration-300">
            <SkipForward className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Average Turnaround Time</span>
            <span className="text-3xl font-bold font-mono text-slate-100 mt-1 block">
              {data.avgTurnaroundTime.toFixed(2)} <span className="text-sm font-normal text-slate-400">ticks</span>
            </span>
          </div>
        </div>

      </div>

      <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <h3 className="text-lg font-semibold text-slate-150 border-b border-slate-800 pb-3">
          Process Execution Breakdown
        </h3>
        
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3">Process ID</th>
                <th className="px-4 py-3 text-center">Arrival Time</th>
                <th className="px-4 py-3 text-center">Burst Time</th>
                <th className="px-4 py-3 text-center">Priority</th>
                <th className="px-4 py-3 text-center">Start Time</th>
                <th className="px-4 py-3 text-center text-teal-400">Completion Time</th>
                <th className="px-4 py-3 text-center text-indigo-400">Turnaround Time</th>
                <th className="px-4 py-3 text-center text-violet-400">Waiting Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/20 text-slate-200">
              {sortedProcesses.map((proc, index) => (
                <tr key={index} className="hover:bg-slate-800/45 transition-colors group">
                  <td className="px-4 py-3 font-mono font-bold text-slate-100">{proc.id}</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-300">{proc.arrivalTime}</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-200">{proc.burstTime}</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-300">{proc.priority}</td>
                  <td className="px-4 py-3 text-center font-mono text-slate-300">
                    {proc.startTime === -1 ? 'N/A' : proc.startTime}
                  </td>
                  <td className="px-4 py-3 text-center font-mono text-teal-400 font-semibold">{proc.completionTime}</td>
                  <td className="px-4 py-3 text-center font-mono text-indigo-400 font-semibold">{proc.turnaroundTime}</td>
                  <td className="px-4 py-3 text-center font-mono text-violet-400 font-semibold">{proc.waitingTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 bg-slate-950/20 p-3 rounded-lg border border-slate-850">
          <span className="font-semibold uppercase text-slate-500 tracking-wider">Formulas:</span>
          <div>Turnaround Time (TAT) = Completion Time - Arrival Time</div>
          <div className="h-3 w-px bg-slate-800 hidden md:block"></div>
          <div>Waiting Time (WT) = Turnaround Time - Burst Time</div>
        </div>

      </div>

    </div>
  );
}
