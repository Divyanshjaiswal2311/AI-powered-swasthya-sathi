/**
 * AI Health Routes
 * 
 * Routes for AI-powered health features including report generation,
 * first aid recommendations, and health chat
 */

const express = require("express");
const authMiddleware = require("../middlewares/authMiddelware");
const {
  generateHealthReportController,
  getFirstAidRecommendationController,
  aiHealthChatController,
} = require("../controllers/aiHealthController");

const router = express.Router();

// Generate AI health report
router.post("/generate-report", authMiddleware, generateHealthReportController);

// Get first aid recommendation for symptoms
router.post("/first-aid", getFirstAidRecommendationController);

// AI health chat (symptom checker)
router.post("/chat", authMiddleware, aiHealthChatController);

module.exports = router;

