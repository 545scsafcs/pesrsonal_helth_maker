import { useState, useEffect } from 'react';
import { Play, Pause, Square, RotateCcw } from 'lucide-react';

export default function Timer({ defaultSeconds, onComplete, autoStart = false }) {
  const [timeLeft, setTimeLeft] = useState(defaultSeconds);
  const [isRunning, setIsRunning] = useState(autoStart);

  useEffect(() => {
    setTimeLeft(defaultSeconds);
    if (autoStart) setIsRunning(true);
  }, [defaultSeconds, autoStart]);

  useEffect(() => {
    let interval = null;
    if (isRunning && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && isRunning) {
      setIsRunning(false);
      if (onComplete) onComplete();
    }
    return () => clearInterval(interval);
  }, [isRunning, timeLeft, onComplete]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((defaultSeconds - timeLeft) / defaultSeconds) * 100;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32 flex items-center justify-center mb-4">
        <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="46" fill="none" stroke="rgba(148,163,184,0.1)" strokeWidth="6" />
          <circle 
            cx="50" cy="50" r="46" fill="none" 
            stroke="#818cf8" strokeWidth="6" strokeLinecap="round"
            strokeDasharray={`${2 * Math.PI * 46}`}
            strokeDashoffset={`${2 * Math.PI * 46 * (1 - progress / 100)}`}
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>
        <span className="text-3xl font-bold text-surface-100 tabular-nums">
          {formatTime(timeLeft)}
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(defaultSeconds);
          }}
          className="p-3 rounded-full bg-surface-700/50 text-surface-400 hover:text-surface-200 transition-colors"
          aria-label="Reset"
        >
          <RotateCcw size={20} />
        </button>
        <button 
          onClick={() => setIsRunning(!isRunning)}
          className="p-4 rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/20 active:scale-95 transition-all"
        >
          {isRunning ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
        </button>
        <button 
          onClick={() => {
            setIsRunning(false);
            setTimeLeft(0);
            if (onComplete) onComplete();
          }}
          className="p-3 rounded-full bg-surface-700/50 text-surface-400 hover:text-surface-200 transition-colors"
          aria-label="Skip"
        >
          <Square size={20} />
        </button>
      </div>
    </div>
  );
}
