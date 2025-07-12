import Question from '../model/question.model.js';
import Answer from '../model/answer.model.js';
import User from '../model/user.model.js';

// POST /question
export const createQuestion = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    const { title, description, tags } = req.body;
    const question = new Question({
      title,
      description,
      tags,
      author: req.user._id,
    });
    await question.save();
    res.status(201).json({ 
      message: 'Question created successfully',
      questionId: question._id 
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating question in createQuestion controller' });
  }
};

// POST /question/:id
export const updateQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const { title, description, tags } = req.body;
    question.title = title;
    question.description = description;
    question.tags = tags;
    await question.save();
    res.json({ message: 'Question updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating question in updateQuestion controller' });
  }
};

// POST /answer
export const createAnswer = async (req, res) => {
  try {
    const { questionId, content } = req.body;
    const question = await Question.findById(questionId);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const answer = new Answer({
      question: questionId,
      author: req.user._id,
      content,
    });
    await answer.save();
    question.answers.push(answer._id);
    await question.save();
    res.status(201).json({ message: 'Answer created successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error creating answer in createAnswer controller' });
  }
};

// POST /answer/:id
export const updateAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    const { content } = req.body;
    answer.content = content;
    await answer.save();
    res.json({ message: 'Answer updated successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating answer in updateAnswer controller' });
  }
};

// GET /questions
export const getQuestions = async (req, res) => {
  try {
    const questions = await Question.find().populate('author').populate('answers');
    res.json(questions);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting questions in getQuestions controller' });
  }
};

// GET /questions/:id
export const getQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id).populate('author').populate('answers');
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    res.json(question);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting question in getQuestion controller' });
  }
};

// GET /answers/:id
export const getAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id).populate('author').populate('question');
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    res.json(answer);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error getting answer getAnswer controller' });
  }
};

// PUT /questions/:id/upvote
// PUT /questions/:id/upvote
export const upvoteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const user = await User.findById(req.user._id);
    if (user.upvotedQuestions.includes(question._id)) {
      return res.status(400).json({ message: 'You have already upvoted this question' });
    }
    question.votes.upvotes.push(user._id);
    user.upvotedQuestions.push(question._id);
    await question.save();
    await user.save();
    res.json({ message: 'Question upvoted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error upvoting question' });
  }
};


// PUT /questions/:id/downvote
export const downvoteQuestion = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findById(id);
    if (!question) {
      return res.status(404).json({ message: 'Question not found' });
    }
    const user = await User.findById(req.user._id);
    if (user.downvotedQuestions.includes(question._id)) {
      return res.status(400).json({ message: 'You have already downvoted this question' });
    }
    question.votes.downvotes.push(user._id);
    user.downvotedQuestions.push(question._id);
    await question.save();
    await user.save();
    res.json({ message: 'Question downvoted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error downvoting question' });
  }
};

// PUT /answers/:id/upvote
export const upvoteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    const user = await User.findById(req.user._id);
    if (user.upvotedAnswers.includes(answer._id)) {
      return res.status(400).json({ message: 'You have already upvoted this answer' });
    }
    answer.votes.upvotes.push(user._id);
    user.upvotedAnswers.push(answer._id);
    await answer.save();
    await user.save();
    res.json({ message: 'Answer upvoted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error upvoting answer' });
  }
};

// PUT /answers/:id/downvote
export const downvoteAnswer = async (req, res) => {
  try {
    const { id } = req.params;
    const answer = await Answer.findById(id);
    if (!answer) {
      return res.status(404).json({ message: 'Answer not found' });
    }
    const user = await User.findById(req.user._id);
    if (user.downvotedAnswers.includes(answer._id)) {
      return res.status(400).json({ message: 'You have already downvoted this answer' });
    }
    answer.votes.downvotes.push(user._id);
    user.downvotedAnswers.push(answer._id);
    await answer.save();
    await user.save();
    res.json({ message: 'Answer downvoted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error downvoting answer' });
  }
};