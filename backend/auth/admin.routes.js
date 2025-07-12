import express from 'express';
import { getAllUsers, toggleBanUser, deleteUser, getAllQuestionsWithAnswers, deleteQuestion, deleteAnswer } from '../controllers/admin.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin middleware to check if user is admin
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }
  next();
};

// User management routes
router.get('/users', auth, adminAuth, getAllUsers);
router.put('/users/:userId/ban', auth, adminAuth, toggleBanUser);
router.delete('/users/:userId', auth, adminAuth, deleteUser);

// Content management routes
router.get('/questions', auth, adminAuth, getAllQuestionsWithAnswers);
router.delete('/questions/:questionId', auth, adminAuth, deleteQuestion);
router.delete('/answers/:answerId', auth, adminAuth, deleteAnswer);

export default router;