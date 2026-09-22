import mongoose from 'mongoose';

const waterEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  glasses: { type: Number, default: 0 },
  target: { type: Number, default: 8 },
}, { timestamps: true });

waterEntrySchema.index({ userId: 1, date: -1 });

export default mongoose.models.WaterEntry || mongoose.model('WaterEntry', waterEntrySchema);
