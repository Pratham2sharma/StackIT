import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

const useAdminStore = create((set, get) => ({
  users: [],
  questions: [],
  isLoading: false,
  error: null,

  // Get all users
  getAllUsers: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/users`);
      set({ users: response.data, isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch users';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Ban/Unban user
  toggleBanUser: async (userId) => {
    try {
      await axios.put(`${API_URL}/users/${userId}/ban`);
      await get().getAllUsers(); // Refresh users list
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update user status';
      return { success: false, error: errorMessage };
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      await get().getAllUsers(); // Refresh users list
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete user';
      return { success: false, error: errorMessage };
    }
  },

  // Get all questions with answers
  getAllQuestions: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/questions`);
      set({ questions: response.data, isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch questions';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Delete question
  deleteQuestion: async (questionId) => {
    try {
      await axios.delete(`${API_URL}/questions/${questionId}`);
      await get().getAllQuestions(); // Refresh questions list
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete question';
      return { success: false, error: errorMessage };
    }
  },

  // Delete answer
  deleteAnswer: async (answerId) => {
    try {
      await axios.delete(`${API_URL}/answers/${answerId}`);
      await get().getAllQuestions(); // Refresh questions list
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete answer';
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useAdminStore;