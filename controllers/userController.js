// Import necessary modules
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const secretKey = process.env.JWT_SECRET || "your-secret-key";

// Function to get all users with their associated events
const getAllUserWithEvents = async (req, res) => {
    try {
        const userWithEvent = await User.getAllUserWithEvents(); // Fetch all users with events
        res.json(userWithEvent);
    } catch (error) {
        console.log(error);
        res.status(500).send("error retreiving events");
    }
};

// Function to get a specific user by ID along with their events
const getUserWithEventsById = async (req, res) => {
    const userId = parseInt(req.params.id); // Parse user ID from request parameters
    try {
        const userwithevent = await User.getUserWithEventsById(userId); // Fetch user with events by ID
        if (!userwithevent) {
            return res.status(404).send("Event not found");
        }
        res.json(userwithevent);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retreiving user with event");
    }
};

// Function to create a new user
const createUser = async (req, res) => {
    const { username, password, role } = req.body; // Extract user data from request body
    try {
        const hashedPassword = await bcrypt.hash(password, 10); // Hash the password
        const newUser = await User.createUser({ username, password: hashedPassword, role }); // Create user in database
        res.status(201).json({ message: "User created successfully", userId: newUser.userId });
    } catch (error) {
        console.error("Error creating user:", error);
        res.status(500).json({ error: "Error creating user" });
    }
};

// Function to log in a user
const loginUser = async (req, res) => {
    const { username, password } = req.body; // Extract login credentials from request body
    try {
        const user = await User.getUserByUsername(username); // Fetch user from database by username
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password); // Validate password
        if (!isPasswordValid) {
            return res.status(401).json({ error: "Incorrect password" });
        }
        const token = jwt.sign({ id: user.userId, role: user.role }, secretKey, { expiresIn: "1h" }); // Generate JWT token
        res.status(200).json({ message: "Login successful", token: token, user_id: user.userId });
    } catch (error) {
        console.error("Error logging in:", error);
        res.status(500).json({ error: "Error logging in" });
    }
};

// Function to get all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.getAllUsers(); // Fetch all users
        res.json(users.map(user => ({
            Userid: user.userId, // Ensure field name matches database schema
            username: user.username
        })));
    } catch (error) {
        console.error('Error retrieving users:', error);
        res.status(500).json({ error: 'Error retrieving users' });
    }
};

// Function to get a user by ID
const getUserById = async (req, res) => {
    const userId = parseInt(req.params.id); // Parse user ID from request parameters
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

// Function to update a user
const updateUser = async (req, res) => {
    const userId = parseInt(req.params.id); // Parse user ID from request parameters
    const newUserData = req.body; // Extract new user data from request body
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

// Function to delete a user
const deleteUser = async (req, res) => {
    const userId = parseInt(req.params.id); // Parse user ID from request parameters
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
        res.status(204).send(); // Send no content response
    } catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({ error: 'Error deleting user' });
    }
};

// Function to search for users
const searchUsers = async (req, res) => {
    const searchTerm = req.query.q; // Extract search term from query parameters
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

// Function to get users for a specific event
const getUsersForEvent = async (req, res) => {
    const id = parseInt(req.params.id); // Parse event ID from request parameters
    console.log(id);
    try {
        const usersForEvent = await User.getUsersForEvent(id); // Fetch users for event by ID
        if (usersForEvent.length === 0) {
            return res.status(404).send("No users found for this event");
        }
        res.json(usersForEvent);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error retrieving users for event");
    }
};

// Function to register a user for an event
const registerUserEvent = async (req, res) => {
    const userdetails = req.body; // Extract user details from request body
    try {
        const success = await User.registerUserEvent(userdetails); // Register user for event
        if (success) {
            res.status(200).send("User registered for the event successfully.");
        } else {
            res.status(400).send("Failed to register user for the event.");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Error registering user for the event.");
    }
};

// Function to remove a user from an event
const removeUserFromEvent = async (req, res) => {
    const userdetails = req.body; // Extract user details from request body
    try {
        const success = await User.removeUserFromEvent(userdetails); // Remove user from event
        if (success) {
            res.status(200).send("User removed from the event successfully.");
        } else {
            res.status(400).send("Failed to remove user from the event.");
        }
    } catch (error) {
        res.status(500).send("Error deleting user from the event.");
    }
};

// Function to check if a user is registered for an event
const isUserRegisteredForEvent = async (req, res) => {
    const userdetails = req.body; // Extract user details from request body
    try {
        const isRegistered = await User.isUserRegisteredForEvent(userdetails); // Check user registration for event
        if (isRegistered) {
            res.status(200).send({ message: "User is registered for the event" });
        } else {
            res.status(404).send({ message: "User is not registered for the event" });
        }
    } catch (error) {
        console.error('Error checking user registration:', error);
        res.status(500).send({ message: 'Server error' });
    }
};

// Export all functions for use in routes
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
};
