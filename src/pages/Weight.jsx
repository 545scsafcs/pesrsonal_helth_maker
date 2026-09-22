import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Scale, TrendingUp, Target, Plus, Calendar, Trash2 } from 'lucide-react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Filler,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

export default function Weight() {
  const { user, checkAuth } = useAuth();
  const [entries, setEntries] = useState([]);
  const [weight, setWeight] = useState('');
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);

  const targetWeight = user?.targetWeight || 60;
  const startingWeight = user?.startingWeight || 52;

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/weight');
      setEntries(data.entries || []);
    } catch {}
    setLoading(false);
  };

  const addEntry = async (e) => {
    e.preventDefault();
    if (!weight || isNaN(weight)) return;
    setAdding(true);
    try {
      await api.post('/api/weight', { weight: parseFloat(weight), date: new Date().toISOString() });
      setWeight('');
      await fetchEntries();
      await checkAuth(); // Sync user currentWeight in auth context
    } catch (err) {
      console.error('Failed to log weight:', err);
    }
    setAdding(false);
  };

  const deleteEntry = async (id) => {
    if (!confirm('Are you sure you want to delete this weight log?')) return;
    try {
      await api.delete(`/api/weight?id=${id}`);
      await fetchEntries();
      await checkAuth();
    } catch (err) {
      console.error('Failed to delete weight entry:', err);
    }
  };

  const currentWeight = entries.length > 0 ? entries[0].weight : (user?.currentWeight || startingWeight);
  const weightDiff = currentWeight - startingWeight;
  const progress = targetWeight > startingWeight
    ? Math.min(100, Math.max(0, Math.round(((currentWeight - startingWeight) / (targetWeight - startingWeight)) * 100)))
    : 100;

  // Weekly average
  const last7 = entries.slice(0, 7);
  const weeklyAvg = last7.length > 0
    ? (last7.reduce((s, e) => s + e.weight, 0) / last7.length).toFixed(1)
    : '—';

  // Chart data
  const chartEntries = [...entries].reverse().slice(-30);
  const chartData = {
    labels: chartEntries.map(e => new Date(e.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })),
    datasets: [{
      label: 'Weight (kg)',
      data: chartEntries.map(e => e.weight),
      borderColor: '#5B55E8',
      backgroundColor: 'rgba(91, 85, 232, 0.08)',
      fill: true,
      tension: 0.35,
      pointRadius: 4,
      pointHoverRadius: 6,
      pointBackgroundColor: '#5B55E8',
      pointBorderColor: '#ffffff',
      pointBorderWidth: 2,
    }],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#202124',
        padding: 10,
        titleFont: { size: 12, weight: 'bold' },
        bodyFont: { size: 12 },
        cornerRadius: 10,
      }
    },
    scales: {
      x: {
        grid: { color: '#E7E4DC' },
        ticks: { color: '#6B6F76', font: { size: 11, weight: '500' } },
      },
      y: {
        grid: { color: '#E7E4DC' },
        ticks: { color: '#6B6F76', font: { size: 11, weight: '500' } },
        suggestedMin: Math.min(startingWeight - 1, currentWeight - 1),
        suggestedMax: targetWeight + 1,
      },
    },
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto page-enter">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202124] tracking-tight">Body Weight Tracker</h1>
          <p className="text-[#6B6F76] text-xs font-medium mt-1">
            Track daily scale weight, analyze body weight trends, and move toward your {targetWeight} kg goal.
          </p>
        </div>

        {/* Log Form Inline */}
        <form onSubmit={addEntry} className="flex items-center gap-2">
          <input
            type="number"
            step="0.1"
            value={weight}
            onChange={e => setWeight(e.target.value)}
            placeholder="e.g. 56.5 kg"
            className="w-36 px-4 py-2.5 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-semibold text-[#202124] placeholder-[#9A9DA3] focus:outline-none focus:border-[#5B55E8]"
          />
          <button 
            type="submit" 
            disabled={adding} 
            className="px-5 py-2.5 bg-[#5B55E8] hover:bg-[#4B45D8] text-white font-bold text-xs rounded-2xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
          >
            <Plus size={16} /> Log
          </button>
        </form>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6F76]">Current</span>
            <div className="w-8 h-8 rounded-xl bg-[#EEECFF] text-[#5B55E8] flex items-center justify-center">
              <Scale size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#202124]">{currentWeight} <span className="text-sm font-semibold text-[#6B6F76]">kg</span></p>
          <p className="text-xs text-[#6B6F76] font-medium mt-1">Latest scale log</p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6F76]">Target</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Target size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#202124]">{targetWeight} <span className="text-sm font-semibold text-[#6B6F76]">kg</span></p>
          <p className="text-xs text-[#6B6F76] font-medium mt-1">Goal weight</p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6F76]">Total Change</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <TrendingUp size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#202124]">{weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} <span className="text-sm font-semibold text-[#6B6F76]">kg</span></p>
          <p className="text-xs text-[#6B6F76] font-medium mt-1">From {startingWeight} kg start</p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B6F76]">7-Day Avg</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Calendar size={16} />
            </div>
          </div>
          <p className="text-3xl font-black text-[#202124]">{weeklyAvg} <span className="text-sm font-semibold text-[#6B6F76]">kg</span></p>
          <p className="text-xs text-[#6B6F76] font-medium mt-1">Weekly rolling average</p>
        </div>
      </div>

      {/* Progress Bar Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <div className="flex justify-between items-center text-xs font-bold text-[#202124] mb-3">
          <span>Start: {startingWeight} kg</span>
          <span className="text-[#5B55E8] bg-[#EEECFF] border border-[#E7E4DC] px-3 py-1 rounded-full">{progress}% Achieved</span>
          <span>Goal: {targetWeight} kg</span>
        </div>
        <div className="h-3 bg-[#F1F0EB] rounded-full overflow-hidden p-0.5 border border-[#E7E4DC]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(5, progress)}%` }}
            transition={{ duration: 0.8 }}
            className="h-full rounded-full bg-[#5B55E8] shadow-xs"
          />
        </div>
      </div>

      {/* Trend Chart */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h2 className="text-sm font-bold text-[#202124] mb-4">30-Day Weight Progress Trend</h2>
        {chartEntries.length > 0 ? (
          <div className="h-[280px]">
            <Line data={chartData} options={chartOptions} />
          </div>
        ) : (
          <div className="text-center py-12 bg-[#F7F6F2] rounded-2xl border border-dashed border-[#E7E4DC]">
            <p className="text-[#6B6F76] text-xs font-medium">No historical weight logs available. Log your scale weight to view progress visual charts.</p>
          </div>
        )}
      </div>

      {/* Recent History Table with Delete Action */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h2 className="text-sm font-bold text-[#202124] mb-4">Logged Weight History</h2>
        {entries.length > 0 ? (
          <div className="divide-y divide-[#E7E4DC]">
            {entries.map((entry) => (
              <div key={entry._id || entry.id || entry.date} className="flex items-center justify-between py-3 hover:bg-[#F1F0EB]/60 px-3 rounded-2xl transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#F1F0EB] text-[#6B6F76] flex items-center justify-center text-xs font-bold">
                    <Scale size={14} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#202124]">
                      {new Date(entry.date).toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                    <p className="text-[11px] text-[#9A9DA3] font-medium">Recorded entry</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-sm font-black text-[#202124]">{entry.weight} kg</span>
                  <button
                    onClick={() => deleteEntry(entry._id || entry.id)}
                    className="p-1.5 text-[#9A9DA3] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    title="Delete Entry"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-[#6B6F76] text-center py-8">No logged entries found.</p>
        )}
      </div>
    </motion.div>
  );
}
