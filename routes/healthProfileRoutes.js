/**
 * Health Profile Routes
 * 
 * Routes for managing health profiles, vitals, conditions, and allergies
 */

const express = require("express");
const authMiddleware = require("../middlewares/authMiddelware");
const {
  createHealthProfileController,
  getHealthProfileController,
  updateVitalsController,
  addConditionController,
  addAllergyController,
  addMedicationController,
  getHealthSummaryController,
  checkDonationEligibilityController,
} = require("../controllers/healthProfileController");

const router = express.Router();

// Create or update health profile
router.post("/create-profile", authMiddleware, createHealthProfileController);

// Get health profile
router.get("/get-profile", authMiddleware, getHealthProfileController);

// Update vitals
router.post("/update-vitals", authMiddleware, updateVitalsController);

// Add medical condition
router.post("/add-condition", authMiddleware, addConditionController);

// Add allergy
router.post("/add-allergy", authMiddleware, addAllergyController);

// Add medication
router.post("/add-medication", authMiddleware, addMedicationController);

// Get health summary
router.get("/get-summary", authMiddleware, getHealthSummaryController);

// Check donation eligibility
router.post("/check-eligibility", authMiddleware, checkDonationEligibilityController);

module.exports = router;

