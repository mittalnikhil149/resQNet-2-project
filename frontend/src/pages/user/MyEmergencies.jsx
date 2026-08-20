import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { emergencyAPI } from '../../api';
import { AlertTriangle, ChevronRight, Search } from 'lucide-react';

function StatusBadge({ status }) {
  return <span className={`badge badge-${status?.toLowerCase()}`}>{status?.replace('_', ' ')}</span>;
}
function SeverityBadge({ severity }) {
  return <span className={`badge badge-${severity?.toLowerCase()}`}>{severity}</span>;
}

export default function MyEmergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    emergencyAPI.getMy()
      .then(res => setEmergencies(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filtered = emergencies.filter(e =>
    e.emergencyCode?.toLowerCase().includes(search.toLowerCase()) ||
    e.emergencyType?.toLowerCase().includes(search.toLowerCase()) ||
    e.address?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">My Emergencies</h1>
          <p className="text-slate-400 text-sm mt-1">{emergencies.length} total reports</p>
        </div>
        <Link to="/user/report-emergency" className="btn btn-primary">
          <AlertTriangle size={16} /> Report New
        </Link>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" className="form-input pl-11 max-w-sm"
          placeholder="Search by code, type, address..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : error ? (
          <div className="p-8 text-center text-red-400">{error}</div>
        ) : filtered.length === 0 ? (
          <div className="p-16 text-center">
            <AlertTriangle size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">No emergencies found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Emergency Code</th>
                  <th>Type</th>
                  <th>Severity</th>
                  <th>Status</th>
                  <th>Address</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(e => (
                  <tr key={e.id}>
                    <td className="font-mono text-blue-400 font-medium">{e.emergencyCode}</td>
                    <td className="text-slate-300">{e.emergencyType?.replace('_', ' ')}</td>
                    <td><SeverityBadge severity={e.severity} /></td>
                    <td><StatusBadge status={e.status} /></td>
                    <td className="text-slate-400 text-xs max-w-xs truncate">{e.address || '—'}</td>
                    <td className="text-slate-500 text-xs">
                      {new Date(e.createdAt).toLocaleDateString('en-IN')}
                    </td>
                    <td>
                      <Link to={`/user/emergencies/${e.id}`}
                        className="btn btn-ghost text-xs py-1.5 px-3">
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
