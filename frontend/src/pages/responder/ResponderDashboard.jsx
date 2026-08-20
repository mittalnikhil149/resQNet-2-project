import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { responderAPI } from '../../api';
import {
  ClipboardList, Activity, Navigation, CheckCircle2,
  AlertTriangle, Truck, MapPin
} from 'lucide-react';

export default function ResponderDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      responderAPI.getProfile(),
      responderAPI.getMyAssignments()
    ])
      .then(([profRes, assigRes]) => {
        setProfile(profRes.data);
        setAssignments(assigRes.data);
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex justify-center p-12"><div className="spinner" /></div>;

  const activeAssig = assignments.find(a =>
    ['ASSIGNED', 'ACCEPTED', 'ON_THE_WAY', 'REACHED'].includes(a.status)
  );

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, Responder {user?.fullName?.split(' ')[0]} 🚑
          </h1>
          <p className="text-slate-400 mt-1 text-sm">
            Status: {profile?.available ? (
              <span className="text-green-400 font-medium">Available</span>
            ) : (
              <span className="text-slate-400 font-medium">Unavailable</span>
            )}
          </p>
        </div>
        {!profile?.approved && (
          <div className="badge badge-cancelled text-sm px-4 py-2">Pending Admin Approval</div>
        )}
      </div>

      <div className="grid grid-cols-3 gap-5">
        <div className="stat-card">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-green-500/20 text-green-400"><Activity size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-white">{profile?.available ? 'ON' : 'OFF'}</div>
          <div className="text-sm text-slate-400">Duty Status</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400"><ClipboardList size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-white">{assignments.length}</div>
          <div className="text-sm text-slate-400">Total Assignments</div>
        </div>
        <div className="stat-card">
          <div className="flex items-center mb-3">
            <div className="p-2 rounded-lg bg-amber-500/20 text-amber-400"><AlertTriangle size={20} /></div>
          </div>
          <div className="text-3xl font-bold text-white">{activeAssig ? '1' : '0'}</div>
          <div className="text-sm text-slate-400">Active Task</div>
        </div>
      </div>

      {/* Active Assignment */}
      <div className="glass rounded-2xl p-6 border border-blue-500/30">
        <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-400" /> Current Assignment
        </h2>
        {activeAssig ? (
          <div className="space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <div className="font-mono text-blue-400 text-lg font-bold">
                  {activeAssig.emergency.emergencyCode}
                </div>
                <div className="text-white font-medium">
                  {activeAssig.emergency.emergencyType.replace('_', ' ')}
                </div>
              </div>
              <div className="badge badge-on_the_way">{activeAssig.status.replace('_', ' ')}</div>
            </div>
            <div className="text-sm text-slate-300 flex items-start gap-2">
              <MapPin size={16} className="text-blue-400 mt-0.5" />
              {activeAssig.emergency.address || 'Location provided via coordinates'}
            </div>
            <Link to="/responder/assignments" className="btn btn-primary w-full mt-2">
              Manage Assignment
            </Link>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle2 size={32} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">No active assignments at the moment.</p>
            {profile?.available ? (
              <p className="text-xs text-green-400 mt-2">You are marked as available to receive alerts.</p>
            ) : (
              <p className="text-xs text-amber-400 mt-2">Turn on availability to receive alerts.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
