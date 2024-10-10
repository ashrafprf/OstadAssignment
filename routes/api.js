import express from "express";
import multer from "multer"; // Import multer for file uploads
import path from "path"; // Import path for handling file paths

const router = express.Router();


import * as UsersController from "../app/controllers/UsersController.js";
import AuthMiddleware from "../app/middlewares/AuthMiddleware.js";

// Ensure the 'uploads' directory exists
import fs from 'fs';
if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads'); // Create the uploads directory if it doesn't exist
}

// Storage configuration for Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Directory to save uploaded files
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Rename file to avoid duplicates
  },
});

// Create upload middleware
const upload = multer({ storage });

// Users
router.post("/Registration", UsersController.Registration);
router.post("/Login", UsersController.Login);
router.post("/ProfileUpdate", AuthMiddleware, UsersController.ProfileUpdate);
router.get("/ProfileDetails", AuthMiddleware, UsersController.ProfileDetails);
router.get("/EmailVerify/:email", UsersController.EmailVerify);
router.post("/CodeVerify", UsersController.CodeVerify);
router.post("/ResetPassword", UsersController.ResetPassword);


// File Upload API
router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }
  res.send(`File uploaded successfully: ${req.file.filename}`);
});

// File Read API
router.get('/files', (req, res) => {
  fs.readdir('uploads', (err, files) => {
    if (err) return res.status(500).send('Error reading files.');
    res.json(files); // Return the list of files
  });
});

// Single File Delete API
router.delete('/delete/:filename', (req, res) => {
  const filePath = path.join('uploads', req.params.filename);
  fs.unlink(filePath, (err) => {
    if (err) return res.status(500).send('Error deleting file.');
    res.send(`File deleted successfully: ${req.params.filename}`);
  });
});

// Export the router
export default router;
