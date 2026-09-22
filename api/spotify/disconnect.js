import connectDB from '../../lib/db.js';
import UserPreferences from '../../models/UserPreferences.js';
import { requireAuth } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authUser = requireAuth(req, res);
  if (!authUser) return;

  await connectDB();
  await UserPreferences.findOneAndUpdate(
    { userId: authUser.userId },
    {
      $set: {
        spotifyConnected: false,
        'spotifyTokens.accessToken': null,
        'spotifyTokens.refreshToken': null,
        'spotifyTokens.expiresAt': null,
      },
    }
  );

  return res.status(200).json({ message: 'Spotify account disconnected successfully', connected: false });
}
