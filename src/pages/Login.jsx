import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { Lock, User, Eye, EyeOff, ArrowRight, Fingerprint, Phone } from 'lucide-react';
import Logo from '../components/Logo';
import { api } from '../services/api';

export default function Login() {
  const { user, login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [passkeyLoading, setPasskeyLoading] = useState(false);

  if (user) return <Navigate to="/dashboard" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(identifier, password);
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasskeyLogin = async () => {
    setError('');
    setPasskeyLoading(true);
    try {
      if (!window.PublicKeyCredential) {
        throw new Error('Passkeys/WebAuthn biometrics are not supported on this browser or device.');
      }
      const options = await api.post('/api/auth/webauthn/login-options', {});
      const challengeBuffer = Uint8Array.from(atob(options.challenge), c => c.charCodeAt(0));

      const allowCredentials = (options.allowCredentials || []).map(c => ({
        ...c,
        id: Uint8Array.from(atob(c.id), ch => ch.charCodeAt(0)),
      }));

      const credential = await navigator.credentials.get({
        publicKey: {
          challenge: challengeBuffer,
          allowCredentials,
          userVerification: options.userVerification || 'preferred',
          timeout: options.timeout || 60000,
        },
      });

      if (!credential) throw new Error('Biometric authentication cancelled');

      const passkeyPayload = {
        id: credential.id,
        rawId: Buffer.from(credential.rawId).toString('base64url'),
        type: credential.type,
      };

      const verifyRes = await api.post('/api/auth/webauthn/login-verify', { credential: passkeyPayload });
      if (verifyRes.user) {
        window.location.href = '/dashboard';
      }
    } catch (err) {
      setError(err.message || 'Passkey login failed. Please use your password.');
    } finally {
      setPasskeyLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F7F6F2] px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md"
      >
        <div className="bg-[#FFFFFF] border border-[#E7E4DC] rounded-3xl p-8 shadow-[0_2px_8px_rgba(32,33,36,0.03)] space-y-6">
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-3">
              <Logo size={56} />
            </div>
            <h1 className="text-2xl font-black text-[#202124] tracking-tight">Vineet's Health OS</h1>
            <p className="text-xs text-[#6B6F76] font-medium mt-1">Personal Workout, Nutrition & AI Assistant</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username / Phone Number */}
            <div>
              <label htmlFor="identifier" className="block text-xs font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">
                Username or Mobile Number
              </label>
              <div className="relative">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9DA3]" />
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="vineet or 9876543210"
                  className="w-full pl-10 pr-4 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-semibold text-[#202124] placeholder-[#9A9DA3] focus:outline-none focus:border-[#5B55E8]"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-bold text-[#6B6F76] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9A9DA3]" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 bg-[#F7F6F2] border border-[#E7E4DC] rounded-2xl text-xs font-semibold text-[#202124] placeholder-[#9A9DA3] focus:outline-none focus:border-[#5B55E8]"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#9A9DA3] hover:text-[#202124]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Display */}
            {error && (
              <p className="text-xs font-bold text-[#D94B4B] text-center bg-rose-50 p-2.5 rounded-xl border border-rose-200">
                {error}
              </p>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-[#5B55E8] hover:bg-[#4B45D8] text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2 shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* WebAuthn / Passkey Biometric Button */}
          <div className="pt-2 border-t border-[#E7E4DC]">
            <button
              onClick={handlePasskeyLogin}
              disabled={passkeyLoading}
              className="w-full py-3 bg-[#EEECFF] hover:bg-[#5B55E8] text-[#5B55E8] hover:text-white font-bold text-xs rounded-2xl border border-[#E7E4DC] transition-all flex items-center justify-center gap-2"
            >
              <Fingerprint size={18} />
              <span>{passkeyLoading ? 'Authenticating...' : 'Passkey / Biometrics Login (Fingerprint / Face)'}</span>
            </button>
            <p className="text-[10px] text-[#6B6F76] text-center mt-1.5 font-medium">
              🔒 Biometric data stays on your device. Only public passkeys are verified.
            </p>
          </div>

          {/* Quick Demo Fill */}
          <div
            onClick={() => {
              setIdentifier('vineet');
              setPassword('vineet123');
            }}
            className="p-3.5 rounded-2xl bg-[#F7F6F2] border border-[#E7E4DC] cursor-pointer hover:border-[#5B55E8] transition-all"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[#202124]">Quick Dev Fill</span>
              <span className="text-[10px] text-[#5B55E8] font-bold">vineet / vineet123</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
