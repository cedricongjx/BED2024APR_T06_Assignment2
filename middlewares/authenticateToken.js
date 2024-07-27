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
    // console.log("Authenticated user ID:", user.id); // Log the user ID
    // console.log(user.role);
    
    const authorizedRoles = 
    {
      "/feedback":["A"],
      "/feedback/name":["A"],
      "/feedback/notverified":["A"],
      "/feedback/verified": ["A"],
      "/feedback/bug":["A"],
      "/feedback/customerservice":["A"],
      "/feedback/feedback":["A"],
      "/feedback/other":["A"],
      "/feedback/delete/[0-9]+":["A"],
      "/feedback/update/[0-9]+":["A"],
      "/feedback/verified":["A"],
      "/feedback/response": ["A"],
      "/feedback/create": ["U","A"],
      "/feedback/response": ["U","A"],
      "/feedback/response/[0-9]+":["U","A"],
      "/feedback/categorycount":["A"],
    }


    const requestedEndpoint = req.url.split('?')[0];
    const authorizedRole = Object.entries(authorizedRoles).find(
      ([endpoint, roles]) => {
        const regex = new RegExp(`^${endpoint}$`); // Create RegExp from endpoint
        return regex.test(requestedEndpoint) && roles.includes(user.role);
      }
    );
    if(!authorizedRole)
    {
      return res.status(403).json({ message: "Forbidden" });
    }

    next(); // Pass control to the next handler
  });
};

module.exports = authenticateToken;
