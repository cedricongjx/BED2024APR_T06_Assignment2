const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../../config/appConfig');

// User registration
const registerUser = async (req, res) => {
  const { username, password, role } = req.body;

  try {
    // Validate username uniqueness and password strength
    if (!username || !password || !role) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check for existing username
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Register user
    const newUser = await User.register(username, password, role);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// User login
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Find user by username
    const user = await User.findByUsername(username);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password with hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const payload = {
      userId: user.user_id,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, jwtSecret, { expiresIn: '1h' }); // Expires in 1 hour

    res.status(200).json({ token });
  } catch (error) {
    console.error('Error logging in user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  registerUser,
  loginUser,
};
