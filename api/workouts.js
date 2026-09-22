import connectDB from '../lib/db.js';
import WorkoutSession from '../models/WorkoutSession.js';
import UserPreferences from '../models/UserPreferences.js';
import { requireAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  const authUser = requireAuth(req, res);
  if (!authUser) return;

  await connectDB();

  if (req.method === 'GET') {
    try {
      const { id, active } = req.query;
      
      if (id) {
        const session = await WorkoutSession.findOne({ _id: id, userId: authUser.userId });
        return res.status(200).json(session);
      }
      
      if (active === 'true') {
        const session = await WorkoutSession.findOne({
          userId: authUser.userId,
          status: 'in-progress'
        }).sort({ startedAt: -1 });
        return res.status(200).json(session || null);
      }

      if (req.query.today === 'true') {
        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date(todayStart);
        todayEnd.setDate(todayEnd.getDate() + 1);

        const session = await WorkoutSession.findOne({
          userId: authUser.userId,
          date: { $gte: todayStart, $lt: todayEnd }
        }).sort({ updatedAt: -1 });
        return res.status(200).json(session || null);
      }

      const sessions = await WorkoutSession.find({ userId: authUser.userId }).sort({ date: -1 });
      return res.status(200).json(sessions);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to fetch workouts' });
    }
  }

  if (req.method === 'POST') {
    try {
      const { workoutType, workoutName, exercises } = req.body;
      
      // Calculate total sets
      let totalSets = 0;
      exercises.forEach(ex => {
        totalSets += ex.sets ? ex.sets.length : 0;
      });

      const session = await WorkoutSession.create({
        userId: authUser.userId,
        workoutType,
        workoutName,
        exercises,
        totalSets,
        startedAt: new Date(),
        status: 'in-progress'
      });

      return res.status(201).json(session);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to start workout' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const { id, updates } = req.body;
      const session = await WorkoutSession.findOneAndUpdate(
        { _id: id, userId: authUser.userId },
        { $set: updates },
        { new: true }
      );
      return res.status(200).json(session);
    } catch (error) {
      return res.status(500).json({ message: 'Failed to update workout' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
