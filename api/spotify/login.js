import { getAuthUser } from '../../lib/auth.js';

export default async function handler(req, res) {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5173/api/spotify/callback';

  if (!clientId) {
    return res.status(500).json({ message: 'Spotify client ID is not configured on the server.' });
  }

  const scope = 'user-read-currently-playing user-read-playback-state user-modify-playback-state playlist-read-private';
  const state = authUser.userId;

  const spotifyAuthUrl = `https://accounts.spotify.com/authorize?${new URLSearchParams({
    response_type: 'code',
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
    state,
  }).toString()}`;

  return res.redirect(spotifyAuthUrl);
}
