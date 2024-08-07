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
 
//const authenticateToken = require('./middlewares/authenticateToken');
//const validationMiddleware = require('./middlewares/validate');
//const dbConfig = require('./config/dbConfig');
//const usersController = require('./controllers/usersController'); // Ensure correct path
//const documentarysController = require('./controllers/documentaryController');
const newslettersController = require('./controllers/newslettersController');
const documentaryController = require('./controllers/documentaryController');
//const validateEmail = require('./middlewares/validateEmail')
const reviewContoller = require('./controllers/reviewController');
 
const feedbackController = require('./controllers/feedbackController');
 
const { user } = require('./dbConfig');
 
const validateFeedback = require("./middlewares/validateFeedback");
 
const dbConfig = require('./config/dbConfig');

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json"); // Import generated spec

 
const app = express();
const port = process.env.PORT || 3000;
 


// Serve the Swagger UI at a specific route
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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



//donataion
app.post('/api/donate', authenticateToken,  donationsController.createDonation);
app.get('/api/top-donors', donationsController.getTopDonors); // Fetch top donors


const docStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/images/documentary');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  if (!allowedTypes.includes(file.mimetype)) {
    const error = new Error('Invalid file type');
    error.code = 'INVALID_FILE_TYPE';
    console.error('File upload error: Invalid file type');
    return cb(error, false);
  }
  cb(null, true);
};

const docUpload = multer({
  storage: docStorage,
  fileFilter: fileFilter
}).single('image');


 

// User routes
app.post('/api/signup', validationMiddleware.validateSignup, userController.createUser);
app.post('/api/login', validationMiddleware.validateLogin, userController.loginUser);
app.get('/api/users',  authenticateToken,  userController.getAllUsers);
app.get('/api/users/:id', authenticateToken, validationMiddleware.validateUserIdParam, userController.getUserById);
app.put('/api/users/:id', authenticateToken,validationMiddleware.validateUserIdParam, validationMiddleware.validateUserUpdate, userController.updateUser);
app.delete('/api/users/:id', authenticateToken,  validationMiddleware.validateUserIdParam, userController.deleteUser);
 
// Newsletter routes
app.post('/newsletter', validateEmail, newslettersController.joinNewsletter);
 
// Documentary routes
app.get('/documentary/category/:doccategory', documentaryController.getDocsbyCat);
app.get('/documentary/search', documentaryController.searchDoc);
app.get('/documentary/:id', documentaryController.getDocbyID);
app.put('/documentary/:id', authenticateToken, (req, res, next) => {
  docUpload(req, res, function (err) {
    if (err) {
      if (err.code === 'INVALID_FILE_TYPE') {
        console.error('Invalid file type. Only JPG, PNG, and GIF are allowed');
        return res.status(400).json({ message: 'Invalid file type. Only JPG, PNG, and GIF are allowed' });
      }
      console.error('File upload error:', err.message);
      return res.status(500).json({ message: 'File upload error', error: err.message });
    }
    next();
  });}, documentaryController.updateDocByID);
app.get('/documentary', documentaryController.getAllDocs);
app.post('/documentary', authenticateToken, (req, res, next) => {
  docUpload(req, res, function (err) {
    if (err) {
      if (err.code === 'INVALID_FILE_TYPE') {
        console.error('Invalid file type. Only JPG, PNG, and GIF are allowed');
        return res.status(400).json({ message: 'Invalid file type. Only JPG, PNG, and GIF are allowed' });
      }
      console.error('File upload error:', err.message);
      return res.status(500).json({ message: 'File upload error', error: err.message });
    }
    next();
  });}, documentaryController.createDoc);
app.delete('/documentary/:id', authenticateToken, documentaryController.deleteDocbyID);
 
//Review routes
app.post('/review/:id', authenticateToken, reviewContoller.createReview);
app.get('/review/:id', reviewContoller.getReviewbyID);
app.get('/documentary/review/:id', reviewContoller.getReviewsbyDoc);
app.get('/review/documentary/:id', reviewContoller.createdReview);
app.get('/review/average/:id', reviewContoller.getAverageStar);
app.get('/review/total/:id', reviewContoller.getNumberofReviews);
 
 
// Donation routes
app.post('/api/donate', authenticateToken, validateDonation, donationsController.createDonation);
app.get('/api/top-donors', donationsController.getTopDonors); // Fetch top donors
 
// Statistics routes
app.get('/api/statistics', statisticsController.getStatistics);
app.get('/api/average-donations', statisticsController.getAverageDonations);
 
 
app.get("/testgetalluserforevent/:id",userController.getUsersForEvent);
 
//------EVENTS------//
 
app.get("/event", eventController.getAllEvent);
app.get("/event/:id", eventController.getEventById);
app.post("/eventpost", testupload.single('image'), validateEventDate, authenticateToken,eventController.createEvent);
app.post("/upload", upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  res.status(200).send({ message: 'File uploaded successfully', file: req.file });
});
app.get("/latestEvent", eventController.latestEvent);
app.get("/events/search", eventController.getEventByName);

app.put('/eventupdate/:id', upload.single('image'),authenticateToken ,eventController.updateEvent);
app.post("/upload", upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).send({ message: 'No file uploaded' });
  }
  res.status(200).send({ message: 'File uploaded successfully', file: req.file });
});
app.get("/userwithevent", userController.getAllUserWithEvents);
app.get("/userwithevent/:id", userController.getUserWithEventsById);
app.get("/eventWithCategory",eventController.getEventsWithCategories);
app.get("/eventWithCategory/:id",eventController.detailedEventById);

app.get("/category",categoryController.getAllCategories);
app.get("/category/:id",categoryController.getCategoryById);
app.post("/categorypost",authenticateToken,categoryController.addCategory)

app.delete("/categorydelete/:id",authenticateToken,categoryController.deleteCategory);
app.post("/addcategoryforevent",authenticateToken,eventController.addCategoryToEvent);
app.delete("/removeCategoryFromEvent",authenticateToken,eventController.removeCategoryFromEvent);
app.get("/events/category/:id",eventController.getEventsByCategory);
app.get("/getCategoryForEvent/:id",eventController.getCategoryForEvent);
 
app.put("/event/:id", eventController.updateEvent);
 
// User with event routes
app.get("/userwithevent", userController.getAllUserWithEvents);
app.get("/userwithevent/:id", userController.getUserWithEventsById);
 
// Event with category routes
app.get("/eventWithCategory", eventController.getEventsWithCategories);
app.get("/eventWithCategory/:id", eventController.detailedEventById);
 
// Category routes
// app.get("/category", categoryController.getAllCategories);
// app.get("/category/:id", categoryController.getCategoryById);
// app.post("/category", categoryController.addCategory);
//app.delete("/category/:id", categoryController.deleteCategory);
 
// Feedback routes
// Static file routes
 
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/images', express.static(path.join(__dirname, 'public/images/event')));
app.post("/testadduser",authenticateToken,userController.registerUserEvent);
app.delete("/testremoveuser",authenticateToken,userController.removeUserFromEvent);
app.post("/testcheck",authenticateToken,userController.isUserRegisteredForEvent);
 
//Feedback
app.put("/feedback/response",authenticateToken,feedbackController.editResponse);
 
app.get("/feedback/name",authenticateToken,feedbackController.getFeedbackByName);
app.get("/feedback",authenticateToken,feedbackController.getAllFeedback);
app.get("/feedback/notverified",authenticateToken,feedbackController.getAllNotVerifiedFeedback);
app.get("/feedback/verified",authenticateToken,feedbackController.getAllVerifiedFeedback);
app.get("/feedback/bug",authenticateToken,feedbackController.getAllBugFeedback);
app.get("/feedback/customerservice",authenticateToken,feedbackController.getAllCustomerServiceFeedback);
app.get("/feedback/feedback",authenticateToken,feedbackController.getAllfeedbackFeedback)
app.get("/feedback/other",authenticateToken,feedbackController.getAllOtherFeedback);
app.post("/feedback/create",validateFeedback.validateFeedback,authenticateToken,feedbackController.createFeedback)
app.put("/feedback/update/:id",authenticateToken,feedbackController.updateFeedback)
app.delete("/feedback/delete/:id",authenticateToken,feedbackController.deleteFeedback);
app.post("/feedback/verified",validateFeedback.validateJustification,authenticateToken,feedbackController.addJustification);
app.get("/feedback/response/:id",authenticateToken,feedbackController.getResponse);
app.get("/feedback/categorycount",authenticateToken, feedbackController.getFeedbackCountByAllCategory);
 
 
 
 
 
 
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
 