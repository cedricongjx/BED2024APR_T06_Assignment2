const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user")
const secretKey = process.env.JWT_SECRET || "your-secret-key";



const getAllUserWithEvents = async (req,res) =>{
    try{
        const userWithEvent = await User.getAllUserWithEvents();
        res.json(userWithEvent);
    }catch(error){
        console.log(error);
        res.status(500).send("error retreiving events");
    }
};
const getUserWithEventsById = async (req,res) =>{
    const userId = parseInt(req.params.id);
    try{
        const userwithevent = await User.getUserWithEventsById(userId);
        if (!userwithevent){
            return res.status(404).send("Event not found");
        }
        res.json(userwithevent);
    }catch(error){
        console.error(error)
        res.status(500).send("Error retreiving user with event");
    }
}
const createUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
    const newUser = await User.createUser({ username, password: hashedPassword, role }); // Create user in database
    res.status(201).json({ message: "User created successfully", userId: newUser.userId });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

// Log in a user
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.getUserByUsername(username); // Fetch user from database
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password); // Validate password
    if (!isPasswordValid) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    const token = jwt.sign({ id: user.userId, role: user.role }, secretKey, { expiresIn: "1h" }); // Generate JWT token
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Error logging in" });
  }
};

// Get all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users.map(user => ({
      Userid: user.userId, // Ensure field name matches database schema
      username: user.username
    })));
  } catch (error) {
    console.error('Error retrieving users:', error);
    res.status(500).json({ error: 'Error retrieving users' });
  }
};

// Get a user by ID
const getUserById = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const user = await User.getUserById(userId); // Fetch user by ID
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      Userid: user.userId,
      username: user.username
    });
  } catch (error) {
    console.error('Error retrieving user:', error);
    res.status(500).json({ error: 'Error retrieving user' });
  }
};

// Update a user
const updateUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  const newUserData = req.body;
  if (isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const updatedUser = await User.updateUser(userId, newUserData); // Update user data
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json({
      Userid: updatedUser.userId,
      username: updatedUser.username
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Error updating user' });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  if (isNaN(userId)) {
    console.error('Invalid user ID:', req.params.id);
    return res.status(400).json({ error: 'Invalid user ID' });
  }

  try {
    const success = await User.deleteUser(userId); // Delete user from database
    if (!success) {
      console.error('User not found:', userId);
      return res.status(404).json({ error: 'User not found' });
    }
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Error deleting user' });
  }
};




// Search for users
const searchUsers = async (req, res) => {
  const searchTerm = req.query.q;
  if (!searchTerm) {
    return res.status(400).json({ error: 'Search term is required' });
  }

  try {
    const users = await User.searchUsers(searchTerm); // Search users by term
    res.json(users.map(user => ({
      Userid: user.userId,
      username: user.username
    })));
  } catch (error) {
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'Error searching users' });
  }
};
  const getUsersForEvent = async (req, res) => {
    
    const id = parseInt(req.params.id);
    console.log(id)
    try {
      const usersForEvent = await User.getUsersForEvent(id);
      if (usersForEvent.length === 0) {
        return res.status(404).send("No users found for this event");
      }
      res.json(usersForEvent);
    } catch (error) {
      console.error(error);
      res.status(500).send("Error retrieving users for event");
    }
  };
  const registerUserEvent = async(req,res) =>{
    const userdetails = req.body;
    try{
      const success = await User.registerUserEvent(userdetails);
      if(success){
        res.status(200).send("User registered for the event successfully.")
      }else{
        res.status(400).send("Failed to register user for the event.");
      }
    }catch(error){
      console.error(error);
      res.status(500).send("Error registering user for the event.");
    }
  }
  const removeUserFromEvent = async(req,res)=>{
    const userdetails = req.body;
    try{
      const success = await User.removeUserFromEvent(userdetails);
      if(success){
        res.status(200).send("User removed for the event successfully.")
      }else{
        res.status(400).send("Failed to remove user for the event.");
      }
    }catch(error){
      res.status(500).send("Error deleting user for the event")
    }
  };
  const isUserRegisteredForEvent = async(req,res)=>{
    const userdetails = req.body;
    try{
      const isRegistered  = await User.isUserRegisteredForEvent(userdetails);
      if (isRegistered) {
        res.status(200).send({ message: "User is registered for the event" });
      }else {
        res.status(404).send({ message: "User is not registered for the event" });
      }
    } catch (error) {
      console.error('Error checking user registration:', error);
      res.status(500).send({ message: 'Server error' });
    }
  };
module.exports = {
    getAllUserWithEvents,
    getUserWithEventsById,
    createUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
    searchUsers,
    getUsersForEvent,
    registerUserEvent,
    removeUserFromEvent,
    isUserRegisteredForEvent,
}