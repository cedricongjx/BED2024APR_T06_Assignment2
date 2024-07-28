const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secretKey = process.env.JWT_SECRET || "your-secret-key";

// // Create a new user
// const createUser = async (req, res) => {
//   const { username, password, role } = req.body;
//   try {
//     const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
//     const newUser = await User.createUser({ username, password: hashedPassword, role }); // Create user in database
//     res.status(201).json({ message: "User created successfully", userId: newUser.userId });
//   } catch (error) {
//     console.error("Error creating user:", error);
//     res.status(500).json({ error: "Error creating user" });
//   }
// };

// // Log in a user
// const loginUser = async (req, res) => {
//   const { username, password } = req.body;
//   try {
//     const user = await User.getUserByUsername(username); // Fetch user from database
//     if (!user) {
//       return res.status(404).json({ error: "User not found" });
//     }
//     const isPasswordValid = await bcrypt.compare(password, user.password); // Validate password
//     if (!isPasswordValid) {
//       return res.status(401).json({ error: "Incorrect password" });
//     }

//     const token = jwt.sign({ id: user.userId, role: user.role }, secretKey, { expiresIn: "1h" });
//     res.status(200).json({ message: "Login successful", token: token , user_id: user.userId});

//   } catch (error) {
//     console.error("Error logging in:", error);
//     res.status(500).json({ error: "Error logging in" });
//   }
// };

// // Get all users
// const getAllUsers = async (req, res) => {
//   try {
//     const users = await User.getAllUsers();
//     res.json(users.map(user => ({
//       Userid: user.userId, // Ensure field name matches database schema
//       username: user.username
//     })));
//   } catch (error) {
//     console.error('Error retrieving users:', error);
//     res.status(500).json({ error: 'Error retrieving users' });
//   }
// };


// // Get a user by ID
// const getUserById = async (req, res) => {
//   const userId = parseInt(req.params.id);
//   if (isNaN(userId)) {
//     return res.status(400).json({ error: 'Invalid user ID' });
//   }

//   try {
//     const user = await User.getUserById(userId); // Fetch user by ID
//     if (!user) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json({
//       Userid: user.userId,
//       username: user.username
//     });
//   } catch (error) {
//     console.error('Error retrieving user:', error);
//     res.status(500).json({ error: 'Error retrieving user' });
//   }
// };


// // Update a user
// const updateUser = async (req, res) => {
//   const userId = parseInt(req.params.id);
//   const newUserData = req.body;
//   if (isNaN(userId)) {
//     return res.status(400).json({ error: 'Invalid user ID' });
//   }

//   try {
//     const updatedUser = await User.updateUser(userId, newUserData); // Update user data
//     if (!updatedUser) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.json({
//       Userid: updatedUser.userId,
//       username: updatedUser.username
//     });
//   } catch (error) {
//     console.error('Error updating user:', error);
//     res.status(500).json({ error: 'Error updating user' });
//   }
// };


// // Delete a user
// const deleteUser = async (req, res) => {
//   const userId = parseInt(req.params.id);
//   if (isNaN(userId)) {
//     return res.status(400).json({ error: 'Invalid user ID' });
//   }

//   try {
//     const success = await User.deleteUser(userId); // Delete user from database
//     if (!success) {
//       return res.status(404).json({ error: 'User not found' });
//     }
//     res.status(204).send();
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     res.status(500).json({ error: 'Error deleting user' });
//   }
// };


// // Search for users
// const searchUsers = async (req, res) => {
//   const searchTerm = req.query.q;
//   if (!searchTerm) {
//     return res.status(400).json({ error: 'Search term is required' });
//   }

//   try {
//     const users = await User.searchUsers(searchTerm); // Search users by term
//     res.json(users.map(user => ({
//       Userid: user.userId,
//       username: user.username
//     })));
//   } catch (error) {
//     console.error('Error searching users:', error);
//     res.status(500).json({ error: 'Error searching users' });
//   }
// };


// // Export functions for use in routes
// module.exports = {
//   createUser,
//   loginUser,
//   getAllUsers,
//   getUserById,
//   updateUser,
//   deleteUser,
//   searchUsers,
// };
