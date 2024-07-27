const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

// Middleware function to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  // Get the Authorization header value
  const authHeader = req.headers['authorization'];
  // Extract the token from the header if it exists
  const token = authHeader && authHeader.split(' ')[1];

  // If no token is provided, log the issue and respond with 403 Forbidden
  if (!token) {
    console.log('No token provided');
    return res.sendStatus(403); // Forbidden
  }

  // Verify the token using the secret key
  jwt.verify(token, secretKey, (err, user) => {
    // If token verification fails, log the error and respond with 403 Forbidden
    if (err) {
      console.log('Token verification failed:', err);
      return res.sendStatus(403); // Forbidden
    }
    
    // If token is valid, attach user info to the request object
    req.user = user;
    console.log("Authenticated user ID:", user.id); // Log the authenticated user ID
    
    // Pass control to the next middleware or route handler
    next();
  });
};

// Export the authenticateToken middleware function
module.exports = authenticateToken;
