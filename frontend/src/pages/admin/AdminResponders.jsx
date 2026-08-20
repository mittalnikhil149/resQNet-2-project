import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { Search, CheckCircle, XCircle } from 'lucide-react';

export default function AdminResponders() {
  const [responders, setResponders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const load = () => {
    setLoading(true);

    adminAPI.getResponders()
      .then(res => {
        console.log('Responders API:', res.data);

        // Ensure array
        setResponders(Array.isArray(res.data) ? res.data : []);
      })
      .catch(err => {
        console.error(err);
        setResponders([]);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleApprove = async (id) => {
    try {
      await adminAPI.approveResponder(id);
      load();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve responder');
    }
  };

  const handleDeactivate = async (id) => {
    if (window.confirm('Are you sure you want to deactivate this responder?')) {
      try {
        await adminAPI.deactivateResponder(id);
        load();
      } catch (err) {
        console.error(err);
        alert(err.response?.data?.message || 'Failed to deactivate responder');
      }
    }
  };

  // SAFE SEARCH
  const filtered = responders.filter((r) => {
    const fullName = r.user?.fullName || '';
    const email = r.user?.email || '';

    return (
      fullName.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase())
    );
  });

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">
        Responder Profiles
      </h1>

      <div className="relative mb-6">
        <Search
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          className="form-input pl-11 max-w-sm"
          placeholder="Search responders..."
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
                  <th>Responder</th>
                  <th>Approval</th>
                  <th>Duty Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center text-slate-400 py-8"
                    >
                      No responders found
                    </td>
                  </tr>
                ) : (
                  filtered.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <div className="text-white font-medium">
                          {r.user?.fullName || 'Unknown User'}
                        </div>

                        <div className="text-xs text-slate-400">
                          {r.user?.email || 'No email'}
                          {' • '}
                          {r.user?.phoneNumber || 'No phone'}
                        </div>
                      </td>

                      <td>
                        {r.approved ? (
                          <span className="badge badge-resolved">
                            Approved
                          </span>
                        ) : (
                          <span className="badge badge-cancelled">
                            Pending
                          </span>
                        )}
                      </td>

                      <td>
                        {r.available ? (
                          <span className="text-green-400 text-sm font-medium">
                            Available
                          </span>
                        ) : (
                          <span className="text-slate-500 text-sm">
                            Unavailable
                          </span>
                        )}
                      </td>

                      <td className="font-mono text-xs text-slate-400">
                        {r.currentLatitude != null
                          ? `${r.currentLatitude}, ${r.currentLongitude}`
                          : 'N/A'}
                      </td>

                      <td>
                        <div className="flex gap-2">
                          {!r.approved ? (
                            <button
                              onClick={() => handleApprove(r.id)}
                              className="btn btn-success text-xs py-1.5 px-3 gap-1"
                            >
                              <CheckCircle size={14} />
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleDeactivate(r.id)}
                              className="btn btn-danger text-xs py-1.5 px-3 gap-1"
                            >
                              <XCircle size={14} />
                              Deactivate
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}