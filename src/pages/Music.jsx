import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Music as MusicIcon, Settings as SettingsIcon, Sparkles, ExternalLink, LogOut, CheckCircle, Disc } from 'lucide-react';

export function formatSpotifyEmbedUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator';
  }
  let url = rawUrl.trim();
  if (url.includes('open.spotify.com/embed/')) return url;
  if (url.includes('open.spotify.com/')) {
    return url.replace('open.spotify.com/', 'open.spotify.com/embed/');
  }
  return 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM?utm_source=generator';
}

export default function Music() {
  const [searchParams] = useSearchParams();
  const [spotifyData, setSpotifyData] = useState({ connected: false });
  const [loading, setLoading] = useState(true);
  const [spotifyUrl, setSpotifyUrl] = useState('https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM');

  const connectedParam = searchParams.get('connected');
  const errorParam = searchParams.get('error');

  useEffect(() => {
    fetchSpotifyInfo();
  }, []);

  const fetchSpotifyInfo = async () => {
    setLoading(true);
    try {
      const data = await api.get('/api/spotify/me');
      if (data) {
        setSpotifyData(data);
        if (data.spotifyEmbedUrl) setSpotifyUrl(data.spotifyEmbedUrl);
      }
    } catch (err) {
      console.warn('Spotify info fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = async () => {
    try {
      await api.post('/api/spotify/disconnect', {});
      setSpotifyData({ connected: false });
    } catch (err) {
      console.error('Failed to disconnect Spotify:', err);
    }
  };

  const embedSrc = formatSpotifyEmbedUrl(spotifyUrl);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6 max-w-4xl mx-auto page-enter">
      {/* Header */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#202124]">Workout Music</h1>
          <p className="text-[#6B6F76] text-xs font-medium mt-1">
            Connect your Spotify account or listen to custom workout playlists.
          </p>
        </div>

        <Link
          to="/settings"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-[#EEECFF] text-[#5B55E8] hover:bg-[#e2deff] font-bold text-xs transition-colors self-start sm:self-auto border border-[#5B55E8]/20"
        >
          <SettingsIcon size={16} />
          <span>Spotify Settings</span>
        </Link>
      </div>

      {/* Connection Notice Alerts */}
      {connectedParam && (
        <div className="bg-[#E8F7EF] border border-[#21A366]/30 text-[#21A366] text-xs font-bold p-4 rounded-2xl flex items-center gap-2">
          <CheckCircle size={18} />
          <span>Spotify account successfully connected!</span>
        </div>
      )}
      {errorParam && (
        <div className="bg-rose-50 border border-rose-200 text-[#D94B4B] text-xs font-bold p-4 rounded-2xl">
          <span>Failed to connect Spotify account: {errorParam}</span>
        </div>
      )}

      {/* Spotify OAuth Account Card */}
      <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-6 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-4">
        <div className="flex items-center justify-between border-b border-[#E7E4DC] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#1DB954]/10 text-[#1DB954] flex items-center justify-center font-bold">
              <MusicIcon size={22} />
            </div>
            <div>
              <h2 className="text-base font-bold text-[#202124]">Spotify Account Status</h2>
              <p className="text-xs text-[#6B6F76]">
                {spotifyData.connected ? `Connected as ${spotifyData.profile?.display_name || 'Spotify User'}` : 'Not connected'}
              </p>
            </div>
          </div>

          {spotifyData.connected ? (
            <span className="text-xs font-bold text-[#1DB954] bg-[#1DB954]/10 border border-[#1DB954]/20 px-3 py-1 rounded-full flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#1DB954] animate-pulse" />
              Connected
            </span>
          ) : (
            <a
              href="/api/spotify/login"
              className="px-4 py-2 bg-[#1DB954] hover:bg-[#1AA34A] text-white font-bold text-xs rounded-xl shadow-xs transition-all inline-flex items-center gap-2"
            >
              <Disc size={16} />
              <span>Connect Spotify</span>
            </a>
          )}
        </div>

        {/* Connected Profile Details & Playlists */}
        {spotifyData.connected && spotifyData.profile && (
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between bg-[#F7F6F2] p-4 rounded-2xl border border-[#E7E4DC]">
              <div className="flex items-center gap-3">
                {spotifyData.profile.images?.[0]?.url ? (
                  <img
                    src={spotifyData.profile.images[0].url}
                    alt={spotifyData.profile.display_name}
                    className="w-10 h-10 rounded-full object-cover border border-[#E7E4DC]"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#1DB954] text-white font-bold flex items-center justify-center text-sm">
                    {spotifyData.profile.display_name?.[0] || 'S'}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-[#202124]">{spotifyData.profile.display_name}</p>
                  <p className="text-xs text-[#6B6F76] font-medium">{spotifyData.profile.email || spotifyData.profile.id}</p>
                </div>
              </div>

              <button
                onClick={handleDisconnect}
                className="px-3 py-1.5 rounded-xl bg-rose-50 text-[#D94B4B] hover:bg-rose-100 border border-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-all"
              >
                <LogOut size={14} /> Disconnect
              </button>
            </div>

            {/* Playlists Grid */}
            {spotifyData.playlists && spotifyData.playlists.length > 0 && (
              <div>
                <h3 className="text-xs font-bold text-[#6B6F76] uppercase tracking-wider mb-3">Your Playlists</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {spotifyData.playlists.map(pl => (
                    <a
                      key={pl.id}
                      href={pl.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC] hover:border-[#1DB954] transition-all flex items-center justify-between group"
                    >
                      <div className="flex items-center gap-3">
                        {pl.images?.[0]?.url ? (
                          <img src={pl.images[0].url} alt={pl.name} className="w-10 h-10 rounded-xl object-cover" />
                        ) : (
                          <div className="w-10 h-10 rounded-xl bg-[#EEECFF] text-[#5B55E8] flex items-center justify-center">
                            <MusicIcon size={18} />
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-[#202124] group-hover:text-[#1DB954] transition-colors">{pl.name}</p>
                          <p className="text-[10px] text-[#6B6F76] font-medium">{pl.tracksTotal} tracks</p>
                        </div>
                      </div>
                      <ExternalLink size={14} className="text-[#6B6F76] group-hover:text-[#1DB954]" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Embedded Player */}
        <div className="w-full rounded-2xl overflow-hidden border border-[#E7E4DC] bg-[#F7F6F2] pt-2">
          <div className="px-4 pb-2 flex items-center justify-between">
            <span className="text-xs font-bold text-[#202124]">Workout Player Embed</span>
            <span className="text-[10px] text-[#6B6F76] font-medium">Standard Web Player</span>
          </div>
          <iframe
            title="Spotify Workout Player"
            src={embedSrc}
            width="100%"
            height="380"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="w-full rounded-2xl"
          />
        </div>
      </div>

      {/* Nora Tip Card */}
      <div className="bg-[#E8F7EF] border border-[#21A366]/20 rounded-3xl p-5 shadow-[0_2px_8px_rgba(32,33,36,0.03)] flex items-center gap-3.5">
        <Sparkles size={22} className="text-[#21A366] shrink-0" />
        <p className="text-xs text-[#202124] font-medium leading-relaxed">
          <strong className="font-bold text-[#21A366]">Nora Navigation Tip:</strong> Ask Nora anytime by saying <span className="bg-[#FFFFFF] px-2 py-0.5 rounded-md border border-[#21A366]/20 font-bold">"Nora, open music"</span> or <span className="bg-[#FFFFFF] px-2 py-0.5 rounded-md border border-[#21A366]/20 font-bold">"Nora music page kholo"</span> to jump right to this player!
        </p>
      </div>
    </motion.div>
  );
}
