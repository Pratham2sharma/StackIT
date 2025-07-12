import express from 'express';
import { getUserNotifications, markAsRead, markAllAsRead } from '../controllers/notification.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', auth, getUserNotifications);
router.put('/:notificationId/read', auth, markAsRead);
router.put('/read-all', auth, markAllAsRead);

export default router;