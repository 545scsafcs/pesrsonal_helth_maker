import connectDB from '../lib/db.js';
import UserPreferences from '../models/UserPreferences.js';
import { requireAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  const authUser = requireAuth(req, res);
  if (!authUser) return;

  await connectDB();

  if (req.method === 'GET') {
    try {
      const prefs = await UserPreferences.findOne({ userId: authUser.userId });
      if (!prefs) {
        return res.status(200).json({
          secondRestDay: 3,
          defaultRestSeconds: 90,
          waterTarget: 8,
          milkTarget: 300,
          voiceEnabled: false,
          setupCompleted: false,
        });
      }
      return res.status(200).json({
        secondRestDay: prefs.secondRestDay,
        defaultRestSeconds: prefs.defaultRestSeconds,
        waterTarget: prefs.waterTarget,
        milkTarget: prefs.milkTarget,
        notifications: prefs.notifications,
        voiceEnabled: prefs.voiceEnabled,
        spotifyEmbedUrl: prefs.spotifyEmbedUrl || 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM',
        setupCompleted: prefs.setupCompleted,
      });

    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch preferences' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const updates = req.body;
      const prefs = await UserPreferences.findOneAndUpdate(
        { userId: authUser.userId },
        { $set: updates },
        { upsert: true, new: true }
      );
      return res.status(200).json({ message: 'Preferences saved', prefs });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to save preferences' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
