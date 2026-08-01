import React from 'react';
import { useSimulation } from '../context/SimulationContext';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, FastForward, Sliders, Clock } from 'lucide-react';

export const PlaybackControls = () => {
  const {
    currentTick,
    setCurrentTick,
    maxTicks,
    isPlaying,
    play,
    pause,
    resetPlayback,
    nextTick,
    prevTick,
    speed,
    setSpeed
  } = useSimulation();

  const speedOptions = [0.25, 0.5, 1, 2, 5];
  const progressPercent = maxTicks > 0 ? (currentTick / maxTicks) * 100 : 0;

  return (
    <div className="bg-slate-900/90 border border-slate-800/80 backdrop-blur-md rounded-2xl p-5 shadow-xl space-y-4">
      
      {/* Header & Tick Counter */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-purple-400" />
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">Playback & Controls</h3>
        </div>

        <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800 shadow-inner">
          <Clock className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-xs font-mono font-extrabold text-purple-300">
            TICK {String(currentTick).padStart(2, '0')} / {String(maxTicks).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Timeline Scrubber Slider with Smooth Color Fill & Instant Response */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
          <span>Scrub Timeline</span>
          <span className="text-purple-300 font-mono font-bold">{Math.round(progressPercent)}%</span>
        </div>
        
        <div className="relative flex items-center">
          <input
            type="range"
            min="0"
            max={maxTicks || 1}
            value={currentTick}
            onPointerDown={() => isPlaying && pause()}
            onChange={(e) => setCurrentTick(Number(e.target.value))}
            style={{
              background: `linear-gradient(to right, #A855F7 0%, #A855F7 ${progressPercent}%, #0F172A ${progressPercent}%, #0F172A 100%)`
            }}
            className="w-full h-2.5 rounded-lg appearance-none cursor-pointer border border-slate-800 shadow-inner outline-none"
          />
        </div>
      </div>

      {/* Playback Action Buttons */}
      <div className="grid grid-cols-4 gap-2">
        <button
          onClick={resetPlayback}
          className="py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 border border-slate-800 rounded-xl flex items-center justify-center transition-colors shadow-sm"
          title="Reset to Tick 0"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={prevTick}
          disabled={currentTick <= 0}
          className="py-2.5 bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-slate-200 disabled:opacity-30 border border-slate-800 rounded-xl flex items-center justify-center transition-colors shadow-sm"
          title="Previous Tick"
        >
          <SkipBack className="w-4 h-4" />
        </button>

        <button
          onClick={isPlaying ? pause : play}
          className="col-span-2 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-purple-500/25 transition-all transform active:scale-95"
        >
          {isPlaying ? (
            <>
              <Pause className="w-4 h-4 fill-white" />
              Pause
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              {currentTick >= maxTicks ? 'Replay' : 'Play'}
            </>
          )}
        </button>

        <button
          onClick={nextTick}
          disabled={currentTick >= maxTicks}
          className="col-span-4 py-2 bg-slate-950 hover:bg-slate-800/80 text-slate-300 font-semibold text-xs rounded-xl border border-slate-800 flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          title="Next Tick"
        >
          <SkipForward className="w-3.5 h-3.5 text-purple-400" />
          Next Tick Step
        </button>
      </div>

      {/* Speed Selector */}
      <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-800 flex items-center justify-between gap-2 shadow-inner">
        <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
          <FastForward className="w-3.5 h-3.5 text-purple-400" />
          <span>Speed:</span>
        </div>
        <div className="flex items-center gap-1">
          {speedOptions.map(s => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`px-2 py-1 text-[10px] font-bold rounded-lg transition-all ${
                speed === s
                  ? 'bg-purple-600 text-white border border-purple-400 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default PlaybackControls;
