import React, { useRef, useEffect, useState } from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Terminal, Copy, Check, Search, Download } from 'lucide-react';

export const EventConsole = () => {
  const { currentTickState } = useSimulation();
  const events = (currentTickState && currentTickState.events) || [];
  const allEvents = (currentTickState && currentTickState.allEvents) || [];
  const containerRef = useRef(null);
  const [copied, setCopied] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [filterText, setFilterText] = useState('');

  // Use container scrollTop to prevent scrolling the browser window
  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [events, autoScroll]);

  const copyConsoleLogs = () => {
    const text = (events || []).map(e => `[${String(e.tick).padStart(2, '0')}] ${e.message}`).join('\n');
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const exportLogs = () => {
    const jsonStr = JSON.stringify(allEvents || events || [], null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `scheduler_events_log.json`;
    a.click();
  };

  const filteredEvents = events.filter(e => {
    if (!filterText) return true;
    const q = filterText.toLowerCase();
    return e.message.toLowerCase().includes(q) || e.type.toLowerCase().includes(q) || (e.processId && e.processId.toLowerCase().includes(q));
  });

  return (
    <div className="bg-slate-950 border border-slate-800/80 rounded-2xl p-5 shadow-xl font-mono text-xs flex flex-col h-[400px]">
      
      {/* Console Header */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-slate-200 text-xs">Event Console</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAutoScroll(prev => !prev)}
            className={`text-[10px] font-sans font-semibold px-2 py-0.5 rounded-md border transition-colors ${
              autoScroll ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-400 border-slate-700'
            }`}
          >
            Auto-scroll {autoScroll ? 'ON' : 'OFF'}
          </button>
          <button
            onClick={copyConsoleLogs}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
            title="Copy logs"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
          <button
            onClick={exportLogs}
            className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors"
            title="Export logs JSON"
          >
            <Download className="w-4 h-4 text-purple-400" />
          </button>
        </div>
      </div>

      {/* Filter Input */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder="Filter logs..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-9 pr-3 py-1.5 focus:outline-none focus:border-purple-500 font-sans"
        />
      </div>

      {/* Terminal Log Output */}
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-2 custom-scrollbar text-[11px]">
        {filteredEvents && filteredEvents.length > 0 ? (
          filteredEvents.map((e, idx) => (
            <div key={idx} className="flex items-start gap-2 hover:bg-slate-900/60 py-1 px-1.5 rounded transition-colors border-l-2 border-slate-800 hover:border-purple-500">
              <span className="text-purple-400 font-bold select-none min-w-[34px]">
                [{String(e.tick).padStart(2, '0')}]
              </span>
              <span className={`font-semibold ${
                e.type === 'ARRIVAL' ? 'text-emerald-400' :
                e.type === 'DISPATCH' ? 'text-purple-300' :
                e.type === 'COMPLETE' ? 'text-cyan-300' :
                e.type === 'PREEMPT' ? 'text-rose-400' : 'text-slate-300'
              }`}>
                {e.message}
              </span>
            </div>
          ))
        ) : (
          <div className="text-slate-600 italic py-8 text-center font-sans text-xs">
            System ready. Awaiting simulation log events...
          </div>
        )}
      </div>

    </div>
  );
};

export default EventConsole;
