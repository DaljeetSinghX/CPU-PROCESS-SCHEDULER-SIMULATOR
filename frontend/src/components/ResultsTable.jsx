import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Table, ExternalLink } from 'lucide-react';

export const ResultsTable = () => {
  const { currentTickState, currentTick, processes, setInspectedProcessId } = useSimulation();
  const fullProcesses = (currentTickState && currentTickState.fullProcesses) || [];

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-5">
        <h3 className="text-base sm:text-lg font-extrabold text-slate-100 flex items-center gap-2.5">
          <Table className="w-5 h-5 text-purple-400" />
          Process Telemetry Table
        </h3>
        <span className="text-xs font-semibold text-slate-400">
          Click any row to open Process Inspector
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono">
          <thead>
            <tr className="text-slate-300 border-b-2 border-slate-800/90 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider">
              <th className="pb-3.5 pl-3">ID</th>
              <th className="pb-3.5">Arrival Time</th>
              <th className="pb-3.5">Burst Time</th>
              <th className="pb-3.5">Priority</th>
              <th className="pb-3.5">Start Time</th>
              <th className="pb-3.5">Completion Time</th>
              <th className="pb-3.5">Waiting Time</th>
              <th className="pb-3.5 pr-3">Turnaround Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {processes.map(p => {
              const fullData = fullProcesses.find(fp => fp.id === p.id) || p;
              
              // Only reveal start time once currentTick reaches start time
              const hasStarted = fullData.startTime !== undefined && fullData.startTime !== -1 && currentTick >= fullData.startTime;
              // Only reveal completion & metric stats once currentTick reaches completion time
              const hasCompleted = fullData.completionTime !== undefined && currentTick >= fullData.completionTime;

              return (
                <tr
                  key={p.id}
                  onClick={() => setInspectedProcessId(p.id)}
                  className="group hover:bg-slate-800/50 cursor-pointer transition-colors"
                >
                  <td className="py-3.5 pl-3 font-sans font-bold text-sm sm:text-base">
                    <div className="flex items-center gap-2.5">
                      <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: p.color || '#8B5CF6' }} />
                      <span className="text-slate-100 group-hover:text-purple-300 transition-colors flex items-center gap-1">
                        {p.id}
                        <ExternalLink className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-purple-400 transition-opacity" />
                      </span>
                    </div>
                  </td>
                  <td className="py-3.5 text-sm sm:text-base font-bold text-slate-200">{p.arrivalTime}</td>
                  <td className="py-3.5 text-sm sm:text-base font-bold text-slate-200">{p.burstTime}</td>
                  <td className="py-3.5 text-sm sm:text-base font-extrabold text-amber-400">{p.priority}</td>
                  <td className="py-3.5 text-sm sm:text-base font-extrabold text-purple-300">
                    {hasStarted ? fullData.startTime : '-'}
                  </td>
                  <td className="py-3.5 text-sm sm:text-base font-extrabold text-purple-300">
                    {hasCompleted ? fullData.completionTime : '-'}
                  </td>
                  <td className="py-3.5 text-sm sm:text-base font-extrabold text-emerald-400">
                    {hasCompleted ? fullData.waitingTime : '-'}
                  </td>
                  <td className="py-3.5 pr-3 text-sm sm:text-base font-extrabold text-cyan-400">
                    {hasCompleted ? fullData.turnaroundTime : '-'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ResultsTable;
