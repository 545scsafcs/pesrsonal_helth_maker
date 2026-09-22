import mongoose from 'mongoose';

const nutritionEntrySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  items: {
    breakfast: { type: Boolean, default: false },
    lunch: { type: Boolean, default: false },
    eveningSnack: { type: Boolean, default: false },
    dinner: { type: Boolean, default: false },
    milk: { type: Boolean, default: false },
    banana: { type: Boolean, default: false },
    proteinSource: { type: Boolean, default: false },
    water: { type: Boolean, default: false },
  },
  milkMl: { type: Number, default: 0 },
  customFoods: [{ name: String, time: String }],
  notes: String,
}, { timestamps: true });

nutritionEntrySchema.index({ userId: 1, date: -1 });

export default mongoose.models.NutritionEntry || mongoose.model('NutritionEntry', nutritionEntrySchema);
