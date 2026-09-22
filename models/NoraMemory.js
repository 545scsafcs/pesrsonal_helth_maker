import mongoose from 'mongoose';

const noraMemorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  key: { type: String, required: true },
  value: mongoose.Schema.Types.Mixed,
  category: { type: String, enum: ['preference', 'habit', 'goal', 'note', 'context'], default: 'context' },
  updatedAt: { type: Date, default: Date.now },
}, { timestamps: true });

noraMemorySchema.index({ userId: 1, key: 1 }, { unique: true });

export default mongoose.models.NoraMemory || mongoose.model('NoraMemory', noraMemorySchema);
