import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { Dumbbell, Flame, Trophy, Droplets, UtensilsCrossed, Target } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function Progress() {
  const [stats, setStats] = useState({
    totalWorkouts: 0, totalSets: 0, totalReps: 0,
    streak: 0, longestStreak: 0,
    currentWeight: 56, targetWeight: 60, startingWeight: 56,
    weightEntries: [],
    waterAvg: 0, nutritionAvg: 0,
  });

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const data = await api.get('/api/progress');
      if (data) setStats(prev => ({ ...prev, ...data }));
    } catch {}
  };

  const weightProgress = stats.targetWeight > stats.startingWeight
    ? Math.min(100, Math.max(0, Math.round(((stats.currentWeight - stats.startingWeight) / (stats.targetWeight - stats.startingWeight)) * 100)))
    : 100;

  // Weight chart
  const chartEntries = (stats.weightEntries || []).slice(-30);
  const chartData = {
    labels: chartEntries.map(e => new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: 'Weight (kg)',
      data: chartEntries.map(e => e.weight),
      borderColor: '#5B55E8',
      backgroundColor: 'rgba(91, 85, 232, 0.08)',
      fill: true, tension: 0.35, pointRadius: 4, pointBackgroundColor: '#5B55E8',
    }],
  };

  const chartOptions = {
    responsive: true, maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: {
      x: { grid: { color: '#E7E4DC' }, ticks: { color: '#6B6F76', font: { size: 11, weight: '500' } } },
      y: { grid: { color: '#E7E4DC' }, ticks: { color: '#6B6F76', font: { size: 11, weight: '500' } } },
    },
  };

  const statCards = [
    { icon: Dumbbell, label: 'Total Workouts', value: stats.totalWorkouts, color: 'text-[#5B55E8] bg-[#EEECFF]' },
    { icon: Target, label: 'Total Sets', value: stats.totalSets, color: 'text-emerald-600 bg-emerald-50' },
    { icon: Flame, label: 'Current Streak', value: `${stats.streak} days`, color: 'text-amber-600 bg-amber-50' },
    { icon: Trophy, label: 'Longest Streak', value: `${stats.longestStreak} days`, color: 'text-purple-600 bg-purple-50' },
    { icon: Droplets, label: 'Avg Water/Day', value: `${stats.waterAvg} glasses`, color: 'text-blue-600 bg-blue-50' },
    { icon: UtensilsCrossed, label: 'Nutrition Score', value: `${stats.nutritionAvg}%`, color: 'text-teal-600 bg-teal-50' },
  ];

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto page-enter">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h1 className="text-2xl font-bold text-[#202124] tracking-tight">Overall Progress Overview</h1>
        <p className="text-[#6B6F76] text-xs font-medium mt-1">
          High-level analytics tracking workouts, streaks, weight gains, and daily consistency.
        </p>
      </div>

      {/* Weight Goal Progress Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-[#202124]">Weight Milestone Progress</h2>
            <p className="text-xs text-[#6B6F76]">Targeting {stats.targetWeight} kg target weight</p>
          </div>
          <span className="text-xl font-black text-[#5B55E8] bg-[#EEECFF] border border-[#E7E4DC] px-4 py-1 rounded-full">
            {weightProgress}%
          </span>
        </div>
        <div className="flex justify-between text-xs font-bold text-[#6B6F76]">
          <span>Start: {stats.startingWeight} kg</span>
          <span>Current: {stats.currentWeight} kg</span>
          <span>Goal: {stats.targetWeight} kg</span>
        </div>
        <div className="h-3 bg-[#F1F0EB] rounded-full overflow-hidden p-0.5 border border-[#E7E4DC]">
          <div
            className="h-full bg-[#5B55E8] rounded-full transition-all duration-1000 shadow-xs"
            style={{ width: `${Math.max(5, weightProgress)}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
            <div className={`w-10 h-10 rounded-2xl ${color} flex items-center justify-center mb-3`}>
              <Icon size={20} />
            </div>
            <p className="text-2xl font-black text-[#202124]">{value}</p>
            <p className="text-xs font-semibold text-[#6B6F76] mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Weight Chart */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h2 className="text-sm font-bold text-[#202124] mb-4">Historical Weight Progression</h2>
        {chartEntries.length > 0 ? (
          <div className="h-[280px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F7F6F2] rounded-2xl border border-dashed border-[#E7E4DC]">
            <p className="text-[#6B6F76] text-xs font-medium">Not enough weight data logged yet.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
