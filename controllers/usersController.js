const User = require('../models/user');

const createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const newUser = await User.createUser({ username, password });
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Error creating user' });
  }
};

const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password' });
    }
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    res.status(500).json({ error: 'Error logging in' });
  }
};

// Function to get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving users' });
  }
};

// Function to get a user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const user = await User.getUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

// Function to update a user
const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const newUserData = req.body;
  try {
    const updatedUser = await User.updateUser(userId, newUserData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Function to delete a user
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const success = await User.deleteUser(userId);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Error deleting user' });
  }
};

// Function to search users (example)
const searchUsers = async (req, res) => {
  const searchTerm = req.query.q;
  try {
    const users = await User.searchUsers(searchTerm);
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Error searching users' });
  }
};

module.exports = {
  createUser,
  loginUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  searchUsers
};
