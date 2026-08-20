import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import {
  Users,
  UserCheck,
  AlertTriangle,
  ClipboardList,
  ActivityIcon
} from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getDashboard()
      .then(res => {
        console.log("Dashboard API Response:", res.data);
        setData(res.data);
      })
      .catch(err => {
        console.error("Dashboard Error:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <div className="spinner" />
      </div>
    );
  }

  const activeEmergencies = Array.isArray(data?.activeEmergencies)
    ? data.activeEmergencies
    : [];

  const pendingResponders = Array.isArray(data?.pendingResponders)
    ? data.pendingResponders
    : [];

  const stats = [
    {
      label: 'Total Users',
      value: data?.totalUsers ?? 0,
      icon: Users,
      color: '#3b82f6'
    },
    {
      label: 'Responders',
      value: data?.totalResponders ?? 0,
      icon: UserCheck,
      color: '#22c55e'
    },
    {
      label: 'Emergencies',
      value: data?.totalEmergencies ?? 0,
      icon: AlertTriangle,
      color: '#f59e0b'
    },
    {
      label: 'Assignments',
      value: data?.totalAssignments ?? 0,
      icon: ClipboardList,
      color: '#8b5cf6'
    }
  ];

  return (
    <div className="p-8 space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">
          System Dashboard
        </h1>

        <p className="text-slate-400 mt-1 text-sm">
          ResQNet Platform Overview
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">

            <div className="flex items-center mb-3">
              <div
                className="p-2 rounded-lg"
                style={{
                  background: `${color}20`,
                  color
                }}
              >
                <Icon size={20} />
              </div>
            </div>

            <div className="text-3xl font-bold text-white">
              {value}
            </div>

            <div className="text-sm text-slate-400">
              {label}
            </div>

          </div>
        ))}
      </div>

      {/* Dashboard Lists */}
      <div className="grid grid-cols-2 gap-6">

        {/* Active Emergencies */}
        <div className="glass rounded-2xl p-6">

          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <ActivityIcon
              size={18}
              className="text-blue-400"
            />
            Active Emergencies
          </h2>

          {activeEmergencies.length === 0 ? (

            <div className="text-slate-400 text-sm py-4">
              No active emergencies
            </div>

          ) : (

            <div className="space-y-3">

              {activeEmergencies.map((e) => (

                <div
                  key={e.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center"
                >

                  <div>

                    <div className="text-white font-medium text-sm">
                      {e.emergencyCode || 'N/A'}
                    </div>

                    <div className="text-xs text-slate-400">
                      {(e.emergencyType || 'UNKNOWN').replace('_', ' ')}
                    </div>

                  </div>

                  <div
                    className={`badge badge-${(e.status || 'unknown').toLowerCase()}`}
                  >
                    {e.status || 'Unknown'}
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

        {/* Pending Responders */}
        <div className="glass rounded-2xl p-6">

          <h2 className="font-semibold text-white mb-4 flex items-center gap-2">
            <UserCheck
              size={18}
              className="text-amber-400"
            />
            Pending Responders
          </h2>

          {pendingResponders.length === 0 ? (

            <div className="text-slate-400 text-sm py-4">
              No pending approvals
            </div>

          ) : (

            <div className="space-y-3">

              {pendingResponders.map((r) => (

                <div
                  key={r.id}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 flex justify-between items-center"
                >

                  <div>

                    <div className="text-white font-medium text-sm">
                      {r.user?.fullName || r.fullName || 'Unknown Responder'}
                    </div>

                    <div className="text-xs text-slate-400">
                      {r.user?.email || r.email || 'No email'}
                    </div>

                  </div>

                  <div className="badge badge-cancelled">
                    Pending
                  </div>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
}