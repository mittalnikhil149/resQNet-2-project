import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, Mail, Lock, User, Phone, Eye, EyeOff, AlertCircle } from 'lucide-react';

const ROLES = [
  { value: 'USER', label: 'Civilian User', desc: 'Report emergencies and track status' },
  { value: 'RESPONDER', label: 'Responder', desc: 'Firefighter, medic, rescue team' },
];

export default function RegisterPage() {
  const [form, setForm] = useState({
    fullName: '', email: '', phoneNumber: '', password: '', role: 'USER'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'RESPONDER') navigate('/responder/dashboard');
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
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] bg-blue-500 blur-[100px] top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute w-[500px] h-[500px] rounded-full opacity-[0.04] bg-indigo-500 blur-[100px] bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="w-full max-w-[460px] relative z-10 fade-in-up">
        {/* Main Card */}
        <div className="rounded-[24px] p-8 sm:p-10 shadow-2xl shadow-black/60 border border-slate-700/50 bg-[#0d1f3c]/60 backdrop-blur-xl my-8">
          
          {/* Header section */}
          <div className="flex flex-col items-center text-center mb-8">
            <Link to="/" className="inline-block mb-6 group outline-none">
              <div className="w-16 h-16 rounded-[20px] flex items-center justify-center bg-gradient-to-br from-blue-600 to-blue-800 shadow-lg shadow-blue-500/30 group-hover:scale-105 group-focus:ring-2 group-focus:ring-blue-400 group-focus:ring-offset-2 group-focus:ring-offset-[#0d1f3c] transition-all duration-300">
                <Shield size={32} className="text-white" />
              </div>
            </Link>
            <h1 className="text-2xl font-bold text-white tracking-tight mb-2">Create Account</h1>
            <p className="text-sm text-slate-400 leading-relaxed max-w-[280px]">
              Join the emergency response network
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
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Role Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 block">Register As</label>
              <div className="grid grid-cols-2 gap-3">
                {ROLES.map((r) => (
                  <button key={r.value} type="button"
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`p-3.5 rounded-xl border text-left transition-all outline-none focus:ring-2 focus:ring-blue-500/50 ${
                      form.role === r.value
                        ? 'border-blue-500 bg-blue-500/15 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                        : 'border-slate-700/50 bg-slate-900/30 hover:border-slate-600 hover:bg-slate-900/50'
                    }`}>
                    <div className="text-sm font-semibold text-slate-100">{r.label}</div>
                    <div className="text-[11px] text-slate-400 mt-1 leading-relaxed">{r.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 block">Full Name</label>
              <div className="relative group">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                <input id="reg-name" type="text" 
                  className="w-full pl-11 pr-4 h-12 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 text-[15px]"
                  placeholder="John Doe"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 block">Email Address</label>
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                <input id="reg-email" type="email" 
                  className="w-full pl-11 pr-4 h-12 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 text-[15px]"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 block">Phone Number</label>
              <div className="relative group">
                <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                <input id="reg-phone" type="tel" 
                  className="w-full pl-11 pr-4 h-12 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 text-[15px]"
                  placeholder="+91-9876543210"
                  value={form.phoneNumber}
                  onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })}
                  required />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-slate-300 block">Password</label>
              <div className="relative group">
                <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                <input id="reg-password" type={showPassword ? 'text' : 'password'}
                  className="w-full pl-11 pr-12 h-12 rounded-xl bg-slate-900/50 border border-slate-700/50 text-slate-100 focus:bg-slate-900/80 focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 outline-none transition-all placeholder:text-slate-600 text-[15px]"
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  required />
                <button type="button"
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
              id="reg-submit" 
              className="w-full h-12 mt-6 rounded-xl bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating account...</span>
                </>
              ) : 'Create Account'}
            </button>
          </form>

          {form.role === 'RESPONDER' && (
            <div className="mt-6 flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
              <AlertCircle size={18} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <span className="text-amber-300/90 text-sm leading-relaxed">
                Responder accounts require admin approval before you can receive assignments.
              </span>
            </div>
          )}

          {/* Divider */}
          <div className="mt-8 flex items-center gap-4">
            <div className="h-px bg-slate-800 flex-1"></div>
            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">OR</span>
            <div className="h-px bg-slate-800 flex-1"></div>
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-400 hover:text-blue-300 font-medium hover:underline underline-offset-4 transition-all">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
