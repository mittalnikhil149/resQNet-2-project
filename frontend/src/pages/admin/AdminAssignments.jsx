import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAssignments()
      .then(res => setAssignments(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Dispatch Assignments</h1>

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Emergency</th>
                  <th>Responder</th>
                  <th>Status</th>
                  <th>Assigned At</th>
                </tr>
              </thead>
              <tbody>
                {assignments.map(a => (
                  <tr key={a.id}>
                    <td>
                      <div className="font-mono text-blue-400">{a.emergency.emergencyCode}</div>
                      <div className="text-xs text-slate-400">{a.emergency.emergencyType}</div>
                    </td>
                    <td>
                      <div className="text-white">{a.responder.user.fullName}</div>
                      <div className="text-xs text-slate-400">{a.responder.user.phoneNumber}</div>
                    </td>
                    <td>
                      <span className={`badge badge-${a.status.toLowerCase()}`}>
                        {a.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="text-xs text-slate-500">
                      {new Date(a.assignedAt).toLocaleString()}
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
