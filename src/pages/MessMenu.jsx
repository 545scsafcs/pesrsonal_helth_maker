import { motion } from 'framer-motion';
import { MESS_MENU, getProteinHighlights } from '../data/messMenu';
import { Coffee, UtensilsCrossed, Moon } from 'lucide-react';
import { NoraAvatar } from '../components/AssetComponents';

const DAY_ORDER = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const todayIndex = new Date().getDay();
const todayKey = DAY_KEYS[todayIndex];

export default function MessMenu() {
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-4xl mx-auto page-enter">
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h1 className="text-2xl font-bold text-[#202124] tracking-tight">Hostel Mess Menu</h1>
        <p className="text-[#6B6F76] text-xs font-medium mt-1">Weekly hostel mess meal schedule & protein advice</p>
      </div>

      <div className="space-y-4">
        {DAY_ORDER.map((key) => {
          const menu = MESS_MENU[key];
          const isToday = key === todayKey;
          const hints = getProteinHighlights(key);

          return (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`app-card p-5 transition-all ${isToday ? 'border-[#5B55E8] ring-2 ring-[#EEECFF]' : ''}`}
            >
              <div className="flex items-center justify-between mb-4 border-b border-[#E7E4DC] pb-3">
                <h2 className="text-lg font-bold text-[#202124]">{menu.day}</h2>
                {isToday && (
                  <span className="text-xs bg-[#EEECFF] text-[#5B55E8] px-3 py-1 rounded-full font-bold border border-[#E7E4DC]">
                    Today
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
                  <div className="flex items-center gap-2 text-amber-600 mb-1">
                    <Coffee size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Breakfast</span>
                  </div>
                  <p className="text-xs text-[#202124] font-medium">{menu.breakfast}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
                  <div className="flex items-center gap-2 text-emerald-600 mb-1">
                    <UtensilsCrossed size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Lunch</span>
                  </div>
                  <p className="text-xs text-[#202124] font-medium">{menu.lunch}</p>
                </div>

                <div className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
                  <div className="flex items-center gap-2 text-indigo-600 mb-1">
                    <Moon size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Dinner</span>
                  </div>
                  <p className="text-xs text-[#202124] font-medium">{menu.dinner}</p>
                </div>
              </div>

              {hints.length > 0 && (
                <div className="mt-4 pt-3 border-t border-[#E7E4DC]">
                  {hints.map((h, i) => (
                    <p key={i} className="text-xs text-emerald-700 font-medium flex items-center gap-1.5 mt-1">
                      <span>✨</span>
                      <span>{h}</span>
                    </p>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
