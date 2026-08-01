import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { CheckCircle2, Play, Heart } from 'lucide-react';

export const StatusBar = () => {
  const { algorithm, processes, maxTicks, currentTick, isPlaying } = useSimulation();

  const isCompleted = currentTick >= maxTicks && maxTicks > 0;

  return (
    <footer className="w-full bg-slate-950/95 border-t border-slate-800/80 px-6 py-2.5 text-xs text-slate-400 mt-auto">
      <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* Left Status */}
        <div className="flex items-center gap-2">
          {isCompleted ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Status: Simulation Complete
            </span>
          ) : isPlaying ? (
            <span className="flex items-center gap-1.5 text-purple-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-purple-400 animate-ping" />
              Status: Simulation Running...
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-slate-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-slate-500" />
              Status: Ready
            </span>
          )}
        </div>

        {/* Center Telemetry */}
        <div className="flex items-center gap-6 font-mono text-[11px]">
          <div>Algorithm: <span className="text-purple-300 font-bold">{algorithm}</span></div>
          <div>Total Processes: <span className="text-slate-200 font-bold">{processes.length}</span></div>
          <div>Total Time: <span className="text-purple-300 font-bold">{maxTicks}</span></div>
        </div>

        {/* Right Footer */}
        <div className="flex items-center gap-1 text-[11px] text-slate-500">
          <span>Built with</span>
          <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" />
          <span>using C++ & React</span>
        </div>

      </div>
    </footer>
  );
};

export default StatusBar;
