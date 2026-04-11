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
 * Analyze Medical Report with AI
 * Extracts key information and provides health recommendations
 */
const analyzeReportController = async (req, res) => {
  try {
    const { recordId, userId } = req.body;

    // Fetch the medical record
    const record = await medicalRecordModel.findById(recordId);
    if (!record) {
      return res.status(404).send({
        success: false,
        message: "Medical record not found"
      });
    }

    // Create AI prompt for analysis
    const analysisPrompt = `
You are a medical report analyzer. Analyze this medical report and provide a structured JSON response with these exact fields:
{
  "summary": "Brief one-paragraph summary of the findings",
  "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
  "abnormalValues": [
    {
      "parameter": "Parameter name",
      "value": 45,
      "normalRange": "30-40",
      "severity": "high"
    }
  ],
  "recommendations": ["Recommendation 1", "Recommendation 2"],
  "riskFactors": ["Risk factor 1"]
}

Report Type: ${record.documentType}
Report Title: ${record.documentTitle}
Document Date: ${record.documentDate}

Guidelines:
- If this is a lab report (CBC/LFT/KFT), identify abnormal values with ranges
- For imaging reports, describe findings and severity
- Severity should be: low, medium, high, or critical
- Provide actionable recommendations
- Keep summary to 2-3 sentences
- Provide 3-5 key findings
- Provide 3-5 recommendations
- If you cannot determine abnormal values, use empty array

Important: Respond ONLY with valid JSON, no additional text.
    `;

    // Call Groq API for analysis
    const aiResponse = await axios.post(GROQ_API_URL, {
      model: GROQ_MODEL,
      messages: [{
        role: "user",
        content: analysisPrompt
      }],
      temperature: 0.7,
      max_tokens: 1500
    }, {
      headers: {
        "Authorization": `Bearer ${GROQ_API_KEY}`,
        "Content-Type": "application/json"
      }
    });

    // Parse AI response
    let analysisData = {};
    try {
      const responseText = aiResponse.data.choices[0].message.content;
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisData = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback to default analysis
        analysisData = createDefaultAnalysis(record);
      }
    } catch (parseError) {
      console.log("Parse error, using default response");
      analysisData = createDefaultAnalysis(record);
    }

    // Ensure all required fields exist
    analysisData.summary = analysisData.summary || "Report has been analyzed";
    analysisData.keyFindings = Array.isArray(analysisData.keyFindings) ? analysisData.keyFindings : [];
    analysisData.abnormalValues = Array.isArray(analysisData.abnormalValues) ? analysisData.abnormalValues : [];
    analysisData.recommendations = Array.isArray(analysisData.recommendations) ? analysisData.recommendations : [];
    analysisData.riskFactors = Array.isArray(analysisData.riskFactors) ? analysisData.riskFactors : [];

    // Validate abnormal values structure
    analysisData.abnormalValues = analysisData.abnormalValues.map(v => ({
      parameter: v.parameter || 'Unknown',
      value: v.value || 0,
      normalRange: v.normalRange || 'N/A',
      severity: ['low', 'medium', 'high', 'critical'].includes(v.severity) ? v.severity : 'medium'
    }));

    // Update record with AI analysis
    record.aiAnalysis = {
      summary: analysisData.summary,
      keyFindings: analysisData.keyFindings,
      abnormalValues: analysisData.abnormalValues,
      recommendations: analysisData.recommendations,
      riskFactors: analysisData.riskFactors,
      analyzedAt: new Date(),
      analysisModel: "Groq-Llama-3.1"
    };

    await record.save();

    return res.status(200).send({
      success: true,
      message: "Medical report analyzed successfully",
      analysis: record.aiAnalysis
    });

  } catch (error) {
    console.log("Analysis error:", error);
    return res.status(500).send({
      success: false,
      message: "Error analyzing medical report",
      error: error.message
    });
  }
};

/**
 * Helper function to create default analysis
 */
function createDefaultAnalysis(record) {
  return {
    summary: `This ${record.documentType?.replace(/_/g, ' ')} has been received and processed. Please review with your healthcare provider for detailed interpretation and clinical recommendations.`,
    keyFindings: [
      "Document successfully uploaded and processed",
      "Ready for medical review by healthcare provider",
      "Additional professional analysis recommended"
    ],
    abnormalValues: [],
    recommendations: [
      "Review with qualified healthcare provider",
      "Follow any medical advice provided by your doctor",
      "Schedule follow-up tests if recommended",
      "Maintain regular health monitoring",
      "Keep copies of your medical records"
    ],
    riskFactors: []
  };
}

module.exports = {
  generateHealthReportController,
  getFirstAidRecommendationController,
  aiHealthChatController,
  analyzeReportController,
};
