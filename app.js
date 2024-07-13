const express = require("express");
const eventController = require("./controllers/eventController");
const sql = require("mssql");
const multer = require("multer");
const path = require("path");
const dbConfig = require("./dbConfig");
const bodyParser = require("body-parser");
const validateEventDate = require("./middlewares/validateEventDate");
const userController = require("./controllers/userController");
const testupload = multer({dest: 'public/images/events'})

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

// Start the server
app.listen(port, async () => {
  try {
    await sql.connect(dbConfig);
    console.log("Database connection established successfully");
  } catch (err) {
    console.error("Database connection error:", err);
    process.exit(1);
  }
  console.log(`Server listening on port ${port}`);
});

// Close the connection pool on SIGINT signal
process.on("SIGINT", async () => {
  console.log("Server is gracefully shutting down");
  await sql.close();
  console.log("Database connection closed");
  process.exit(0);
});
