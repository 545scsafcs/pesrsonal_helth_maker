import connectDB from '../lib/db.js';
import NutritionEntry from '../models/NutritionEntry.js';
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
      const entry = await NutritionEntry.findOne({
        userId: authUser.userId,
        date: { $gte: today, $lt: tomorrow },
      });
      return res.status(200).json({
        items: entry?.items || {},
        milkMl: entry?.milkMl || 0,
        customFoods: entry?.customFoods || [],
      });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch nutrition data' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { items, milkMl, customFoods } = req.body;
      const entry = await NutritionEntry.findOneAndUpdate(
        { userId: authUser.userId, date: { $gte: today, $lt: tomorrow } },
        { $set: { items, milkMl: milkMl || 0, customFoods: customFoods || [], date: today } },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      return res.status(200).json({ entry });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update nutrition' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
