import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';

// Layouts
import UserLayout from './layouts/UserLayout';
import ResponderLayout from './layouts/ResponderLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// User Pages
import UserDashboard from './pages/user/UserDashboard';
import ReportEmergency from './pages/user/ReportEmergency';
import MyEmergencies from './pages/user/MyEmergencies';
import EmergencyDetail from './pages/user/EmergencyDetail';
import UserNotifications from './pages/user/UserNotifications';

// Responder Pages
import ResponderDashboard from './pages/responder/ResponderDashboard';
import Assignments from './pages/responder/Assignments';
import AvailabilityPage from './pages/responder/AvailabilityPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminResponders from './pages/admin/AdminResponders';
import AdminEmergencies from './pages/admin/AdminEmergencies';
import AdminAssignments from './pages/admin/AdminAssignments';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* User Routes */}
          <Route path="/user" element={
            <PrivateRoute allowedRoles={['USER']}>
              <UserLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<UserDashboard />} />
            <Route path="report-emergency" element={<ReportEmergency />} />
            <Route path="emergencies" element={<MyEmergencies />} />
            <Route path="emergencies/:id" element={<EmergencyDetail />} />
            <Route path="notifications" element={<UserNotifications />} />
          </Route>

          {/* Responder Routes */}
          <Route path="/responder" element={
            <PrivateRoute allowedRoles={['RESPONDER']}>
              <ResponderLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<ResponderDashboard />} />
            <Route path="assignments" element={<Assignments />} />
            <Route path="availability" element={<AvailabilityPage />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={
            <PrivateRoute allowedRoles={['ADMIN']}>
              <AdminLayout />
            </PrivateRoute>
          }>
            <Route index element={<Navigate to="dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="responders" element={<AdminResponders />} />
            <Route path="emergencies" element={<AdminEmergencies />} />
            <Route path="assignments" element={<AdminAssignments />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
