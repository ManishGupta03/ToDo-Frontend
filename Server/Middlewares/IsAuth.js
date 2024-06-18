const jwt = require('jsonwebtoken');
const User = require('../Models/userModel');
require('dotenv').config();

const isAuth = (req, res, next) => {
    if (req.session.isAuth) {
      next();
    } else {
      return res.send({
        status: 401,
        message: "Session expired, please login again",
      });
    }
  };

  const authMiddleware = async (req, res, next) => {
    const token = req.header('Authorization').replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ error: 'No token, authorization denied' });
    }
      try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      res.status(401).json({ error: 'Token is not valid Bhai' });
    }
    };
  
 
  
  module.exports = { isAuth, authMiddleware };