import mongoose from 'mongoose';

const workoutSessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  workoutType: { type: String, required: true }, // 'full-body-a', 'full-body-b', etc.
  workoutName: { type: String },
  date: { type: Date, default: Date.now },
  status: { type: String, enum: ['in-progress', 'completed', 'partial'], default: 'in-progress' },
  exercises: [{
    exerciseId: String,
    exerciseName: String,
    sets: [{
      setNumber: Number,
      targetReps: String,
      actualReps: Number,
      weight: String,
      completed: { type: Boolean, default: false },
      completedAt: Date,
    }],
    completed: { type: Boolean, default: false },
  }],
  startedAt: { type: Date, default: Date.now },
  completedAt: Date,
  durationMinutes: Number,
  totalSets: { type: Number, default: 0 },
  completedSets: { type: Number, default: 0 },
  notes: String,
}, { timestamps: true });

export default mongoose.models.WorkoutSession || mongoose.model('WorkoutSession', workoutSessionSchema);
