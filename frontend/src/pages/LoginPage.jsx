import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      // Route based on role
      if (user.role === 'ADMIN')     navigate('/admin/dashboard');
      else if (user.role === 'RESPONDER') navigate('/responder/dashboard');
      else navigate('/user/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center relative bg-[#020818] px-4 sm:px-6 lg:px-8 py-12"
      style={{ background: 'linear-gradient(135deg, #020818 0%, #0a1628 50%, #020818 100%)' }}
    >
      {/* Background decorations - subtle glow effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none flex justify-center items-center">
        <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full opacity-[0.04] bg-blue-500 blur-[100px] top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] rounded-full opacity-[0.04] bg-indigo-500 blur-[100px] bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-[420px] mx-auto relative z-10 fade-in-up flex flex-col justify-center">
        {/* Main Card */}
        <div className="w-full rounded-[24px] p-6 sm:p-10 shadow-2xl shadow-black/60 border border-slate-700/50 bg-[#0d1f3c]/60 backdrop-blur-xl">
          
          {/* Header section */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link to="/" className="inline-block mb-6 group outline-none">
              <div className="w-16 h-16 rounded-[20px] flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-500/30 group-hover:scale-105 group-focus:ring-2 group-focus:ring-blue-400 group-focus:ring-offset-2 group-focus:ring-offset-[#0d1f3c] transition-all duration-300">
                <Shield size={32} className="text-white" />
              </div>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
              Sign in to access your emergency response account
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
              <AlertCircle size={18} className="text-red-400 flex-shrink-0 mt-0.5" />
              <span className="text-red-400 text-sm leading-relaxed break-words">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block" htmlFor="login-email">
                Email Address
              </label>
              <div className="relative group w-full">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                <input
                  type="email"
                  id="login-email"
                  className="w-full pl-11 pr-4 h-12 sm:h-14 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 text-[15px]"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block" htmlFor="login-password">
                Password
              </label>
              <div className="relative group w-full">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="login-password"
                  className="w-full pl-11 pr-12 h-12 sm:h-14 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 text-[15px]"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1.5 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button 
              type="submit" 
              className="w-full h-12 sm:h-14 mt-4 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Signing in...</span>
                </>
              ) : 'Sign In'}
            </button>
          </form>

          {/* Demo Credentials Info Box */}
          <div className="mt-8 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 flex flex-col items-center">
            <div className="flex items-center gap-2 mb-3 text-slate-300 text-sm font-medium">
              <Shield size={16} className="text-blue-400" />
              <span>Demo Admin Credentials</span>
            </div>
            <div className="text-sm text-slate-400 flex flex-col items-center gap-1.5">
              <p>Email: <span className="text-slate-200 font-mono tracking-wide ml-1">admin@resqnet.com</span></p>
              <p>Password: <span className="text-slate-200 font-mono tracking-wide ml-1">Admin@123</span></p>
            </div>
          </div>
          
          {/* Divider */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">OR</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          {/* Footer Link */}
          <div className="mt-8 text-center text-sm text-slate-400">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-blue-400 hover:text-blue-300 font-medium hover:underline underline-offset-4 transition-all inline-block mt-1 sm:mt-0">
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
