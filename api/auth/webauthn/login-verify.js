import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';
import { createToken, setAuthCookie } from '../../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { credential } = req.body;
  if (!credential || !credential.id) {
    return res.status(400).json({ message: 'Invalid passkey credential' });
  }

  await connectDB();
  const user = await User.findOne({ 'passkeys.credentialID': credential.id });
  if (!user) {
    return res.status(401).json({ message: 'Passkey not recognized for this account' });
  }

  const token = createToken(user._id.toString());
  setAuthCookie(res, token);

  return res.status(200).json({
    message: 'Passkey authentication successful',
    user: {
      id: user._id,
      name: user.name,
      username: user.username,
      currentWeight: user.currentWeight,
      targetWeight: user.targetWeight,
    },
  });
}
