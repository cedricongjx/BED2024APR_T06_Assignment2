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

    req.user = user; // Attach user info to request object
    // console.log("Authenticated user ID:", user.id); // Log the user ID
    // console.log("User role:", user.role);

    const authorizedRoles = {
      
      //feedback
      
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
      "/feedback/response/[0-9]+": ["U", "A"],
      "/feedback/categorycount": ["A"],
      
      //Loginsignup
      
      "/api/donate": ["U", "A"],
      "/api/users": ["A"],
      "/api/users/[0-9]+": ["A"],
      
      //events
      
      "/categorydelete/[0-9]+": ["A"],
      "/event": ["U", "A"],
      "/events/search": ["U", "A"],
      "/events/category/[0-9]+": ["U", "A"],
      "/latestEvent": ["U", "A"],
      "/category": ["U", "A"],
      "/eventWithCategory/[0-9]+": ["U", "A"],
      "/testgetalluserforevent/[0-9]+": ["U", "A"],
      "/userwithevent/[0-9]+": ["U"],
      "/testremoveuser": ["U"],
      "/testcheck": ["U"],
      "/testadduser": ["U"],
      "/addcategoryforevent": ["A"],
      "/category": ["A"],
      "/category/[0-9]+": ["A"],
      "/eventpost": ["A"],
      "/categorypost": ["A"],
      "/removeCategoryFromEvent": ["A"],
      "/testcheck": ["U"],
      "/eventupdate/[0-9]+": ["A"],
      
      //documentary
      
      "/documentary/[0-9]+":["A"],
      "/documentary":["A"],
      "/review/[0-9]+":["U"],
    }



    const requestedEndpoint = req.url.split('?')[0];
    // console.log("Requested Endpoint:", requestedEndpoint); // Log the requested endpoint

    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(user.role);
      }
    );

    if (!authorizedRole) {
      console.log("User role not authorized for this endpoint");
      return res.status(403).json({ message: "Forbidden" });
    }

    next(); // Pass control to the next handler
  });
};

module.exports = authenticateToken;
