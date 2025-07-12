import Notification from '../model/notification.model.js';

// Get user notifications
export const getUserNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate('sender', 'name')
      .populate('question', 'title')
      .sort({ createdAt: -1 })
      .limit(20);
    
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching notifications' });
  }
};

// Mark notification as read
export const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    await Notification.findByIdAndUpdate(notificationId, { isRead: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notification' });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req, res) => {
  try {
    await Notification.updateMany(
      { recipient: req.user._id, isRead: false },
      { isRead: true }
    );
    res.json({ message: 'All notifications marked as read' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating notifications' });
  }
};

// Create notification helper function
export const createNotification = async (recipientId, senderId, type, message, questionId = null, answerId = null) => {
  try {
    if (recipientId.toString() === senderId.toString()) {
      return; // Don't notify yourself
    }
    
    const notification = new Notification({
      recipient: recipientId,
      sender: senderId,
      type,
      message,
      question: questionId,
      answer: answerId
    });
    
    await notification.save();
  } catch (error) {
    console.error('Error creating notification:', error);
  }
};