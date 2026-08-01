import React from 'react';
import { Cpu, Code2, Server } from 'lucide-react';

export const AboutTab = () => {
  return (
    <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-6 sm:p-8 shadow-xl max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="text-center pb-5 border-b border-slate-800">
        <div className="inline-flex items-center justify-center p-3.5 rounded-2xl bg-purple-600/20 border border-purple-500/30 text-purple-400 mb-3 shadow-lg shadow-purple-500/20">
          <Cpu className="w-9 h-9 animate-pulse" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 tracking-tight">CPU Process Scheduler Simulator</h2>
        <p className="text-xs sm:text-sm text-purple-400 font-bold mt-1.5">Full-Stack OS Simulation Engine & Subprocess Middleware</p>
      </div>

      {/* Tech Stack Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-purple-400 font-extrabold text-sm sm:text-base mb-3">
            <Server className="w-5 h-5" />
            C++17 Native Backend Engine
          </div>
          <ul className="space-y-2.5 text-sm sm:text-base text-slate-200">
            <li className="flex items-start gap-2.5">
              <span className="text-purple-400 font-black">•</span>
              <span className="font-medium">Polymorphic OOP Architecture with virtual <code className="text-purple-300 font-bold">Scheduler</code> base class.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-purple-400 font-black">•</span>
              <span className="font-medium">High-performance deterministic algorithms: FCFS, SJF, Round Robin, Priority.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-purple-400 font-black">•</span>
              <span className="font-medium">Tick-by-tick event stream emission (Arrival, Dispatch, Execution, Preemption, Completion, Context Switch).</span>
            </li>
          </ul>
        </div>

        <div className="bg-slate-950 p-5 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-sm sm:text-base mb-3">
            <Code2 className="w-5 h-5" />
            React + Vite + Tailwind CSS Frontend
          </div>
          <ul className="space-y-2.5 text-sm sm:text-base text-slate-200">
            <li className="flex items-start gap-2.5">
              <span className="text-cyan-400 font-black">•</span>
              <span className="font-medium">Real-time tick playback engine with speed adjustment and scrubbing slider.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-cyan-400 font-black">•</span>
              <span className="font-medium">Framer Motion smooth card transitions, queue reordering, and side drawer inspector.</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-cyan-400 font-black">•</span>
              <span className="font-medium">Subprocess stdin/stdout communication via Node.js Vite server middleware proxy.</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Equations */}
      <div className="bg-slate-950 p-5 sm:p-6 rounded-xl border border-slate-800">
        <h3 className="text-xs sm:text-sm font-bold text-slate-300 uppercase tracking-wider mb-4">OS Metric Formulas</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-mono">
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
            <span className="text-purple-400 font-extrabold block mb-1">Turnaround Time (TAT)</span>
            <span className="text-slate-200 font-bold">TAT = Completion Time - Arrival Time</span>
          </div>
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
            <span className="text-cyan-400 font-extrabold block mb-1">Waiting Time (WT)</span>
            <span className="text-slate-200 font-bold">WT = Turnaround Time - Burst Time</span>
          </div>
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
            <span className="text-emerald-400 font-extrabold block mb-1">Response Time (RT)</span>
            <span className="text-slate-200 font-bold">RT = First CPU Start Time - Arrival Time</span>
          </div>
          <div className="bg-slate-900 p-3.5 rounded-lg border border-slate-800">
            <span className="text-amber-400 font-extrabold block mb-1">CPU Utilization (%)</span>
            <span className="text-slate-200 font-bold">Util = (Total Busy Time / Max Completion) * 100</span>
          </div>
        </div>
      </div>

    </div>
  );
};

export default AboutTab;
