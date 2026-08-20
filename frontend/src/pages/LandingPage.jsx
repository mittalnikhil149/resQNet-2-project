import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield, AlertTriangle, Clock, Navigation, CheckCircle2 } from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  const handleEnter = () => {
    if (role === 'ADMIN') navigate('/admin/dashboard');
    else if (role === 'RESPONDER') navigate('/responder/dashboard');
    else navigate('/user/dashboard');
  };

  return (
    <div className="min-h-screen relative overflow-hidden"
      style={{ background: 'linear-gradient(135deg,#020818 0%,#0a1628 50%,#020818 100%)' }}>

      {/* Nav */}
      <nav className="absolute top-0 w-full z-20 border-b border-white/5 bg-[#020818]/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20"
              style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
              <Shield size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white tracking-wide">ResQNet</span>
          </div>
          <div className="flex gap-3">
            {isAuthenticated ? (
              <button onClick={handleEnter} className="btn btn-primary px-4 sm:px-6 py-2">
                Enter Portal
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost px-4 sm:px-6 py-2 text-sm sm:text-base">Sign In</Link>
                <Link to="/register" className="btn btn-primary px-4 sm:px-6 py-2 text-sm sm:text-base">Get Started</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 sm:pt-40 pb-16 sm:pb-24 flex flex-col items-center text-center">
        <div className="badge badge-assigned mb-8 border border-blue-500/20 px-4 py-1.5 fade-in-up">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse mr-2 inline-block"/>
          Smart Emergency Response System
        </div>

        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tight mb-8 leading-[1.1] sm:leading-tight fade-in-up"
          style={{ animationDelay: '0.1s' }}>
          When Seconds Count,<br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
            ResQNet Delivers.
          </span>
        </h1>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mb-10 sm:mb-12 px-4 sm:px-0 fade-in-up" style={{ animationDelay: '0.2s' }}>
          A centralized disaster coordination platform that instantly routes critical emergencies
          to the nearest available responders using intelligent location tracking and Haversine algorithms.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 sm:px-0 fade-in-up" style={{ animationDelay: '0.3s' }}>
          {isAuthenticated ? (
            <button onClick={handleEnter} className="btn btn-primary text-base sm:text-lg px-8 py-4 shadow-lg shadow-blue-500/20 w-full sm:w-auto">
              Access Dashboard
            </button>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary text-base sm:text-lg px-8 py-4 shadow-lg shadow-blue-500/20 w-full sm:w-auto text-center">
                Join as a User
              </Link>
              <Link to="/register" className="btn btn-ghost text-base sm:text-lg px-8 py-4 w-full sm:w-auto text-center border-slate-700">
                Register as Responder
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Features */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="glass rounded-3xl p-6 sm:p-8 hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-black/20">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-6 bg-red-500/10 text-red-500 shadow-inner">
              <AlertTriangle size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Instant Reporting</h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Report emergencies instantly with browser geolocation. Categorize by severity to prioritize critical dispatches automatically.
            </p>
          </div>

          <div className="glass rounded-3xl p-6 sm:p-8 hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-black/20">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-6 bg-blue-500/10 text-blue-500 shadow-inner">
              <Navigation size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Smart Routing</h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Uses the Haversine formula to identify and alert the closest available responders within a 50km radius, minimizing response times.
            </p>
          </div>

          <div className="glass rounded-3xl p-6 sm:p-8 hover:-translate-y-2 transition-transform duration-300 shadow-xl shadow-black/20 md:col-span-2 lg:col-span-1">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-6 bg-green-500/10 text-green-500 shadow-inner">
              <CheckCircle2 size={28} />
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white mb-3">Live Coordination</h3>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              Track status updates in real-time from &quot;Assigned&quot; to &quot;On The Way&quot; to &quot;Resolved&quot; with instant push notifications.
            </p>
          </div>
        </div>
      </div>

      {/* Background elements */}
      <div className="absolute top-1/4 -left-64 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-64 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-blue-800/20 rounded-full blur-[100px] pointer-events-none" />
    </div>
  );
}
