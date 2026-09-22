import { requireAuth } from '../../../lib/auth.js';
import connectDB from '../../../lib/db.js';
import User from '../../../models/User.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const authUser = requireAuth(req, res);
  if (!authUser) return;

  const { credential } = req.body;
  if (!credential || !credential.id) {
    return res.status(400).json({ message: 'Invalid credential payload' });
  }

  await connectDB();
  const user = await User.findById(authUser.userId);
  if (!user) return res.status(404).json({ message: 'User not found' });

  // Store passkey credential ID and public key (NO raw biometric data is ever sent or stored!)
  const newPasskey = {
    credentialID: credential.id,
    publicKey: credential.response?.publicKey || credential.id,
    counter: 0,
    transports: credential.response?.transports || ['internal'],
    createdAt: new Date(),
  };

  user.passkeys = user.passkeys || [];
  // Avoid duplicate registration of same credential ID
  if (!user.passkeys.some(p => p.credentialID === credential.id)) {
    user.passkeys.push(newPasskey);
    await user.save();
  }

  return res.status(200).json({ message: 'Passkey registered successfully', success: true });
}
