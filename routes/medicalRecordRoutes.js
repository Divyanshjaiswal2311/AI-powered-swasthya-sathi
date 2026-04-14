/**
 * Medical Record Routes
 * 
 * Routes for managing medical records, uploads, and document sharing
 */

const express = require("express");
const multer = require("multer");
const path = require("path");
const authMiddleware = require("../middlewares/authMiddleware");
const {
  uploadMedicalRecordController,
  getMedicalRecordsController,
  getRecordByIdController,
  updateMedicalRecordController,
  deleteMedicalRecordController,
  shareRecordController,
  archiveRecordController,
  getRecordsByTypeController,
} = require("../controllers/medicalRecordController");

// Configure file upload storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/medical-records/');
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

// File upload filter
const fileFilter = (req, file, cb) => {
  const allowedMimes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF and images are allowed.'), false);
  }
};

// Configure multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: fileFilter
});

const router = express.Router();

// Upload medical record
router.post("/upload", authMiddleware, upload.single('file'), uploadMedicalRecordController);

// Get all medical records for user
router.post("/get-records", authMiddleware, getMedicalRecordsController);

// Get record by ID
router.get("/get-record/:recordId", authMiddleware, getRecordByIdController);

// Get records by type
router.get("/get-by-type/:documentType", authMiddleware, getRecordsByTypeController);

// Update record
router.put("/update/:recordId", authMiddleware, updateMedicalRecordController);

// Delete record
router.delete("/delete/:recordId", authMiddleware, deleteMedicalRecordController);

// Share record with doctor
router.post("/share", authMiddleware, shareRecordController);

// Archive record
router.put("/archive/:recordId", authMiddleware, archiveRecordController);

module.exports = router;

