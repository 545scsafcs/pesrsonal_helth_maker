import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  phoneNumber: { type: String, sparse: true },
  password: { type: String, required: true },
  name: { type: String, default: 'Vineet' },
  height: { type: String, default: '6 feet' },
  startingWeight: { type: Number, default: 56 },
  currentWeight: { type: Number, default: 56 },
  targetWeight: { type: Number, default: 60 },
  passkeys: [{
    credentialID: { type: String, required: true },
    publicKey: { type: String, required: true },
    counter: { type: Number, default: 0 },
    transports: [String],
    createdAt: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

export default mongoose.models.User || mongoose.model('User', userSchema);
