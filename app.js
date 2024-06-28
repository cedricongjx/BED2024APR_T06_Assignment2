const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const dbConfig = require('./config/dbConfig');
const usersController = require('./controllers/usersController'); // Ensure correct path
const newslettersController = require('./controllers/newslettersController');
const documentarysController = require('./controllers/documentarysController');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' folder
app.use(express.static('public'));

// User routes
app.post('/api/signup', usersController.createUser); 
app.post('/api/login', usersController.loginUser); // Ensure this line is correct
app.get('/api/users', usersController.getAllUsers);
app.get('/api/users/:id', usersController.getUserById);
app.put('/api/users/:id', usersController.updateUser);
app.delete('/api/users/:id', usersController.deleteUser);
app.post('/api/newsletter', newslettersController.joinNewsletter);
app.get('/api/documentary/:id', documentarysController.getDocbyID);
app.put('/api/documentary/:id', documentarysController.updateDocByID);

// Start the server and connect to the database
app.listen(port, async () => {
  try {
    await sql.connect(dbConfig);
    console.log(`Database connected and server running on port ${port}`);
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
});

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await sql.close();
  process.exit(0);
});
