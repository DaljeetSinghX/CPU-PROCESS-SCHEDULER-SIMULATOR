import React from 'react';
import { Clock } from 'lucide-react';

export default function GanttChart({ timeline = [] }) {
  if (timeline.length === 0) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-400">
        No simulation timeline recorded. Run the simulation to view the Gantt Chart.
      </div>
    );
  }

  const getProcessColor = (id) => {
    if (id === 'IDLE') {
      return {
        bg: 'bg-slate-800/40',
        text: 'text-slate-400',
        border: 'border-slate-800',
        glow: ''
      };
    }
    
    let hash = 0;
    for (let i = 0; i < id.length; i++) {
      hash = id.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colors = [
      { bg: 'bg-blue-500/20 hover:bg-blue-500/30', text: 'text-blue-400', border: 'border-blue-500/50', glow: 'shadow-blue-500/5' },
      { bg: 'bg-emerald-500/20 hover:bg-emerald-500/30', text: 'text-emerald-400', border: 'border-emerald-500/50', glow: 'shadow-emerald-500/5' },
      { bg: 'bg-purple-500/20 hover:bg-purple-500/30', text: 'text-purple-400', border: 'border-purple-500/50', glow: 'shadow-purple-500/5' },
      { bg: 'bg-amber-500/20 hover:bg-amber-500/30', text: 'text-amber-400', border: 'border-amber-500/50', glow: 'shadow-amber-500/5' },
      { bg: 'bg-rose-500/20 hover:bg-rose-500/30', text: 'text-rose-400', border: 'border-rose-500/50', glow: 'shadow-rose-500/5' },
      { bg: 'bg-cyan-500/20 hover:bg-cyan-500/30', text: 'text-cyan-400', border: 'border-cyan-500/50', glow: 'shadow-cyan-500/5' },
      { bg: 'bg-indigo-500/20 hover:bg-indigo-500/30', text: 'text-indigo-400', border: 'border-indigo-500/50', glow: 'shadow-indigo-500/5' },
      { bg: 'bg-fuchsia-500/20 hover:bg-fuchsia-500/30', text: 'text-fuchsia-400', border: 'border-fuchsia-500/50', glow: 'shadow-fuchsia-500/5' }
    ];
    
    const idx = Math.abs(hash) % colors.length;
    return colors[idx];
  };

  const uniqueProcessIds = Array.from(new Set(timeline.map(s => s.processId)))
    .filter(id => id !== 'IDLE')
    .sort();

  const totalTime = timeline[timeline.length - 1].endTime;

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      
      <div className="flex items-center justify-between border-b border-slate-800 pb-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            Gantt Chart Timeline
          </h3>
          <p className="text-xs text-slate-400 mt-1">Graphical representation of CPU execution slices.</p>
        </div>
        <div className="text-xs font-mono bg-slate-900 text-slate-300 border border-slate-800 px-3 py-1 rounded-lg">
          Total Makespan: <span className="text-indigo-400 font-bold">{totalTime} ticks</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 bg-slate-950/20 px-4 py-2 border border-slate-850 rounded-xl">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider mr-1">Legend:</span>
        {uniqueProcessIds.map(procId => {
          const style = getProcessColor(procId);
          return (
            <div key={procId} className="flex items-center gap-1.5 text-xs bg-slate-900/50 border border-slate-800 px-2 py-1 rounded">
              <span className={`w-2.5 h-2.5 rounded border ${style.text} ${style.bg} ${style.border}`}></span>
              <span className="font-mono text-slate-200">{procId}</span>
            </div>
          );
        })}
        <div className="flex items-center gap-1.5 text-xs bg-slate-900/50 border border-slate-800 px-2 py-1 rounded">
          <span className="w-2.5 h-2.5 rounded border border-slate-700 bg-slate-800/40"></span>
          <span className="font-mono text-slate-400">IDLE</span>
        </div>
      </div>

      <div className="relative pt-2 pb-6">
        <div className="overflow-x-auto pb-4 pt-1">
          <div className="flex min-w-[700px] border border-slate-800 rounded-xl overflow-hidden shadow-inner bg-slate-950/30">
            {timeline.map((segment, index) => {
              const duration = segment.endTime - segment.startTime;
              const theme = getProcessColor(segment.processId);
              
              return (
                <div
                  key={index}
                  style={{ flexGrow: duration, minWidth: `${Math.max(45, duration * 18)}px` }}
                  className={`relative flex flex-col items-center justify-center py-5 border-r border-slate-800/40 last:border-r-0 select-none group transition-all duration-300 ${theme.bg} ${theme.text} border-t-2 ${theme.border} capitalize shadow-lg ${theme.glow}`}
                >
                  <span className="font-mono font-bold text-sm tracking-wide group-hover:scale-110 transition-transform">
                    {segment.processId}
                  </span>
                  
                  <span className="text-[10px] opacity-75 mt-1 font-mono">
                    d:{duration}
                  </span>

                  <div className="absolute left-0 bottom-0 text-[10px] font-mono text-slate-500 translate-y-full pt-1.5">
                    {segment.startTime}
                  </div>
                  {index === timeline.length - 1 && (
                    <div className="absolute right-0 bottom-0 text-[10px] font-mono text-slate-500 translate-y-full pt-1.5">
                      {segment.endTime}
                    </div>
                  )}

                  <div className="absolute bottom-full mb-2 bg-slate-950 border border-slate-700 text-slate-100 rounded-lg p-2.5 text-xs shadow-2xl opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 min-w-[120px] text-left">
                    <div className="font-mono font-bold text-indigo-400 border-b border-slate-800 pb-1 mb-1 flex justify-between">
                      <span>{segment.processId}</span>
                      <span className="text-slate-400 font-normal">Execution Slice</span>
                    </div>
                    <div>Start Time: <strong className="font-mono">{segment.startTime}</strong></div>
                    <div>End Time: <strong className="font-mono">{segment.endTime}</strong></div>
                    <div>Burst Slice: <strong className="font-mono">{duration} ticks</strong></div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
