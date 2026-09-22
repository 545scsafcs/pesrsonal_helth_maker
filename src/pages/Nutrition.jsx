import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { getTodayMenu, getProteinHighlights } from '../data/messMenu';
import { UtensilsCrossed, Milk, Plus, Check, Sparkles } from 'lucide-react';
import { NoraAvatar } from '../components/AssetComponents';

const CHECKLIST_ITEMS = [
  { key: 'breakfast', label: 'Breakfast', emoji: '🍳' },
  { key: 'lunch', label: 'Lunch', emoji: '🍛' },
  { key: 'eveningSnack', label: 'Evening Snack', emoji: '🍪' },
  { key: 'dinner', label: 'Dinner', emoji: '🍽️' },
  { key: 'milk', label: 'Milk (₹20 daily budget)', emoji: '🥛' },
  { key: 'banana', label: 'Bananas', emoji: '🍌' },
  { key: 'proteinSource', label: 'Protein Source', emoji: '💪' },
  { key: 'water', label: 'Water Goal', emoji: '💧' },
];

const MILK_OPTIONS = [200, 300, 400];
const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export default function Nutrition() {
  const [items, setItems] = useState({
    breakfast: false, lunch: false, eveningSnack: false, dinner: false,
    milk: false, banana: false, proteinSource: false, water: false,
  });
  const [milkMl, setMilkMl] = useState(0);
  const [customFoods, setCustomFoods] = useState([]);
  const [newFood, setNewFood] = useState('');

  const todayMenu = getTodayMenu();
  const dayKey = DAY_KEYS[new Date().getDay()];
  const proteinHints = getProteinHighlights(dayKey);

  useEffect(() => {
    fetchToday();
  }, []);

  const fetchToday = async () => {
    try {
      const data = await api.get('/api/nutrition');
      if (data) {
        setItems(data.items || items);
        setMilkMl(data.milkMl || 0);
        setCustomFoods(data.customFoods || []);
      }
    } catch {}
  };

  const toggleItem = async (key) => {
    const updated = { ...items, [key]: !items[key] };
    setItems(updated);
    try {
      await api.post('/api/nutrition', { items: updated, milkMl, customFoods });
    } catch {}
  };

  const setMilk = async (ml) => {
    setMilkMl(ml);
    const updatedItems = { ...items, milk: ml > 0 };
    setItems(updatedItems);
    try {
      await api.post('/api/nutrition', { items: updatedItems, milkMl: ml, customFoods });
    } catch {}
  };

  const addCustomFood = async () => {
    if (!newFood.trim()) return;
    const updated = [...customFoods, { name: newFood.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }];
    setCustomFoods(updated);
    setNewFood('');
    try {
      await api.post('/api/nutrition', { items, milkMl, customFoods: updated });
    } catch {}
  };

  const checkedCount = Object.values(items).filter(Boolean).length;
  const progressPct = Math.round((checkedCount / CHECKLIST_ITEMS.length) * 100);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto page-enter">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#202124] tracking-tight">Nutrition & Mess Tracking</h1>
          <p className="text-[#6B6F76] text-xs font-medium mt-1">
            Track hostel meals, milk intake, extra protein snacks, and hydration goals.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-[#EEECFF] border border-[#E7E4DC] px-4 py-2 rounded-2xl shrink-0 self-start sm:self-auto">
          <UtensilsCrossed size={16} className="text-[#5B55E8]" />
          <span className="text-xs font-bold text-[#5B55E8]">{checkedCount} of {CHECKLIST_ITEMS.length} Logged ({progressPct}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-2">
        <div className="flex justify-between text-xs font-bold text-[#202124]">
          <span>Daily Nutrition Completion</span>
          <span>{progressPct}%</span>
        </div>
        <div className="h-3 bg-[#F1F0EB] rounded-full overflow-hidden p-0.5 border border-[#E7E4DC]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPct}%` }}
            className="h-full bg-[#21A366] rounded-full"
          />
        </div>
      </div>

      {/* Nora Tip Card */}
      <div className="bg-[#EEECFF]/60 border border-[#5B55E8]/20 rounded-3xl p-5 flex items-start gap-4">
        <NoraAvatar state="speaking" size={40} />
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#5B55E8] flex items-center gap-1">
            <Sparkles size={14} /> Nora's Daily Protein Coach
          </span>
          {proteinHints.map((hint, i) => (
            <p key={i} className="text-xs text-[#202124] font-medium mt-1 leading-relaxed">{hint}</p>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Daily Checklist */}
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-4">
          <h2 className="text-sm font-bold text-[#202124] border-b border-[#E7E4DC] pb-3">Daily Meal & Hydration Checklist</h2>
          <div className="space-y-2.5">
            {CHECKLIST_ITEMS.map(({ key, label, emoji }) => (
              <button
                key={key}
                onClick={() => toggleItem(key)}
                className={`w-full flex items-center gap-3.5 p-3.5 rounded-2xl transition-all border ${
                  items[key]
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900 font-semibold'
                    : 'bg-[#F7F6F2] hover:bg-[#F1F0EB] border-[#E7E4DC] text-[#202124] font-medium'
                }`}
              >
                <span className="text-xl">{emoji}</span>
                <span className="flex-1 text-left text-xs">{label}</span>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                  items[key]
                    ? 'bg-[#21A366] text-white'
                    : 'border-2 border-[#9A9DA3]'
                }`}>
                  {items[key] && <Check size={14} strokeWidth={3} />}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Milk & Custom Foods Column */}
        <div className="space-y-6">
          {/* Milk Tracker */}
          <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-4">
            <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-3">
              <h2 className="text-sm font-bold text-[#202124] flex items-center gap-2">
                <Milk size={18} className="text-[#5B55E8]" /> Daily Milk Intake
              </h2>
              <span className="text-xs font-semibold text-[#6B6F76]">Budget: ₹20 / day</span>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {MILK_OPTIONS.map(ml => (
                <button
                  key={ml}
                  onClick={() => setMilk(ml)}
                  className={`py-3 rounded-2xl text-xs font-bold transition-all border ${
                    milkMl === ml
                      ? 'bg-[#5B55E8] text-white border-[#5B55E8] shadow-xs'
                      : 'bg-[#F7F6F2] hover:bg-[#F1F0EB] text-[#202124] border-[#E7E4DC]'
                  }`}
                >
                  {ml} ml
                </button>
              ))}
            </div>

            <div className="pt-1">
              <input
                type="number"
                value={milkMl || ''}
                onChange={e => setMilk(parseInt(e.target.value) || 0)}
                placeholder="Custom amount in ml (e.g. 250)"
                className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-semibold text-[#202124] placeholder-[#9A9DA3] focus:outline-none focus:border-[#5B55E8]"
              />
            </div>
          </div>

          {/* Custom Foods */}
          <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-4">
            <h2 className="text-sm font-bold text-[#202124] border-b border-[#E7E4DC] pb-3">Extra Snacks & Meals</h2>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFood}
                onChange={e => setNewFood(e.target.value)}
                placeholder="e.g. Roasted chana, 2 eggs..."
                className="flex-1 px-4 py-2.5 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-medium text-[#202124] placeholder-[#9A9DA3] focus:outline-none focus:border-[#5B55E8]"
                onKeyDown={e => e.key === 'Enter' && addCustomFood()}
              />
              <button onClick={addCustomFood} className="px-4 py-2.5 bg-[#5B55E8] hover:bg-[#4B45D8] text-white font-bold text-xs rounded-2xl shadow-xs transition-all">
                <Plus size={16} />
              </button>
            </div>

            {customFoods.length > 0 ? (
              <div className="space-y-2 pt-2">
                {customFoods.map((food, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-2 px-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-xl font-medium">
                    <span className="text-[#202124]">{food.name}</span>
                    <span className="text-[#9A9DA3] text-[11px]">{food.time}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-[#6B6F76] text-center py-2">No custom snacks added yet today.</p>
            )}
          </div>
        </div>
      </div>

      {/* Hostel Mess Menu Banner */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h2 className="text-sm font-bold text-[#202124] mb-4 flex items-center gap-2">
          <UtensilsCrossed size={16} className="text-[#5B55E8]" /> Today's Hostel Mess Schedule
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">🌅 Breakfast</span>
            <p className="text-xs text-amber-900 font-medium">{todayMenu.breakfast}</p>
          </div>
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block mb-1">☀️ Lunch</span>
            <p className="text-xs text-emerald-900 font-medium">{todayMenu.lunch}</p>
          </div>
          <div className="bg-[#EEECFF] border border-[#E7E4DC] rounded-2xl p-4">
            <span className="text-xs font-bold text-[#5B55E8] uppercase tracking-wider block mb-1">🌙 Dinner</span>
            <p className="text-xs text-[#202124] font-medium">{todayMenu.dinner}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
