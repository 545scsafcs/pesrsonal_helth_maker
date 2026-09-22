import connectDB from '../lib/db.js';
import WaterEntry from '../models/WaterEntry.js';
import UserPreferences from '../models/UserPreferences.js';
import { requireAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  const authUser = requireAuth(req, res);
  if (!authUser) return;

  await connectDB();

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (req.method === 'GET') {
    try {
      let entry = await WaterEntry.findOne({
        userId: authUser.userId,
        date: { $gte: today, $lt: tomorrow },
      });
      const prefs = await UserPreferences.findOne({ userId: authUser.userId });
      return res.status(200).json({
        glasses: entry?.glasses || 0,
        target: prefs?.waterTarget || 8,
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch water data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { glasses } = req.body;
      const entry = await WaterEntry.findOneAndUpdate(
        { userId: authUser.userId, date: { $gte: today, $lt: tomorrow } },
        { $set: { glasses: glasses || 0, date: today } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(200).json({ entry });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update water' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
