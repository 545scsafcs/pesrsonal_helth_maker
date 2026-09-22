import connectDB from '../lib/db.js';
import mongoose from 'mongoose';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  let dbStatus = 'disconnected';
  try {
    await connectDB();
    if (mongoose.connection.readyState === 1) {
      dbStatus = 'connected';
    }
  } catch (err) {
    dbStatus = 'error';
  }

  const geminiStatus = (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY.trim() !== '')
    ? 'configured'
    : 'not_configured';

  const spotifyStatus = (process.env.SPOTIFY_CLIENT_ID && process.env.SPOTIFY_CLIENT_SECRET)
    ? 'configured'
    : 'not_configured';

  return res.status(200).json({
    api: 'ok',
    database: dbStatus,
    gemini: geminiStatus,
    spotify: spotifyStatus,
  });
}
