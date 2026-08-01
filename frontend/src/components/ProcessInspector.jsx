import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { X, Activity, Clock, CheckCircle2, AlertTriangle, Layers, BarChart2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProcessInspector = () => {
  const { inspectedProcessId, setInspectedProcessId, processes, currentTickState } = useSimulation();
  const { fullProcesses, ganttSegments, allEvents } = currentTickState;

  if (!inspectedProcessId) return null;

  const proc = processes.find(p => p.id === inspectedProcessId);
  const fullData = fullProcesses.find(fp => fp.id === inspectedProcessId) || proc;

  if (!proc) return null;

  // Filter gantt segments for this process
  const procSegments = (ganttSegments || []).filter(seg => seg.processId === inspectedProcessId);
  // Filter events for this process
  const procEvents = (allEvents || []).filter(e => e.processId === inspectedProcessId);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
        
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setInspectedProcessId(null)}
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
        />

        {/* Slide-over Drawer Panel */}
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className="relative w-full max-w-md bg-slate-900 border-l border-slate-800 shadow-2xl p-6 overflow-y-auto flex flex-col justify-between custom-scrollbar z-10"
        >
          <div>
            
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full shadow-lg"
                  style={{ backgroundColor: proc.color }}
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                    Process Inspector: {proc.id}
                  </h3>
                  <p className="text-xs text-slate-400">Detailed OS Process Telemetry</p>
                </div>
              </div>
              <button
                onClick={() => setInspectedProcessId(null)}
                className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <MetricItem label="Arrival Time" value={`${proc.arrivalTime} ticks`} />
              <MetricItem label="Burst Time" value={`${proc.burstTime} ticks`} />
              <MetricItem label="Priority Value" value={proc.priority} highlight="text-amber-400" />
              <MetricItem label="Start Time" value={fullData?.startTime !== undefined && fullData?.startTime !== -1 ? `${fullData.startTime} ticks` : 'Not Started'} />
              <MetricItem label="Completion Time" value={fullData?.completionTime ? `${fullData.completionTime} ticks` : 'Pending'} />
              <MetricItem label="Waiting Time" value={fullData?.waitingTime !== undefined ? `${fullData.waitingTime} ticks` : '-'} highlight="text-emerald-400" />
              <MetricItem label="Turnaround Time" value={fullData?.turnaroundTime !== undefined ? `${fullData.turnaroundTime} ticks` : '-'} highlight="text-cyan-400" />
              <MetricItem label="Response Time" value={fullData?.responseTime !== undefined && fullData?.responseTime !== -1 ? `${fullData.responseTime} ticks` : '-'} highlight="text-purple-400" />
            </div>

            {/* Mini Gantt Execution Intervals */}
            <div className="mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-3">
                <BarChart2 className="w-4 h-4 text-purple-400" />
                Process Execution Segments
              </h4>
              {procSegments.length === 0 ? (
                <span className="text-xs text-slate-600 italic">No execution intervals yet</span>
              ) : (
                <div className="space-y-2">
                  {procSegments.map((seg, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-slate-900 px-3 py-2 rounded-lg border border-slate-800 font-mono">
                      <span className="text-slate-400">Segment #{idx + 1}</span>
                      <span className="text-purple-300 font-bold">
                        Tick {seg.startTime} → Tick {seg.endTime} ({seg.endTime - seg.startTime} ticks)
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* State Transition History */}
            <div className="mb-6 bg-slate-950 p-4 rounded-xl border border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2 mb-3">
                <Activity className="w-4 h-4 text-emerald-400" />
                Event & State Log
              </h4>
              <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                {procEvents.map((ev, idx) => (
                  <div key={idx} className="text-xs text-slate-300 border-l-2 border-purple-500/50 pl-2.5 py-1">
                    <span className="text-[10px] font-mono text-purple-400 font-bold mr-1.5">[TICK {ev.tick}]</span>
                    <span>{ev.message}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <button
            onClick={() => setInspectedProcessId(null)}
            className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs rounded-xl transition-colors mt-4"
          >
            Close Inspector
          </button>
        </motion.div>

      </div>
    </AnimatePresence>
  );
};

const MetricItem = ({ label, value, highlight = 'text-purple-300' }) => (
  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
    <span className="text-[10px] font-semibold text-slate-400 block">{label}</span>
    <span className={`text-xs font-bold font-mono ${highlight}`}>{value}</span>
  </div>
);
