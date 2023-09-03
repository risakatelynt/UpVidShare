const express = require("express");
const multer = require("multer");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 3001;

// Use the cors middleware to enable CORS for all routes
app.use(cors());

const uploadedVideos = [];

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads/"); // Specify the directory where uploaded files will be saved
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Use a timestamp in the filename to avoid conflicts
  },
});
const upload = multer({ storage });

const backendURL = "https://video-uploader.onrender.com";
// const backendURL = "http://localhost:3001";

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.get("/videos", (req, res) => {
  res.json({ videos: uploadedVideos });
});

// Handle video upload
app.post("/upload", upload.single("video"), (req, res) => {
  // save metadata about the video and generate a unique link here

  // const videoLink = `http://localhost:${port}/uploads/${req.file.filename}`; // dev url
  const videoLink = `${backendURL}/uploads/${req.file.filename}`; // production url
  uploadedVideos.push(videoLink); // Store the video link
  res.json({ link: videoLink });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
