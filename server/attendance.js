import connectDB from '../lib/db.js';
import WorkoutSession from '../models/WorkoutSession.js';
import UserPreferences from '../models/UserPreferences.js';
import WaterEntry from '../models/WaterEntry.js';
import NutritionEntry from '../models/NutritionEntry.js';
import WeightEntry from '../models/WeightEntry.js';
import { requireAuth } from '../lib/auth.js';

export default async function handler(req, res) {
  const authUser = requireAuth(req, res);
  if (!authUser) return;

  await connectDB();

  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { month, year } = req.query;
    const m = parseInt(month) || (new Date().getMonth() + 1);
    const y = parseInt(year) || new Date().getFullYear();

    const startDate = new Date(y, m - 1, 1);
    const endDate = new Date(y, m, 0, 23, 59, 59);

    const sessions = await WorkoutSession.find({
      userId: authUser.userId,
      date: { $gte: startDate, $lte: endDate },
    });

    const prefs = await UserPreferences.findOne({ userId: authUser.userId });
    const secondRestDay = prefs?.secondRestDay ?? 3;

    // Build day status map
    const days = {};
    for (let d = 1; d <= endDate.getDate(); d++) {
      const date = new Date(y, m - 1, d);
      const dateStr = `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const dayOfWeek = date.getDay();

      if (dayOfWeek === 0 || dayOfWeek === secondRestDay) {
        days[dateStr] = 'rest';
      } else {
        const session = sessions.find(s => {
          const sd = new Date(s.date);
          return sd.getDate() === d;
        });
        if (session) {
          days[dateStr] = session.status === 'completed' ? 'completed' : 'partial';
        } else if (date < new Date()) {
          days[dateStr] = 'missed';
        }
      }
    }

    // Stats
    const allSessions = await WorkoutSession.find({ userId: authUser.userId });
    const completedCount = allSessions.filter(s => s.status === 'completed' || s.status === 'partial').length;

    // Streak calculation
    let streak = 0;
    const check = new Date();
    check.setHours(0, 0, 0, 0);
    for (let i = 0; i < 365; i++) {
      const dayStr = check.toISOString().slice(0, 10);
      const dow = check.getDay();
      const isRest = dow === 0 || dow === secondRestDay;
      const hasWorkout = allSessions.some(s => new Date(s.date).toISOString().slice(0, 10) === dayStr);

      if (hasWorkout || isRest) {
        if (hasWorkout) streak++;
        check.setDate(check.getDate() - 1);
      } else if (i === 0) {
        check.setDate(check.getDate() - 1);
        continue;
      } else {
        break;
      }
    }

    // Today's Activity metrics (Real DB values)
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);
    const todayEnd = new Date(todayStart);
    todayEnd.setDate(todayEnd.getDate() + 1);

    const todayWorkout = await WorkoutSession.findOne({
      userId: authUser.userId,
      date: { $gte: todayStart, $lt: todayEnd },
    });

    const waterToday = await WaterEntry.findOne({
      userId: authUser.userId,
      date: { $gte: todayStart, $lt: todayEnd },
    });

    const nutritionToday = await NutritionEntry.findOne({
      userId: authUser.userId,
      date: { $gte: todayStart, $lt: todayEnd },
    });

    const latestWeight = await WeightEntry.findOne({ userId: authUser.userId }).sort({ date: -1 });

    const todayActivity = {
      workout: todayWorkout ? {
        status: todayWorkout.status,
        workoutName: todayWorkout.workoutName || todayWorkout.workoutType,
        durationMinutes: todayWorkout.durationMinutes || 0,
        completedSets: todayWorkout.completedSets || 0,
        totalSets: todayWorkout.totalSets || 0,
        notes: todayWorkout.notes || '',
      } : null,
      water: waterToday ? {
        glasses: waterToday.glasses || 0,
        target: waterToday.target || 8,
      } : null,
      nutrition: nutritionToday ? {
        milkMl: nutritionToday.milkMl || 0,
        items: nutritionToday.items || {},
      } : null,
      weight: latestWeight ? {
        weight: latestWeight.weight,
        date: latestWeight.date,
      } : null,
    };

    return res.status(200).json({
      days,
      stats: {
        streak,
        longest: streak,
        total: completedCount,
        planned: Object.values(days).filter(v => v !== 'rest').length,
      },
      todayActivity,
    });
  } catch (error) {
    console.error('Attendance error:', error);
    return res.status(500).json({ message: 'Failed to fetch attendance' });
  }
}
