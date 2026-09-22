import mongoose from 'mongoose';

const userPreferencesSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  secondRestDay: { type: Number, default: 3 }, // 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  defaultRestSeconds: { type: Number, default: 90 },
  waterTarget: { type: Number, default: 8 },
  milkTarget: { type: Number, default: 300 }, // ml
  workoutTime: { type: String, default: 'evening' },
  notifications: {
    workout: { type: Boolean, default: true },
    water: { type: Boolean, default: true },
    milk: { type: Boolean, default: true },
    meals: { type: Boolean, default: true },
    weight: { type: Boolean, default: false },
    sleep: { type: Boolean, default: false },
  },
  notificationTimes: {
    workout: { type: String, default: '17:00' },
    water: { type: String, default: '10:00' },
    milk: { type: String, default: '21:00' },
  },
  voiceEnabled: { type: Boolean, default: false },
  spotifyConnected: { type: Boolean, default: false },
  spotifyTokens: {
    accessToken: String,
    refreshToken: String,
    expiresAt: Date,
  },
  spotifyEmbedUrl: { type: String, default: 'https://open.spotify.com/embed/playlist/37i9dQZF1DXdLEN7aqioXM' },
  setupCompleted: { type: Boolean, default: false },
}, { timestamps: true });

export default mongoose.models.UserPreferences || mongoose.model('UserPreferences', userPreferencesSchema);

