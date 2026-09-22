import connectDB from '../../lib/db.js';
import UserPreferences from '../../models/UserPreferences.js';

export default async function handler(req, res) {
  const { code, state, error } = req.query;

  if (error || !code) {
    return res.redirect('/music?error=spotify_denied');
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI || 'http://localhost:5173/api/spotify/callback';

  if (!clientId || !clientSecret) {
    return res.status(500).json({ message: 'Spotify credentials missing on server' });
  }

  try {
    const tokenRes = await fetch('https://accounts.spotify.com/api/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }).toString(),
    });

    if (!tokenRes.ok) {
      const errText = await tokenRes.text();
      console.error('Spotify token exchange failed:', errText);
      return res.redirect('/music?error=spotify_token_failed');
    }

    const tokenData = await tokenRes.json();
    const { access_token, refresh_token, expires_in } = tokenData;

    await connectDB();
    if (state) {
      const expiresAt = new Date(Date.now() + (expires_in || 3600) * 1000);
      await UserPreferences.findOneAndUpdate(
        { userId: state },
        {
          $set: {
            spotifyConnected: true,
            spotifyTokens: {
              accessToken: access_token,
              refreshToken: refresh_token,
              expiresAt,
            },
          },
        },
        { upsert: true }
      );
    }

    return res.redirect('/music?connected=true');
  } catch (err) {
    console.error('Spotify callback error:', err);
    return res.redirect('/music?error=spotify_server_error');
  }
}
