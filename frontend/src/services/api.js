import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: async (data) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
  },

  login: async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  createProfileFromGoogle: async (data) => {
    const response = await api.post('/auth/google-profile', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  updateProfile: async (profile) => {
    const response = await api.put('/auth/profile', { profile });
    return response.data;
  }
};

// Interview API calls
export const interviewAPI = {
  start: async (mode) => {
    const response = await api.post('/interview/start', { mode });
    return response.data;
  },

  analyze: async (sessionId) => {
    const response = await api.post('/interview/analyze', { sessionId });
    return response.data;
  },

  getSession: async (sessionId) => {
    const response = await api.get(`/interview/session/${sessionId}`);
    return response.data;
  }
};

// User API calls
export const userAPI = {
  getSessions: async () => {
    const response = await api.get('/user/sessions');
    return response.data;
  },

  getProgress: async () => {
    const response = await api.get('/user/progress');
    return response.data;
  },

  deleteSession: async (sessionId) => {
    const response = await api.delete(`/user/sessions/${sessionId}`);
    return response.data;
  }
};

export default api;
