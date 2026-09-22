import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Droplets, Plus, Minus, CheckCircle } from 'lucide-react';

export default function Water() {
  const [glasses, setGlasses] = useState(0);
  const [target, setTarget] = useState(8);

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    try {
      const data = await api.get('/api/water');
      if (data) {
        setGlasses(data.glasses || 0);
        setTarget(data.target || 8);
      }
    } catch {}
  };

  const updateGlasses = async (newCount) => {
    const count = Math.max(0, newCount);
    setGlasses(count);
    try {
      await api.post('/api/water', { glasses: count });
    } catch {}
  };

  const percentage = Math.min(100, Math.round((glasses / target) * 100));
  const droplets = Array.from({ length: target }, (_, i) => i < glasses);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto page-enter">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h1 className="text-2xl font-bold text-[#202124] tracking-tight">Hydration Tracker</h1>
        <p className="text-[#6B6F76] text-xs font-medium mt-1">
          Monitor your daily water consumption and hit your target of {target} glasses per day.
        </p>
      </div>

      {/* Main Tracker Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-8 text-center shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-8">
        {/* Circular Progress Gauge */}
        <div className="relative w-44 h-44 mx-auto">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r="60" fill="none" stroke="#F1F0EB" strokeWidth="12" />
            <circle
              cx="70" cy="70" r="60" fill="none"
              stroke="#5B55E8"
              strokeWidth="12"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - percentage / 100)}`}
              style={{ transition: 'stroke-dashoffset 0.5s ease' }}
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Droplets size={26} className="text-[#5B55E8] mb-1" />
            <p className="text-4xl font-black text-[#202124]">{glasses}</p>
            <p className="text-xs font-semibold text-[#6B6F76]">of {target} glasses</p>
          </div>
        </div>

        {/* Counter Buttons */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => updateGlasses(glasses - 1)}
            className="w-14 h-14 rounded-2xl bg-[#F1F0EB] border border-[#E7E4DC] flex items-center justify-center text-[#202124] hover:bg-[#E7E4DC] transition-all active:scale-95 shadow-xs"
            aria-label="Remove glass"
          >
            <Minus size={22} />
          </button>
          <button
            onClick={() => updateGlasses(glasses + 1)}
            className="w-20 h-20 rounded-3xl bg-[#5B55E8] hover:bg-[#4B45D8] flex items-center justify-center text-white shadow-xs transition-all active:scale-95"
            aria-label="Add glass"
          >
            <Plus size={30} strokeWidth={3} />
          </button>
        </div>

        {/* Quick Add Pills */}
        <div className="flex justify-center gap-2 pt-2">
          {[1, 2, 3].map(n => (
            <button
              key={n}
              onClick={() => updateGlasses(glasses + n)}
              className="px-4 py-2 rounded-2xl bg-[#EEECFF] border border-[#E7E4DC] text-[#5B55E8] text-xs font-bold hover:bg-[#5B55E8] hover:text-white transition-all"
            >
              +{n} glass{n > 1 ? 'es' : ''}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Glass Grid */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h2 className="text-sm font-bold text-[#202124] mb-4 text-center">Daily Hydration Log ({percentage}%)</h2>
        <div className="flex flex-wrap gap-4 justify-center">
          {droplets.map((filled, i) => (
            <motion.button
              key={i}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              onClick={() => updateGlasses(filled ? i : i + 1)}
              className={`text-3xl transition-all cursor-pointer p-2 rounded-2xl ${
                filled ? 'bg-[#EEECFF] border border-[#E7E4DC] scale-105' : 'bg-[#F7F6F2] opacity-40 hover:opacity-70 border border-[#E7E4DC]'
              }`}
            >
              💧
            </motion.button>
          ))}
        </div>
      </div>

      {/* Completion Banner */}
      {glasses >= target && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-emerald-50 border border-emerald-200 rounded-3xl p-6 text-center shadow-xs"
        >
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle size={28} />
          </div>
          <p className="text-base font-bold text-emerald-900">Hydration Target Reached!</p>
          <p className="text-xs font-medium text-emerald-700 mt-1">Excellent job keeping your body hydrated throughout the day.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
