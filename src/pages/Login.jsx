import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Keyboard, Lock, Mail, ArrowRight, Key } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { startAuthentication } from '@simplewebauthn/browser';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [needMfa, setNeedMfa] = useState(false);
  const [mfaToken, setMfaToken] = useState('');
  const [savedCredentials, setSavedCredentials] = useState({ email: '', password: '' });
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setSavedCredentials({ email: formData.email, password: formData.password });
    const result = await login(formData.email, formData.password);
    if (result.success) {
      navigate('/');
    } else if (result.needMfa) {
      setNeedMfa(true);
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleMfaSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login(savedCredentials.email, savedCredentials.password, mfaToken);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const loginWithPasskey = async () => {
    const username = prompt('Enter your username:');
    if (!username) return;
    setError('');
    setLoading(true);
    try {
      const startRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/authenticate/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username }),
        credentials: 'include'
      });
      if (!startRes.ok) throw new Error('No passkeys registered for this user');
      const options = await startRes.json();
      const authResponse = await startAuthentication(options);
      const finishRes = await fetch(`${import.meta.env.VITE_API_BASE_URL}/webauthn/authenticate/finish`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...authResponse, username }),
        credentials: 'include'
      });
      if (finishRes.ok) {
        navigate('/');
      } else {
        setError('Passkey authentication failed');
      }
    } catch (err) {
      console.error(err);
      setError('Error during passkey login: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-base-dark text-white flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
         <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
         <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] mix-blend-screen animate-pulse"></div>
         <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-accent-purple/20 rounded-full blur-[120px] mix-blend-screen"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-card p-8 rounded-2xl border border-white/10 shadow-2xl">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="p-2 bg-primary/20 rounded-lg border border-primary/50 group-hover:bg-primary/40 transition-colors">
                <Keyboard className="w-6 h-6 text-primary-glow" />
              </div>
            </Link>
            <h2 className="text-3xl font-bold mb-2">Welcome Back</h2>
            <p className="text-gray-400">Enter your credentials to access the arena.</p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-lg mb-6 text-sm text-center">
              {error}
            </div>
          )}

          {/* OAuth Buttons */}
          <div className="space-y-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-base-dark px-2 text-gray-400">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/google`}
                className="flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all hover:shadow-lg"
              >
                Google
              </button>
              <button
                onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/github`}
                className="flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all hover:shadow-lg"
              >
                GitHub
              </button>
              <button
                onClick={() => window.location.href = `${import.meta.env.VITE_API_BASE_URL}/auth/discord`}
                className="flex items-center justify-center py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-xl text-white font-medium transition-all hover:shadow-lg"
              >
                Discord
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email or Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-base-navy/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white placeholder-gray-500 transition-all outline-none"
                  placeholder="player@example.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Password</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className="block w-full pl-10 pr-3 py-3 bg-base-navy/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white placeholder-gray-500 transition-all outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-600 bg-base-navy text-primary focus:ring-primary/50" />
                <span className="text-gray-400 group-hover:text-white transition-colors">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary-glow transition-colors">Forgot password?</a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 group"
            >
              {loading ? 'Logging in...' : 'Enter Arena'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          {/* Passkey Login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-base-dark px-2 text-gray-400">Or</span>
              </div>
            </div>
            <div className="mt-4">
              <button
                onClick={loginWithPasskey}
                disabled={loading}
                className="w-full py-4 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 group border border-white/20"
              >
                <Key className="w-5 h-5" />
                {loading ? 'Authenticating...' : 'Login with Passkey'}
              </button>
            </div>
          </div>

          {/* MFA Verification */}
          {needMfa && (
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-base-dark px-2 text-gray-400">Enter MFA Code</span>
                </div>
              </div>
              <form onSubmit={handleMfaSubmit} className="mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300 ml-1">Authenticator Code</label>
                  <input
                    type="text"
                    value={mfaToken}
                    onChange={(e) => setMfaToken(e.target.value)}
                    required
                    maxLength="6"
                    className="block w-full pl-3 py-3 bg-base-navy/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white placeholder-gray-500 transition-all outline-none text-center text-lg font-mono"
                    placeholder="000000"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 py-3 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-all"
                >
                  {loading ? 'Verifying...' : 'Verify & Login'}
                </button>
              </form>
            </div>
          )}

          <div className="mt-8 text-center text-sm text-gray-400">
            Don't have an account?{' '}
            <Link to="/signup" className="text-primary font-bold hover:text-primary-glow transition-colors">
              Sign Up Free
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
