import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { api } from '../services/api';
import { getTodayMenu, getProteinHighlights } from '../data/messMenu';
import { EXERCISES } from '../data/exercises';
import { NoraAvatar } from '../components/AssetComponents';
import {
  Dumbbell, Scale, Droplets, UtensilsCrossed,
  Music, Calendar, ChevronRight, Flame, Plus, Check,
  Coffee, Moon as MoonIcon, Sparkles, Clock, Layers
} from 'lucide-react';

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return { text: 'Good morning', emoji: '☀️' };
  if (hour < 17) return { text: 'Good afternoon', emoji: '🌤️' };
  if (hour < 21) return { text: 'Good evening', emoji: '🌆' };
  return { text: 'Good night', emoji: '🌙' };
}

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const greeting = getGreeting();
  const todayMenu = getTodayMenu();
  const todayDayKey = DAY_KEYS[new Date().getDay()];
  const proteinHints = getProteinHighlights(todayDayKey);

  const [stats, setStats] = useState({
    currentWeight: user?.currentWeight || 56,
    targetWeight: user?.targetWeight || 60,
    startingWeight: user?.startingWeight || 56,
    streak: 0,
    todayWater: 0,
    waterTarget: 8,
    todayNutrition: 0,
    nutritionTarget: 8,
    secondRestDay: 3,
  });

  const [noraMessage, setNoraMessage] = useState('');
  const [todayPlan, setTodayPlan] = useState([]);
  const [planSaved, setPlanSaved] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [customItemText, setCustomItemText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('exercise');

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const data = await api.get('/api/dashboard');
        if (data) {
          setStats(prev => ({ ...prev, ...data }));
        }
      } catch {
        // Fallback to defaults
      }
    }
    fetchDashboard();

    const messages = [
      `Ready to get after it today, Vineet? 💪`,
      `Another day, another step closer to ${user?.targetWeight || 60} kg.`,
      `Build today's plan your way. You're in control.`,
      `Your consistency is building real results.`,
      `Keep eating clean and staying hydrated today!`,
    ];
    setNoraMessage(messages[Math.floor(Math.random() * messages.length)]);

    // Load saved today's plan from localStorage if present
    const saved = localStorage.getItem(`vh_today_plan_${new Date().toISOString().slice(0, 10)}`);
    if (saved) {
      try {
        setTodayPlan(JSON.parse(saved));
      } catch {}
    } else {
      setTodayPlan([
        { type: 'exercise', id: 'goblet-squat', name: 'Goblet Squat (3 sets × 12 reps)' },
        { type: 'exercise', id: 'pushup', name: 'Push-ups (3 sets × 12 reps)' },
        { type: 'activity', name: 'Drink 500ml Water' },
      ]);
    }
  }, [user]);

  const handleQuickAddWater = async () => {
    const newCount = stats.todayWater + 1;
    setStats(prev => ({ ...prev, todayWater: newCount }));
    try {
      await api.post('/api/water', { glasses: newCount });
    } catch {}
  };

  const handleSavePlan = () => {
    localStorage.setItem(`vh_today_plan_${new Date().toISOString().slice(0, 10)}`, JSON.stringify(todayPlan));
    setPlanSaved(true);
    setTimeout(() => setPlanSaved(false), 2500);
  };

  const handleAddPlanItem = (item) => {
    setTodayPlan(prev => [...prev, item]);
    setShowAddModal(false);
    setCustomItemText('');
  };

  const handleRemovePlanItem = (index) => {
    setTodayPlan(prev => prev.filter((_, i) => i !== index));
  };

  const weightProgress = stats.targetWeight > stats.currentWeight
    ? Math.min(100, Math.round(((stats.currentWeight - (stats.startingWeight || 56)) / Math.max(1, stats.targetWeight - (stats.startingWeight || 56))) * 100))
    : 100;

  const secondRestDayName = DAY_NAMES[stats.secondRestDay] || 'Wednesday';

  return (
    <div className="space-y-8 page-enter">
      {/* Top Greeting Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#FFFFFF] p-6 rounded-3xl border border-[#E7E4DC] shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-[#202124] tracking-tight">
            {greeting.text}, Vineet {greeting.emoji}
          </h1>
          <p className="text-[#6B6F76] text-sm mt-1 font-medium">
            Let's make today count. Customize your workout, track hydration, and check your hostel nutrition.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/workout')}
            className="px-5 py-2.5 rounded-xl bg-[#5B55E8] text-white font-medium text-sm hover:bg-[#4B45D8] transition-colors shadow-sm flex items-center gap-2"
          >
            <Dumbbell size={18} />
            <span>Build Today's Workout</span>
          </button>
          <Link
            to="/nora"
            className="p-2.5 bg-[#EEECFF] border border-[#E7E4DC] rounded-xl text-[#5B55E8] hover:scale-105 transition-all flex items-center gap-2"
            title="Chat with Nora AI"
          >
            <NoraAvatar state="idle" size={28} />
            <span className="text-xs font-semibold">Nora AI</span>
          </Link>
        </div>
      </div>

      {/* Nora Quick Greeting Card */}
      <div className="bg-[#EEECFF]/60 p-4 rounded-2xl border border-[#5B55E8]/20 flex items-start gap-3.5">
        <NoraAvatar state="speaking" size={36} />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5B55E8]">Nora AI</span>
            <span className="text-[10px] bg-[#5B55E8]/10 text-[#5B55E8] px-2 py-0.5 rounded-full font-semibold">Fitness Coach</span>
          </div>
          <p className="text-sm text-[#202124] mt-1 font-medium">{noraMessage}</p>
        </div>
      </div>

      {/* 6 Key Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Card 1: Current Weight */}
        <div className="app-card p-5 flex flex-col justify-between hover:border-[#5B55E8] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider">Current Weight</span>
            <div className="p-2 rounded-xl bg-[#EEECFF] text-[#5B55E8]">
              <Scale size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#202124]">{stats.currentWeight} <span className="text-sm font-normal text-[#6B6F76]">kg</span></div>
            <p className="text-xs text-[#6B6F76] mt-1">Target: <strong className="text-[#202124]">{stats.targetWeight} kg</strong></p>
            <div className="w-full bg-[#F1F0EB] h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-[#5B55E8] h-full rounded-full transition-all duration-500" style={{ width: `${weightProgress}%` }} />
            </div>
          </div>
          <Link to="/weight" className="text-xs font-semibold text-[#5B55E8] mt-3 inline-flex items-center gap-1 group-hover:underline">
            <span>Log Weight</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Card 2: Today's Activity */}
        <div className="app-card p-5 flex flex-col justify-between hover:border-[#5B55E8] transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider">Today's Activity</span>
            <div className="p-2 rounded-xl bg-[#EEECFF] text-[#5B55E8]">
              <Dumbbell size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-lg font-bold text-[#202124]">Plan Your Day</div>
            <p className="text-xs text-[#6B6F76] mt-1">Choose your workouts & rest</p>
          </div>
          <button
            onClick={() => navigate('/workout')}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-[#EEECFF] text-[#5B55E8] text-xs font-semibold hover:bg-[#5B55E8] hover:text-white transition-all text-center"
          >
            Build Today's Plan
          </button>
        </div>

        {/* Card 3: Water */}
        <div className="app-card p-5 flex flex-col justify-between hover:border-blue-400 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider">Water</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600">
              <Droplets size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#202124]">{stats.todayWater} <span className="text-sm font-normal text-[#6B6F76]">/ {stats.waterTarget} glasses</span></div>
            <p className="text-xs text-[#6B6F76] mt-1">{Math.round((stats.todayWater / (stats.waterTarget || 8)) * 100)}% daily goal reached</p>
          </div>
          <button
            onClick={handleQuickAddWater}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-blue-50 text-blue-700 text-xs font-semibold hover:bg-blue-100 transition-all inline-flex items-center justify-center gap-1"
          >
            <Plus size={14} />
            <span>Quick Add (+1 Glass)</span>
          </button>
        </div>

        {/* Card 4: Nutrition */}
        <div className="app-card p-5 flex flex-col justify-between hover:border-emerald-400 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider">Nutrition</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600">
              <UtensilsCrossed size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#202124]">{stats.todayNutrition} <span className="text-sm font-normal text-[#6B6F76]">/ {stats.nutritionTarget}</span></div>
            <p className="text-xs text-[#6B6F76] mt-1">Hostel meals & protein checklist</p>
          </div>
          <Link to="/nutrition" className="text-xs font-semibold text-emerald-600 mt-3 inline-flex items-center gap-1 group-hover:underline">
            <span>View Nutrition</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Card 5: Streak */}
        <div className="app-card p-5 flex flex-col justify-between hover:border-amber-400 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider">Consistency</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600">
              <Flame size={18} />
            </div>
          </div>
          <div className="mt-3">
            <div className="text-2xl font-bold text-[#202124]">{stats.streak} <span className="text-sm font-normal text-[#6B6F76]">days</span></div>
            <p className="text-xs text-[#6B6F76] mt-1">Current streak active</p>
          </div>
          <Link to="/attendance" className="text-xs font-semibold text-amber-600 mt-3 inline-flex items-center gap-1 group-hover:underline">
            <span>View Calendar</span>
            <ChevronRight size={14} />
          </Link>
        </div>

        {/* Card 6: Rest Day */}
        <div className="app-card p-5 flex flex-col justify-between hover:border-purple-400 transition-all group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#6B6F76] uppercase tracking-wider">Rest Schedule</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600">
              <Calendar size={18} />
            </div>
          </div>
          <div className="mt-3 space-y-1">
            <p className="text-xs font-semibold text-[#202124]">Sunday — Fixed Rest</p>
            <p className="text-xs text-[#6B6F76]">Second Rest: <strong className="text-purple-600 font-semibold">{secondRestDayName}</strong></p>
          </div>
          <Link to="/settings" className="text-xs font-semibold text-purple-600 mt-3 inline-flex items-center gap-1 group-hover:underline">
            <span>Change Rest Day</span>
            <ChevronRight size={14} />
          </Link>
        </div>
      </div>

      {/* Main Section: Today's Plan Builder */}
      <div className="app-card p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E7E4DC] pb-4">
          <div>
            <h2 className="text-xl font-bold text-[#202124] tracking-tight">Today's Plan</h2>
            <p className="text-xs text-[#6B6F76] mt-0.5 font-medium">
              You decide what to do today. Customize your exercises, meals, and rest intervals.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => { setSelectedCategory('exercise'); setShowAddModal(true); }}
              className="px-3 py-2 rounded-xl bg-[#EEECFF] border border-[#E7E4DC] text-[#5B55E8] text-xs font-semibold hover:bg-[#5B55E8] hover:text-white transition-all inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Exercise</span>
            </button>
            <button
              onClick={() => { setSelectedCategory('activity'); setShowAddModal(true); }}
              className="px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold hover:bg-emerald-600 hover:text-white transition-all inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Activity</span>
            </button>
            <button
              onClick={() => {
                setTodayPlan(prev => [...prev, { type: 'rest', name: 'Full Rest & Muscle Recovery' }]);
              }}
              className="px-3 py-2 rounded-xl bg-purple-50 border border-purple-200 text-purple-700 text-xs font-semibold hover:bg-purple-600 hover:text-white transition-all inline-flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Rest</span>
            </button>
            <button
              onClick={handleSavePlan}
              className="px-4 py-2 rounded-xl bg-[#5B55E8] text-white text-xs font-semibold hover:bg-[#4B45D8] transition-all flex items-center gap-1.5 shadow-xs"
            >
              {planSaved ? <Check size={14} /> : null}
              <span>{planSaved ? 'Saved!' : 'Save Today\'s Plan'}</span>
            </button>
          </div>
        </div>

        {/* Plan List */}
        {todayPlan.length === 0 ? (
          <div className="py-12 text-center border-2 border-dashed border-[#E7E4DC] rounded-2xl">
            <Clock size={36} className="mx-auto text-[#9A9DA3] mb-3" />
            <h3 className="text-base font-semibold text-[#202124]">No Plan Built Yet</h3>
            <p className="text-xs text-[#6B6F76] mt-1 max-w-sm mx-auto">
              Add exercises or activities above to shape your schedule for today.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {todayPlan.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl border border-[#E7E4DC] bg-[#F1F0EB]/40 flex items-center justify-between group hover:border-[#5B55E8] transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg text-xs font-bold ${
                    item.type === 'exercise'
                      ? 'bg-[#EEECFF] text-[#5B55E8]'
                      : item.type === 'rest'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {item.type === 'exercise' ? <Dumbbell size={16} /> : item.type === 'rest' ? <Calendar size={16} /> : <Check size={16} />}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#202124]">{item.name}</p>
                    <span className="text-[10px] text-[#6B6F76] capitalize">{item.type}</span>
                  </div>
                </div>

                <button
                  onClick={() => handleRemovePlanItem(index)}
                  className="text-xs text-[#9A9DA3] hover:text-red-500 p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Remove item"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Hostel Mess Menu & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hostel Mess Menu Card */}
        <div className="app-card p-6 lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
            <div>
              <h3 className="text-base font-bold text-[#202124]">Today's Hostel Mess Menu</h3>
              <p className="text-xs text-[#6B6F76]">Hostel menu highlights for {DAY_NAMES[new Date().getDay()]}</p>
            </div>
            <Link to="/mess-menu" className="text-xs font-semibold text-[#5B55E8] hover:underline">
              Full Schedule →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-[#F1F0EB]/60 border border-[#E7E4DC]">
              <div className="flex items-center gap-2 text-amber-600 mb-1">
                <Coffee size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Breakfast</span>
              </div>
              <p className="text-xs text-[#202124] font-medium">{todayMenu.breakfast}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F1F0EB]/60 border border-[#E7E4DC]">
              <div className="flex items-center gap-2 text-emerald-600 mb-1">
                <UtensilsCrossed size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Lunch</span>
              </div>
              <p className="text-xs text-[#202124] font-medium">{todayMenu.lunch}</p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F1F0EB]/60 border border-[#E7E4DC]">
              <div className="flex items-center gap-2 text-indigo-600 mb-1">
                <MoonIcon size={16} />
                <span className="text-xs font-bold uppercase tracking-wider">Dinner</span>
              </div>
              <p className="text-xs text-[#202124] font-medium">{todayMenu.dinner}</p>
            </div>
          </div>

          {proteinHints.length > 0 && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center gap-2">
              <Sparkles size={14} className="shrink-0 text-emerald-600" />
              <span>{proteinHints[0]}</span>
            </div>
          )}
        </div>

        {/* Quick App Shortcut Grid */}
        <div className="app-card p-6 space-y-4">
          <h3 className="text-base font-bold text-[#202124] border-b border-[#E7E4DC] pb-3">
            Quick Shortcuts
          </h3>
          <div className="grid grid-cols-2 gap-2.5">
            <Link to="/weight" className="p-3 rounded-xl border border-[#E7E4DC] bg-[#F1F0EB]/50 hover:border-[#5B55E8] transition-all flex items-center gap-2.5">
              <Scale size={18} className="text-[#5B55E8]" />
              <span className="text-xs font-semibold text-[#202124]">Log Weight</span>
            </Link>
            <Link to="/nutrition" className="p-3 rounded-xl border border-[#E7E4DC] bg-[#F1F0EB]/50 hover:border-emerald-500 transition-all flex items-center gap-2.5">
              <UtensilsCrossed size={18} className="text-emerald-600" />
              <span className="text-xs font-semibold text-[#202124]">Check Food</span>
            </Link>
            <Link to="/exercises" className="p-3 rounded-xl border border-[#E7E4DC] bg-[#F1F0EB]/50 hover:border-blue-500 transition-all flex items-center gap-2.5">
              <Layers size={18} className="text-blue-600" />
              <span className="text-xs font-semibold text-[#202124]">Exercises</span>
            </Link>
            <Link to="/music" className="p-3 rounded-xl border border-[#E7E4DC] bg-[#F1F0EB]/50 hover:border-purple-500 transition-all flex items-center gap-2.5">
              <Music size={18} className="text-purple-600" />
              <span className="text-xs font-semibold text-[#202124]">Music</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Add Plan Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4 backdrop-blur-xs">
          <div className="bg-[#FFFFFF] rounded-3xl p-6 max-w-md w-full border border-[#E7E4DC] shadow-xl space-y-4">
            <h3 className="text-lg font-bold text-[#202124]">Add to Today's Plan</h3>

            {selectedCategory === 'exercise' ? (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[#6B6F76]">Select Exercise from Library</label>
                <div className="max-h-48 overflow-y-auto space-y-1.5 border border-[#E7E4DC] rounded-xl p-2 bg-[#F7F6F2]">
                  {EXERCISES.map(ex => (
                    <button
                      key={ex.id}
                      onClick={() => handleAddPlanItem({ type: 'exercise', id: ex.id, name: `${ex.name} (${ex.sets} sets × ${ex.reps})` })}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-medium text-[#202124] hover:bg-[#EEECFF] hover:text-[#5B55E8] transition-all"
                    >
                      {ex.name} — <span className="text-[#6B6F76]">{ex.equipment}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <label className="text-xs font-semibold text-[#6B6F76]">Custom Activity Title</label>
                <input
                  type="text"
                  value={customItemText}
                  onChange={e => setCustomItemText(e.target.value)}
                  placeholder="e.g. Drink 500ml Milk / 20 min Mobility"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E7E4DC] bg-[#F7F6F2] text-sm text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                />
                <button
                  onClick={() => customItemText.trim() && handleAddPlanItem({ type: 'activity', name: customItemText.trim() })}
                  disabled={!customItemText.trim()}
                  className="w-full py-2.5 rounded-xl bg-[#5B55E8] text-white text-xs font-semibold hover:bg-[#4B45D8] transition-all disabled:opacity-50"
                >
                  Add Custom Activity
                </button>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#6B6F76] hover:bg-[#F1F0EB]"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
