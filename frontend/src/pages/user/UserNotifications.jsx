import { useState, useEffect } from 'react';
import { notificationAPI } from '../../api';
import { Bell, CheckCheck, Check } from 'lucide-react';

export default function UserNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    notificationAPI.getAll()
      .then(res => setNotifications(res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const markRead = async (id) => {
    await notificationAPI.markRead(id);
    setNotifications(n => n.map(x => x.id === id ? { ...x, isRead: true } : x));
  };

  const markAllRead = async () => {
    await notificationAPI.markAllRead();
    setNotifications(n => n.map(x => ({ ...x, isRead: true })));
  };

  const unread = notifications.filter(n => !n.isRead).length;

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bell size={22} className="text-blue-400" />
            Notifications
            {unread > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white"
                style={{ background: '#ef4444' }}>
                {unread}
              </span>
            )}
          </h1>
        </div>
        {unread > 0 && (
          <button onClick={markAllRead} className="btn btn-ghost text-sm gap-2">
            <CheckCheck size={14} /> Mark all read
          </button>
        )}
      </div>

      <div className="space-y-3">
        {loading ? (
          <div className="flex justify-center py-12"><div className="spinner" /></div>
        ) : notifications.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Bell size={40} className="mx-auto text-slate-600 mb-3" />
            <p className="text-slate-400 text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map(n => (
            <div key={n.id}
              className={`glass rounded-xl p-4 flex items-start gap-4 transition-all ${
                !n.isRead ? 'border-blue-500/30' : 'opacity-70'
              }`}
              style={{ borderColor: !n.isRead ? 'rgba(59,130,246,0.3)' : undefined }}>
              <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(59,130,246,0.15)' }}>
                <Bell size={16} className="text-blue-400" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-white text-sm">{n.title}</div>
                <div className="text-slate-400 text-xs mt-0.5">{n.message}</div>
                <div className="text-slate-600 text-xs mt-1">
                  {new Date(n.createdAt).toLocaleString('en-IN')}
                </div>
              </div>
              {!n.isRead && (
                <button onClick={() => markRead(n.id)}
                  className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors flex-shrink-0">
                  <Check size={14} />
                </button>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
