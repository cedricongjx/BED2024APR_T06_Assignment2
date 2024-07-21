
require('dotenv').config();

const express = require("express");
const eventController = require("./controllers/eventController");
const sql = require("mssql");
const multer = require("multer");
const path = require("path");
//const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const validateEventDate = require("./middlewares/validateEventDate");
const userController = require("./controllers/userController");
const testupload = multer({dest: 'public/images/events'})
const categoryController = require("./controllers/categoryController")

const donationsController = require('./controllers/donationsController');
const statisticsController = require('./controllers/statisticsController');
const authenticateToken = require('./middlewares/authenticateToken');
const validationMiddleware = require('./middlewares/validate');
const dbConfig = require('./config/dbConfig');
const usersController = require('./controllers/usersController'); // Ensure correct path
const newslettersController = require('./controllers/newslettersController');
const documentarysController = require('./controllers/documentarysController');
const validateEmail = require('./middlewares/validateEmail')

const feedbackController = require('./controllers/feedbackController');

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
    cb(null, Date.now() +path.extname(file.originalname));
  }
});


const upload = multer({ storage: storage });
const docUpload = multer({ dest: 'public/images/documentary' });

app.post('/api/signup', validationMiddleware.validateSignup, usersController.createUser);
app.post('/api/login', validationMiddleware.validateLogin, usersController.loginUser);
app.get('/api/users', usersController.getAllUsers);
app.get('/api/users/:id', validationMiddleware.validateUserIdParam, usersController.getUserById);
app.put('/api/users/:id', validationMiddleware.validateUserIdParam, validationMiddleware.validateUserUpdate, usersController.updateUser);
app.delete('/api/users/:id', validationMiddleware.validateUserIdParam, usersController.deleteUser);
app.post('/newsletter', validateEmail, newslettersController.joinNewsletter);
app.get('/documentary/:id', documentarysController.getDocbyID);
app.put('/documentary/:id', documentarysController.updateDocByID);
app.get('/documentary', documentarysController.getAllDocs);
app.post('/documentary', docUpload.single('image'), documentarysController.createDoc);
app.delete('/documentary/:id', documentarysController.deleteDocByID);



// Routes
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
app.get("/userwithevent", userController.getAllUserWithEvents);
app.get("/userwithevent/:id", userController.getUserWithEventsById);
app.get("/eventWithCategory",eventController.getEventsWithCategories);
app.get("/eventWithCategory/:id",eventController.detailedEventById);

app.get("/category",categoryController.getAllCategories);
app.get("/category/:id",categoryController.getCategoryById);
app.post("/category",categoryController.addCategory)
app.delete("/category/:id",categoryController.deleteCategory);
app.post("/addcategoryforevent",eventController.addCategoryToEvent);
app.delete("/removeCategoryFromEvent",eventController.removeCategoryFromEvent);
app.get("/events/category/:id",eventController.getEventsByCategory)

app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images/event')));


app.post('/api/donate', authenticateToken, donationsController.createDonation);

// Add this new route for fetching top donors
app.get('/api/top-donors', donationsController.getTopDonors);

// Statistics route
app.get('/api/statistics', statisticsController.getStatistics);

//Feedback
app.put("/feedback/response",feedbackController.editResponse);

app.get("/feedback/name",feedbackController.getFeedbackByName);
app.get("/feedback",feedbackController.getAllFeedback);
app.get("/feedback/notverified",feedbackController.getAllNotVerifiedFeedback);
app.get("/feedback/verified",feedbackController.getAllVerifiedFeedback);
app.get("/feedback/bug",feedbackController.getAllBugFeedback);
app.get("/feedback/customerservice",feedbackController.getAllCustomerServiceFeedback);
app.get("/feedback/feedback",feedbackController.getAllfeedbackFeedback)
app.get("/feedback/other",feedbackController.getAllOtherFeedback);
app.post("/feedback",feedbackController.createFeedback)
app.put("/feedback/:id",feedbackController.updateFeedback)
app.delete("/feedback/:id",feedbackController.deleteFeedback);

app.post("/feedback/verified",feedbackController.addJustification);
app.get("/feedback/response/:id",feedbackController.getResponse);





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
