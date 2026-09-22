import connectDB from '../lib/db.js';
import User from '../models/User.js';
import UserPreferences from '../models/UserPreferences.js';
import WorkoutSession from '../models/WorkoutSession.js';
import WaterEntry from '../models/WaterEntry.js';
import NutritionEntry from '../models/NutritionEntry.js';
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
    if (!user) return res.status(404).json({ message: 'User not found' });

    const prefs = await UserPreferences.findOne({ userId: user._id });

    // Today's date range
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Water today
    const waterToday = await WaterEntry.findOne({
      userId: user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    // Nutrition today
    const nutritionToday = await NutritionEntry.findOne({
      userId: user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    // Count checked nutrition items
    let nutritionCount = 0;
    if (nutritionToday?.items) {
      nutritionCount = Object.values(nutritionToday.items.toObject ? nutritionToday.items.toObject() : nutritionToday.items)
        .filter(v => v === true).length;
    }

    // Workout streak
    let streak = 0;
    const recentWorkouts = await WorkoutSession.find({
      userId: user._id,
      status: { $in: ['completed', 'partial'] },
    }).sort({ date: -1 }).limit(60);

    if (recentWorkouts.length > 0) {
      const checkDate = new Date();
      checkDate.setHours(0, 0, 0, 0);
      // Check if today has a workout
      const todayWorkout = recentWorkouts.find(w => {
        const wd = new Date(w.date);
        wd.setHours(0, 0, 0, 0);
        return wd.getTime() === checkDate.getTime();
      });
      if (!todayWorkout) {
        checkDate.setDate(checkDate.getDate() - 1);
      }
      // Count consecutive days
      for (let i = 0; i < 60; i++) {
        const dayStr = checkDate.toISOString().slice(0, 10);
        const hasWorkout = recentWorkouts.some(w => {
          const wd = new Date(w.date);
          return wd.toISOString().slice(0, 10) === dayStr;
        });
        const dayOfWeek = checkDate.getDay();
        const isRestDay = dayOfWeek === 0 || dayOfWeek === (prefs?.secondRestDay ?? 3);

        if (hasWorkout || isRestDay) {
          if (hasWorkout) streak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return res.status(200).json({
      currentWeight: user.currentWeight,
      targetWeight: user.targetWeight,
      startingWeight: user.startingWeight,
      streak,
      todayWater: waterToday?.glasses || 0,
      waterTarget: prefs?.waterTarget || 8,
      todayNutrition: nutritionCount,
      nutritionTarget: 8,
      secondRestDay: prefs?.secondRestDay ?? 3,
      setupCompleted: prefs?.setupCompleted ?? false,
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    return res.status(500).json({ message: 'Failed to load dashboard' });
  }
}
