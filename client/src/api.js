import axios from 'axios';

// In production on Vercel, use relative '/api' endpoint; fallback to localhost in dev
const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'production' ? '' : 'http://localhost:5000');

const api = axios.create({
  baseURL: API_URL ? (API_URL.endsWith('/api') ? API_URL : `${API_URL}/api`) : '/api',
});

export const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path;
  return `${API_URL}${path}`;
};

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
