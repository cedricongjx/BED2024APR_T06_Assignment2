// middlewares/authorizeAdmin.js
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'A') {
      return res.status(403).json({ message: "Access Denied: Admins Only" });
    }
    next();
  };
  
  module.exports = authorizeAdmin;
  