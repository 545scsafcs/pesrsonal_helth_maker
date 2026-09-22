import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTimer } from '../hooks/useTimer';
import { Clock, Timer as TimerIcon, Play, Pause, RotateCcw, Flag, Volume2, VolumeX, Plus } from 'lucide-react';

export default function Time() {
  const {
    clock,
    stopwatchMs,
    stopwatchRunning,
    laps,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    lapStopwatch,
    formatTimeMs,
    timerSeconds,
    timerInitial,
    timerRunning,
    soundEnabled,
    setSoundEnabled,
    startTimer,
    pauseTimer,
    resetTimer,
    setTimerPreset,
    formatSeconds,
  } = useTimer();

  const [customInput, setCustomInput] = useState('');

  const handleCustomTimerSubmit = (e) => {
    e.preventDefault();
    const sec = parseInt(customInput, 10);
    if (!isNaN(sec) && sec > 0) {
      setTimerPreset(sec);
      setCustomInput('');
    }
  };

  const timerProgress = timerInitial > 0 ? ((timerInitial - timerSeconds) / timerInitial) * 100 : 0;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl mx-auto page-enter">
      {/* Header & Live Clock Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 md:p-8 shadow-[0_2px_8px_rgba(32,33,36,0.03)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2.5 text-[#5B55E8] mb-1">
            <Clock size={22} />
            <span className="text-xs font-bold uppercase tracking-wider">Live Time OS</span>
          </div>
          <h1 className="text-2xl font-bold text-[#202124] tracking-tight">Clock & Training Timers</h1>
          <p className="text-[#6B6F76] text-xs font-medium mt-1">
            Live local time, precision stopwatch, and rest interval countdowns.
          </p>
        </div>

        {/* Live Clock Display */}
        <div className="bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl px-6 py-4 text-center min-w-[220px]">
          <p className="text-3xl font-black text-[#202124] font-mono tracking-wider">
            {clock.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </p>
          <p className="text-xs font-semibold text-[#6B6F76] mt-1">
            {clock.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Countdown Timer Card */}
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEECFF] text-[#5B55E8] flex items-center justify-center">
                <TimerIcon size={20} />
              </div>
              <h2 className="text-lg font-bold text-[#202124]">Rest & Focus Timer</h2>
            </div>

            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2.5 rounded-xl border transition-all ${
                soundEnabled ? 'bg-[#EEECFF] text-[#5B55E8] border-[#E7E4DC]' : 'bg-[#F7F6F2] text-[#9A9DA3] border-[#E7E4DC]'
              }`}
              title={soundEnabled ? 'Mute Sound Chime' : 'Enable Sound Chime'}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          {/* Timer Circle / Countdown Display */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="44" stroke="#F1F0EB" strokeWidth="8" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="44"
                  stroke="#5B55E8"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray="276.46"
                  strokeDashoffset={276.46 - (276.46 * timerProgress) / 100}
                  strokeLinecap="round"
                  className="transition-[stroke-dashoffset] duration-500 ease-linear"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-black font-mono text-[#202124]">
                  {formatSeconds(timerSeconds)}
                </span>
                <span className="text-[10px] font-bold text-[#6B6F76] uppercase tracking-wider mt-1">
                  {timerRunning ? 'Counting Down' : timerSeconds === 0 ? 'Completed! 🎉' : 'Timer Paused'}
                </span>
              </div>
            </div>
          </div>

          {/* Presets & Custom Input */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-[#6B6F76] uppercase tracking-wider">Quick Presets</p>
            <div className="flex flex-wrap gap-2">
              {[
                { label: '30s', val: 30 },
                { label: '60s', val: 60 },
                { label: '90s', val: 90 },
                { label: '2 min', val: 120 },
                { label: '5 min', val: 300 },
              ].map(p => (
                <button
                  key={p.val}
                  onClick={() => setTimerPreset(p.val)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    timerInitial === p.val
                      ? 'bg-[#5B55E8] text-white border-[#5B55E8] shadow-xs'
                      : 'bg-[#F7F6F2] text-[#202124] border-[#E7E4DC] hover:border-[#5B55E8]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleCustomTimerSubmit} className="flex gap-2 pt-2">
              <input
                type="number"
                placeholder="Custom seconds..."
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                className="flex-1 px-3.5 py-2 rounded-xl bg-[#F7F6F2] border border-[#E7E4DC] text-xs font-semibold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                min="1"
                max="3600"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#EEECFF] text-[#5B55E8] font-bold text-xs border border-[#E7E4DC] hover:bg-[#5B55E8] hover:text-white transition-all flex items-center gap-1"
              >
                <Plus size={14} /> Set
              </button>
            </form>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3 pt-4 border-t border-[#E7E4DC]">
            {timerRunning ? (
              <button
                onClick={pauseTimer}
                className="flex-1 py-3 rounded-2xl bg-[#D89B25] text-white font-bold text-xs hover:bg-[#C28A1F] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Pause size={16} fill="currentColor" /> Pause
              </button>
            ) : (
              <button
                onClick={startTimer}
                disabled={timerSeconds === 0}
                className="flex-1 py-3 rounded-2xl bg-[#21A366] text-white font-bold text-xs hover:bg-[#1C8955] transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
              >
                <Play size={16} fill="currentColor" /> Start Timer
              </button>
            )}

            <button
              onClick={resetTimer}
              className="px-4 py-3 rounded-2xl bg-[#F1F0EB] text-[#202124] font-bold text-xs hover:bg-[#E7E4DC] border border-[#E7E4DC] transition-all flex items-center gap-1.5"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>
        </div>

        {/* Stopwatch Card */}
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-6 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EEECFF] text-[#5B55E8] flex items-center justify-center">
                <TimerIcon size={20} />
              </div>
              <h2 className="text-lg font-bold text-[#202124]">Precision Stopwatch</h2>
            </div>
            <span className="text-xs text-[#6B6F76] font-semibold bg-[#F7F6F2] px-3 py-1 rounded-full border border-[#E7E4DC]">
              {laps.length} Laps
            </span>
          </div>

          {/* Stopwatch Time Display */}
          <div className="py-6 text-center bg-[#F7F6F2] rounded-2xl border border-[#E7E4DC]">
            <p className="text-5xl font-black font-mono text-[#202124] tracking-tight">
              {formatTimeMs(stopwatchMs)}
            </p>
            <p className="text-xs font-semibold text-[#6B6F76] mt-2">
              {stopwatchRunning ? 'Stopwatch Active' : stopwatchMs === 0 ? 'Ready to Start' : 'Paused'}
            </p>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            {stopwatchRunning ? (
              <button
                onClick={pauseStopwatch}
                className="flex-1 py-3 rounded-2xl bg-[#D89B25] text-white font-bold text-xs hover:bg-[#C28A1F] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Pause size={16} fill="currentColor" /> Pause
              </button>
            ) : (
              <button
                onClick={startStopwatch}
                className="flex-1 py-3 rounded-2xl bg-[#5B55E8] text-white font-bold text-xs hover:bg-[#4B45D8] transition-all flex items-center justify-center gap-2 shadow-xs"
              >
                <Play size={16} fill="currentColor" /> Start Stopwatch
              </button>
            )}

            <button
              onClick={lapStopwatch}
              disabled={!stopwatchRunning}
              className="px-4 py-3 rounded-2xl bg-[#EEECFF] text-[#5B55E8] font-bold text-xs border border-[#E7E4DC] hover:bg-[#5B55E8] hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-40"
            >
              <Flag size={16} /> Lap
            </button>

            <button
              onClick={resetStopwatch}
              className="px-4 py-3 rounded-2xl bg-[#F1F0EB] text-[#202124] font-bold text-xs hover:bg-[#E7E4DC] border border-[#E7E4DC] transition-all flex items-center gap-1.5"
            >
              <RotateCcw size={16} /> Reset
            </button>
          </div>

          {/* Lap History List */}
          <div className="border-t border-[#E7E4DC] pt-4 flex-1">
            <h3 className="text-xs font-bold text-[#6B6F76] uppercase tracking-wider mb-2">Lap History</h3>
            {laps.length === 0 ? (
              <p className="text-xs text-[#9A9DA3] italic py-4 text-center">No laps recorded yet</p>
            ) : (
              <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                {laps.map((lapMs, i) => (
                  <div key={i} className="flex justify-between items-center py-2 px-3 rounded-xl bg-[#F7F6F2] text-xs font-mono border border-[#E7E4DC]">
                    <span className="font-sans font-bold text-[#6B6F76]">Lap {laps.length - i}</span>
                    <span className="font-bold text-[#202124]">{formatTimeMs(lapMs)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
