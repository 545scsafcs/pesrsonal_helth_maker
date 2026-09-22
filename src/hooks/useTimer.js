import { useState, useEffect, useRef, useCallback } from 'react';

// Web Audio API chime generator (no external asset needed)
export function playTimerChime() {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    gain1.gain.setValueAtTime(0.3, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.6);

    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(659.25, now + 0.2); // E5
    gain2.gain.setValueAtTime(0.3, now + 0.2);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.2);
    osc2.stop(now + 0.8);

    const osc3 = ctx.createOscillator();
    const gain3 = ctx.createGain();
    osc3.type = 'sine';
    osc3.frequency.setValueAtTime(783.99, now + 0.4); // G5
    gain3.gain.setValueAtTime(0.4, now + 0.4);
    gain3.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
    osc3.connect(gain3);
    gain3.connect(ctx.destination);
    osc3.start(now + 0.4);
    osc3.stop(now + 1.2);
  } catch (e) {
    console.warn('Audio chime disabled or not supported:', e);
  }
}

export function useTimer() {
  // Live Clock State
  const [clock, setClock] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setClock(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Stopwatch State
  const [stopwatchMs, setStopwatchMs] = useState(0);
  const [stopwatchRunning, setStopwatchRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const stopwatchIntervalRef = useRef(null);

  const startStopwatch = () => setStopwatchRunning(true);
  const pauseStopwatch = () => setStopwatchRunning(false);
  const resetStopwatch = () => {
    setStopwatchRunning(false);
    setStopwatchMs(0);
    setLaps([]);
  };
  const lapStopwatch = () => {
    if (stopwatchMs > 0) {
      setLaps(prev => [stopwatchMs, ...prev]);
    }
  };

  useEffect(() => {
    if (stopwatchRunning) {
      const startTime = Date.now() - stopwatchMs;
      stopwatchIntervalRef.current = setInterval(() => {
        setStopwatchMs(Date.now() - startTime);
      }, 10);
    } else {
      clearInterval(stopwatchIntervalRef.current);
    }
    return () => clearInterval(stopwatchIntervalRef.current);
  }, [stopwatchRunning]);

  // Countdown Timer State
  const [timerSeconds, setTimerSeconds] = useState(60);
  const [timerInitial, setTimerInitial] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const timerIntervalRef = useRef(null);

  const startTimer = useCallback(() => {
    if (timerSeconds > 0) setTimerRunning(true);
  }, [timerSeconds]);

  const pauseTimer = () => setTimerRunning(false);

  const resetTimer = useCallback(() => {
    setTimerRunning(false);
    setTimerSeconds(timerInitial);
  }, [timerInitial]);

  const setTimerPreset = useCallback((seconds) => {
    setTimerRunning(false);
    setTimerInitial(seconds);
    setTimerSeconds(seconds);
  }, []);

  useEffect(() => {
    if (timerRunning && timerSeconds > 0) {
      timerIntervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(timerIntervalRef.current);
            setTimerRunning(false);
            if (soundEnabled) playTimerChime();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerIntervalRef.current);
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [timerRunning, timerSeconds, soundEnabled]);

  // Format Helpers
  const formatTimeMs = (ms) => {
    const totalSec = Math.floor(ms / 1000);
    const m = Math.floor(totalSec / 60);
    const s = totalSec % 60;
    const ms100 = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(ms100).padStart(2, '0')}`;
  };

  const formatSeconds = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return {
    clock,
    // Stopwatch
    stopwatchMs,
    stopwatchRunning,
    laps,
    startStopwatch,
    pauseStopwatch,
    resetStopwatch,
    lapStopwatch,
    formatTimeMs,
    // Countdown Timer
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
    playChime: playTimerChime,
  };
}
