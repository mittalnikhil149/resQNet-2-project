import { useState, useEffect } from 'react';
import { adminAPI } from '../../api';
import { Search } from 'lucide-react';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    adminAPI.getUsers()
      .then(res => setUsers(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = users.filter(u =>
    u.fullName.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Registered Users</h1>

      <div className="relative mb-6">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input type="text" className="form-input pl-11 max-w-sm"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)} />
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        {loading ? (
          <div className="flex justify-center py-16"><div className="spinner" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(u => (
                  <tr key={u.id}>
                    <td className="font-mono text-slate-500">{u.id}</td>
                    <td className="text-white font-medium">{u.fullName}</td>
                    <td>{u.email}</td>
                    <td>{u.phoneNumber}</td>
                    <td>
                      <span className={`badge ${
                        u.role === 'ADMIN' ? 'badge-critical' :
                        u.role === 'RESPONDER' ? 'badge-resolved' : 'badge-assigned'
                      }`}>{u.role}</span>
                    </td>
                    <td className="text-xs text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
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
