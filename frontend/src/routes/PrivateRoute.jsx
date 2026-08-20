import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children, allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" style={{ background: '#020818' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // Redirect to correct dashboard
    if (role === 'ADMIN')     return <Navigate to="/admin/dashboard" replace />;
    if (role === 'RESPONDER') return <Navigate to="/responder/dashboard" replace />;
    return <Navigate to="/user/dashboard" replace />;
  }

  return children;
}
