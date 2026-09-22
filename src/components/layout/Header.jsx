import { useAuth } from '../../hooks/useAuth';
import { useLocation, Link } from 'react-router-dom';
import { Bell, Sparkles, Menu, X } from 'lucide-react';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/workout': 'Workout Planner',
  '/exercises': 'Exercise Library',
  '/progress': 'Progress Tracking',
  '/attendance': 'Attendance Calendar',
  '/nutrition': 'Nutrition Tracker',
  '/mess-menu': 'Hostel Mess Schedule',
  '/weight': 'Weight Analytics',
  '/water': 'Water Intake',
  '/music': 'Workout Music',
  '/nora': 'Nora AI Companion',
  '/settings': 'Settings & Profile',
};

export default function Header({ mobileDrawerOpen, setMobileDrawerOpen }) {
  const { user } = useAuth();
  const location = useLocation();

  const title = routeTitles[location.pathname] || 'Dashboard';
  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#E7E4DC] sticky top-0 z-30 shadow-[0_2px_8px_rgba(32,33,36,0.02)] box-border">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between">
        {/* Left Side: Title & Subtitle (Desktop) + Hamburger (Mobile) */}
        <div className="flex items-center gap-3">
          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileDrawerOpen(!mobileDrawerOpen)}
            className="lg:hidden p-2 rounded-xl text-[#202124] hover:bg-[#F1F0EB] transition-colors border border-[#E7E4DC]"
            aria-label="Toggle Mobile Menu"
          >
            {mobileDrawerOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div>
            <h2 className="text-lg lg:text-xl font-bold text-[#202124] tracking-tight leading-tight">
              {title}
            </h2>
            <p className="text-[11px] lg:text-xs text-[#6B6F76] font-medium leading-tight">
              {todayFormatted}
            </p>
          </div>
        </div>

        {/* Right Side Controls */}
        <div className="flex items-center gap-3">
          {/* Ask Nora Quick Action */}
          <Link
            to="/nora"
            className="hidden sm:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EEECFF] border border-[#5B55E8]/20 text-[#5B55E8] text-xs font-bold hover:bg-[#e2deff] transition-all"
          >
            <Sparkles size={14} className="text-[#5B55E8]" />
            <span>Ask Nora</span>
          </Link>

          {/* Notification Bell */}
          <button
            className="p-2 rounded-xl text-[#6B6F76] hover:text-[#202124] hover:bg-[#F1F0EB] transition-all relative border border-[#E7E4DC]"
            aria-label="Notifications"
          >
            <Bell size={17} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#5B55E8] rounded-full" />
          </button>

          {/* User Profile Pill */}
          <Link
            to="/settings"
            className="flex items-center gap-2.5 pl-2 pr-3 py-1 rounded-xl border border-[#E7E4DC] bg-[#FFFFFF] hover:bg-[#F1F0EB] transition-all"
          >
            <div className="w-7 h-7 rounded-lg bg-[#5B55E8] text-white flex items-center justify-center font-bold text-xs shadow-2xs">
              {user?.name?.[0] || 'V'}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-xs font-bold text-[#202124] leading-tight truncate">
                {user?.name || 'Vineet'}
              </p>
              <p className="text-[10px] text-[#6B6F76] font-medium leading-tight">
                {user?.currentWeight ? `${user.currentWeight} kg` : '56 kg'}
              </p>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
