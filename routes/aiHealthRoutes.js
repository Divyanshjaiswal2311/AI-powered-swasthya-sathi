/**
 * AI Health Routes
 * 
 * Routes for AI-powered health features including report generation,
 * first aid recommendations, health chat, and medical report analysis
 */

const express = require("express");
const authMiddleware = require("../middlewares/authMiddelware");
const {
  generateHealthReportController,
  getFirstAidRecommendationController,
  aiHealthChatController,
  analyzeReportController,
} = require("../controllers/aiHealthController");

const router = express.Router();

// Generate AI health report
router.post("/generate-report", authMiddleware, generateHealthReportController);

// Get first aid recommendation for symptoms
router.post("/first-aid", authMiddleware, getFirstAidRecommendationController);

// AI health chat (symptom checker)
router.post("/chat", authMiddleware, aiHealthChatController);

// Analyze medical report with AI
router.post("/analyze-report", authMiddleware, analyzeReportController);

module.exports = router;
