import connectDB from '../../lib/db.js';
import UserPreferences from '../../models/UserPreferences.js';
import { requireAuth } from '../../lib/auth.js';

async function getValidAccessToken(prefs) {
  if (!prefs?.spotifyTokens?.accessToken) return null;

  const { accessToken, refreshToken, expiresAt } = prefs.spotifyTokens;
  const isExpired = !expiresAt || new Date(expiresAt) <= new Date(Date.now() + 60000);

  if (!isExpired) return accessToken;
  if (!refreshToken) return null;

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) return null;

  try {
    const refreshRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
      }).toString(),
    });

    if (!refreshRes.ok) return null;
    const data = await refreshRes.json();
    const newAccessToken = data.access_token;
    const newExpiresAt = new Date(Date.now() + (data.expires_in || 3600) * 1000);

    prefs.spotifyTokens.accessToken = newAccessToken;
    prefs.spotifyTokens.expiresAt = newExpiresAt;
    if (data.refresh_token) prefs.spotifyTokens.refreshToken = data.refresh_token;
    await prefs.save();

    return newAccessToken;
  } catch (err) {
    console.error('Spotify token refresh error:', err);
    return null;
  }
}

export default async function handler(req, res) {
  const authUser = requireAuth(req, res);
  if (!authUser) return;

  await connectDB();
  const prefs = await UserPreferences.findOne({ userId: authUser.userId });
  if (!prefs || !prefs.spotifyConnected) {
    return res.status(200).json({ connected: false, spotifyEmbedUrl: prefs?.spotifyEmbedUrl });
  }

  const accessToken = await getValidAccessToken(prefs);
  if (!accessToken) {
    prefs.spotifyConnected = false;
    await prefs.save();
    return res.status(200).json({ connected: false, spotifyEmbedUrl: prefs.spotifyEmbedUrl });
  }

  try {
    const profileRes = await fetch('https://api.spotify.com/v1/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (!profileRes.ok) {
      return res.status(200).json({ connected: false, spotifyEmbedUrl: prefs.spotifyEmbedUrl });
    }

    const profile = await profileRes.json();

    const playlistsRes = await fetch('https://api.spotify.com/v1/me/playlists?limit=10', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const playlistsData = playlistsRes.ok ? await playlistsRes.json() : { items: [] };

    return res.status(200).json({
      connected: true,
      profile: {
        display_name: profile.display_name,
        email: profile.email,
        id: profile.id,
        images: profile.images,
        product: profile.product,
      },
      playlists: (playlistsData.items || []).map(p => ({
        id: p.id,
        name: p.name,
        uri: p.uri,
        images: p.images,
        tracksTotal: p.tracks?.total || 0,
        externalUrl: p.external_urls?.spotify,
      })),
      spotifyEmbedUrl: prefs.spotifyEmbedUrl,
    });
  } catch (err) {
    console.error('Spotify me error:', err);
    return res.status(500).json({ message: 'Failed to fetch Spotify account info' });
  }
}
