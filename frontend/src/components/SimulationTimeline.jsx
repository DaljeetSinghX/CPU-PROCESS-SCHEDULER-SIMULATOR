import React, { useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Clock, Search, Download, CheckCircle, ArrowRight, AlertCircle, Play, CornerDownRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const SimulationTimeline = () => {
  const { currentTickState, processes, setInspectedProcessId } = useSimulation();
  const events = (currentTickState && currentTickState.events) || [];
  const allEvents = (currentTickState && currentTickState.allEvents) || [];
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const displayEvents = (events || []).filter(e => {
    if (categoryFilter !== 'ALL' && e.type !== categoryFilter) return false;
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      return e.message.toLowerCase().includes(q) || e.processId.toLowerCase().includes(q);
    }
    return true;
  });

  const getEventBadgeColor = (type) => {
    switch (type) {
      case 'ARRIVAL':
        return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'DISPATCH':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'COMPLETE':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'PREEMPT':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getEventDotColor = (pId) => {
    const pObj = processes.find(p => p.id === pId);
    return pObj ? pObj.color : '#8B5CF6';
  };

  const exportSteps = () => {
    const jsonStr = JSON.stringify(allEvents || [], null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scheduler_execution_timeline.json`;
    a.click();
  };

  return (
    <div className="bg-slate-900/80 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-xl flex flex-col h-[480px]">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-4 h-4 text-purple-400" />
            Execution Timeline
          </h3>
          <p className="text-xs text-slate-400">Step-by-step execution details</p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search events..."
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-2 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-950 border border-slate-800 text-slate-300 text-xs rounded-xl px-2.5 py-2 focus:outline-none focus:border-purple-500"
        >
          <option value="ALL">All Events</option>
          <option value="ARRIVAL">Arrivals</option>
          <option value="DISPATCH">Dispatches</option>
          <option value="COMPLETE">Completions</option>
          <option value="PREEMPT">Preemptions</option>
        </select>
      </div>

      {/* Vertical Timeline Card Stream */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-3 custom-scrollbar overscroll-contain">
        {displayEvents.length === 0 ? (
          <div className="text-center py-10 text-xs text-slate-600 italic">
            No events to display for current filter
          </div>
        ) : (
          displayEvents.map((ev, idx) => {
            const dotColor = getEventDotColor(ev.processId);
            return (
              <motion.div
                key={`${ev.tick}-${ev.type}-${idx}`}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className="relative pl-6 border-l-2 border-slate-800 hover:border-purple-500/50 transition-colors group"
              >
                {/* Timeline Node Icon */}
                <div
                  className="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full border-2 border-slate-900 shadow-md flex items-center justify-center"
                  style={{ backgroundColor: dotColor }}
                />

                {/* Event Card */}
                <div className="bg-slate-950/90 border border-slate-800/80 hover:border-slate-700 rounded-xl p-3 shadow-md transition-all">
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-md border font-mono ${getEventBadgeColor(ev.type)}`}>
                      Time {ev.tick}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {ev.type}
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                    {ev.processId && ev.processId !== 'IDLE' && (
                      <span
                        onClick={() => setInspectedProcessId(ev.processId)}
                        className="cursor-pointer hover:underline text-purple-300 font-bold"
                      >
                        {ev.processId}:
                      </span>
                    )}
                    {ev.message}
                  </p>

                  {/* Ready Queue State Diff */}
                  {ev.readyQueue && ev.readyQueue.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono bg-slate-900/60 p-1.5 rounded-lg border border-slate-800/60">
                      <CornerDownRight className="w-3 h-3 text-slate-500" />
                      <span>Ready Queue:</span>
                      <span className="text-purple-300 font-bold">[{ev.readyQueue.join(', ')}]</span>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Export Steps Button */}
      <div className="mt-4 pt-3 border-t border-slate-800/80">
        <button
          onClick={exportSteps}
          className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-300 font-semibold text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-2 transition-colors shadow-sm"
        >
          <Download className="w-3.5 h-3.5 text-purple-400" />
          Export Steps
        </button>
      </div>

    </div>
  );
};
