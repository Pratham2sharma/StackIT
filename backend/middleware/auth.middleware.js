// middleware/auth.js
import jwt from 'jsonwebtoken';
 
import User from '../model/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      const user = await User.findById(decoded.userId);
      
      if (!user) {
        throw new Error('User not found');
      }
      
      req.user = user;
      req.token = token;
      next();
    } else {
      res.status(401).json({ message: 'Unauthorized - missing or invalid authorization header' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Unauthorized - error in middleware' });
  }
};

export default auth;