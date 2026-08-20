import { useState, useEffect } from 'react';
import { responderAPI } from '../../api';
import { Power, MapPin, Navigation, AlertCircle, CheckCircle } from 'lucide-react';

export default function AvailabilityPage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const load = () => {
    responderAPI.getProfile()
      .then(res => setProfile(res.data))
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const toggleAvailability = async () => {
    if (!profile) return;
    setError('');
    setSuccess('');
    try {
      const newVal = !profile.available;
      await responderAPI.updateAvailability(newVal);
      setProfile({ ...profile, available: newVal });
      setSuccess(`Duty status changed to ${newVal ? 'Available' : 'Unavailable'}`);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation not supported');
      return;
    }
    setLocating(true);
    setError('');
    setSuccess('');

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          await responderAPI.updateLocation(lat, lng);
          setProfile({ ...profile, currentLatitude: lat, currentLongitude: lng });
          setSuccess('Location updated successfully');
        } catch (err) {
          setError(err.message);
        } finally {
          setLocating(false);
        }
      },
      (err) => {
        setError('Location permission denied.');
        setLocating(false);
      }
    );
  };

  if (loading) return <div className="flex justify-center p-12"><div className="spinner" /></div>;
  if (!profile) return null;

  return (
    <div className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-white mb-6">Manage Availability</h1>

      {!profile.approved && (
        <div className="mb-6 p-4 rounded-xl flex items-start gap-3 bg-red-500/10 border border-red-500/20">
          <AlertCircle size={20} className="text-red-400 mt-0.5" />
          <div>
            <h3 className="text-red-400 font-semibold text-sm">Account Pending Approval</h3>
            <p className="text-slate-300 text-xs mt-1">
              An administrator must approve your account before you can set your availability and receive assignments.
            </p>
          </div>
        </div>
      )}

      {error && <div className="mb-4 text-red-400 text-sm">{error}</div>}
      {success && <div className="mb-4 text-green-400 text-sm flex items-center gap-2"><CheckCircle size={14}/>{success}</div>}

      <div className="glass rounded-2xl p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Duty Status</h2>
            <p className="text-slate-400 text-sm">Turn this on to receive emergency alerts</p>
          </div>
          <button
            onClick={toggleAvailability}
            disabled={!profile.approved}
            className={`w-14 h-8 rounded-full flex items-center transition-all px-1 ${
              profile.available ? 'bg-green-500 justify-end' : 'bg-slate-700 justify-start'
            } ${!profile.approved ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
            <div className="w-6 h-6 bg-white rounded-full shadow-md" />
          </button>
        </div>

        <div className="p-4 rounded-xl border" style={{
          background: profile.available ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.05)',
          borderColor: profile.available ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'
        }}>
          <div className="flex items-center gap-3">
            <Power size={24} className={profile.available ? 'text-green-400' : 'text-slate-500'} />
            <div>
              <div className="font-semibold text-white">
                {profile.available ? 'You are On Duty' : 'You are Off Duty'}
              </div>
              <div className="text-sm text-slate-400">
                {profile.available
                  ? 'Ready to receive assignments within your radius.'
                  : 'You will not receive any emergency assignments.'}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="glass rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Current Location</h2>
            <p className="text-slate-400 text-sm">Update your location for accurate dispatching</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6 p-4 rounded-xl bg-white/5 border border-white/10">
          <MapPin size={24} className="text-blue-400" />
          <div>
            {profile.currentLatitude ? (
              <div className="font-mono text-sm text-slate-300">
                Lat: {profile.currentLatitude} <br/> Lng: {profile.currentLongitude}
              </div>
            ) : (
              <div className="text-sm text-slate-400">Location not set</div>
            )}
          </div>
        </div>

        <button onClick={updateLocation} disabled={locating} className="btn w-full gap-2"
          style={{ background: '#3b82f6', color: 'white' }}>
          {locating ? <div className="spinner w-4 h-4" /> : <Navigation size={16} />}
          {locating ? 'Updating...' : 'Update Location'}
        </button>
      </div>
    </div>
  );
}
