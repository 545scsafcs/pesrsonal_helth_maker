import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import {
  User, Calendar, Timer, Trash2, Save,
  Droplet, GlassWater, LogOut, CheckCircle, Music, Shield, RotateCcw
} from 'lucide-react';
import { NoraAvatar } from '../components/AssetComponents';

const DAY_OPTIONS = [
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export default function Settings() {
  const { user, logout, checkAuth } = useAuth();

  // Profile Form State
  const [profile, setProfile] = useState({
    name: user?.name || 'Vineet',
    username: user?.username || 'vineet',
    height: user?.height || '6 feet',
    currentWeight: user?.currentWeight || 55.4,
    targetWeight: user?.targetWeight || 60,
    startingWeight: user?.startingWeight || 52,
  });

  // Preferences State
  const [prefs, setPrefs] = useState({
    secondRestDay: 3,
    defaultRestSeconds: 90,
    waterTarget: 8,
    milkTarget: 300,
    spotifyEmbedUrl: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM',
  });

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || 'Vineet',
        username: user.username || 'vineet',
        height: user.height || '6 feet',
        currentWeight: user.currentWeight || 55.4,
        targetWeight: user.targetWeight || 60,
        startingWeight: user.startingWeight || 52,
      });
    }
    fetchPrefs();
  }, [user]);

  const fetchPrefs = async () => {
    try {
      const data = await api.get('/api/preferences');
      if (data) setPrefs(prev => ({ ...prev, ...data }));
    } catch {}
  };

  const handleSaveAll = async (e) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage('');
    try {
      // 1. Save Profile
      await api.patch('/api/auth/me', {
        name: profile.name,
        username: profile.username,
        height: profile.height,
        currentWeight: parseFloat(profile.currentWeight),
        targetWeight: parseFloat(profile.targetWeight),
        startingWeight: parseFloat(profile.startingWeight),
      });

      // 2. Save Preferences
      await api.patch('/api/preferences', prefs);

      // Refresh Auth Context
      await checkAuth();

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save settings');
    }
    setSaving(false);
  };

  const handleResetForm = () => {
    if (user) {
      setProfile({
        name: user.name || 'Vineet',
        username: user.username || 'vineet',
        height: user.height || '6 feet',
        currentWeight: user.currentWeight || 55.4,
        targetWeight: user.targetWeight || 60,
        startingWeight: user.startingWeight || 52,
      });
    }
    fetchPrefs();
  };

  const resetNoraMemory = async () => {
    if (confirm('Reset Nora\'s memory? She will forget chat context and preferences.')) {
      try {
        await api.delete('/api/nora-memory');
        alert('Nora\'s memory has been reset.');
      } catch {}
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)]">
        <h1 className="text-2xl font-black text-[#202124]">Settings & Profile Editor</h1>
        <p className="text-[#6B6F76] text-xs font-medium mt-1">
          Manage your personal body metrics, target weight, workout schedule, hydration goals, and Spotify embeds.
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-[#FDECEC] border border-[#D94B4B]/20 rounded-2xl text-[#D94B4B] text-xs font-bold">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSaveAll} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 md:p-8 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E7E4DC] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#EEECFF] text-[#5B55E8] flex items-center justify-center font-bold">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#202124]">Personal Profile</h2>
              <p className="text-xs text-[#6B6F76]">Edit display credentials and physical metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">Display Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">Username</label>
              <input
                type="text"
                value={profile.username}
                onChange={e => setProfile({ ...profile, username: e.target.value })}
                className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">Height</label>
              <input
                type="text"
                value={profile.height}
                onChange={e => setProfile({ ...profile, height: e.target.value })}
                className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">Current Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profile.currentWeight}
                onChange={e => setProfile({ ...profile, currentWeight: e.target.value })}
                className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">Target Weight (kg)</label>
              <input
                type="number"
                step="0.1"
                value={profile.targetWeight}
                onChange={e => setProfile({ ...profile, targetWeight: e.target.value })}
                className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                required
              />
            </div>
          </div>
        </div>

        {/* Workout & Daily Goals Card */}
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 md:p-8 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-6">
          <div className="flex items-center gap-3 border-b border-[#E7E4DC] pb-4">
            <div className="w-10 h-10 rounded-2xl bg-[#EEECFF] text-[#5B55E8] flex items-center justify-center font-bold">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#202124]">Workout & Daily Preferences</h2>
              <p className="text-xs text-[#6B6F76]">Rest days, timers, and daily targets</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2">Second Rest Day</label>
                <select
                  value={prefs.secondRestDay}
                  onChange={e => setPrefs({ ...prefs, secondRestDay: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                >
                  {DAY_OPTIONS.map(d => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Timer size={14} className="text-[#5B55E8]" /> Default Set Rest Time (Seconds)
                </label>
                <input
                  type="number"
                  value={prefs.defaultRestSeconds}
                  onChange={e => setPrefs({ ...prefs, defaultRestSeconds: parseInt(e.target.value) || 60 })}
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <GlassWater size={14} className="text-[#5B55E8]" /> Water Target
                  </label>
                  <input
                    type="number"
                    value={prefs.waterTarget}
                    onChange={e => setPrefs({ ...prefs, waterTarget: parseInt(e.target.value) || 8 })}
                    className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2 flex items-center gap-1">
                    <Droplet size={14} className="text-[#5B55E8]" /> Milk Target (ml)
                  </label>
                  <input
                    type="number"
                    value={prefs.milkTarget}
                    onChange={e => setPrefs({ ...prefs, milkTarget: parseInt(e.target.value) || 300 })}
                    className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#202124] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <Music size={14} className="text-[#1DB954]" /> Spotify Playlist / Track Embed URL
                </label>
                <input
                  type="text"
                  value={prefs.spotifyEmbedUrl || ''}
                  onChange={e => setPrefs({ ...prefs, spotifyEmbedUrl: e.target.value })}
                  placeholder="https://open.spotify.com/playlist/..."
                  className="w-full px-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-bold text-[#202124] focus:outline-none focus:border-[#5B55E8]"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleResetForm}
            className="px-6 py-3.5 bg-[#FFFFFF] border border-[#E7E4DC] hover:bg-[#F1F0EB] text-[#202124] font-bold text-xs rounded-2xl transition-all flex items-center gap-2"
          >
            <RotateCcw size={16} /> Cancel & Reset
          </button>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 bg-[#5B55E8] hover:bg-[#4A44D4] text-white font-bold text-xs rounded-2xl shadow-lg shadow-[#5B55E8]/25 transition-all flex items-center gap-2"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : savedSuccess ? (
              <><CheckCircle size={16} /> Changes Saved!</>
            ) : (
              <><Save size={16} /> Save Changes</>
            )}
          </button>
        </div>
      </form>

      {/* Account Session & Nora Memory */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <NoraAvatar state="idle" size={40} />
            <div>
              <h3 className="text-sm font-bold text-[#202124]">Nora AI Memory</h3>
              <p className="text-xs text-[#6B6F76]">Reset conversational chat context</p>
            </div>
          </div>
          <button
            onClick={resetNoraMemory}
            className="px-4 py-2 text-xs font-bold text-[#D94B4B] bg-[#FDECEC] border border-[#D94B4B]/20 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <Trash2 size={14} /> Reset
          </button>
        </div>

        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-[#202124]">Account Session</h3>
            <p className="text-xs text-[#6B6F76]">Sign out of your active workspace</p>
          </div>
          <button
            onClick={logout}
            className="px-5 py-2.5 text-xs font-bold text-white bg-[#D94B4B] hover:bg-[#C43B3B] rounded-xl shadow-md shadow-[#D94B4B]/20 transition-all flex items-center gap-1.5"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </div>
    </motion.div>
  );
}


