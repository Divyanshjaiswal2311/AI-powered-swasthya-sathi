/**
 * Emergency Alert Routes
 * 
 * Routes for creating and managing emergency alerts
 * including blood emergencies and medical emergencies
 */

const express = require("express");
const authMiddleware = require("../middlewares/authMiddelware");
const {
  createEmergencyAlertController,
  getActiveEmergenciesController,
  getEmergencyByIdController,
  updateEmergencyStatusController,
  addResponderController,
  addBloodBankResponseController,
  resolveEmergencyController,
  findNearbyBloodBanksController,
} = require("../controllers/emergencyAlertController");

const router = express.Router();

// Create emergency alert
router.post("/create", authMiddleware, createEmergencyAlertController);

// Get active emergencies
router.get("/active", getActiveEmergenciesController);

// Get emergency by ID
router.get("/get/:alertId", getEmergencyByIdController);

// Update emergency status
router.put("/update-status/:alertId", authMiddleware, updateEmergencyStatusController);

// Add responder to emergency
router.post("/add-responder/:alertId", authMiddleware, addResponderController);

// Add blood bank response
router.post("/add-blood-bank/:alertId", authMiddleware, addBloodBankResponseController);

// Resolve emergency
router.put("/resolve/:alertId", authMiddleware, resolveEmergencyController);

// Find nearby blood banks
router.post("/find-nearby", authMiddleware, findNearbyBloodBanksController);

module.exports = router;

