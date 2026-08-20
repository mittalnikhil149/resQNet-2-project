import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, ClipboardList, MapPin, Activity, LogOut, Shield
} from 'lucide-react';

const links = [
  { to: '/responder/dashboard',    icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/responder/assignments',  icon: ClipboardList,   label: 'Assignments' },
  { to: '/responder/availability', icon: Activity,        label: 'Availability' },
];

export default function ResponderLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#020818' }}>
      <aside className="w-64 flex-shrink-0 flex flex-col" style={{
        background: 'rgba(10,22,40,0.95)',
        borderRight: '1px solid rgba(59,130,246,0.12)'
      }}>
        <div className="p-6 border-b" style={{ borderColor: 'rgba(59,130,246,0.12)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
              <Shield size={18} className="text-white" />
            </div>
            <div>
              <div className="font-bold text-white text-sm">ResQNet</div>
              <div className="text-xs text-green-400">Responder Portal</div>
            </div>
          </div>
        </div>

        <div className="px-4 py-4 border-b" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ background: 'linear-gradient(135deg,#22c55e,#16a34a)' }}>
              {user?.fullName?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-white truncate">{user?.fullName}</div>
              <div className="text-xs text-slate-400">Responder</div>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`}>
              <Icon size={16} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t" style={{ borderColor: 'rgba(59,130,246,0.08)' }}>
          <button onClick={handleLogout} className="sidebar-link w-full text-red-400 hover:text-red-300">
            <LogOut size={16} />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
