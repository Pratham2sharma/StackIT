import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

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
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAuthStore;