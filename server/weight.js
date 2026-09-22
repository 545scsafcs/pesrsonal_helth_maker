import connectDB from '../lib/db.js';
import WeightEntry from '../models/WeightEntry.js';
import User from '../models/User.js';
import { requireAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  const authUser = requireAuth(req, res);
  if (!authUser) return;

  await connectDB();

  if (req.method === 'GET') {
    try {
      const entries = await WeightEntry.find({ userId: authUser.userId })
        .sort({ date: -1 })
        .limit(60);
      return res.status(200).json({ entries });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch weight entries' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { weight, date, note } = req.body;
      if (!weight || isNaN(weight)) {
        return res.status(400).json({ message: 'Valid weight is required' });
      }
      const entry = await WeightEntry.create({
        userId: authUser.userId,
        weight: parseFloat(weight),
        date: date ? new Date(date) : new Date(),
        note,
      });
      // Update user's current weight
      await User.findByIdAndUpdate(authUser.userId, { currentWeight: parseFloat(weight) });
      return res.status(201).json({ entry });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to log weight' });
    }
  }

  if (req.method === 'DELETE') {
    try {
      const { id } = req.query;
      if (!id) {
        return res.status(400).json({ message: 'Entry ID is required' });
      }
      await WeightEntry.findOneAndDelete({ _id: id, userId: authUser.userId });

      // Recalculate latest current weight
      const latest = await WeightEntry.findOne({ userId: authUser.userId }).sort({ date: -1 });
      if (latest) {
        await User.findByIdAndUpdate(authUser.userId, { currentWeight: latest.weight });
      }
      return res.status(200).json({ message: 'Weight entry deleted' });
    } catch (error) {
      return res.status(500).json({ message: 'Failed to delete weight entry' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
