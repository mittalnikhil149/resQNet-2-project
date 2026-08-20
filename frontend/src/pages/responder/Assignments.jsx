import { useState, useEffect } from 'react';
import { responderAPI, assignmentAPI, emergencyAPI } from '../../api';
import { MapPin, Navigation, CheckCircle, XCircle, Truck, Flag } from 'lucide-react';

export default function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    responderAPI.getMyAssignments()
      .then(res => setAssignments(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleAction = async (id, action, emergencyId = null, newStatus = null) => {
    setActionLoading(true);
    try {
      if (action === 'ACCEPT') await assignmentAPI.accept(id);
      if (action === 'REJECT') await assignmentAPI.reject(id);
      if (action === 'UPDATE_STATUS' && emergencyId && newStatus) {
        await emergencyAPI.updateStatus(emergencyId, newStatus);
      }
      load();
    } catch (err) {
      alert(err.message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><div className="spinner" /></div>;

  return (
    <div className="p-8 max-w-4xl">
      <h1 className="text-2xl font-bold text-white mb-6">My Assignments</h1>

      {assignments.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-slate-400">
          No assignments found. Make sure you are marked as Available.
        </div>
      ) : (
        <div className="space-y-6">
          {assignments.map(a => {
            const e = a.emergency;
            const isAssigned = a.status === 'ASSIGNED';
            const isActive = ['ACCEPTED', 'ON_THE_WAY', 'REACHED'].includes(a.status);
            const isResolved = a.status === 'COMPLETED' || e.status === 'RESOLVED';

            return (
              <div key={a.id} className={`glass rounded-2xl p-6 border ${
                isActive ? 'border-amber-500/50' : 'border-white/10'
              }`}>
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-mono text-blue-400 font-bold text-lg">{e.emergencyCode}</span>
                      <span className={`badge badge-${e.severity.toLowerCase()}`}>{e.severity}</span>
                      <span className={`badge badge-${a.status.toLowerCase()}`}>{a.status.replace('_', ' ')}</span>
                    </div>
                    <h3 className="text-white font-semibold text-lg">{e.emergencyType.replace('_', ' ')}</h3>
                  </div>
                  <div className="text-right text-xs text-slate-400">
                    Assigned: {new Date(a.assignedAt).toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                  {e.address && (
                    <div className="flex items-start gap-2 text-slate-300">
                      <MapPin size={16} className="text-blue-400 mt-0.5" />
                      <span>{e.address}</span>
                    </div>
                  )}
                  {e.latitude && (
                    <div className="flex items-center gap-2 text-slate-300">
                      <Navigation size={16} className="text-blue-400" />
                      <span className="font-mono text-xs">{e.latitude}, {e.longitude}</span>
                    </div>
                  )}
                </div>

                {e.description && (
                  <div className="mb-6 p-3 rounded-lg bg-white/5 text-slate-300 text-sm">
                    {e.description}
                  </div>
                )}

                {/* Actions */}
                <div className="border-t border-white/10 pt-4 flex gap-3">
                  {isAssigned && (
                    <>
                      <button onClick={() => handleAction(a.id, 'ACCEPT')} disabled={actionLoading}
                        className="btn btn-success flex-1 gap-2">
                        <CheckCircle size={16} /> Accept Assignment
                      </button>
                      <button onClick={() => handleAction(a.id, 'REJECT')} disabled={actionLoading}
                        className="btn btn-danger flex-1 gap-2">
                        <XCircle size={16} /> Reject
                      </button>
                    </>
                  )}

                  {isActive && a.status === 'ACCEPTED' && (
                    <button onClick={() => handleAction(a.id, 'UPDATE_STATUS', e.id, 'ON_THE_WAY')} disabled={actionLoading}
                      className="btn btn-primary w-full gap-2" style={{ background: '#f59e0b', color: 'white' }}>
                      <Truck size={16} /> Mark as On The Way
                    </button>
                  )}

                  {isActive && a.status === 'ON_THE_WAY' && (
                    <button onClick={() => handleAction(a.id, 'UPDATE_STATUS', e.id, 'REACHED')} disabled={actionLoading}
                      className="btn btn-primary w-full gap-2" style={{ background: '#8b5cf6', color: 'white' }}>
                      <Navigation size={16} /> Mark as Reached Location
                    </button>
                  )}

                  {isActive && a.status === 'REACHED' && (
                    <button onClick={() => handleAction(a.id, 'UPDATE_STATUS', e.id, 'RESOLVED')} disabled={actionLoading}
                      className="btn w-full gap-2" style={{ background: '#22c55e', color: 'white' }}>
                      <Flag size={16} /> Mark Emergency Resolved
                    </button>
                  )}

                  {isResolved && (
                    <div className="w-full text-center text-green-400 text-sm font-medium flex items-center justify-center gap-2">
                      <CheckCircle size={16} /> Assignment Completed
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
