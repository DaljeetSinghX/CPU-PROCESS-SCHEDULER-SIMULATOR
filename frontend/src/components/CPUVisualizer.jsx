import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Cpu, ArrowRight, CheckCircle2, Clock, Activity, Layers, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const CPUVisualizer = () => {
  const { currentTickState, currentTick, maxTicks, processes, setInspectedProcessId } = useSimulation();
  
  const readyQueue = (currentTickState && currentTickState.readyQueue) || [];
  const runningProcessId = (currentTickState && currentTickState.runningProcessId) || 'IDLE';
  const completedProcesses = (currentTickState && currentTickState.completedProcesses) || [];
  const remainingBursts = (currentTickState && currentTickState.remainingBursts) || {};
  const cpuStatus = (currentTickState && currentTickState.cpuStatus) || 'IDLE';
  const timeSlice = (currentTickState && currentTickState.timeSlice) || 0;
  const totalTimeSlice = (currentTickState && currentTickState.totalTimeSlice) || 0;
  const ganttSegments = (currentTickState && currentTickState.ganttSegments) || [];
  const fullProcesses = (currentTickState && currentTickState.fullProcesses) || [];

  // Find running process details
  const runningProc = processes.find(p => p.id === runningProcessId);
  const remainingTime = runningProcessId && remainingBursts[runningProcessId] !== undefined
    ? remainingBursts[runningProcessId]
    : 0;
  const burstTime = runningProc ? runningProc.burstTime : 1;

  // Derive execution steps for "Process Execution Flow" box
  // Group full timeline segments into steps
  const fullTimeline = (currentTickState && currentTickState.allEvents) ? 
    ganttSegments : [];

  return (
    <div className="space-y-6">
      
      {/* 1. Top Section: CPU Execution Pipeline Box */}
      <div className="bg-slate-900/90 border border-purple-500/30 backdrop-blur-xl rounded-2xl p-6 shadow-2xl relative overflow-hidden">
        
        {/* Background Circuit Traces Accent */}
        <div className="absolute inset-0 opacity-15 pointer-events-none flex items-center justify-center">
          <svg className="w-full h-full" viewBox="0 0 800 300" fill="none">
            <path d="M100 150 H300 V100 H500 V150 H700" stroke="#8B5CF6" strokeWidth="2" strokeDasharray="6 6" />
            <path d="M150 80 H350 V220 H650" stroke="#3B82F6" strokeWidth="1.5" strokeDasharray="4 4" />
            <circle cx="300" cy="150" r="4" fill="#A855F7" />
            <circle cx="500" cy="150" r="4" fill="#3B82F6" />
          </svg>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-6 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400 shadow-md shadow-purple-500/20">
              <Activity className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-100 tracking-tight flex items-center gap-2">
                CPU Execution
              </h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className={`inline-flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${
                  cpuStatus === 'RUNNING'
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-sm'
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${cpuStatus === 'RUNNING' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                  {cpuStatus === 'RUNNING' ? 'Running' : 'Idle'}
                </span>
              </div>
            </div>
          </div>

          {/* Current Time Badge */}
          <div className="flex items-center gap-2 bg-slate-950/90 px-4 py-1.5 rounded-xl border border-slate-800 text-xs font-semibold shadow-inner">
            <Clock className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-slate-400">Current Time:</span>
            <span className="text-purple-300 font-mono font-extrabold">{currentTick} / {maxTicks}</span>
          </div>
        </div>

        {/* Pipeline Cards Grid (Ready Queue -> CPU -> Next/Running -> Completed) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 items-center gap-4 relative z-10">
          
          {/* Card 1: Ready Queue */}
          <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col min-h-[130px] shadow-inner justify-between">
            <span className="text-[11px] font-bold text-slate-400 mb-2 block text-center uppercase tracking-wider">
              Ready Queue
            </span>
            <div className="flex-1 flex flex-col justify-center gap-1.5">
              <AnimatePresence>
                {readyQueue.length === 0 ? (
                  <span className="text-xs text-slate-600 italic text-center">Empty</span>
                ) : (
                  readyQueue.map(pId => {
                    const pObj = processes.find(p => p.id === pId);
                    const color = pObj ? pObj.color : '#8B5CF6';
                    const rem = remainingBursts[pId] !== undefined ? remainingBursts[pId] : (pObj ? pObj.burstTime : 0);
                    return (
                      <motion.div
                        key={pId}
                        layout
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        onClick={() => setInspectedProcessId(pId)}
                        className="flex items-center gap-2 px-2.5 py-1 bg-slate-900/80 border border-slate-800 rounded-lg cursor-pointer hover:border-purple-500/50 transition-all group"
                      >
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: color }} />
                        <span className="text-xs font-bold text-slate-200 group-hover:text-purple-300">{pId}</span>
                        <span className="text-[11px] text-slate-400 font-mono font-semibold">({rem})</span>
                      </motion.div>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Arrow 1 */}
          <div className="hidden md:flex justify-center absolute left-[23%] z-20 pointer-events-none">
            <ArrowRight className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>

          {/* Card 2: Glowing CPU Chip Core */}
          <div className="relative flex flex-col items-center justify-center p-4 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 border-2 border-purple-500/50 rounded-2xl shadow-xl shadow-purple-500/20 min-h-[130px]">
            <div className="w-16 h-16 rounded-2xl bg-slate-950 border-2 border-purple-500 flex flex-col items-center justify-center shadow-lg shadow-purple-500/30 relative">
              <span className="text-sm font-extrabold text-white tracking-widest drop-shadow-md">CPU</span>
              <svg className="w-8 h-4 text-purple-400 mt-1" viewBox="0 0 40 20" fill="none">
                <path d="M0 10 Q10 0 20 10 T40 10" stroke="currentColor" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 mt-2 tracking-wider">Native Core</span>
          </div>

          {/* Arrow 2 */}
          <div className="hidden md:flex justify-center absolute left-[48%] z-20 pointer-events-none">
            <ArrowRight className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>

          {/* Card 3: Next / Running Execution Box */}
          <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col min-h-[130px] shadow-inner justify-between text-center">
            <span className="text-[11px] font-bold text-slate-400 mb-1 block uppercase tracking-wider">
              {cpuStatus === 'RUNNING' ? 'Running' : 'Next'}
            </span>
            <div className="flex-1 flex flex-col items-center justify-center">
              {runningProc ? (
                <motion.div
                  key={runningProc.id}
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  onClick={() => setInspectedProcessId(runningProc.id)}
                  className="cursor-pointer"
                >
                  <span className="text-lg font-extrabold block drop-shadow-md" style={{ color: runningProc.color }}>
                    {runningProc.id}
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-300 block mt-0.5">
                    ({burstTime - remainingTime} / {burstTime})
                  </span>
                  {totalTimeSlice > 0 && (
                    <span className="text-[10px] font-mono text-purple-400 block mt-0.5 font-semibold">
                      Time Slice: {timeSlice} / {totalTimeSlice}
                    </span>
                  )}
                </motion.div>
              ) : (
                <span className="text-xs text-slate-600 italic">None</span>
              )}
            </div>
            {/* Progress Bar */}
            <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800 mt-2">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-indigo-500 transition-all duration-300"
                style={{ width: `${runningProc ? Math.min(100, Math.max(0, ((burstTime - remainingTime) / burstTime) * 100)) : 0}%` }}
              />
            </div>
          </div>

          {/* Arrow 3 */}
          <div className="hidden md:flex justify-center absolute left-[73%] z-20 pointer-events-none">
            <ArrowRight className="w-5 h-5 text-purple-400 animate-pulse" />
          </div>

          {/* Card 4: Completed Processes */}
          <div className="bg-slate-950/90 border border-slate-800/90 rounded-2xl p-4 flex flex-col min-h-[130px] shadow-inner justify-between">
            <span className="text-[11px] font-bold text-slate-400 mb-2 block text-center uppercase tracking-wider">
              Completed
            </span>
            <div className="flex-1 flex flex-wrap items-center justify-center gap-2">
              <AnimatePresence>
                {completedProcesses.length === 0 ? (
                  <span className="text-xs text-slate-600 italic">None</span>
                ) : (
                  completedProcesses.map(pId => {
                    const pObj = processes.find(p => p.id === pId);
                    const color = pObj ? pObj.color : '#10B981';
                    return (
                      <motion.span
                        key={pId}
                        layout
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        onClick={() => setInspectedProcessId(pId)}
                        className="text-xs font-extrabold cursor-pointer hover:underline"
                        style={{ color: color }}
                      >
                        {pId}
                      </motion.span>
                    );
                  })
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>

      </div>

      {/* 2. Bottom Sub-Section: "Process Execution Flow" Card */}
      <div className="bg-slate-900/90 border-2 border-purple-500/40 backdrop-blur-xl rounded-2xl p-6 shadow-2xl shadow-purple-500/10 relative">
        
        {/* Header */}
        <div className="flex items-center justify-between gap-2 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Layers className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-100 tracking-tight">
              Process Execution Flow
            </h3>
          </div>

          <div className="bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 text-xs font-semibold text-purple-300">
            Total Steps: <span className="font-bold text-purple-200">{ganttSegments.length}</span>
          </div>
        </div>

        {/* 2-Column Grid Layout (Left Timeline Steps + Right Segment Telemetry Table) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Timeline Steps List (5 cols) */}
          <div className="lg:col-span-5 space-y-3">
            {ganttSegments.length === 0 ? (
              <div className="text-xs text-slate-600 italic py-8 text-center bg-slate-950 rounded-xl border border-slate-800">
                Awaiting execution step data...
              </div>
            ) : (
              ganttSegments.map((seg, idx) => {
                const pObj = processes.find(p => p.id === seg.processId);
                const color = seg.processId === 'IDLE' ? '#475569' : (pObj ? pObj.color : '#8B5CF6');
                const isStepCompleted = currentTick >= seg.endTime;
                const isStepCurrent = currentTick >= seg.startTime && currentTick < seg.endTime;

                const totalBurst = pObj ? pObj.burstTime : (seg.endTime - seg.startTime);
                const executedSoFar = seg.processId === 'IDLE' ? 0 : Math.min(totalBurst, Math.max(0, currentTick - seg.startTime));

                return (
                  <motion.div
                    key={`step-${idx}-${seg.startTime}`}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => seg.processId !== 'IDLE' && setInspectedProcessId(seg.processId)}
                    className={`relative pl-7 p-3 rounded-xl border cursor-pointer transition-all ${
                      isStepCurrent
                        ? 'bg-slate-950 border-purple-500 shadow-md shadow-purple-500/20'
                        : isStepCompleted
                        ? 'bg-slate-950/80 border-slate-800/80 opacity-90 hover:opacity-100'
                        : 'bg-slate-950/40 border-slate-800/40 opacity-50'
                    }`}
                  >
                    {/* Step Node Dot */}
                    <div
                      className={`absolute left-2.5 top-4 w-3.5 h-3.5 rounded-full border-2 border-slate-950 flex items-center justify-center shadow-sm ${
                        isStepCurrent ? 'animate-ping' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    >
                      {isStepCompleted && <Check className="w-2.5 h-2.5 text-slate-950 font-bold" />}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-extrabold text-slate-100 flex items-center gap-1.5">
                        Step {idx + 1} ({seg.startTime}-{seg.endTime})
                      </span>
                      {isStepCompleted && (
                        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
                          Completed
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-slate-300 font-medium mt-1">
                      <span className="font-bold" style={{ color: color }}>{seg.processId}</span> executing ({executedSoFar}/{totalBurst})
                    </p>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Right Column: Execution Telemetry Table (7 cols) */}
          <div className="lg:col-span-7 bg-slate-950 rounded-xl border border-slate-800 p-4 overflow-x-auto shadow-inner">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="text-slate-400 border-b border-slate-800/80 font-sans font-semibold text-[11px]">
                  <th className="pb-2.5 pl-2">Time</th>
                  <th className="pb-2.5">Process</th>
                  <th className="pb-2.5">Action</th>
                  <th className="pb-2.5 pr-2">CPU State</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/40">
                {ganttSegments.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-slate-600 italic font-sans">
                      Execution flow waiting for simulation...
                    </td>
                  </tr>
                ) : (
                  ganttSegments.map((seg, idx) => {
                    const pObj = processes.find(p => p.id === seg.processId);
                    const color = seg.processId === 'IDLE' ? '#475569' : (pObj ? pObj.color : '#8B5CF6');
                    const isCompleted = currentTick >= seg.endTime;
                    const totalBurst = pObj ? pObj.burstTime : (seg.endTime - seg.startTime);
                    const executedSoFar = seg.processId === 'IDLE' ? 0 : Math.min(totalBurst, Math.max(0, currentTick - seg.startTime));
                    const segPercent = totalBurst > 0 ? (executedSoFar / totalBurst) * 100 : 0;

                    return (
                      <tr key={`row-${idx}`} className="hover:bg-slate-900/50 transition-colors">
                        <td className="py-2.5 pl-2 text-slate-300 font-bold">{seg.startTime}-{seg.endTime}</td>
                        <td className="py-2.5 font-bold" style={{ color: color }}>{seg.processId}</td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-sans font-bold border ${
                            isCompleted
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                              : 'bg-purple-500/10 text-purple-300 border-purple-500/20'
                          }`}>
                            {isCompleted ? 'Completed' : 'Running'}
                          </span>
                        </td>
                        <td className="py-2.5 pr-2">
                          <div className="flex items-center gap-2">
                            <div className="w-24 bg-slate-900 h-2.5 rounded-full overflow-hidden border border-slate-800">
                              <div
                                className="h-full transition-all duration-300 rounded-full"
                                style={{
                                  width: `${segPercent}%`,
                                  backgroundColor: color
                                }}
                              />
                            </div>
                            <span className="text-[10px] text-slate-400 font-semibold">({executedSoFar}/{totalBurst})</span>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};

export default CPUVisualizer;
