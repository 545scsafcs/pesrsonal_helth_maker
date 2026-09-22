import { requireAuth } from '../../../lib/auth.js';
import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authUser = requireAuth(req, res);
  if (!authUser) return;

  await connectDB();
  const user = await User.findById(authUser.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Generate WebAuthn registration challenge (stored in session/challenge token)
  const challenge = Buffer.from(Math.random().toString(36).substring(2) + Date.now()).toString('base64url');

  const options = {
    challenge,
    rp: { name: "Vineet's Health OS", id: req.headers.host?.split(':')[0] || 'localhost' },
    user: {
      id: Buffer.from(user._id.toString()).toString('base64url'),
      name: user.username,
      displayName: user.name,
    },
    pubKeyCredParams: [
      { alg: -7, type: 'public-key' },  // ES256
      { alg: -257, type: 'public-key' } // RS256
    ],
    authenticatorSelection: {
      userVerification: 'preferred',
      authenticatorAttachment: 'platform',
    },
    timeout: 60000,
  };

  return res.status(200).json(options);
}
