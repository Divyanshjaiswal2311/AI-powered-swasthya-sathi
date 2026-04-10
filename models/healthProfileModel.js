/**
 * Health Profile Model
 * 
 * Comprehensive health profile for donors and patients
 * Tracks medical history, conditions, allergies, and vitals
 */

const mongoose = require("mongoose");

const healthProfileSchema = new mongoose.Schema(
  {
    // Reference to user
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
      unique: true,
    },

    // Basic Health Information
    dateOfBirth: {
      type: Date,
      required: true,
    },

    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },

    bloodType: {
      type: String,
      enum: ["O+", "O-", "AB+", "AB-", "A+", "A-", "B+", "B-"],
      required: true,
    },

    // Vital Signs (Latest)
    vitals: {
      systolic: Number,        // Blood pressure systolic
      diastolic: Number,       // Blood pressure diastolic
      heartRate: Number,       // BPM
      temperature: Number,     // Celsius
      respiratoryRate: Number, // Breaths per minute
      weight: Number,          // KG
      height: Number,          // CM
      bmi: Number,             // Calculated BMI
      lastUpdated: Date,
    },

    // Medical Conditions
    medicalConditions: [
      {
        condition: String,     // e.g., Diabetes, Hypertension
        diagnosedDate: Date,
        status: {
          type: String,
          enum: ["active", "controlled", "resolved"],
          default: "active",
        },
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
        },
      },
    ],

    // Allergies
    allergies: [
      {
        allergen: String,      // Drug, food, material allergy
        severity: {
          type: String,
          enum: ["mild", "moderate", "severe"],
        },
        reaction: String,      // Symptoms of reaction
        lastOccurrence: Date,
      },
    ],

    // Medications
    medications: [
      {
        name: String,
        dosage: String,
        frequency: String,     // Daily, twice daily, etc.
        startDate: Date,
        endDate: Date,
        prescribedBy: String,  // Doctor name
        reason: String,
      },
    ],

    // Past Medical History
    surgeries: [
      {
        name: String,
        date: Date,
        hospital: String,
        outcome: String,
      },
    ],

    // Donation & Health Metrics
    donationEligibility: {
      isEligible: Boolean,
      lastEligibilityCheck: Date,
      nextEligibleDate: Date,
      ineligibilityReason: String,
      eligibilityScore: Number, // 0-100
    },

    // Lifestyle Factors
    lifestyle: {
      smoker: Boolean,
      alcoholConsumption: {
        type: String,
        enum: ["none", "occasional", "regular", "heavy"],
      },
      exerciseFrequency: {
        type: String,
        enum: ["none", "occasional", "regular", "daily"],
      },
      dietType: {
        type: String,
        enum: ["vegetarian", "non-vegetarian", "vegan", "mixed"],
      },
    },

    // Lab Test Results (Latest)
    labTests: [
      {
        testName: String,
        value: Number,
        unit: String,
        normalRange: String,
        date: Date,
        laboratory: String,
        status: {
          type: String,
          enum: ["normal", "abnormal", "critical"],
        },
      },
    ],

    // Emergency Contacts
    emergencyContacts: [
      {
        name: String,
        relationship: String,
        phone: String,
        email: String,
      },
    ],

    // Health Risk Assessment
    riskAssessment: {
      overallRisk: {
        type: String,
        enum: ["low", "medium", "high"],
      },
      riskFactors: [String],
      calculatedDate: Date,
      nextAssessmentDate: Date,
    },

    // Insurance Information
    insurance: {
      provider: String,
      policyNumber: String,
      groupNumber: String,
      coverageStartDate: Date,
      coverageEndDate: Date,
    },

    // Privacy Settings
    privacySettings: {
      shareWithDoctors: { type: Boolean, default: true },
      shareWithHospitals: { type: Boolean, default: true },
      allowAIAnalysis: { type: Boolean, default: true },
      allowResearch: { type: Boolean, default: false },
    },

    // Consent & Agreement
    hasConsentedToDataUsage: {
      type: Boolean,
      default: false,
    },

    consentDate: Date,
  },
  { timestamps: true }
);

// Calculate BMI automatically
healthProfileSchema.pre("save", function (next) {
  if (this.vitals && this.vitals.weight && this.vitals.height) {
    const heightInMeters = this.vitals.height / 100;
    this.vitals.bmi = (this.vitals.weight / (heightInMeters * heightInMeters)).toFixed(2);
  }
  next();
});

module.exports = mongoose.model("HealthProfile", healthProfileSchema);

