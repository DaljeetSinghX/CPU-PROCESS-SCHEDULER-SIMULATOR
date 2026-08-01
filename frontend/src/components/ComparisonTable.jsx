import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Trophy, Award } from 'lucide-react';

export const ComparisonTable = () => {
  const { simulationResults, setAlgorithm, setActiveTab } = useSimulation();

  if (!simulationResults) {
    return (
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-center text-slate-300 text-base font-semibold">
        Run simulation first to compare algorithm performance.
      </div>
    );
  }

  const algos = ['FCFS', 'SJF', 'RR', 'Priority'];
  const data = algos.map(name => {
    const res = simulationResults[name] || {};
    return {
      name,
      avgWT: res.avgWaitingTime || 0,
      avgTAT: res.avgTurnaroundTime || 0,
      avgRT: res.avgResponseTime || 0,
      cpuUtil: res.cpuUtilization || 100,
      contextSwitches: res.contextSwitches || 0
    };
  });

  // Sort algorithms by Avg Waiting Time (lowest is best)
  const ranked = [...data].sort((a, b) => a.avgWT - b.avgWT);
  const winner = ranked[0];

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl max-w-5xl mx-auto space-y-6">
      
      {/* Winner Banner */}
      <div className="bg-gradient-to-r from-purple-900/40 via-indigo-900/40 to-slate-900 border border-purple-500/40 p-5 sm:p-6 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-purple-500/10">
        <div className="flex items-center gap-4">
          <div className="p-3.5 bg-amber-500/20 border border-amber-500/30 rounded-xl text-amber-400">
            <Trophy className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <span className="text-xs sm:text-sm font-bold text-amber-400 uppercase tracking-wider block">Optimal Algorithm Winner</span>
            <h3 className="text-xl sm:text-2xl font-black text-slate-100 mt-0.5">
              {winner ? winner.name : 'N/A'} <span className="text-purple-300 font-mono text-lg sm:text-xl font-bold">(Avg WT: {winner ? winner.avgWT.toFixed(2) : 0} ticks)</span>
            </h3>
          </div>
        </div>

        <button
          onClick={() => {
            if (winner) setAlgorithm(winner.name);
            setActiveTab('Simulator');
          }}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-extrabold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer"
        >
          Select Winner
        </button>
      </div>

      {/* Comparison Leaderboard Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left font-mono">
          <thead>
            <tr className="text-slate-300 border-b-2 border-slate-800 font-sans font-bold text-xs sm:text-sm uppercase tracking-wider">
              <th className="pb-3.5 pl-3">Rank</th>
              <th className="pb-3.5">Algorithm</th>
              <th className="pb-3.5">Avg. Waiting Time</th>
              <th className="pb-3.5">Avg. Turnaround Time</th>
              <th className="pb-3.5">Avg. Response Time</th>
              <th className="pb-3.5">CPU Utilization</th>
              <th className="pb-3.5 pr-3">Context Switches</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {ranked.map((item, index) => {
              const isWinner = index === 0;
              return (
                <tr
                  key={item.name}
                  className={`hover:bg-slate-800/50 transition-colors ${
                    isWinner ? 'bg-purple-950/20' : ''
                  }`}
                >
                  <td className="py-3.5 pl-3 font-sans font-bold text-sm sm:text-base">
                    {index === 0 ? (
                      <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-amber-500/20 text-amber-400 text-sm font-extrabold border border-amber-500/30">
                        1
                      </span>
                    ) : (
                      <span className="text-slate-500 pl-2">#{index + 1}</span>
                    )}
                  </td>
                  <td className="py-3.5 font-sans font-black text-slate-100 text-base sm:text-lg">
                    <span className="flex items-center gap-2">
                      {item.name}
                      {isWinner && <Award className="w-5 h-5 text-amber-400" />}
                    </span>
                  </td>
                  <td className="py-3.5 text-sm sm:text-base text-purple-300 font-extrabold">{item.avgWT.toFixed(2)} ticks</td>
                  <td className="py-3.5 text-sm sm:text-base text-cyan-300 font-extrabold">{item.avgTAT.toFixed(2)} ticks</td>
                  <td className="py-3.5 text-sm sm:text-base text-emerald-300 font-extrabold">{item.avgRT.toFixed(2)} ticks</td>
                  <td className="py-3.5 text-sm sm:text-base text-slate-200 font-bold">{item.cpuUtil.toFixed(0)}%</td>
                  <td className="py-3.5 pr-3 text-sm sm:text-base text-rose-300 font-bold">{item.contextSwitches}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default ComparisonTable;
