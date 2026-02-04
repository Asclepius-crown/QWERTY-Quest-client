import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Keyboard, Lock, Mail, User, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    const result = await signup(formData.username, formData.email, formData.password);
    if (result.success) {
       navigate('/');
    } else {
      setError(result.error);
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
            <h2 className="text-3xl font-bold mb-2">Create Player</h2>
            <p className="text-gray-400">Join the ranks and start competing.</p>
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

          <form onSubmit={handleSubmit} className="space-y-5">
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Username</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength="3"
                  className="block w-full pl-10 pr-3 py-3 bg-base-navy/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white placeholder-gray-500 transition-all outline-none"
                  placeholder="Cortex"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Email Address</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                </div>
                <input
                  type="email"
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
                   minLength="6"
                   className="block w-full pl-10 pr-3 py-3 bg-base-navy/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white placeholder-gray-500 transition-all outline-none"
                   placeholder="••••••••"
                 />
               </div>
             </div>

             <div className="space-y-2">
               <label className="text-sm font-medium text-gray-300 ml-1">Confirm Password</label>
               <div className="relative group">
                 <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                   <Lock className="h-5 w-5 text-gray-500 group-focus-within:text-primary transition-colors" />
                 </div>
                 <input
                   type="password"
                   name="confirmPassword"
                   value={formData.confirmPassword}
                   onChange={handleChange}
                   required
                   className="block w-full pl-10 pr-3 py-3 bg-base-navy/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/50 focus:border-primary/50 text-white placeholder-gray-500 transition-all outline-none"
                   placeholder="••••••••"
                 />
               </div>
             </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold text-lg shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] transition-all flex items-center justify-center gap-2 group mt-2"
            >
              {loading ? 'Signing up...' : 'Start Career'}
              {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-400">
            Already have an account?{' '}
            <Link to="/login" className="text-primary font-bold hover:text-primary-glow transition-colors">
              Login
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
