// middleware/auth.js
import jwt from 'jsonwebtoken';
 
import User from '../model/user.model.js';
import dotenv from 'dotenv';
dotenv.config();

const auth = async (req, res, next) => {
  try {
    console.log('=== AUTH MIDDLEWARE DEBUG ===');
    console.log('All headers:', req.headers);
    console.log('Authorization header:', req.headers.authorization);
    console.log('Authorization header type:', typeof req.headers.authorization);
    console.log('Authorization header length:', req.headers.authorization ? req.headers.authorization.length : 'undefined');
    console.log('ACCESS_TOKEN_SECRET exists:', !!process.env.ACCESS_TOKEN_SECRET);
    
    const authHeader = req.headers.authorization;
    console.log('authHeader exists:', !!authHeader);
    console.log('authHeader starts with Bearer:', authHeader ? authHeader.startsWith('Bearer ') : 'N/A');
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '');
      console.log('Extracted token:', token);
      
      const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
      console.log('Decoded token payload:', decoded);
      console.log('Looking for user with ID:', decoded.userId);
      
      const user = await User.findById(decoded.userId);
      console.log('Found user:', user ? 'YES' : 'NO');
      
      if (!user) {
        console.log('User not found in database');
        throw new Error('User not found');
      }
      
      req.user = user;
      req.token = token;
      console.log('Auth successful, proceeding to next middleware');
      next();
    } else {
      console.log('Invalid authorization header format');
      res.status(401).json({ message: 'Unauthorized - missing or invalid authorization header' });
    }
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.status(401).json({ message: 'Unauthorized - error in middleware' });
  }
};

export default auth;