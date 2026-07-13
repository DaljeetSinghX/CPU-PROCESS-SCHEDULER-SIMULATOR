import React, { useState } from 'react';
import { Cpu, Terminal, AlertTriangle, RefreshCw, GraduationCap } from 'lucide-react';
import ProcessTable from './components/ProcessTable';
import GanttChart from './components/GanttChart';
import ResultsTable from './components/ResultsTable';

export default function App() {
  const [processes, setProcesses] = useState([
    { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
    { id: 'P2', arrivalTime: 2, burstTime: 3, priority: 1 },
    { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 3 },
    { id: 'P4', arrivalTime: 6, burstTime: 4, priority: 4 }
  ]);

  const [rrQuantum, setRrQuantum] = useState(4);

  const [selectedAlgo, setSelectedAlgo] = useState('FCFS');
  const [simulationResults, setSimulationResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [error, setError] = useState(null);

  const runSimulation = async () => {
    setIsSimulating(true);
    setError(null);
    try {
      const response = await fetch('/api/simulate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          rrQuantum,
          processes
        }),
      });

      if (!response.ok) {
        let errText = 'Server error occurred.';
        try {
          const errData = await response.json();
          errText = errData.error || errText;
          if (errData.stderr) {
            errText += ` Details: ${errData.stderr}`;
          }
        } catch (_) {
          errText = await response.text();
        }
        throw new Error(errText);
      }

      const results = await response.json();
      setSimulationResults(results);
    } catch (err) {
      console.error('Simulation execution failed:', err);
      setError(err.message || 'Failed to execute C++ scheduler executable. Ensure it compiled correctly.');
    } finally {
      setIsSimulating(false);
    }
  };

  const resetSimulator = () => {
    setProcesses([
      { id: 'P1', arrivalTime: 0, burstTime: 5, priority: 2 },
      { id: 'P2', arrivalTime: 2, burstTime: 3, priority: 1 },
      { id: 'P3', arrivalTime: 4, burstTime: 1, priority: 3 },
      { id: 'P4', arrivalTime: 6, burstTime: 4, priority: 4 }
    ]);
    setRrQuantum(4);
    setSimulationResults(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[150px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-violet-500/10 rounded-full blur-[150px] pointer-events-none"></div>

      <header className="border-b border-slate-900 bg-slate-950/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-r from-violet-600 to-indigo-600 p-2 rounded-xl text-white shadow-lg shadow-indigo-600/10">
              <Cpu className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h1 className="text-md sm:text-lg font-bold tracking-tight bg-gradient-to-r from-slate-100 to-slate-300 bg-clip-text text-transparent">
                CPU Scheduler Simulator
              </h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                <span className="text-[10px] font-mono text-emerald-400">C++ Native Core</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button
              onClick={resetSimulator}
              className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs px-3.5 py-1.5 rounded-lg transition-all"
              title="Reset Simulator"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 relative z-10">
        

        {error && (
          <div className="flex gap-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 p-4 rounded-xl items-start">
            <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-500" />
            <div>
              <h4 className="text-sm font-bold">Execution Error</h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{error}</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          
          <div className="lg:col-span-2">
            <ProcessTable
              processes={processes}
              setProcesses={setProcesses}
              rrQuantum={rrQuantum}
              setRrQuantum={setRrQuantum}
              selectedAlgo={selectedAlgo}
              setSelectedAlgo={setSelectedAlgo}
              onRunSimulation={runSimulation}
              isSimulating={isSimulating}
            />
          </div>

          <div className="lg:col-span-3 space-y-8">
            {simulationResults ? (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
                


                <GanttChart timeline={simulationResults[selectedAlgo].timeline} />

                <ResultsTable data={simulationResults[selectedAlgo]} />



              </div>
            ) : (
              <div className="bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl py-24 px-8 text-center flex flex-col items-center justify-center space-y-4">
                <div className="bg-slate-900/70 p-4 rounded-full border border-slate-800 text-slate-500 shadow-inner">
                  <Terminal className="w-8 h-8" />
                </div>
                <div className="space-y-1 max-w-sm">
                  <h3 className="text-slate-200 font-semibold text-sm">Dashboard Awaiting Simulation</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Set process times, modify quantum parameters, and click "Run Simulation" to execute the scheduler core.
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

      </main>

      <footer className="mt-20 border-t border-slate-900 bg-slate-950/40 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-xs text-slate-500 space-y-2">
          <p>© 2026 CPU Process Scheduler Simulator. Built for Operating Systems Lab.</p>
          <div className="flex items-center justify-center gap-3">
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-[10px]">C++ Version: 17</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-[10px]">React Version: 19</span>
            <span className="bg-slate-900 border border-slate-800 px-2 py-0.5 rounded font-mono text-[10px]">Tailwind Version: 4.0</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
