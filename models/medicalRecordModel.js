/**
 * Medical Record Model
 * 
 * Stores comprehensive medical records, reports, and documents
 * for patients and donors
 */

const mongoose = require("mongoose");

const medicalRecordSchema = new mongoose.Schema(
  {
    // Reference to health profile
    healthProfileId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HealthProfile",
      required: true,
    },

    // Document Information
    documentType: {
      type: String,
      enum: [
        "prescription",
        "lab_report",
        "imaging",
        "hospital_discharge",
        "consultation_notes",
        "vaccination_record",
        "diagnostic_report",
        "pathology_report",
        "other"
      ],
      required: true,
    },

    documentTitle: {
      type: String,
      required: true,
    },

    description: String,

    // Document Storage
    fileUrl: {
      type: String,
      required: true,
    },

    fileName: String,

    fileSize: Number, // In bytes

    mimeType: String,

    // Medical Information
    relatedCondition: String, // Which condition this record relates to

    doctor: {
      name: String,
      specialty: String,
      hospital: String,
      email: String,
    },

    lab: {
      name: String,
      location: String,
      accreditationNumber: String,
    },

    // Dates
    documentDate: {
      type: Date,
      required: true,
    },

    validUntil: Date, // Expiry date if applicable

    // AI Analysis
    aiAnalysis: {
      summary: String,           // AI-generated summary
      keyFindings: [String],     // Key points extracted
      abnormalValues: [
        {
          parameter: String,
          value: Number,
          normalRange: String,
          severity: {
            type: String,
            enum: ["low", "medium", "high", "critical"],
          },
        },
      ],
      recommendations: [String], // AI-suggested actions
      analyzedAt: Date,
      analysisModel: String,     // Which AI model was used
    },

    // Clinical Notes
    clinicalNotes: String,

    // Results/Findings
    results: {
      testName: String,
      testResult: String,
      normalRange: String,
      interpretation: String,
    },

    // Visibility & Sharing
    visibility: {
      type: String,
      enum: ["private", "doctors_only", "hospital", "shared"],
      default: "private",
    },

    sharedWith: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userRole: String,
        sharedAt: Date,
        sharedBy: mongoose.Schema.Types.ObjectId,
      },
    ],

    // Verification
    isVerified: {
      type: Boolean,
      default: false,
    },

    verifiedBy: String,      // Doctor or lab technician name
    verificationDate: Date,

    // Flags & Alerts
    requiresAttention: {
      type: Boolean,
      default: false,
    },

    priorityLevel: {
      type: String,
      enum: ["normal", "important", "urgent"],
      default: "normal",
    },

    // Comments & Collaboration
    comments: [
      {
        userId: mongoose.Schema.Types.ObjectId,
        userName: String,
        comment: String,
        commentDate: Date,
      },
    ],

    // Archive
    isArchived: {
      type: Boolean,
      default: false,
    },

    archivedAt: Date,

    // Metadata
    tags: [String], // For easy searching

    sourceSystem: String, // Where the record came from
  },
  { timestamps: true }
);

// Index for faster queries
medicalRecordSchema.index({ healthProfileId: 1, documentDate: -1 });
medicalRecordSchema.index({ documentType: 1 });
medicalRecordSchema.index({ tags: 1 });

module.exports = mongoose.model("MedicalRecord", medicalRecordSchema);

