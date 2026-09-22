import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Logo from '../Logo';
import {
  LayoutDashboard, Dumbbell, Timer, BookOpen, TrendingUp, CalendarCheck,
  UtensilsCrossed, Droplets, Scale, Music, Sparkles, Settings,
  LogOut, X
} from 'lucide-react';

const navItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/workout', icon: Dumbbell, label: 'Workout' },
  { path: '/time', icon: Timer, label: 'Time & Timer' },
  { path: '/exercises', icon: BookOpen, label: 'Exercises' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
  { path: '/attendance', icon: CalendarCheck, label: 'Attendance' },
  { path: '/nutrition', icon: UtensilsCrossed, label: 'Nutrition' },
  { path: '/weight', icon: Scale, label: 'Weight' },
  { path: '/water', icon: Droplets, label: 'Water' },
  { path: '/music', icon: Music, label: 'Music' },
  { path: '/nora', icon: Sparkles, label: 'Nora AI' },
  { path: '/settings', icon: Settings, label: 'Settings' },
];

const mobileNavItems = [
  { path: '/dashboard', icon: LayoutDashboard, label: 'Home' },
  { path: '/workout', icon: Dumbbell, label: 'Workout' },
  { path: '/time', icon: Timer, label: 'Time' },
  { path: '/nora', icon: Sparkles, label: 'Nora' },
  { path: '/progress', icon: TrendingUp, label: 'Progress' },
];

export default function Sidebar({ mobileDrawerOpen, setMobileDrawerOpen }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Desktop Layout-Participating Sidebar Column (Option A) */}
      <aside
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`hidden lg:flex flex-col sticky top-0 h-screen bg-[#FFFFFF] border-r border-[#E7E4DC] shrink-0 z-40 transition-[width] duration-250 ease-in-out overflow-hidden shadow-[2px_0_12px_rgba(32,33,36,0.02)] ${
          isHovered ? 'w-[250px]' : 'w-[72px]'
        }`}
      >
        {/* Brand Logo Header */}
        <div className="h-16 flex items-center border-b border-[#E7E4DC] shrink-0">
          <div className="w-[72px] h-full flex items-center justify-center shrink-0">
            <Logo size={36} />
          </div>
          <div className={`whitespace-nowrap overflow-hidden transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 w-0'}`}>
            <h1 className="text-sm font-black text-[#202124] tracking-tight">Vineet's Health</h1>
            <p className="text-[10px] font-semibold text-[#6B6F76]">Personal Fitness OS</p>
          </div>
        </div>

        {/* Navigation Items List */}
        <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-none">
          {navItems.map(({ path, icon: Icon, label }) => {
            const isActive = location.pathname === path || (path === '/dashboard' && location.pathname === '/');
            return (
              <NavLink
                key={path}
                to={path}
                className={`relative flex items-center h-11 rounded-xl transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#EEECFF] text-[#5B55E8] font-bold'
                    : 'text-[#6B6F76] hover:text-[#202124] hover:bg-[#F1F0EB] font-semibold'
                }`}
              >
                {/* Active Indicator Line */}
                {isActive && (
                  <div className="absolute left-0 top-2 bottom-2 w-1 bg-[#5B55E8] rounded-r-full" />
                )}

                {/* Icon Container (Fixed 72px slot so icon NEVER moves) */}
                <div className="w-[56px] h-full flex items-center justify-center shrink-0">
                  <Icon size={20} className={isActive ? 'text-[#5B55E8]' : 'text-[#6B6F76]'} />
                </div>

                {/* Label (Fades in smoothly) */}
                <span className={`text-xs whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'opacity-0 w-0'
                }`}>
                  {label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom Profile & Logout Section */}
        <div className="p-2 border-t border-[#E7E4DC] bg-[#F7F6F2]/60 shrink-0 space-y-1">
          <NavLink
            to="/settings"
            className="flex items-center h-11 rounded-xl text-[#6B6F76] hover:text-[#202124] hover:bg-[#F1F0EB] transition-all"
            title="Profile & Settings"
          >
            <div className="w-[56px] h-full flex items-center justify-center shrink-0">
              <div className="w-8 h-8 rounded-lg bg-[#5B55E8] text-white font-bold flex items-center justify-center text-xs shadow-2xs">
                {user?.name?.[0] || 'V'}
              </div>
            </div>
            <div className={`whitespace-nowrap overflow-hidden transition-opacity duration-200 ${isHovered ? 'opacity-100' : 'opacity-0 w-0'}`}>
              <p className="text-xs font-bold text-[#202124] truncate">{user?.name || 'Vineet'}</p>
              <p className="text-[10px] text-[#6B6F76] font-medium">{user?.currentWeight || '56'} kg</p>
            </div>
          </NavLink>

          <button
            onClick={logout}
            className="flex items-center h-10 w-full rounded-xl text-[#D94B4B] hover:bg-[#FDECEC] transition-all"
            title="Sign Out"
          >
            <div className="w-[56px] h-full flex items-center justify-center shrink-0">
              <LogOut size={18} />
            </div>
            <span className={`text-xs font-bold whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
              isHovered ? 'opacity-100' : 'opacity-0 w-0'
            }`}>
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileDrawerOpen && (
        <>
          <div
            className="lg:hidden fixed inset-0 bg-black/40 z-50 backdrop-blur-xs"
            onClick={() => setMobileDrawerOpen(false)}
          />
          <div className="lg:hidden fixed left-0 top-0 bottom-0 w-72 bg-[#FFFFFF] z-50 p-5 overflow-y-auto shadow-2xl flex flex-col justify-between border-r border-[#E7E4DC]">
            <div>
              <div className="flex justify-between items-center mb-6 border-b border-[#E7E4DC] pb-4">
                <div className="flex items-center gap-2.5">
                  <Logo size={36} />
                  <div>
                    <h2 className="text-sm font-black text-[#202124]">Vineet's Health</h2>
                    <p className="text-[10px] font-semibold text-[#6B6F76]">Navigation</p>
                  </div>
                </div>
                <button onClick={() => setMobileDrawerOpen(false)} className="p-1.5 text-[#6B6F76] hover:bg-[#F1F0EB] rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map(({ path, icon: Icon, label }) => (
                  <NavLink
                    key={path}
                    to={path}
                    onClick={() => setMobileDrawerOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-[#EEECFF] text-[#5B55E8]'
                          : 'text-[#6B6F76] hover:bg-[#F1F0EB]'
                      }`
                    }
                  >
                    <Icon size={18} />
                    <span>{label}</span>
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="pt-4 border-t border-[#E7E4DC] space-y-2">
              <button
                onClick={() => { logout(); setMobileDrawerOpen(false); }}
                className="flex items-center gap-3 px-3.5 py-3 rounded-xl text-xs font-bold text-[#D94B4B] bg-[#FDECEC] w-full"
              >
                <LogOut size={18} />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-[#FFFFFF] border-t border-[#E7E4DC] z-30 flex items-center justify-around px-2 shadow-lg">
        {mobileNavItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <NavLink
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-all ${
                isActive
                  ? 'text-[#5B55E8] font-bold'
                  : 'text-[#6B6F76] hover:text-[#202124]'
              }`}
            >
              <Icon size={19} />
              <span className="text-[10px]">{label}</span>
            </NavLink>
          );
        })}
      </nav>
    </>
  );
}
