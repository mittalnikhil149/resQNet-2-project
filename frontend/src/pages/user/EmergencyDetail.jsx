import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { emergencyAPI } from '../../api';
import {
  ArrowLeft, MapPin, Clock, User, AlertTriangle,
  CheckCircle2, Truck, Navigation, Flag
} from 'lucide-react';

function StatusBadge({ status }) {
  return <span className={`badge badge-${status?.toLowerCase()}`}>{status?.replace('_', ' ')}</span>;
}
function SeverityBadge({ severity }) {
  return <span className={`badge badge-${severity?.toLowerCase()}`}>{severity}</span>;
}

const STATUS_STEPS = [
  { key: 'REPORTED',    icon: AlertTriangle,  label: 'Reported' },
  { key: 'ASSIGNED',   icon: User,           label: 'Assigned' },
  { key: 'ACCEPTED',   icon: CheckCircle2,   label: 'Accepted' },
  { key: 'ON_THE_WAY', icon: Truck,          label: 'On the Way' },
  { key: 'REACHED',    icon: Navigation,     label: 'Reached' },
  { key: 'RESOLVED',   icon: Flag,           label: 'Resolved' },
];

const STATUS_ORDER = STATUS_STEPS.map(s => s.key);

export default function EmergencyDetail() {
  const { id } = useParams();
  const [emergency, setEmergency] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    emergencyAPI.getById(id)
      .then(res => setEmergency(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex justify-center items-center h-full p-8">
      <div className="spinner" />
    </div>
  );

  if (error) return (
    <div className="p-8 text-center text-red-400">{error}</div>
  );

  if (!emergency) return null;

  const currentStep = STATUS_ORDER.indexOf(emergency.status);

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/user/emergencies" className="flex items-center gap-2 text-slate-400 hover:text-white text-sm mb-6">
        <ArrowLeft size={16} /> Back to My Emergencies
      </Link>

      {/* Header */}
      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="font-mono text-blue-400 font-bold text-lg mb-1">{emergency.emergencyCode}</div>
            <h1 className="text-xl font-bold text-white">
              {emergency.emergencyType?.replace('_', ' ')} Emergency
            </h1>
          </div>
          <div className="flex flex-col items-end gap-2">
            <StatusBadge status={emergency.status} />
            <SeverityBadge severity={emergency.severity} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          {emergency.address && (
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin size={14} className="mt-0.5 flex-shrink-0 text-blue-400" />
              <span>{emergency.address}</span>
            </div>
          )}
          {emergency.latitude && (
            <div className="flex items-center gap-2 text-slate-400">
              <Navigation size={14} className="text-blue-400" />
              <span className="font-mono text-xs">{emergency.latitude}, {emergency.longitude}</span>
            </div>
          )}
          <div className="flex items-center gap-2 text-slate-400">
            <Clock size={14} className="text-blue-400" />
            <span>{new Date(emergency.createdAt).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {emergency.description && (
          <div className="mt-4 p-3 rounded-lg text-sm text-slate-300"
            style={{ background: 'rgba(255,255,255,0.04)' }}>
            {emergency.description}
          </div>
        )}
      </div>

      {/* Status Timeline */}
      <div className="glass rounded-2xl p-6">
        <h2 className="font-semibold text-white mb-6">Response Timeline</h2>
        <div className="space-y-0">
          {STATUS_STEPS.filter(s => s.key !== 'CANCELLED').map((step, idx) => {
            const stepIdx = STATUS_ORDER.indexOf(step.key);
            const done    = stepIdx <= currentStep;
            const current = stepIdx === currentStep;
            const Icon = step.icon;
            const isLast = idx === STATUS_STEPS.filter(s => s.key !== 'CANCELLED').length - 1;

            return (
              <div key={step.key} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                    current ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-[#0d1f3c]' : ''
                  }`} style={{
                    background: done
                      ? 'linear-gradient(135deg,#22c55e,#16a34a)'
                      : 'rgba(255,255,255,0.06)',
                  }}>
                    <Icon size={16} style={{ color: done ? 'white' : '#475569' }} />
                  </div>
                  {!isLast && (
                    <div className="w-0.5 flex-1 my-1" style={{
                      background: done ? '#22c55e' : 'rgba(255,255,255,0.08)',
                      minHeight: '24px'
                    }} />
                  )}
                </div>
                <div className={`pb-6 ${isLast ? '' : ''}`}>
                  <div className={`font-medium text-sm ${done ? 'text-white' : 'text-slate-500'}`}>
                    {step.label}
                    {current && <span className="ml-2 text-blue-400 text-xs">• Current</span>}
                  </div>
                  {current && emergency.updatedAt && (
                    <div className="text-xs text-slate-500 mt-0.5">
                      {new Date(emergency.updatedAt).toLocaleString('en-IN')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
