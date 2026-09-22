import { EXERCISES } from './exercises';

export const WORKOUT_TYPES = {
  'full-body-a': {
    id: 'full-body-a',
    name: 'Full Body A',
    emoji: '🏋️',
    description: 'Compound-focused full body session',
    color: 'brand',
    exercises: ['goblet-squat', 'romanian-deadlift', 'floor-press', 'one-arm-row', 'shoulder-press', 'dumbbell-curl', 'triceps-extension', 'calf-raises'],
  },
  'full-body-b': {
    id: 'full-body-b',
    name: 'Full Body B',
    emoji: '💪',
    description: 'Unilateral and balance focus',
    color: 'energy',
    exercises: ['bulgarian-split-squat', 'single-leg-rdl', 'pushup', 'one-arm-row', 'lateral-raise', 'hammer-curl', 'triceps-extension', 'plank'],
  },
  'upper-body': {
    id: 'upper-body',
    name: 'Upper Body',
    emoji: '💪',
    description: 'Chest, back, shoulders, arms',
    color: 'brand',
    exercises: ['floor-press', 'one-arm-row', 'shoulder-press', 'lateral-raise', 'dumbbell-curl', 'hammer-curl', 'triceps-extension', 'pushup'],
  },
  'lower-body': {
    id: 'lower-body',
    name: 'Lower Body',
    emoji: '🦵',
    description: 'Legs and glutes',
    color: 'energy',
    exercises: ['goblet-squat', 'romanian-deadlift', 'bulgarian-split-squat', 'single-leg-rdl', 'calf-raises'],
  },
  'core': {
    id: 'core',
    name: 'Core',
    emoji: '🔥',
    description: 'Core and stability',
    color: 'warn',
    exercises: ['plank', 'goblet-squat', 'pushup'],
  },
  'quick': {
    id: 'quick',
    name: 'Quick 20 Min',
    emoji: '⚡',
    description: 'Fast and effective',
    color: 'brand',
    exercises: ['goblet-squat', 'pushup', 'one-arm-row', 'plank'],
  },
};

export const WORKOUT_OPTIONS = [
  { id: 'full-body-a', label: 'Full Body A', emoji: '🏋️', desc: 'Compound movements' },
  { id: 'full-body-b', label: 'Full Body B', emoji: '💪', desc: 'Unilateral & balance' },
  { id: 'upper-body', label: 'Upper Body', emoji: '💪', desc: 'Push & pull' },
  { id: 'lower-body', label: 'Lower Body', emoji: '🦵', desc: 'Legs & glutes' },
  { id: 'core', label: 'Core', emoji: '🔥', desc: 'Core stability' },
  { id: 'quick', label: 'Quick 20 Min', emoji: '⚡', desc: 'Fast session' },
  { id: 'custom', label: 'Custom', emoji: '🎯', desc: 'Pick exercises' },
  { id: 'rest', label: 'Rest Day', emoji: '😴', desc: 'Recovery' },
];

/**
 * Get the full workout plan with exercise details
 */
export function getWorkoutPlan(typeId) {
  const type = WORKOUT_TYPES[typeId];
  if (!type) return null;

  const exercises = type.exercises
    .map(id => EXERCISES.find(e => e.id === id))
    .filter(Boolean);

  return { ...type, exerciseDetails: exercises };
}

/**
 * Distribute Full Body A/B across workout days
 * workoutDays = array of day indices (0=Sun, 1=Mon, ..., 6=Sat) that are workout days
 */
export function distributeWorkouts(workoutDays) {
  const schedule = {};
  workoutDays.forEach((day, idx) => {
    schedule[day] = idx % 2 === 0 ? 'full-body-a' : 'full-body-b';
  });
  return schedule;
}

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

/**
 * Generate a full weekly schedule
 * @param {number} secondRestDay - day index (0-6) for the second rest day
 */
export function generateWeeklySchedule(secondRestDay = 3) {
  const schedule = [];
  const workoutDayIndices = [];

  for (let i = 0; i < 7; i++) {
    if (i === 0 || i === secondRestDay) {
      schedule.push({ day: i, dayName: DAY_NAMES[i], type: 'rest', label: 'Rest' });
    } else {
      workoutDayIndices.push(i);
      schedule.push({ day: i, dayName: DAY_NAMES[i], type: 'workout', label: '' });
    }
  }

  // Distribute A/B across workout days
  const distribution = distributeWorkouts(workoutDayIndices);
  schedule.forEach(s => {
    if (s.type === 'workout') {
      const workoutType = distribution[s.day];
      const wt = WORKOUT_TYPES[workoutType];
      s.workoutId = workoutType;
      s.label = wt ? wt.name : 'Workout';
      s.emoji = wt ? wt.emoji : '🏋️';
    }
  });

  return schedule;
}
