const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET || 'your-secret-key';

// Middleware function to authenticate JWT tokens
const authenticateToken = (req, res, next) => {
  // Get the Authorization header value
  const authHeader = req.headers['authorization'];
  console.log('Request headers:', req.headers); // Log all request headers

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

    req.user = user; // Attach user info to request object
    console.log("Authenticated user ID:", user.id); // Log the user ID
    console.log("Authenticated user role:", user.role); // Log the user role

    // Define authorized roles for endpoints
    const authorizedRoles = {
      "/feedback": ["A"],
      "/feedback/name": ["A"],
      "/feedback/notverified": ["A"],
      "/feedback/verified": ["A"],
      "/feedback/bug": ["A"],
      "/feedback/customerservice": ["A"],
      "/feedback/feedback": ["A"],
      "/feedback/other": ["A"],
      "/feedback/delete/[0-9]+": ["A"],
      "/feedback/update/[0-9]+": ["A"],
      "/feedback/response": ["A"],
      "/feedback/create": ["U", "A"],
      "/feedback/response": ["U", "A"],
      "/feedback/response/[0-9]+": ["U", "A"],
      "/feedback/categorycount": ["A"],
      "/api/donate": ["U", "A"],
      "/api/users": ["A"],
      "/api/users/[0-9]+": ["A"], // Match parameterized route
    };

    const requestedEndpoint = req.url.split('?')[0];
    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`);
        return regex.test(requestedEndpoint) && roles.includes(user.role);
      }
    );

    if (!authorizedRole) {
      console.log('Authorization failed for role:', user.role); // Log the failed role
      return res.status(403).json({ message: "Forbidden" });
    }

    next(); // Pass control to the next handler
  });
};

// Export the authenticateToken middleware function
module.exports = authenticateToken;
