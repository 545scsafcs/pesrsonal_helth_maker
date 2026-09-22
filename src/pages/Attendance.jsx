import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { CalendarCheck, Flame, Trophy, CheckCircle, ChevronLeft, ChevronRight, Dumbbell, Droplets, Milk, Scale, Clock, Activity, FileText } from 'lucide-react';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const STATUS_STYLES = {
  completed: { bg: 'bg-[#21A366] text-white font-bold shadow-xs', label: 'Completed Workout' },
  partial: { bg: 'bg-[#D89B25] text-white font-bold', label: 'Partial Workout' },
  missed: { bg: 'bg-rose-100 text-rose-700 font-bold border border-rose-200', label: 'Missed Workout' },
  rest: { bg: 'bg-[#F1F0EB] text-[#6B6F76] font-medium', label: 'Rest Day' },
  future: { bg: '', text: 'text-[#9A9DA3]', label: '' },
  today: { bg: 'bg-[#5B55E8] text-white font-extrabold ring-4 ring-[#EEECFF] shadow-xs', label: 'Today' },
};

export default function Attendance() {
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());
  const [attendance, setAttendance] = useState({});
  const [stats, setStats] = useState({ streak: 0, longest: 0, total: 0, planned: 0 });
  const [todayActivity, setTodayActivity] = useState(null);

  useEffect(() => {
    fetchAttendance();
  }, [month, year]);

  const fetchAttendance = async () => {
    try {
      const data = await api.get(`/api/attendance?month=${month + 1}&year=${year}`);
      if (data) {
        setAttendance(data.days || {});
        setStats(data.stats || stats);
        if (data.todayActivity) setTodayActivity(data.todayActivity);
      }
    } catch {}
  };

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };

  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const today = new Date();
  const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

  const calendarDays = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const getDayStatus = (day) => {
    if (!day) return null;
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (attendance[dateStr]) return attendance[dateStr];
    if (isCurrentMonth && day === today.getDate()) return 'today';
    if (new Date(year, month, day) > today) return 'future';
    return null;
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-5xl mx-auto page-enter">
      {/* Page Header */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h1 className="text-2xl font-bold text-[#202124] tracking-tight">Workout Attendance & Consistency</h1>
        <p className="text-[#6B6F76] text-xs font-medium mt-1">
          Track daily workout execution, rest day compliance, and ongoing training streaks.
        </p>
      </div>

      {/* Today's Activity Section (Feature 7) */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-4">
        <div className="flex items-center gap-2 border-b border-[#E7E4DC] pb-3">
          <Activity size={20} className="text-[#5B55E8]" />
          <h2 className="text-base font-bold text-[#202124]">Today's Recorded Activity</h2>
          <span className="text-[10px] font-bold text-[#5B55E8] bg-[#EEECFF] px-2 py-0.5 rounded-md border border-[#E7E4DC]">
            Real Database Logs
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {/* Workout Session Card */}
          <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
            <div className="flex items-center gap-2 text-[#5B55E8] mb-1">
              <Dumbbell size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Workout</span>
            </div>
            {todayActivity?.workout ? (
              <>
                <p className="text-sm font-bold text-[#202124]">{todayActivity.workout.workoutName}</p>
                <p className="text-xs text-[#6B6F76] font-medium capitalize mt-0.5">{todayActivity.workout.status}</p>
              </>
            ) : (
              <p className="text-xs text-[#9A9DA3] italic font-medium">Not started today</p>
            )}
          </div>

          {/* Active Duration & Sets Card */}
          <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
            <div className="flex items-center gap-2 text-indigo-600 mb-1">
              <Clock size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Duration & Sets</span>
            </div>
            {todayActivity?.workout ? (
              <>
                <p className="text-sm font-bold text-[#202124]">{todayActivity.workout.durationMinutes || 0} mins</p>
                <p className="text-xs text-[#6B6F76] font-medium mt-0.5">{todayActivity.workout.completedSets} / {todayActivity.workout.totalSets} sets done</p>
              </>
            ) : (
              <p className="text-xs text-[#9A9DA3] italic font-medium">0 mins recorded</p>
            )}
          </div>

          {/* Water Intake Card */}
          <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
            <div className="flex items-center gap-2 text-cyan-600 mb-1">
              <Droplets size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Water Intake</span>
            </div>
            <p className="text-sm font-bold text-[#202124]">
              {todayActivity?.water ? todayActivity.water.glasses : 0} / {todayActivity?.water ? todayActivity.water.target : 8} glasses
            </p>
            <p className="text-xs text-[#6B6F76] font-medium mt-0.5">Hydration progress</p>
          </div>

          {/* Milk Intake Card */}
          <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
            <div className="flex items-center gap-2 text-amber-600 mb-1">
              <Milk size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Milk Intake</span>
            </div>
            <p className="text-sm font-bold text-[#202124]">
              {todayActivity?.nutrition?.milkMl || 0} ml
            </p>
            <p className="text-xs text-[#6B6F76] font-medium mt-0.5">Hostel protein booster</p>
          </div>

          {/* Current Weight Card */}
          <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC]">
            <div className="flex items-center gap-2 text-emerald-600 mb-1">
              <Scale size={16} />
              <span className="text-[11px] font-bold uppercase tracking-wider">Weight Record</span>
            </div>
            {todayActivity?.weight ? (
              <>
                <p className="text-sm font-bold text-[#202124]">{todayActivity.weight.weight} kg</p>
                <p className="text-[10px] text-[#6B6F76] font-medium mt-0.5">
                  Logged {new Date(todayActivity.weight.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}
                </p>
              </>
            ) : (
              <p className="text-xs text-[#9A9DA3] italic font-medium">No recent weight entry</p>
            )}
          </div>

          {/* Notes Card */}
          {todayActivity?.workout?.notes && (
            <div className="p-4 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC] col-span-2">
              <div className="flex items-center gap-2 text-purple-600 mb-1">
                <FileText size={16} />
                <span className="text-[11px] font-bold uppercase tracking-wider">Session Notes</span>
              </div>
              <p className="text-xs font-semibold text-[#202124]">{todayActivity.workout.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-3">
            <Flame size={20} />
          </div>
          <p className="text-3xl font-black text-[#202124]">{stats.streak} <span className="text-xs font-semibold text-[#6B6F76]">Days</span></p>
          <p className="text-xs text-[#6B6F76] font-medium mt-1">Current Active Streak</p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-3">
            <Trophy size={20} />
          </div>
          <p className="text-3xl font-black text-[#202124]">{stats.longest} <span className="text-xs font-semibold text-[#6B6F76]">Days</span></p>
          <p className="text-xs text-[#6B6F76] font-medium mt-1">All-Time Best Streak</p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle size={20} />
          </div>
          <p className="text-3xl font-black text-[#202124]">{stats.total}</p>
          <p className="text-xs text-[#6B6F76] font-medium mt-1">Sessions Completed</p>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
          <div className="w-10 h-10 rounded-2xl bg-[#EEECFF] text-[#5B55E8] flex items-center justify-center mb-3">
            <CalendarCheck size={20} />
          </div>
          <p className="text-3xl font-black text-[#202124]">{stats.planned}</p>
          <p className="text-xs text-[#6B6F76] font-medium mt-1">Planned Sessions</p>
        </div>
      </div>

      {/* Calendar Grid Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 md:p-8 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6 border-b border-[#E7E4DC] pb-4">
          <button 
            onClick={prevMonth} 
            className="p-2 text-[#6B6F76] hover:text-[#202124] hover:bg-[#F1F0EB] rounded-xl transition-all"
            title="Previous Month"
          >
            <ChevronLeft size={22} />
          </button>
          <h2 className="text-xl font-bold text-[#202124]">
            {MONTH_NAMES[month]} {year}
          </h2>
          <button 
            onClick={nextMonth} 
            className="p-2 text-[#6B6F76] hover:text-[#202124] hover:bg-[#F1F0EB] rounded-xl transition-all"
            title="Next Month"
          >
            <ChevronRight size={22} />
          </button>
        </div>

        {/* Day Header Row */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {DAY_NAMES.map(d => (
            <div key={d} className="text-center text-xs font-bold text-[#9A9DA3] uppercase tracking-wider py-1">{d}</div>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, i) => {
            const status = getDayStatus(day);
            const style = status ? STATUS_STYLES[status] : null;
            const isTodayCell = isCurrentMonth && day === today.getDate();

            return (
              <div
                key={i}
                className={`aspect-square rounded-2xl flex items-center justify-center text-sm font-semibold transition-all ${
                  !day ? 'bg-transparent' :
                  isTodayCell ? STATUS_STYLES.today.bg :
                  style ? style.bg :
                  'bg-[#F7F6F2] text-[#202124] hover:bg-[#F1F0EB] border border-[#E7E4DC]'
                }`}
              >
                {day || ''}
              </div>
            );
          })}
        </div>

        {/* Calendar Color Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 mt-8 pt-4 border-t border-[#E7E4DC]">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#21A366]" />
            <span className="text-xs font-semibold text-[#6B6F76]">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#D89B25]" />
            <span className="text-xs font-semibold text-[#6B6F76]">Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-rose-200 border border-rose-400" />
            <span className="text-xs font-semibold text-[#6B6F76]">Missed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-full bg-[#F1F0EB]" />
            <span className="text-xs font-semibold text-[#6B6F76]">Rest Day</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
