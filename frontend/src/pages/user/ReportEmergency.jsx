import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { emergencyAPI } from '../../api';
import {
  AlertTriangle, MapPin, Navigation, CheckCircle, AlertCircle
} from 'lucide-react';

const EMERGENCY_TYPES = ['FIRE', 'ROAD_ACCIDENT', 'MEDICAL', 'COLLAPSE', 'DISASTER'];
const SEVERITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

const TYPE_INFO = {
  FIRE:         { emoji: '🔥', label: 'Fire',              desc: 'Building or forest fire' },
  ROAD_ACCIDENT:{ emoji: '🚗', label: 'Road Accident',     desc: 'Vehicle crash or collision' },
  MEDICAL:      { emoji: '🏥', label: 'Medical Emergency', desc: 'Health crisis, heart attack' },
  COLLAPSE:     { emoji: '🏗️', label: 'Building Collapse', desc: 'Structural failure' },
  DISASTER:     { emoji: '🌊', label: 'Natural Disaster',  desc: 'Flood, earthquake, etc.' },
};

const SEV_COLORS = {
  LOW:      { bg: 'rgba(34,197,94,0.1)',   border: 'rgba(34,197,94,0.3)',   text: '#4ade80' },
  MEDIUM:   { bg: 'rgba(245,158,11,0.1)',  border: 'rgba(245,158,11,0.3)',  text: '#fbbf24' },
  HIGH:     { bg: 'rgba(249,115,22,0.1)',  border: 'rgba(249,115,22,0.3)',  text: '#fb923c' },
  CRITICAL: { bg: 'rgba(239,68,68,0.1)',   border: 'rgba(239,68,68,0.3)',   text: '#f87171' },
};

export default function ReportEmergency() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    emergencyType: '', severity: '', description: '', address: '',
    latitude: '', longitude: ''
  });
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser. Enter location manually.');
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm(f => ({
          ...f,
          latitude: pos.coords.latitude.toFixed(6),
          longitude: pos.coords.longitude.toFixed(6),
        }));
        setLocating(false);
      },
      (err) => {
        setError('Location permission denied. Please enter coordinates manually.');
        setLocating(false);
      },
      { timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    if (!form.emergencyType) { setError('Please select an emergency type'); return; }
    if (!form.severity)      { setError('Please select a severity level'); return; }

    setLoading(true);
    try {
      const payload = {
        ...form,
        latitude:  form.latitude  ? parseFloat(form.latitude)  : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      };
      const res = await emergencyAPI.create(payload);
      const created = res.data;
      setSuccess(`Emergency ${created.emergencyCode} reported successfully! Redirecting...`);
      setTimeout(() => navigate(`/user/emergencies/${created.id}`), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <div className="p-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)' }}>
            <AlertTriangle size={20} className="text-red-400" />
          </div>
          Report Emergency
        </h1>
        <p className="text-slate-400 mt-2 text-sm">
          Fill in the details below. Responders will be automatically notified.
        </p>
      </div>

      {error && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)' }}>
          <AlertCircle size={16} className="text-red-400 mt-0.5 flex-shrink-0" />
          <span className="text-red-400 text-sm">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-6 flex items-start gap-3 p-4 rounded-xl"
          style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)' }}>
          <CheckCircle size={16} className="text-green-400 mt-0.5 flex-shrink-0" />
          <span className="text-green-400 text-sm">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-7">
        {/* Emergency Type */}
        <div>
          <label className="form-label text-base mb-3 block">Emergency Type *</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EMERGENCY_TYPES.map(type => {
              const info = TYPE_INFO[type];
              const selected = form.emergencyType === type;
              return (
                <button key={type} type="button"
                  onClick={() => setForm(f => ({ ...f, emergencyType: type }))}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    selected
                      ? 'border-blue-500 bg-blue-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/8'
                  }`}>
                  <div className="text-2xl mb-2">{info.emoji}</div>
                  <div className="text-sm font-medium text-white">{info.label}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{info.desc}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Severity */}
        <div>
          <label className="form-label text-base mb-3 block">Severity Level *</label>
          <div className="grid grid-cols-4 gap-3">
            {SEVERITIES.map(sev => {
              const c = SEV_COLORS[sev];
              const selected = form.severity === sev;
              return (
                <button key={sev} type="button"
                  onClick={() => setForm(f => ({ ...f, severity: sev }))}
                  className="p-3 rounded-xl border text-center transition-all"
                  style={{
                    background:   selected ? c.bg : 'rgba(255,255,255,0.03)',
                    borderColor:  selected ? c.border : 'rgba(255,255,255,0.1)',
                    color:        selected ? c.text : '#94a3b8',
                  }}>
                  <div className="font-semibold text-sm">{sev}</div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="form-label">Description</label>
          <textarea
            id="em-description"
            className="form-input resize-none"
            rows={4}
            placeholder="Describe the emergency situation..."
            value={form.description}
            onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))}
          />
        </div>

        {/* Location */}
        <div className="glass rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="form-label mb-0 flex items-center gap-2">
              <MapPin size={14} /> Location
            </label>
            <button type="button" id="get-location-btn" onClick={getLocation} disabled={locating}
              className="btn btn-ghost text-xs py-1.5 px-3 gap-2">
              <Navigation size={13} />
              {locating ? 'Detecting...' : 'Use My Location'}
            </button>
          </div>

          <div>
            <label className="form-label">Address</label>
            <input id="em-address" type="text" className="form-input"
              placeholder="123 Main Street, City"
              value={form.address}
              onChange={(e) => setForm(f => ({ ...f, address: e.target.value }))} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="form-label">Latitude</label>
              <input id="em-lat" type="number" step="any" className="form-input"
                placeholder="28.6139"
                value={form.latitude}
                onChange={(e) => setForm(f => ({ ...f, latitude: e.target.value }))} />
            </div>
            <div>
              <label className="form-label">Longitude</label>
              <input id="em-lng" type="number" step="any" className="form-input"
                placeholder="77.2090"
                value={form.longitude}
                onChange={(e) => setForm(f => ({ ...f, longitude: e.target.value }))} />
            </div>
          </div>

          {form.latitude && form.longitude && (
            <div className="text-xs text-green-400 flex items-center gap-1">
              <CheckCircle size={12} /> Location captured: {form.latitude}, {form.longitude}
            </div>
          )}
        </div>

        <button type="submit" id="report-submit" className="btn btn-danger w-full py-4 text-base"
          disabled={loading}>
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Reporting Emergency...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <AlertTriangle size={18} />
              Report Emergency Now
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
