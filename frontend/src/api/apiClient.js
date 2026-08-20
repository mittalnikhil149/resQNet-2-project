import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request interceptor — attach JWT
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('resqnet_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — human-readable errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Network error / backend not reachable
      return Promise.reject(new Error(
        'Cannot connect to the server. Make sure the backend is running on port 8080.'
      ));
    }

    const { status, data } = error.response;

    let message = 'An unexpected error occurred';

    if (data?.message) {
      message = data.message;
    } else {
      switch (status) {
        case 400: message = data?.message || 'Invalid request data'; break;
        case 401: message = 'Session expired. Please login again.'; break;
        case 403: message = 'Access denied. You do not have permission.'; break;
        case 404: message = data?.message || 'Resource not found'; break;
        case 409: message = data?.message || 'Email already registered'; break;
        case 500: message = 'Internal server error. Please try again.'; break;
        default:  message = data?.message || `Error ${status}`;
      }
    }

    // Auto logout on 401
    if (status === 401) {
      localStorage.removeItem('resqnet_token');
      localStorage.removeItem('resqnet_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }

    return Promise.reject(new Error(message));
  }
);

export default apiClient;
