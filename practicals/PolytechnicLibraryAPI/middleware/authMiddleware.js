const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/appConfig');


const authMiddleware = (req, res, next) => {
  // Get token from header
  const token = req.header('Authorization');

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Authorization denied. No token provided.' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, jwtSecret);

    // Attach user information to request object
    req.user = decoded;

    // Proceed to next middleware or route handler
    next();
  } catch (error) {
    console.error('Token verification failed:', error);
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = authMiddleware;
