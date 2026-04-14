import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add token to requests
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth services
export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
};

// Symptom services
export const symptomService = {
  getAll: (params) => api.get('/symptoms', { params }),
  getById: (id) => api.get(`/symptoms/${id}`),
};

// Analysis services
export const analysisService = {
  analyze: (data) => api.post('/analysis', data),
  getReports: () => api.get('/analysis/reports'),
  getReport: (id) => api.get(`/analysis/reports/${id}`),
};

export default api;
