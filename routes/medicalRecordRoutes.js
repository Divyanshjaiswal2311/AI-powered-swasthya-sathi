/**
 * Medical Record Routes
 * 
 * Routes for managing medical records, uploads, and document sharing
 */

const express = require("express");
const authMiddleware = require("../middlewares/authMiddelware");
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

const router = express.Router();

// Upload medical record
router.post("/upload", authMiddleware, uploadMedicalRecordController);

// Get all medical records for user
router.get("/get-records", authMiddleware, getMedicalRecordsController);

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

