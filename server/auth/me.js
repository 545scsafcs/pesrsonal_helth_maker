import connectDB from '../../lib/db.js';
import User from '../../models/User.js';
import { getAuthUser } from '../../lib/auth.js';

export default async function handler(req, res) {
  const authUser = getAuthUser(req);
  if (!authUser) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  await connectDB();

  if (req.method === 'GET') {
    try {
      const user = await User.findById(authUser.userId).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      return res.status(200).json({
        user: {
          id: user._id,
          name: user.name,
          username: user.username,
          currentWeight: user.currentWeight,
          targetWeight: user.targetWeight,
          startingWeight: user.startingWeight,
          height: user.height,
        },
      });
    } catch (error) {
      console.error('Auth check error:', error);
      return res.status(500).json({ message: 'Server error' });
    }
  }

  if (req.method === 'PATCH') {
    try {
      const updates = req.body;
      const allowedFields = ['name', 'username', 'height', 'currentWeight', 'targetWeight', 'startingWeight'];
      const updateData = {};

      for (const field of allowedFields) {
        if (updates[field] !== undefined) {
          updateData[field] = updates[field];
        }
      }

      const updatedUser = await User.findByIdAndUpdate(
        authUser.userId,
        { $set: updateData },
        { new: true, runValidators: true }
      ).select('-password');

      return res.status(200).json({
        message: 'Profile updated successfully',
        user: {
          id: updatedUser._id,
          name: updatedUser.name,
          username: updatedUser.username,
          currentWeight: updatedUser.currentWeight,
          targetWeight: updatedUser.targetWeight,
          startingWeight: updatedUser.startingWeight,
          height: updatedUser.height,
        },
      });
    } catch (error) {
      console.error('Profile update error:', error);
      return res.status(500).json({ message: 'Failed to update profile' });
    }
  }

  return res.status(405).json({ message: 'Method not allowed' });
}
