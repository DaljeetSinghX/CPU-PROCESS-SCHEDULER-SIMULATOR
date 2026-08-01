import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Plus, Shuffle, Trash2, Settings2, Clock, Play, Pause, StepForward } from 'lucide-react';

export const ProcessTable = () => {
  const {
    processes,
    addProcess,
    removeProcess,
    updateProcess,
    generateRandomProcesses,
    algorithm,
    setAlgorithm,
    rrQuantum,
    setRrQuantum,
    loadPreset,
    isPlaying,
    play,
    pause,
    nextTick,
    runSimulation
  } = useSimulation();

  return (
    <div className="flex flex-col gap-5">
      
      {/* 1. Scheduling Algorithm Selector Panel (Top Card) */}
      <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-xl flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-indigo-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Scheduling Algorithm</h3>
        </div>

        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
          className="w-full bg-slate-950 border border-slate-800 text-slate-100 text-xs font-semibold rounded-xl p-3 focus:outline-none focus:border-purple-500 transition-colors shadow-inner cursor-pointer"
        >
          <option value="FCFS">First Come First Serve (FCFS)</option>
          <option value="SJF">Shortest Job First (SJF - Non-Preemptive)</option>
          <option value="RR">Round Robin (RR - Preemptive)</option>
          <option value="Priority">Priority Scheduling (Non-Preemptive)</option>
        </select>

        {/* Time Quantum (for RR) */}
        <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
          <div>
            <span className="text-xs font-semibold text-slate-300">Time Quantum (for RR)</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const newQ = Math.max(1, rrQuantum - 1);
                setRrQuantum(newQ);
                runSimulation(processes, newQ);
              }}
              className="w-7 h-7 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center font-bold text-xs border border-slate-700/60 cursor-pointer"
            >
              -
            </button>
            <span className="w-8 text-center text-xs font-bold text-purple-300 font-mono">{rrQuantum}</span>
            <button
              onClick={() => {
                const newQ = rrQuantum + 1;
                setRrQuantum(newQ);
                runSimulation(processes, newQ);
              }}
              className="w-7 h-7 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg flex items-center justify-center font-bold text-xs border border-slate-700/60 cursor-pointer"
            >
              +
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col gap-2 mt-1">
          <button
            onClick={isPlaying ? pause : play}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all transform active:scale-98 cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white" />}
            {isPlaying ? 'Pause Simulation' : 'Start Simulation'}
          </button>

          <button
            onClick={nextTick}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800/80 text-slate-300 font-semibold text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <StepForward className="w-3.5 h-3.5 text-purple-400" />
            Step by Step Mode
          </button>
        </div>

      </div>

      {/* 2. Configure Processes Panel (Bottom Card) */}
      <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between gap-2 mb-4">
          <div>
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-purple-400" />
              Configure Processes
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={addProcess}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg transition-all cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Process
            </button>
            <button
              onClick={generateRandomProcesses}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 rounded-lg transition-all cursor-pointer"
              title="Generate random processes"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Random Gen
            </button>
          </div>
        </div>

        {/* Preset Scenarios Selector */}
        <div className="mb-4">
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">Preset Scenarios</label>
          <select
            onChange={(e) => loadPreset(e.target.value)}
            defaultValue="default"
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            <option value="default">Default Balanced Scenario (4 Procs)</option>
            <option value="convoy">Convoy Effect (FCFS Bottleneck)</option>
            <option value="priorityTie">Priority & Tie-breaker Scenario</option>
            <option value="roundRobinStarvation">Round Robin Time Slice Demo</option>
          </select>
        </div>

        {/* Process Table List */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="text-slate-400 border-b border-slate-800/80 font-medium">
                <th className="pb-2.5 pl-2">ID</th>
                <th className="pb-2.5">Arrival</th>
                <th className="pb-2.5">Burst</th>
                <th className="pb-2.5">Priority</th>
                <th className="pb-2.5 text-right pr-2">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {processes.map((p) => (
                <tr key={p.id} className="group hover:bg-slate-800/30 transition-colors">
                  <td className="py-2.5 pl-2 font-semibold">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full shadow-sm"
                        style={{ backgroundColor: p.color || '#8B5CF6' }}
                      />
                      <span className="text-slate-100">{p.id}</span>
                    </div>
                  </td>
                  <td className="py-2.5">
                    <input
                      type="number"
                      min="0"
                      max="50"
                      value={p.arrivalTime}
                      onChange={(e) => updateProcess(p.id, 'arrivalTime', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs text-center focus:border-purple-500 outline-none font-mono"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="number"
                      min="1"
                      max="50"
                      value={p.burstTime}
                      onChange={(e) => updateProcess(p.id, 'burstTime', Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-14 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs text-center focus:border-purple-500 outline-none font-mono"
                    />
                  </td>
                  <td className="py-2.5">
                    <input
                      type="number"
                      min="0"
                      max="20"
                      value={p.priority}
                      onChange={(e) => updateProcess(p.id, 'priority', Math.max(0, parseInt(e.target.value) || 0))}
                      className="w-14 bg-slate-950 border border-slate-800 rounded-lg px-2 py-1 text-slate-200 text-xs text-center focus:border-purple-500 outline-none font-mono"
                    />
                  </td>
                  <td className="py-2.5 pr-2 text-right">
                    <button
                      onClick={() => removeProcess(p.id)}
                      disabled={processes.length <= 1}
                      className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors disabled:opacity-30 cursor-pointer"
                      title="Delete process"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

export default ProcessTable;
