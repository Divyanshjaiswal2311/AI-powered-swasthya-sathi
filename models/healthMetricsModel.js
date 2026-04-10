/**
 * Health Metrics Model
 * 
 * Tracks vital signs and health metrics over time
 * Can be populated from wearables, manual entry, or medical devices
 */

const mongoose = require("mongoose");

const healthMetricsSchema = new mongoose.Schema(
  {
    // Reference to health profile
    healthProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthProfile",
      required: true,
    },

    // Metric Date & Time
    metricDate: {
      type: Date,
      required: true,
      default: Date.now,
    },

    // Data Source
    dataSource: {
      type: String,
      enum: ["manual_entry", "wearable_device", "medical_device", "hospital", "clinic"],
      default: "manual_entry",
    },

    deviceType: String,        // Apple Watch, Fitbit, Omron BP Monitor, etc.
    deviceId: String,          // Serial number or identifier

    // Vital Signs
    vitals: {
      bloodPressure: {
        systolic: Number,      // mmHg
        diastolic: Number,     // mmHg
        timestamp: Date,
      },

      heartRate: {
        bpm: Number,           // Beats per minute
        rhythm: {
          type: String,
          enum: ["regular", "irregular", "arrhythmia"],
        },
        timestamp: Date,
      },

      temperature: {
        celsius: Number,
        fahrenheit: Number,
        timestamp: Date,
      },

      respiratoryRate: {
        breaths: Number,       // Breaths per minute
        timestamp: Date,
      },

      oxygenSaturation: {
        percentage: Number,    // SpO2 %
        timestamp: Date,
      },

      bloodGlucose: {
        value: Number,         // mg/dL
        mealState: {
          type: String,
          enum: ["fasting", "pre_meal", "post_meal"],
        },
        timestamp: Date,
      },
    },

    // Body Composition
    bodyComposition: {
      weight: {
        kg: Number,
        timestamp: Date,
      },

      height: Number,          // cm

      bmi: {
        value: Number,
        category: {
          type: String,
          enum: ["underweight", "normal", "overweight", "obese"],
        },
        timestamp: Date,
      },

      bodyFatPercentage: {
        percentage: Number,
        timestamp: Date,
      },

      muscleMass: {
        percentage: Number,
        timestamp: Date,
      },

      waterContent: {
        percentage: Number,
        timestamp: Date,
      },
    },

    // Activity & Movement
    activity: {
      steps: Number,
      distance: Number,        // km
      calories: Number,        // kcal burned
      activeMinutes: Number,   // Minutes of activity
      activityType: String,    // Walking, Running, Cycling, etc.
      intensity: {
        type: String,
        enum: ["light", "moderate", "vigorous"],
      },
      timestamp: Date,
    },

    // Sleep Data
    sleep: {
      duration: Number,        // Hours
      quality: {
        type: String,
        enum: ["poor", "fair", "good", "excellent"],
      },
      deepSleep: Number,       // Minutes
      lightSleep: Number,      // Minutes
      remSleep: Number,        // Minutes
      awakenings: Number,
      timestamp: Date,
    },

    // Stress & Mental Health
    stress: {
      stressLevel: {
        type: String,
        enum: ["low", "moderate", "high"],
      },
      stressScore: Number,     // 0-100
      moodScore: Number,       // 0-100
      anxiety: Number,         // 0-100
      timestamp: Date,
    },

    // Hydration
    hydration: {
      waterIntake: Number,     // ml
      timestamp: Date,
    },

    // Nutrition
    nutrition: {
      calorieIntake: Number,   // kcal
      carbs: Number,           // grams
      protein: Number,         // grams
      fat: Number,             // grams
      fiber: Number,           // grams
      sodium: Number,          // mg
      timestamp: Date,
    },

    // Menstrual Cycle (if applicable)
    menstrualCycle: {
      cycleDay: Number,
      flow: String,            // Light, normal, heavy
      symptoms: [String],
      timestamp: Date,
    },

    // Quality Assessment
    qualityMetrics: {
      isOutlier: Boolean,      // Flag for abnormal readings
      confidence: Number,      // 0-100
      validationStatus: {
        type: String,
        enum: ["valid", "invalid", "needs_review"],
        default: "valid",
      },
    },

    // Notes & Context
    notes: String,             // User notes about the reading
    context: String,           // Morning, after workout, after meals, etc.

    // Alert Flags
    alerts: [
      {
        alertType: String,     // e.g., "high_bp", "low_oxygen"
        severity: {
          type: String,
          enum: ["info", "warning", "critical"],
        },
        message: String,
        actionRequired: Boolean,
      },
    ],

    // Normalization & Baseline
    isBaseline: Boolean,       // Flag for baseline measurement
    deviationFromBaseline: Number, // Percentage deviation

    // Manual Entry
    enteredBy: {
      userId: mongoose.Schema.Types.ObjectId,
      timestamp: Date,
    },

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedBy: String,
    verificationDate: Date,

    // Sharing & Privacy
    isPrivate: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Index for faster queries
healthMetricsSchema.index({ healthProfileId: 1, metricDate: -1 });
healthMetricsSchema.index({ metricDate: -1 });
healthMetricsSchema.index({ dataSource: 1 });
healthMetricsSchema.index({ "alerts.severity": 1 });

module.exports = mongoose.model("HealthMetrics", healthMetricsSchema);

