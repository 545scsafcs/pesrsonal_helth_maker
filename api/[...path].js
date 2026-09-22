import ai from '../server/ai.js';
import attendance from '../server/attendance.js';
import dashboard from '../server/dashboard.js';
import health from '../server/health.js';
import nutrition from '../server/nutrition.js';
import preferences from '../server/preferences.js';
import progress from '../server/progress.js';
import water from '../server/water.js';
import weight from '../server/weight.js';
import workouts from '../server/workouts.js';
import authLogin from '../server/auth/login.js';
import authLogout from '../server/auth/logout.js';
import authMe from '../server/auth/me.js';
import webauthnLoginOptions from '../server/auth/webauthn/login-options.js';
import webauthnLoginVerify from '../server/auth/webauthn/login-verify.js';
import webauthnRegisterOptions from '../server/auth/webauthn/register-options.js';
import webauthnRegisterVerify from '../server/auth/webauthn/register-verify.js';
import spotifyCallback from '../server/spotify/callback.js';
import spotifyDisconnect from '../server/spotify/disconnect.js';
import spotifyLogin from '../server/spotify/login.js';
import spotifyMe from '../server/spotify/me.js';

// All API routes are served through this single serverless function to stay
// within Vercel's per-deployment function limit. Individual handlers live in
// /server and are dispatched here by their path.
const routes = {
  'ai': ai,
  'attendance': attendance,
  'dashboard': dashboard,
  'health': health,
  'nutrition': nutrition,
  'preferences': preferences,
  'progress': progress,
  'water': water,
  'weight': weight,
  'workouts': workouts,
  'auth/login': authLogin,
  'auth/logout': authLogout,
  'auth/me': authMe,
  'auth/webauthn/login-options': webauthnLoginOptions,
  'auth/webauthn/login-verify': webauthnLoginVerify,
  'auth/webauthn/register-options': webauthnRegisterOptions,
  'auth/webauthn/register-verify': webauthnRegisterVerify,
  'spotify/callback': spotifyCallback,
  'spotify/disconnect': spotifyDisconnect,
  'spotify/login': spotifyLogin,
  'spotify/me': spotifyMe,
};

export default async function handler(req, res) {
  const parts = req.query.path;
  const route = Array.isArray(parts) ? parts.join('/') : (parts || '');

  const fn = routes[route];
  if (!fn) {
    return res.status(404).json({ message: `Not found: /api/${route}` });
  }

  return fn(req, res);
}
