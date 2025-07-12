import { create } from 'zustand';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/quesans';

const useQuestionStore = create((set, get) => ({
  questions: [],
  currentQuestion: null,
  isLoading: false,
  error: null,

  // Get all questions
  getQuestions: async () => {
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

  // Get single question
  getQuestion: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(`${API_URL}/questions/${id}`);
      set({ currentQuestion: response.data, isLoading: false });
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch question';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Create question
  createQuestion: async (title, description, tags) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/question`, {
        title,
        description,
        tags
      });
      
      // Refresh questions list
      await get().getQuestions();
      set({ isLoading: false });
      
      return { success: true, questionId: response.data.questionId };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create question';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Create answer
  createAnswer: async (questionId, content) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${API_URL}/answer`, {
        questionId,
        content
      });
      
      // Refresh current question to show new answer
      if (get().currentQuestion?._id === questionId) {
        await get().getQuestion(questionId);
      }
      
      set({ isLoading: false });
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create answer';
      set({ error: errorMessage, isLoading: false });
      return { success: false, error: errorMessage };
    }
  },

  // Upvote question
  upvoteQuestion: async (questionId) => {
    try {
      await axios.put(`${API_URL}/questions/${questionId}/upvote`);
      
      // Refresh current question or questions list
      if (get().currentQuestion?._id === questionId) {
        await get().getQuestion(questionId);
      } else {
        await get().getQuestions();
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to upvote';
      return { success: false, error: errorMessage };
    }
  },

  // Downvote question
  downvoteQuestion: async (questionId) => {
    try {
      await axios.put(`${API_URL}/questions/${questionId}/downvote`);
      
      // Refresh current question or questions list
      if (get().currentQuestion?._id === questionId) {
        await get().getQuestion(questionId);
      } else {
        await get().getQuestions();
      }
      
      return { success: true };
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to downvote';
      return { success: false, error: errorMessage };
    }
  },

  // Clear error
  clearError: () => set({ error: null }),
}));

export default useQuestionStore;