import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

export const GanttChart = () => {
  const { currentTickState, maxTicks, processes, setInspectedProcessId } = useSimulation();
  const ganttSegments = (currentTickState && currentTickState.ganttSegments) || [];
  const [hoveredSeg, setHoveredSeg] = useState(null);

  const totalDuration = maxTicks || 1;

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 shadow-xl">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-400" />
            Gantt Chart
          </h3>
          <p className="text-xs text-slate-400">Visual representation of CPU execution over time</p>
        </div>
        <div className="bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs sm:text-sm font-semibold text-purple-300">
          Total Time: <span className="font-bold text-purple-200 font-mono">{maxTicks}</span> ticks
        </div>
      </div>

      {/* Gantt Bar Container */}
      <div className="relative">
        <div className="w-full bg-slate-950 border border-slate-800 rounded-xl h-16 p-1.5 flex items-center gap-1 overflow-hidden shadow-inner relative">
          {ganttSegments.length === 0 ? (
            <div className="w-full h-full flex items-center justify-center text-xs sm:text-sm text-slate-600 italic">
              Simulation not started
            </div>
          ) : (
            ganttSegments.map((seg, idx) => {
              const pObj = processes.find(p => p.id === seg.processId);
              const color = seg.processId === 'IDLE' ? '#334155' : (pObj ? pObj.color : '#8B5CF6');
              const duration = seg.endTime - seg.startTime;
              const widthPercent = (duration / totalDuration) * 100;

              return (
                <motion.div
                  key={`${seg.processId}-${seg.startTime}-${idx}`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                  onClick={() => seg.processId !== 'IDLE' && setInspectedProcessId(seg.processId)}
                  onMouseEnter={() => setHoveredSeg(seg)}
                  onMouseLeave={() => setHoveredSeg(null)}
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: color,
                  }}
                  className={`h-full rounded-lg flex flex-col items-center justify-center relative cursor-pointer group transition-transform hover:brightness-110 shadow-md ${
                    seg.processId === 'IDLE' ? 'opacity-40' : ''
                  }`}
                >
                  <span className="text-sm font-black text-white drop-shadow-md tracking-tight">
                    {seg.processId}
                  </span>
                  <span className="text-[10px] sm:text-xs font-mono font-bold text-white/90">
                    {seg.startTime} - {seg.endTime}
                  </span>

                  {/* Segment Hover Tooltip */}
                  {hoveredSeg === seg && seg.processId !== 'IDLE' && (
                    <div className="absolute bottom-full mb-2 z-50 bg-slate-950 border border-slate-700 rounded-xl p-3 shadow-2xl text-left pointer-events-none min-w-[170px]">
                      <div className="flex items-center gap-2 mb-1.5 border-b border-slate-800 pb-1">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs font-bold text-slate-100">Process {seg.processId}</span>
                      </div>
                      <div className="space-y-0.5 text-xs text-slate-300 font-mono">
                        <div>Start Time: <span className="text-purple-300 font-semibold">{seg.startTime}</span></div>
                        <div>End Time: <span className="text-purple-300 font-semibold">{seg.endTime}</span></div>
                        <div>Burst Span: <span className="text-emerald-300 font-semibold">{seg.endTime - seg.startTime}</span></div>
                        {pObj && (
                          <>
                            <div>Arrival Time: <span className="text-slate-400">{pObj.arrivalTime}</span></div>
                            <div>Priority: <span className="text-amber-400">{pObj.priority}</span></div>
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </div>

        {/* Time Scale Axis Below */}
        <div className="relative w-full h-6 mt-1.5 flex items-center text-xs font-mono font-bold text-slate-400">
          {Array.from({ length: Math.min(totalDuration + 1, 21) }, (_, i) => {
            const step = Math.ceil(totalDuration / 10) || 1;
            const val = i * step;
            if (val > totalDuration) return null;
            const leftPercent = (val / totalDuration) * 100;

            return (
              <div
                key={val}
                className="absolute flex flex-col items-center transform -translate-x-1/2"
                style={{ left: `${leftPercent}%` }}
              >
                <div className="w-[1.5px] h-2 bg-slate-600 mb-0.5" />
                <span>{val}</span>
              </div>
            );
          })}
          <div
            className="absolute flex flex-col items-center right-0 transform translate-x-1/2"
          >
            <div className="w-[1.5px] h-2 bg-slate-600 mb-0.5" />
            <span>{totalDuration}</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default GanttChart;
