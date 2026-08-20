import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { Search } from 'lucide-react';

function StatusBadge({ status }) {
  return (
    <span className={`badge badge-${status?.toLowerCase()}`}>
      {status?.replace('_', ' ')}
    </span>
  );
}

function SeverityBadge({ severity }) {
  return (
    <span className={`badge badge-${severity?.toLowerCase()}`}>
      {severity || 'N/A'}
    </span>
  );
}

export default function AdminEmergencies() {
  const [emergencies, setEmergencies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getEmergencies()
      .then(res => {
        console.log('Emergencies API Response:', res.data);

        setEmergencies(
          Array.isArray(res.data) ? res.data : []
        );
      })
      .catch(err => {
        console.error('Emergency API Error:', err);
        setEmergencies([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = emergencies.filter(e => {
    const emergencyCode = e?.emergencyCode || '';

    // Support different possible backend response structures
    const userName =
      e?.user?.fullName ||
      e?.reportedBy?.fullName ||
      e?.civilian?.fullName ||
      e?.fullName ||
      '';

    return (
      emergencyCode.toLowerCase().includes(search.toLowerCase()) ||
      userName.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-8">

      <h1 className="text-2xl font-bold text-white mb-6">
        All Emergencies
      </h1>

      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          className="form-input pl-11 max-w-sm"
          placeholder="Search by code or user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="glass rounded-2xl overflow-hidden">

        {loading ? (

          <div className="flex justify-center py-16">
            <div className="spinner" />
          </div>

        ) : (

          <div className="overflow-x-auto">

            <table className="data-table">

              <thead>
                <tr>
                  <th>Code</th>
                  <th>Type / Severity</th>
                  <th>Reported By</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>

                {filtered.length === 0 ? (

                  <tr>
                    <td
                      colSpan="6"
                      className="text-center text-slate-400 py-10"
                    >
                      No emergencies found
                    </td>
                  </tr>

                ) : (

                  filtered.map(e => {

                    const userName =
                      e?.user?.fullName ||
                      e?.reportedBy?.fullName ||
                      e?.civilian?.fullName ||
                      e?.fullName ||
                      'Unknown User';

                    const phoneNumber =
                      e?.user?.phoneNumber ||
                      e?.reportedBy?.phoneNumber ||
                      e?.civilian?.phoneNumber ||
                      e?.phoneNumber ||
                      'N/A';

                    return (
                      <tr key={e.id}>

                        <td className="font-mono text-blue-400 font-medium">
                          {e.emergencyCode || 'N/A'}
                        </td>

                        <td>

                          <div className="text-white text-sm">
                            {(e.emergencyType || 'UNKNOWN').replace('_', ' ')}
                          </div>

                          <div className="mt-1">
                            <SeverityBadge severity={e.severity} />
                          </div>

                        </td>

                        <td>

                          <div className="text-white text-sm">
                            {userName}
                          </div>

                          <div className="text-xs text-slate-400">
                            {phoneNumber}
                          </div>

                        </td>

                        <td className="text-xs text-slate-400 max-w-[200px] truncate">
                          {e.address ||
                            `${e.latitude ?? 'N/A'}, ${e.longitude ?? 'N/A'}`}
                        </td>

                        <td>
                          <StatusBadge status={e.status} />
                        </td>

                        <td className="text-xs text-slate-500">
                          {e.createdAt
                            ? new Date(e.createdAt).toLocaleString()
                            : 'N/A'}
                        </td>

                      </tr>
                    );
                  })

                )}

              </tbody>

            </table>

          </div>

        )}

      </div>

    </div>
  );
}