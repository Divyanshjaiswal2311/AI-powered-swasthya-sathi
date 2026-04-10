/**
 * First Aid Guide Model
 * 
 * Comprehensive first aid database with symptoms,
 * treatment protocols, and emergency procedures
 */

const mongoose = require("mongoose");

const firstAidGuideSchema = new mongoose.Schema(
  {
    // Condition/Emergency Type
    conditionName: {
      type: String,
      required: true,
      unique: true,
    },

    category: {
      type: String,
      enum: [
        "cardiac",
        "respiratory",
        "injury",
        "poisoning",
        "allergic_reaction",
        "infection",
        "neurological",
        "gastrointestinal",
        "environmental",
        "psychological",
        "other"
      ],
      required: true,
    },

    severity: {
      type: String,
      enum: ["minor", "moderate", "severe", "life_threatening"],
      required: true,
    },

    // Symptoms & Recognition
    symptoms: [
      {
        symptom: String,
        description: String,
        onset: String,         // Immediate, gradual, etc.
      },
    ],

    // Initial Assessment
    initialAssessment: {
      checkpoints: [String],  // What to check first
      vitalSignsToMonitor: [String],
      warningSignsRequiringEmergency: [String],
    },

    // First Aid Steps
    firstAidSteps: [
      {
        stepNumber: Number,
        stepName: String,
        description: String,
        duration: String,      // How long to perform
        caution: String,       // Important warnings
        images: [String],      // URLs to instructional images
        video: String,         // URL to tutorial video
      },
    ],

    // Do's and Don'ts
    dos: [String],
    donts: [String],

    // Equipment & Supplies Needed
    requiredSupplies: [
      {
        item: String,
        quantity: Number,
        unit: String,
        notes: String,
      },
    ],

    // When to Call Emergency
    emergencyIndications: [
      {
        indicator: String,
        actionToTake: String,
        emergencyNumber: String,
      },
    ],

    // Recovery & Aftercare
    recoverySteps: [
      {
        step: String,
        duration: String,
        instructions: String,
      },
    ],

    // Complications to Watch For
    complications: [
      {
        complication: String,
        signs: [String],
        action: String,
      },
    ],

    // Related Conditions
    relatedConditions: [String],

    // Medication Information
    commonMedications: [
      {
        medicationName: String,
        dosage: String,
        application: String,
        cautions: String,
      },
    ],

    // Special Considerations
    specialConsiderations: {
      pregnant: String,
      children: String,
      elderly: String,
      allergic: String,
    },

    // Prevention Tips
    preventionTips: [String],

    // Statistics
    statistics: {
      incidenceRate: String,
      mostAffectedGroup: String,
      seasonality: String,
    },

    // Professional Guidance
    professionalNote: String,

    // References & Sources
    references: [
      {
        source: String,
        url: String,
        organization: String,
      },
    ],

    // Content Quality
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedBy: {
      name: String,
      qualification: String,
      date: Date,
    },

    lastUpdated: Date,

    updateHistory: [
      {
        updatedAt: Date,
        updatedBy: String,
        changes: String,
      },
    ],

    // Accessibility
    languages: [String],      // Available in which languages
    readabilityLevel: String, // Easy, Medium, Advanced

    // Related Resources
    relatedGuides: [
      {
        guideId: mongoose.Schema.Types.ObjectId,
        guideName: String,
      },
    ],

    // Community Feedback
    userRatings: {
      averageRating: Number, // 0-5
      totalRatings: Number,
      helpful: Number,
      notHelpful: Number,
    },

    // AI Integration
    aiSuitability: {
      isAiRecommendable: Boolean,
      aiUseCase: String,
    },
  },
  { timestamps: true }
);

// Index for faster queries
firstAidGuideSchema.index({ conditionName: "text", category: 1 });
firstAidGuideSchema.index({ category: 1, severity: 1 });

module.exports = mongoose.model("FirstAidGuide", firstAidGuideSchema);

