import User from '../model/user.model.js';
import Question from '../model/question.model.js';
import Answer from '../model/answer.model.js';

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users' });
  }
};

// Ban/Unban user
export const toggleBanUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot ban admin users' });
    }
    
    user.isBanned = !user.isBanned;
    await user.save();
    
    res.json({ message: `User ${user.isBanned ? 'banned' : 'unbanned'} successfully` });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status' });
  }
};

// Delete user
export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    
    await User.findByIdAndDelete(userId);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user' });
  }
};

// Get all questions with answers
export const getAllQuestionsWithAnswers = async (req, res) => {
  try {
    const questions = await Question.find()
      .populate('author', 'name email')
      .populate({
        path: 'answers',
        populate: {
          path: 'author',
          select: 'name email'
        }
      });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

// Delete question
export const deleteQuestion = async (req, res) => {
  try {
    const { questionId } = req.params;
    const question = await Question.findById(questionId);
    
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    // Delete associated answers
    await Answer.deleteMany({ question: questionId });
    
    // Delete question
    await Question.findByIdAndDelete(questionId);
    
    res.json({ message: 'Question and associated answers deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting question' });
  }
};

// Delete answer
export const deleteAnswer = async (req, res) => {
  try {
    const { answerId } = req.params;
    const answer = await Answer.findById(answerId);
    
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    
    // Remove answer from question's answers array
    await Question.findByIdAndUpdate(
      answer.question,
      { $pull: { answers: answerId } }
    );
    
    // Delete answer
    await Answer.findByIdAndDelete(answerId);
    
    res.json({ message: 'Answer deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting answer' });
  }
};