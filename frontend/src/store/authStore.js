import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Axios interceptor to handle token refresh
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return axios(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        const response = await axios.post(`${API_URL}/refresh-token`);
        if (response.data.accessToken) {
          axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
          localStorage.setItem('token', response.data.accessToken);
        }
        processQueue(null);
        return axios(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        // Logout user if refresh fails
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  isLoading: false,
  error: null,

  // Set auth header for axios
  setAuthHeader: (token) => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      localStorage.setItem('token', token);
    } else {
      delete axios.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const response = await axios.post(`${API_URL}/refresh-token`);
      if (response.data.accessToken) {
        set({ token: response.data.accessToken });
        get().setAuthHeader(response.data.accessToken);
      }
      return { success: true };
    } catch (error) {
      // If refresh fails, logout user
      get().logout();
      return { success: false };
    }
  },

  // Login
  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      const { accessToken, ...userData } = response.data;
      
      set({ user: userData, token: accessToken, isLoading: false });
      get().setAuthHeader(accessToken);
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Register
  register: async (name, email, password, role = 'user') => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/signup`, { name, email, password, role });
      set({ isLoading: false });
      return { success: true, message: response.data.message };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Logout
  logout: async () => {
    try {
      await axios.post(`${API_URL}/logout`);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      set({ user: null, token: null });
      get().setAuthHeader(null);
    }
  },

  // Initialize auth on app start
  initAuth: () => {
    const token = get().token;
    if (token) {
      get().setAuthHeader(token);
      // Set up automatic token refresh every 20 hours
      setInterval(() => {
        get().refreshToken();
      }, 20 * 60 * 60 * 1000); // 20 hours
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;