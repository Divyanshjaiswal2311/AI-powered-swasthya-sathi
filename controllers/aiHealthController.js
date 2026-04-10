/**
 * AI Health Service Controller
 * 
 * Integrates with Groq API for health report summarization,
 * first aid recommendations, and health insights
 */

const axios = require("axios");
const aiHealthReportModel = require("../models/aiHealthReportModel");
const healthProfileModel = require("../models/healthProfileModel");
const medicalRecordModel = require("../models/medicalRecordModel");
const firstAidGuideModel = require("../models/firstAidGuideModel");

// Groq API Configuration
const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const GROQ_MODEL = "llama-3.1-8b-instant"; // Available and fast model

console.log('🔑 Groq API Key Status:', GROQ_API_KEY ? '✅ Configured' : '❌ Not Set');

/**
 * Generate Health Report Summary using Gemini
 */
const generateHealthReportController = async (req, res) => {
  try {
    const { userId, reportType } = req.body;

    // Fetch health profile
    const healthProfile = await healthProfileModel.findOne({ userId });
    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    // Fetch recent medical records
    const medicalRecords = await medicalRecordModel
      .find({ healthProfileId: healthProfile._id })
      .sort({ documentDate: -1 })
      .limit(5);

    // Prepare data for AI
    const healthData = {
      age: calculateAge(healthProfile.dateOfBirth),
      bloodType: healthProfile.bloodType,
      vitals: healthProfile.vitals,
      conditions: healthProfile.medicalConditions,
      allergies: healthProfile.allergies,
      medications: healthProfile.medications,
      lifestyle: healthProfile.lifestyle,
      recentRecords: medicalRecords.map((r) => ({
        type: r.documentType,
        title: r.documentTitle,
        date: r.documentDate,
      })),
    };

    // Create prompt for Gemini
    const prompt = generatePrompt(reportType, healthData);

    // Call Gemini API
    const aiResponse = await callGeminiAPI(prompt);

    if (!aiResponse.success) {
      return res.status(500).send({
        success: false,
        message: "Error generating AI report",
        error: aiResponse.error,
      });
    }

    // Parse AI response
    const reportContent = parseAIResponse(aiResponse.data, reportType);

    // Save report to database
    const aiReport = new aiHealthReportModel({
      healthProfileId: healthProfile._id,
      reportType,
      title: reportContent.title,
      executiveSummary: reportContent.summary,
      mainFindings: reportContent.findings,
      recommendations: reportContent.recommendations,
      riskFactors: reportContent.riskFactors,
      metricsAnalysis: reportContent.metricsAnalysis,
      aiModel: {
        modelName: "Gemini",
        modelVersion: "gemini-pro",
        confidence: reportContent.confidence || 85,
        processingTime: aiResponse.processingTime || 0,
      },
      dataSourcesUsed: [
        {
          source: "health_profile",
          sourceId: healthProfile._id,
          dateUsed: new Date(),
        },
        ...medicalRecords.map((r) => ({
          source: "medical_record",
          sourceId: r._id,
          dateUsed: new Date(),
        })),
      ],
    });

    await aiReport.save();

    return res.status(200).send({
      success: true,
      message: "AI health report generated successfully",
      report: aiReport,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error generating health report",
      error: error.message,
    });
  }
};

/**
 * Get First Aid Recommendation for Symptoms
 */
const getFirstAidRecommendationController = async (req, res) => {
  try {
    const { symptoms, severity } = req.body;

    // Search first aid guides based on symptoms
    const guides = await firstAidGuideModel.find({
      $text: { $search: symptoms.join(" ") },
      severity: severity || { $exists: true },
    });

    if (guides.length === 0) {
      return res.status(404).send({
        success: false,
        message: "No matching first aid guides found",
      });
    }

    // Get best match (first result from text search)
    const bestMatch = guides[0];

    // Generate AI-powered recommendations based on the guide
    const prompt = `Based on these symptoms: ${symptoms.join(", ")}, 
    and the first aid guide for ${bestMatch.conditionName}, 
    provide immediate action steps, warning signs, and when to seek emergency help. 
    Be concise and practical. Keep response under 300 words.`;

    const aiResponse = await callGeminiAPI(prompt);

    const recommendation = {
      condition: bestMatch.conditionName,
      severity: bestMatch.severity,
      symptoms: symptoms,
      immediateActions: bestMatch.firstAidSteps.slice(0, 3),
      warningSigns: bestMatch.emergencyIndications,
      requiredSupplies: bestMatch.requiredSupplies,
      aiGuidance: aiResponse.success ? aiResponse.data : "Consult medical professional",
      emergencyNumber: "911",
      isEmergency: bestMatch.severity === "life_threatening",
    };

    return res.status(200).send({
      success: true,
      message: "First aid recommendation generated",
      recommendation,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error getting first aid recommendation",
      error: error.message,
    });
  }
};

/**
 * AI Health Chat (Symptom Checker) - GROQ VERSION
 */
const aiHealthChatController = async (req, res) => {
  try {
    const { userId, userMessage } = req.body;

    if (!userMessage) {
      return res.status(400).send({
        success: false,
        message: "User message is required",
      });
    }

    // Get health profile for context (optional)
    let healthContext = "";
    try {
      const healthProfile = await healthProfileModel.findOne({ userId });
      if (healthProfile) {
        healthContext = `User's known conditions: ${healthProfile.medicalConditions?.map((c) => c.condition).join(", ") || "None"}
User's allergies: ${healthProfile.allergies?.map((a) => a.allergen).join(", ") || "None"}`;
      }
    } catch (err) {
      console.log("Error fetching health profile for context:", err.message);
    }

    // Build comprehensive prompt
    const systemPrompt = `You are a helpful and empathetic health information assistant named "Swasthya Sathi".
You provide general health information and first aid guidance based on symptoms.

IMPORTANT INSTRUCTIONS:
1. Always remind users that you are NOT a medical professional
2. For any serious symptoms (chest pain, difficulty breathing, severe bleeding), recommend immediate emergency services (911)
3. Provide practical, evidence-based health information
4. Be warm and supportive in your tone
5. Ask clarifying questions if needed
6. Keep responses concise (under 400 words)
7. Include a disclaimer at the end

${healthContext ? `User Context: ${healthContext}` : ""}

Remember: Your role is to provide information and first aid guidance, not medical diagnosis.`;

    console.log("📝 Sending message to Groq:", userMessage.substring(0, 50) + "...");

    // Call Groq API with chat
    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000, // 30 second timeout
      }
    );

    console.log("✅ Groq API Response received");

    // Extract the AI message
    const aiMessage =
      response?.data?.choices?.[0]?.message?.content ||
      "I apologize, but I couldn't generate a response. Please try again.";

    return res.status(200).send({
      success: true,
      message: "AI response generated successfully",
      response: aiMessage,
      disclaimer:
        "⚠️ This is for informational purposes only. Always consult a qualified healthcare provider for medical advice, diagnosis, or treatment.",
      assistantName: "Swasthya Sathi AI Assistant",
    });
  } catch (error) {
    console.error("❌ AI Chat Error:", error.message);
    console.error("Error Details:", error.response?.data || error);

    // Provide helpful error message
    let errorMessage = "Error in AI chat";
    if (error.message.includes("API key")) {
      errorMessage = "AI service is not configured. Please set GROQ_API_KEY.";
    } else if (error.message.includes("timeout")) {
      errorMessage = "Request timed out. Please try again.";
    } else if (error.response?.status === 401) {
      errorMessage = "Invalid API key. Please check your configuration.";
    } else if (error.response?.status === 429) {
      errorMessage = "Rate limit exceeded. Please try again later.";
    }

    return res.status(error.response?.status || 500).send({
      success: false,
      message: errorMessage,
      error: error.message,
    });
  }
};

/**
 * Helper: Call Groq API
 */
async function callGroqAPI(prompt) {
  try {
    if (!GROQ_API_KEY) {
      return {
        success: false,
        error: "Groq API key not configured",
      };
    }

    const startTime = Date.now();

    const response = await axios.post(
      GROQ_API_URL,
      {
        model: GROQ_MODEL,
        messages: [
          {
            role: "system",
            content: "You are a helpful health information assistant. Provide practical, evidence-based health information. Always remind users that you are NOT a medical professional."
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 1024,
        temperature: 0.7,
      },
      {
        headers: {
          "Authorization": `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      }
    );

    const processingTime = Date.now() - startTime;
    const aiText = response?.data?.choices?.[0]?.message?.content;

    if (!aiText) {
      return {
        success: false,
        error: "No response from Groq API",
      };
    }

    return {
      success: true,
      data: aiText,
      processingTime,
    };
  } catch (error) {
    console.log("❌ Groq API Error:", error.message);
    if (error.response?.data) {
      console.log("Error Response:", error.response.data);
    }
    return {
      success: false,
      error: error.message,
    };
  }
}

/**
 * Helper: Call Gemini API (deprecated - for backward compatibility)
 */
async function callGeminiAPI(prompt) {
  // Redirect to Groq API
  return callGroqAPI(prompt);
}

/**
 * Helper: Generate prompt based on report type
 */
function generatePrompt(reportType, healthData) {
  const baseData = `
  User Health Profile:
  - Age: ${healthData.age}
  - Blood Type: ${healthData.bloodType}
  - Current BMI: ${healthData.vitals?.bmi || "Unknown"}
  - Blood Pressure: ${healthData.vitals?.systolic}/${healthData.vitals?.diastolic} mmHg
  - Medical Conditions: ${healthData.conditions.map((c) => c.condition).join(", ") || "None"}
  - Allergies: ${healthData.allergies.map((a) => a.allergen).join(", ") || "None"}
  - Current Medications: ${healthData.medications.map((m) => m.name).join(", ") || "None"}
  - Lifestyle: ${JSON.stringify(healthData.lifestyle)}
  `;

  switch (reportType) {
    case "health_summary":
      return `${baseData}
      Generate a comprehensive health summary with:
      1. Overall health status assessment
      2. Key health observations
      3. Active health concerns
      4. Wellness recommendations
      Format: Structured with clear sections`;

    case "risk_assessment":
      return `${baseData}
      Perform a health risk assessment with:
      1. Identified risk factors
      2. Risk severity levels (low, medium, high)
      3. Potential health complications
      4. Mitigation strategies
      Format: Risk factor analysis`;

    case "wellness_recommendation":
      return `${baseData}
      Provide personalized wellness recommendations:
      1. Diet and nutrition suggestions
      2. Exercise and lifestyle modifications
      3. Stress management techniques
      4. Preventive health measures
      Format: Practical action items`;

    default:
      return baseData;
  }
}

/**
 * Helper: Parse AI Response
 */
function parseAIResponse(aiText, reportType) {
  // Basic parsing - can be enhanced with NLP
  return {
    title: `${reportType.replace(/_/g, " ").toUpperCase()} Report`,
    summary: aiText.substring(0, 500),
    findings: [
      {
        finding: "Health assessment completed",
        importance: "high",
        details: aiText,
      },
    ],
    recommendations: [
      {
        recommendation: "Follow up with healthcare provider",
        category: "medical",
        priority: "high",
        timeframe: "Within 1 week",
      },
    ],
    riskFactors: [
      {
        riskFactor: "Requires ongoing monitoring",
        severity: "moderate",
        mitigation: "Regular check-ups and vitals monitoring",
      },
    ],
    metricsAnalysis: {
      vitals: {
        status: "Need review",
        interpretation: "See detailed report",
      },
    },
    confidence: 85,
  };
}

/**
 * Helper: Calculate Age
 */
function calculateAge(dateOfBirth) {
  const today = new Date();
  let age = today.getFullYear() - new Date(dateOfBirth).getFullYear();
  const monthDifference = today.getMonth() - new Date(dateOfBirth).getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < new Date(dateOfBirth).getDate())
  ) {
    age--;
  }

  return age;
}

module.exports = {
  generateHealthReportController,
  getFirstAidRecommendationController,
  aiHealthChatController,
};
