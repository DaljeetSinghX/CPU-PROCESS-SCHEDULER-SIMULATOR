import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Cpu, RotateCcw, Layers, BarChart3, Info, Table } from 'lucide-react';

export const Header = () => {
  const { activeTab, setActiveTab, resetPlayback } = useSimulation();

  const navItems = [
    { id: 'Simulator', label: 'Simulator', icon: Cpu },
    { id: 'Results', label: 'Results & Metrics', icon: Table },
    { id: 'Algorithms', label: 'Algorithms', icon: Layers },
    { id: 'Comparison', label: 'Comparison', icon: BarChart3 },
    { id: 'About', label: 'About', icon: Info },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 px-6 py-3 transition-all duration-300">
      <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
        
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-600 p-[1px] shadow-lg shadow-purple-500/25">
            <div className="w-full h-full bg-slate-950 rounded-[11px] flex items-center justify-center">
              <Cpu className="w-5 h-5 text-purple-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="text-lg font-extrabold text-slate-100 tracking-tight">CPU Scheduler Simulator</h1>
          </div>
        </div>

        {/* Center Nav Tabs */}
        <nav className="flex items-center gap-1 p-1 bg-slate-900/90 border border-slate-800/80 rounded-xl shadow-inner">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Styled Reset Action Button */}
          <button
            onClick={resetPlayback}
            className="group flex items-center gap-2 px-4 py-2 text-xs font-bold bg-slate-900/90 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 text-slate-200 hover:text-white border border-purple-500/30 hover:border-purple-400 rounded-xl transition-all duration-300 shadow-md shadow-purple-500/10 hover:shadow-purple-500/25 active:scale-95 cursor-pointer"
            title="Reset Simulation Clock to Tick 0"
          >
            <RotateCcw className="w-3.5 h-3.5 text-purple-400 group-hover:text-white group-hover:rotate-[-180deg] transition-transform duration-500" />
            <span>Reset</span>
          </button>
        </div>

      </div>
    </header>
  );
};

export default Header;
