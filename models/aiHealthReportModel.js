/**
 * AI Health Report Model
 * 
 * Stores AI-generated health summaries and analysis reports
 * Powered by GPT-4 and ML models
 */

const mongoose = require("mongoose");

const aiHealthReportSchema = new mongoose.Schema(
  {
    // Reference to health profile
    healthProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthProfile",
      required: true,
    },

    // Report Information
    reportType: {
      type: String,
      enum: [
        "health_summary",
        "risk_assessment",
        "donation_eligibility",
        "wellness_recommendation",
        "trend_analysis",
        "document_summary",
        "medication_analysis",
        "allergy_analysis"
      ],
      required: true,
    },

    title: String,

    // Report Content
    executiveSummary: String,  // Brief overview

    mainFindings: [
      {
        finding: String,
        importance: {
          type: String,
          enum: ["low", "medium", "high", "critical"],
        },
        details: String,
      },
    ],

    riskFactors: [
      {
        riskFactor: String,
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
        },
        mitigation: String,     // How to reduce this risk
      },
    ],

    recommendations: [
      {
        recommendation: String,
        category: {
          type: String,
          enum: ["lifestyle", "medical", "monitoring", "preventive"],
        },
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
        },
        timeframe: String,      // e.g., "Immediate", "Within 1 month"
      },
    ],

    // Health Metrics Analysis
    metricsAnalysis: {
      vitals: {
        status: String,        // Healthy, At-Risk, Concerning
        interpretation: String,
      },
      weight: {
        status: String,
        bmiCategory: String,   // Underweight, Normal, Overweight, Obese
        recommendation: String,
      },
      cardiovascular: {
        status: String,
        bloodPressure: String,
        heartRate: String,
      },
    },

    // Condition-Specific Analysis
    conditionAnalysis: [
      {
        condition: String,
        status: String,        // Controlled, Uncontrolled, Resolved
        analysis: String,
        treatmentReview: String,
        nextReview: Date,
      },
    ],

    // Medication Review
    medicationReview: {
      summary: String,
      drugInteractions: [
        {
          drug1: String,
          drug2: String,
          interaction: String,
          severity: {
            type: String,
            enum: ["mild", "moderate", "severe"],
          },
          recommendation: String,
        },
      ],
      sideEffectMonitoring: [String],
      adherenceScore: Number, // 0-100
    },

    // Allergy Assessment
    allergyAssessment: {
      totalAllergies: Number,
      severeAllergies: [String],
      crossReactivity: [
        {
          allergen: String,
          relatedAllergens: [String],
        },
      ],
      managementTips: [String],
    },

    // Donation Eligibility (if applicable)
    donationEligibility: {
      isEligible: Boolean,
      eligibilityScore: Number, // 0-100
      reason: String,
      nextEligibleDate: Date,
      suggestedActions: [String],
    },

    // Lifestyle Assessment
    lifestyleAssessment: {
      smoker: {
        status: String,
        recommendation: String,
      },
      alcohol: {
        status: String,
        recommendation: String,
      },
      exercise: {
        status: String,
        targetMinutes: Number,
        recommendation: String,
      },
      diet: {
        status: String,
        recommendation: String,
      },
      sleep: {
        status: String,
        targetHours: Number,
        recommendation: String,
      },
      stress: {
        status: String,
        managementTips: [String],
      },
    },

    // AI Model Information
    aiModel: {
      modelName: String,     // e.g., "GPT-4", "LLaMA2", "Custom-ML"
      modelVersion: String,
      confidence: Number,    // 0-100 confidence score
      processingTime: Number, // In milliseconds
    },

    // Data Sources Used
    dataSourcesUsed: [
      {
        source: String,       // health_profile, medical_record, lab_report, etc.
        sourceId: mongoose.Schema.Types.ObjectId,
        dateUsed: Date,
      },
    ],

    // Report Period
    reportPeriodStart: Date,
    reportPeriodEnd: Date,

    // Follow-up Actions
    followUpActions: [
      {
        action: String,
        dueDate: Date,
        assignedTo: String,
        priority: {
          type: String,
          enum: ["low", "medium", "high"],
        },
        completed: Boolean,
        completedDate: Date,
      },
    ],

    // Comparison with Previous Reports
    comparisons: {
      previousReport: mongoose.Schema.Types.ObjectId,
      changes: [
        {
          metric: String,
          previousValue: String,
          currentValue: String,
          trend: {
            type: String,
            enum: ["improved", "stable", "declined"],
          },
        },
      ],
    },

    // Regeneration & Versioning
    version: { type: Number, default: 1 },
    isLatest: { type: Boolean, default: true },
    regenerationHistory: [
      {
        regeneratedAt: Date,
        regeneratedBy: mongoose.Schema.Types.ObjectId,
        reason: String,
      },
    ],

    // Alerts & Notifications
    criticalAlerts: [
      {
        alert: String,
        severity: {
          type: String,
          enum: ["warning", "critical"],
        },
        actionRequired: Boolean,
      },
    ],

    // Sharing & Permissions
    sharedWith: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userRole: String,
        sharedAt: Date,
      },
    ],

    // Report Status
    status: {
      type: String,
      enum: ["draft", "completed", "reviewed", "archived"],
      default: "completed",
    },

    reviewedBy: {
      doctorId: mongoose.Schema.Types.ObjectId,
      doctorName: String,
      reviewDate: Date,
      feedback: String,
    },
  },
  { timestamps: true }
);

// Index for faster queries
aiHealthReportSchema.index({ healthProfileId: 1, createdAt: -1 });
aiHealthReportSchema.index({ reportType: 1 });
aiHealthReportSchema.index({ isLatest: 1 });

module.exports = mongoose.model("AIHealthReport", aiHealthReportSchema);

