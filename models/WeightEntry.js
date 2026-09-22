import mongoose from 'mongoose';

const weightEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  weight: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  note: String,
}, { timestamps: true });

weightEntrySchema.index({ userId: 1, date: -1 });

export default mongoose.models.WeightEntry || mongoose.model('WeightEntry', weightEntrySchema);
