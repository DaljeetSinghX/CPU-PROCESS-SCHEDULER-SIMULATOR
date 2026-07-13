import React from 'react';
import { Plus, Trash2, Sparkles, FolderOpen, Play } from 'lucide-react';

export default function ProcessTable({
  processes,
  setProcesses,
  rrQuantum,
  setRrQuantum,
  selectedAlgo,
  setSelectedAlgo,
  onRunSimulation,
  isSimulating
}) {

  const addProcess = () => {
    let maxNum = 0;
    processes.forEach(p => {
      const match = p.id.match(/^P(\d+)$/);
      if (match) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    
    const nextId = `P${maxNum + 1}`;
    setProcesses([
      ...processes,
      { id: nextId, arrivalTime: 0, burstTime: 5, priority: 1 }
    ]);
  };

  const deleteProcess = (indexToDelete) => {
    if (processes.length <= 1) return;
    const filtered = processes.filter((_, idx) => idx !== indexToDelete);
    setProcesses(filtered);
  };

  const updateProcess = (index, field, value) => {
    let parsedVal = parseInt(value, 10);
    if (isNaN(parsedVal)) {
      parsedVal = 0;
    }
    
    if (field === 'arrivalTime' || field === 'burstTime' || field === 'priority') {
      if (parsedVal < 0) parsedVal = 0;
      if (field === 'burstTime' && parsedVal < 1) parsedVal = 1;
    }

    const updated = [...processes];
    updated[index] = {
      ...updated[index],
      [field]: field === 'id' ? value : parsedVal
    };
    setProcesses(updated);
  };

  const generateRandomProcesses = () => {
    const count = Math.floor(Math.random() * 4) + 4;
    const generated = [];
    for (let i = 0; i < count; i++) {
      generated.push({
        id: `P${i + 1}`,
        arrivalTime: Math.floor(Math.random() * 10),
        burstTime: Math.floor(Math.random() * 12) + 2,
        priority: Math.floor(Math.random() * 8) + 1
      });
    }
    generated.sort((a, b) => a.arrivalTime - b.arrivalTime);
    setProcesses(generated);
  };

  const loadScenario = (scenario) => {
    switch (scenario) {
      case 'convoy':
        setProcesses([
          { id: 'P1', arrivalTime: 0, burstTime: 20, priority: 3 },
          { id: 'P2', arrivalTime: 1, burstTime: 2, priority: 2 },
          { id: 'P3', arrivalTime: 2, burstTime: 3, priority: 1 }
        ]);
        break;
      case 'sjf-demo':
        setProcesses([
          { id: 'P1', arrivalTime: 0, burstTime: 6, priority: 2 },
          { id: 'P2', arrivalTime: 1, burstTime: 8, priority: 3 },
          { id: 'P3', arrivalTime: 2, burstTime: 7, priority: 1 },
          { id: 'P4', arrivalTime: 3, burstTime: 3, priority: 4 }
        ]);
        break;
      case 'priority-demo':
        setProcesses([
          { id: 'P1', arrivalTime: 0, burstTime: 10, priority: 3 },
          { id: 'P2', arrivalTime: 1, burstTime: 1, priority: 1 },
          { id: 'P3', arrivalTime: 2, burstTime: 2, priority: 4 },
          { id: 'P4', arrivalTime: 3, burstTime: 5, priority: 2 }
        ]);
        break;
      default:
        setProcesses([
          { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
          { id: 'P2', arrivalTime: 2, burstTime: 3, priority: 1 },
          { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 3 },
          { id: 'P4', arrivalTime: 6, burstTime: 4, priority: 4 }
        ]);
        break;
    }
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-6">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 flex items-center gap-2">
            <span className="h-3 w-3 rounded-full bg-indigo-500 animate-pulse"></span>
            Configure Processes
          </h2>
          <p className="text-xs text-slate-400 mt-1">Add running process entries and tweak simulation parameters.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={generateRandomProcesses}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs px-3 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02]"
            title="Generate random processes"
          >
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Random Gen
          </button>

        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-slate-800">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-950/40 text-slate-400 text-xs font-semibold uppercase tracking-wider border-b border-slate-800">
              <th className="px-4 py-3">Process ID</th>
              <th className="px-4 py-3">Arrival Time</th>
              <th className="px-4 py-3">Burst Time</th>
              <th className="px-4 py-3">Priority</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 bg-slate-900/20 text-slate-200">
            {processes.map((proc, index) => (
              <tr key={index} className="hover:bg-slate-800/45 transition-colors group">
                <td className="px-4 py-2.5">
                  <input
                    type="text"
                    value={proc.id}
                    onChange={(e) => updateProcess(index, 'id', e.target.value)}
                    className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm font-mono text-center text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min="0"
                    value={proc.arrivalTime}
                    onChange={(e) => updateProcess(index, 'arrivalTime', e.target.value)}
                    className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min="1"
                    value={proc.burstTime}
                    onChange={(e) => updateProcess(index, 'burstTime', e.target.value)}
                    className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-slate-200 font-semibold focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-2.5">
                  <input
                    type="number"
                    min="1"
                    value={proc.priority}
                    onChange={(e) => updateProcess(index, 'priority', e.target.value)}
                    className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1 text-sm text-center text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-2.5 text-center">
                  <button
                    onClick={() => deleteProcess(index)}
                    disabled={processes.length <= 1}
                    className="text-slate-500 hover:text-rose-400 disabled:text-slate-700 disabled:pointer-events-none transition-colors p-1"
                    title="Delete Process Row"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex flex-col gap-4 pt-4 border-t border-slate-800">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 block">Select Scheduling Algorithm</label>
          <select
            value={selectedAlgo}
            onChange={(e) => setSelectedAlgo(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none cursor-pointer"
          >
            <option value="FCFS">First Come First Serve (FCFS)</option>
            <option value="SJF">Shortest Job First (SJF)</option>
            <option value="RR">Round Robin (RR)</option>
            <option value="Priority">Priority Scheduling (Non-Preemptive)</option>
          </select>
        </div>

        {selectedAlgo === 'RR' && (
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300 block">Round Robin Quantum</label>
            <input
              type="number"
              min="1"
              value={rrQuantum}
              onChange={(e) => setRrQuantum(Math.max(1, parseInt(e.target.value, 10) || 1))}
              className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:border-indigo-500"
            />
          </div>
        )}


      </div>

      <div className="pt-2">
        <button
          onClick={onRunSimulation}
          disabled={isSimulating}
          className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
        >
          {isSimulating ? (
            <>
              <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              Simulating in C++ Subprocess...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              Run Simulation
            </>
          )}
        </button>
      </div>

    </div>
  );
}
