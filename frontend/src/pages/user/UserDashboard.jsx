import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { emergencyAPI } from '../../api';
import {
  AlertTriangle, CheckCircle2, Clock, Activity, Plus, ChevronRight
} from 'lucide-react';

function StatusBadge({ status }) {
  return <span className={`badge badge-${status?.toLowerCase()}`}>{status?.replace('_', ' ')}</span>;
}

function SeverityBadge({ severity }) {
  return <span className={`badge badge-${severity?.toLowerCase()}`}>{severity}</span>;
}

export default function UserDashboard() {
  const { user } = useAuth();
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    emergencyAPI.getMy()
      .then(res => setEmergencies(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const active = emergencies.filter(e =>
    !['RESOLVED', 'CANCELLED'].includes(e.status));
  const resolved = emergencies.filter(e => e.status === 'RESOLVED');

  const stats = [
    { label: 'Total Reports', value: emergencies.length, icon: AlertTriangle, color: '#3b82f6' },
    { label: 'Active',        value: active.length,       icon: Activity,      color: '#f59e0b' },
    { label: 'Resolved',      value: resolved.length,     icon: CheckCircle2,  color: '#22c55e' },
  ];

  return (
    <div className="p-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome, {user?.fullName?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 mt-1 text-sm">Here&apos;s your emergency activity overview</p>
        </div>
        <Link to="/user/report-emergency"
          className="btn btn-primary flex items-center gap-2">
          <Plus size={16} />
          Report Emergency
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-5">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2 rounded-lg" style={{ background: `${color}20` }}>
                <Icon size={20} style={{ color }} />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{loading ? '—' : value}</div>
            <div className="text-sm text-slate-400">{label}</div>
          </div>
        ))}
      </div>

      {/* Recent Emergencies */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b flex items-center justify-between"
          style={{ borderColor: 'rgba(59,130,246,0.1)' }}>
          <h2 className="font-semibold text-white">Recent Emergencies</h2>
          <Link to="/user/emergencies" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1">
            View all <ChevronRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="spinner" />
          </div>
        ) : error ? (
          <div className="p-6 text-center text-red-400 text-sm">{error}</div>
        ) : emergencies.length === 0 ? (
          <div className="p-12 text-center">
            <AlertTriangle size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">No emergencies reported yet</p>
            <Link to="/user/report-emergency" className="btn btn-primary mt-4 inline-flex">
              <Plus size={16} /> Report your first emergency
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Reported</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {emergencies.slice(0, 5).map(e => (
                  <tr key={e.id}>
                    <td className="font-mono text-blue-400 font-medium">{e.emergencyCode}</td>
                    <td className="text-slate-300">{e.emergencyType?.replace('_', ' ')}</td>
                    <td><SeverityBadge severity={e.severity} /></td>
                    <td><StatusBadge status={e.status} /></td>
                    <td className="text-slate-500 text-xs">
                      {new Date(e.createdAt).toLocaleDateString('en-IN', {
                        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                      })}
                    </td>
                    <td>
                      <Link to={`/user/emergencies/${e.id}`}
                        className="text-blue-400 hover:text-blue-300 text-xs flex items-center gap-1">
                        View <ChevronRight size={12} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
