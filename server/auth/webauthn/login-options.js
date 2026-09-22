import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  await connectDB();
  const user = await User.findOne({ username: 'vineet' });
  if (!user) return res.status(404).json({ message: 'User not found' });

  const challenge = Buffer.from(Math.random().toString(36).substring(2) + Date.now()).toString('base64url');

  const allowCredentials = (user.passkeys || []).map(p => ({
    id: p.credentialID,
    type: 'public-key',
    transports: p.transports || ['internal'],
  }));

  return res.status(200).json({
    challenge,
    allowCredentials,
    timeout: 60000,
    userVerification: 'preferred',
  });
}
