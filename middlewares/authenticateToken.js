const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    console.log('No token provided');
    return res.sendStatus(403); // Forbidden if no token is provided
  }

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.sendStatus(403); // Forbidden if token is invalid
    }
    req.user = user; // Attach user info to request object
    console.log("Authenticated user ID:", user.id); // Log the user ID
    next(); // Pass control to the next handler
  });
};

module.exports = authenticateToken;
