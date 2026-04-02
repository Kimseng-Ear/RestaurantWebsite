import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const IMG_BASE_URL = API_BASE.replace('/api', '');

const instance = axios.create({
  baseURL: API_BASE,
});

// Attach JWT token to every request
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle expired / invalid tokens
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect based on the role that was stored
      if (user?.role === 'admin') {
        window.location.href = '/admin/login';
      } else {
        window.location.href = '/signin';
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
