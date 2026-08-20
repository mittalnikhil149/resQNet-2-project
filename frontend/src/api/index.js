import apiClient from './apiClient';

export const authAPI = {
  register: (data) => apiClient.post('/auth/register', data),
  login: (data) => apiClient.post('/auth/login', data),
};

export const emergencyAPI = {
  create: (data) => apiClient.post('/emergencies', data),
  getMy: () => apiClient.get('/emergencies/my'),
  getById: (id) => apiClient.get(`/emergencies/${id}`),
  getAll: () => apiClient.get('/emergencies'),
  updateStatus: (id, status) => apiClient.put(`/emergencies/${id}/status`, { status }),
};

export const responderAPI = {
  getProfile: () => apiClient.get('/responders/profile'),
  updateAvailability: (availability) => apiClient.put('/responders/availability', { availability }),
  updateLocation: (lat, lng) => apiClient.put('/responders/location', { latitude: lat, longitude: lng }),
  getMyAssignments: () => apiClient.get('/responders/assignments'),
};

export const assignmentAPI = {
  accept: (id) => apiClient.post(`/assignments/${id}/accept`),
  reject: (id) => apiClient.post(`/assignments/${id}/reject`),
};

export const notificationAPI = {
  getAll: () => apiClient.get('/notifications'),
  getUnreadCount: () => apiClient.get('/notifications/unread-count'),
  markRead: (id) => apiClient.put(`/notifications/${id}/read`),
  markAllRead: () => apiClient.put('/notifications/read-all'),
};

export const adminAPI = {
  getDashboard: () => apiClient.get('/admin/dashboard'),
  getUsers: () => apiClient.get('/admin/users'),
  getResponders: () => apiClient.get('/admin/responders'),
  approveResponder: (id) => apiClient.put(`/admin/responders/${id}/approve`),
  deactivateResponder: (id) => apiClient.put(`/admin/responders/${id}/deactivate`),
  getEmergencies: () => apiClient.get('/admin/emergencies'),
  getAssignments: () => apiClient.get('/admin/assignments'),
};
