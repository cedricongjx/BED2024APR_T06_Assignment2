require('dotenv').config();

const express = require("express");
const sql = require("mssql");
const multer = require("multer");
const path = require("path");
const bodyParser = require("body-parser");

const validateEventDate = require("./middlewares/validateEventDate");
const authenticateToken = require('./middlewares/authenticateToken');
const authorizeAdmin = require('./middlewares/authorizeAdmin');
const validationMiddleware = require('./middlewares/validate');
const validateEmail = require('./middlewares/validateEmail');
const validateDonation = require('./middlewares/validateDonation');

const eventController = require("./controllers/eventController");
const userController = require("./controllers/userController");
const categoryController = require("./controllers/categoryController");
const donationsController = require('./controllers/donationsController');
const statisticsController = require('./controllers/statisticsController');
const usersController = require('./controllers/usersController'); // Ensure correct path
const newslettersController = require('./controllers/newslettersController');
const documentarysController = require('./controllers/documentarysController');
const feedbackController = require('./controllers/feedbackController');

const dbConfig = require('./config/dbConfig');

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON and URL-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images/event');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });
const testupload = multer({ dest: 'public/images/events' });

// User routes
app.post('/api/signup', validationMiddleware.validateSignup, usersController.createUser);
app.post('/api/login', validationMiddleware.validateLogin, usersController.loginUser);
app.get('/api/users', authenticateToken, authorizeAdmin, usersController.getAllUsers);
app.get('/api/users/:id', authenticateToken, authorizeAdmin, validationMiddleware.validateUserIdParam, usersController.getUserById);
app.put('/api/users/:id', authenticateToken, authorizeAdmin, validationMiddleware.validateUserIdParam, validationMiddleware.validateUserUpdate, usersController.updateUser);
app.delete('/api/users/:id', authenticateToken, authorizeAdmin, validationMiddleware.validateUserIdParam, usersController.deleteUser);

// Newsletter routes
app.post('/api/newsletter', validateEmail, newslettersController.joinNewsletter);

// Documentary routes
app.get('/api/documentary/:id', documentarysController.getDocbyID);
app.put('/api/documentary/:id', documentarysController.updateDocByID);

// Donation routes
app.post('/api/donate', authenticateToken, validateDonation, donationsController.createDonation);
app.get('/api/top-donors', donationsController.getTopDonors); // Fetch top donors

// Statistics routes
app.get('/api/statistics', statisticsController.getStatistics);
app.get('/api/average-donations', statisticsController.getAverageDonations);

// Event routes
app.get("/event", eventController.getAllEvent);
app.get("/event/:id", eventController.getEventById);
app.post("/event", testupload.single('image'), validateEventDate, eventController.createEvent);
app.post("/upload", upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  res.status(200).send({ message: 'File uploaded successfully', file: req.file });
});
app.get("/latestEvent", eventController.latestEvent);
app.get("/events/search", eventController.getEventByName);
app.put("/event/:id", eventController.updateEvent);

// User with event routes
app.get("/userwithevent", userController.getAllUserWithEvents);
app.get("/userwithevent/:id", userController.getUserWithEventsById);

// Event with category routes
app.get("/eventWithCategory", eventController.getEventsWithCategories);
app.get("/eventWithCategory/:id", eventController.detailedEventById);

// Category routes
app.get("/category", categoryController.getAllCategories);
app.get("/category/:id", categoryController.getCategoryById);
app.post("/category", categoryController.addCategory);
app.delete("/category/:id", categoryController.deleteCategory);
app.post("/addcategoryforevent", eventController.addCategoryToEvent);
app.delete("/removeCategoryFromEvent", eventController.removeCategoryFromEvent);
app.get("/events/category/:id", eventController.getEventsByCategory);

// Feedback routes
app.put("/feedback/response", feedbackController.editResponse);
app.get("/feedback/name", feedbackController.getFeedbackByName);
app.get("/feedback", authenticateToken, feedbackController.getAllFeedback);
app.get("/feedback/notverified", feedbackController.getAllNotVerifiedFeedback);
app.get("/feedback/verified", feedbackController.getAllVerifiedFeedback);
app.get("/feedback/bug", feedbackController.getAllBugFeedback);
app.get("/feedback/customerservice", feedbackController.getAllCustomerServiceFeedback);
app.get("/feedback/feedback", feedbackController.getAllfeedbackFeedback);
app.get("/feedback/other", feedbackController.getAllOtherFeedback);
app.post("/feedback", feedbackController.createFeedback);
app.put("/feedback/:id", feedbackController.updateFeedback);
app.delete("/feedback/:id", feedbackController.deleteFeedback);
app.post("/feedback/verified", feedbackController.addJustification);
app.get("/feedback/response/:id", feedbackController.getResponse);

// Static file routes
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images/event')));

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
