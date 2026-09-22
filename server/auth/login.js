import bcrypt from 'bcryptjs';
import connectDB from '../../lib/db.js';
import User from '../../models/User.js';
import UserPreferences from '../../models/UserPreferences.js';
import { createToken, setAuthCookie } from '../../lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { username, phoneNumber, identifier: bodyIdentifier, password } = req.body;
    const identifier = (username || phoneNumber || bodyIdentifier || '').trim().toLowerCase();

    if (!identifier || !password) {
      return res.status(400).json({ message: 'Username/Phone number and password are required' });
    }

    await connectDB();

    // Find user by username or mobile number
    let user = await User.findOne({
      $or: [
        { username: identifier },
        { phoneNumber: identifier },
      ],
    });

    // If no user exists and this is the first login, seed the default user
    if (!user) {
      const defaultPassword = process.env.DEFAULT_USER_PASSWORD || 'vineet123';
      if ((identifier === 'vineet' || identifier === '9876543210') && password === defaultPassword) {
        const hashedPassword = await bcrypt.hash(password, 12);
        user = await User.create({
          username: 'vineet',
          phoneNumber: '9876543210',
          password: hashedPassword,
          name: 'Vineet',
          height: '6 feet',
          startingWeight: 56,
          currentWeight: 56,
          targetWeight: 60,
        });
        await UserPreferences.create({
          userId: user._id,
          secondRestDay: 3,
          setupCompleted: false,
        });
      } else {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    } else {
      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
    }

    const token = createToken(user._id.toString());
    setAuthCookie(res, token);

    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        phoneNumber: user.phoneNumber,
        currentWeight: user.currentWeight,
        targetWeight: user.targetWeight,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Server error. Please try again.' });
  }
}
