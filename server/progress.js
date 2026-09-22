import connectDB from '../lib/db.js';
import User from '../models/User.js';
import WorkoutSession from '../models/WorkoutSession.js';
import WeightEntry from '../models/WeightEntry.js';
import WaterEntry from '../models/WaterEntry.js';
import NutritionEntry from '../models/NutritionEntry.js';
import UserPreferences from '../models/UserPreferences.js';
import { requireAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authUser = requireAuth(req, res);
  if (!authUser) return;

  try {
    await connectDB();

    const user = await User.findById(authUser.userId).select('-password');
    const prefs = await UserPreferences.findOne({ userId: authUser.userId });

    // Workout stats
    const sessions = await WorkoutSession.find({ userId: authUser.userId });
    const completed = sessions.filter(s => s.status === 'completed' || s.status === 'partial');
    const totalSets = completed.reduce((sum, s) => sum + (s.completedSets || 0), 0);

    // Weight entries
    const weightEntries = await WeightEntry.find({ userId: authUser.userId })
      .sort({ date: 1 })
      .limit(60);

    // Water average (last 7 days)
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);
    const waterEntries = await WaterEntry.find({
      userId: authUser.userId,
      date: { $gte: last7Days },
    });
    const waterAvg = waterEntries.length > 0
      ? Math.round(waterEntries.reduce((s, e) => s + (e.glasses || 0), 0) / waterEntries.length)
      : 0;

    // Nutrition average
    const nutritionEntries = await NutritionEntry.find({
      userId: authUser.userId,
      date: { $gte: last7Days },
    });
    let nutritionAvg = 0;
    if (nutritionEntries.length > 0) {
      const scores = nutritionEntries.map(e => {
        const items = e.items?.toObject ? e.items.toObject() : (e.items || {});
        const checked = Object.values(items).filter(Boolean).length;
        return Math.round((checked / 8) * 100);
      });
      nutritionAvg = Math.round(scores.reduce((s, v) => s + v, 0) / scores.length);
    }

    // Streak
    const secondRestDay = prefs?.secondRestDay ?? 3;
    let streak = 0;
    const check = new Date();
    check.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const dayStr = check.toISOString().slice(0, 10);
      const dow = check.getDay();
      const isRest = dow === 0 || dow === secondRestDay;
      const hasWorkout = completed.some(s => new Date(s.date).toISOString().slice(0, 10) === dayStr);
      if (hasWorkout || isRest) {
        if (hasWorkout) streak++;
        check.setDate(check.getDate() - 1);
      } else if (i === 0) {
        check.setDate(check.getDate() - 1);
        continue;
      } else break;
    }

    return res.status(200).json({
      totalWorkouts: completed.length,
      totalSets,
      totalReps: 0, // Would need per-set tracking
      streak,
      longestStreak: streak,
      currentWeight: user?.currentWeight || 56,
      targetWeight: user?.targetWeight || 60,
      startingWeight: user?.startingWeight || 56,
      weightEntries,
      waterAvg,
      nutritionAvg,
    });
  } catch (error) {
    console.error('Progress error:', error);
    return res.status(500).json({ message: 'Failed to fetch progress' });
  }
}
