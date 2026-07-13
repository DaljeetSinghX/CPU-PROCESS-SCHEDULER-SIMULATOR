import React from 'react';
import { Award, BarChart3, Medal, Trophy } from 'lucide-react';

export default function ComparisonTable({ results = {} }) {
  const algoKeys = Object.keys(results);
  if (algoKeys.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        No comparative simulation results. Run the simulation to compare algorithms.
      </div>
    );
  }

  const comparisonData = algoKeys.map(key => ({
    name: key === 'Priority' ? 'Priority (Non-Preempt)' : key === 'RR' ? 'Round Robin' : key,
    fullName: key,
    avgWaitingTime: results[key].avgWaitingTime,
    avgTurnaroundTime: results[key].avgTurnaroundTime,
  }));

  const maxWaiting = Math.max(...comparisonData.map(d => d.avgWaitingTime), 1);
  const maxTurnaround = Math.max(...comparisonData.map(d => d.avgTurnaround), 1);

  const rankedData = [...comparisonData].sort((a, b) => a.avgWaitingTime - b.avgWaitingTime);

  const renderRankBadge = (index) => {
    switch (index) {
      case 0:
        return (
          <span className="flex items-center gap-1 text-amber-400 font-bold bg-amber-400/10 px-2 py-0.5 rounded border border-amber-500/20 text-xs">
            <Trophy className="w-3.5 h-3.5 fill-current" />
            1st (Best)
          </span>
        );
      case 1:
        return (
          <span className="flex items-center gap-1 text-slate-300 font-bold bg-slate-300/10 px-2 py-0.5 rounded border border-slate-400/20 text-xs">
            <Medal className="w-3.5 h-3.5 fill-current" />
            2nd
          </span>
        );
      case 2:
        return (
          <span className="flex items-center gap-1 text-amber-600 font-bold bg-amber-700/10 px-2 py-0.5 rounded border border-amber-800/20 text-xs">
            <Medal className="w-3.5 h-3.5 fill-current" />
            3rd
          </span>
        );
      default:
        return (
          <span className="text-slate-400 font-medium px-2 py-0.5 rounded text-xs select-none">
            {index + 1}th
          </span>
        );
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-indigo-400" />
            Algorithm Performance Comparison
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Leaderboard rankings ordered by Average Waiting Time (lowest is most optimal).
          </p>
        </div>
      </div>

      <div className="space-y-4">
        
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
                <th className="px-4 py-3 text-center w-20">Rank</th>
                <th className="px-4 py-3">Algorithm</th>
                <th className="px-4 py-3">Average Waiting Time</th>
                <th className="px-4 py-3">Average Turnaround Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 bg-slate-900/20 text-slate-200">
              {rankedData.map((item, index) => {
                const wtPercentage = (item.avgWaitingTime / maxWaiting) * 100;
                const tatPercentage = (item.avgTurnaroundTime / maxTurnaround) * 100;
                const isBest = index === 0;

                return (
                  <tr key={index} className={`transition-colors hover:bg-slate-800/45 ${isBest ? 'bg-indigo-500/5 hover:bg-indigo-500/10' : ''}`}>
                    
                    <td className="px-4 py-4 text-center align-middle">
                      <div className="flex justify-center">{renderRankBadge(index)}</div>
                    </td>

                    <td className="px-4 py-4 font-semibold text-slate-100 align-middle">
                      {item.name}
                      {isBest && (
                        <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-widest animate-pulse">
                          Optimal
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-4 space-y-1.5 max-w-xs align-middle">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-violet-400">{item.avgWaitingTime.toFixed(2)} ticks</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.max(3, wtPercentage)}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${isBest ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' : 'bg-violet-500'}`}
                        ></div>
                      </div>
                    </td>

                    <td className="px-4 py-4 space-y-1.5 max-w-xs align-middle">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="font-bold text-indigo-400">{item.avgTurnaroundTime.toFixed(2)} ticks</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                        <div
                          style={{ width: `${Math.max(3, tatPercentage)}%` }}
                          className={`h-full rounded-full transition-all duration-500 ${isBest ? 'bg-gradient-to-r from-emerald-500 to-indigo-500' : 'bg-indigo-500'}`}
                        ></div>
                      </div>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="bg-indigo-950/10 border border-indigo-900/30 rounded-xl p-4 text-xs text-indigo-300 leading-relaxed">
          <p className="font-semibold mb-1 flex items-center gap-1.5 text-indigo-200">
            <Award className="w-4 h-4 text-indigo-400" />
            Scheduling Insight
          </p>
          For the current set of process arrival times and bursts, the <strong>{rankedData[0]?.name}</strong> algorithm yields the minimal average waiting time ({rankedData[0]?.avgWaitingTime.toFixed(2)} ticks) making it the most resource-efficient choice. Note how shortest job scheduling and feedback loops generally decrease waiting overhead.
        </div>

      </div>

    </div>
  );
}
