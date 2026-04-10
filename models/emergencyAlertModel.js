/**
 * Emergency Alert Model
 * 
 * Tracks emergency situations including blood emergencies,
 * medical emergencies, and coordinated response
 */

const mongoose = require("mongoose");

const emergencyAlertSchema = new mongoose.Schema(
  {
    // Alert Information
    alertType: {
      type: String,
      enum: [
        "blood_needed",
        "medical_emergency",
        "organ_donation",
        "trauma",
        "cardiac_emergency",
        "respiratory_emergency",
        "other"
      ],
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    // Severity & Urgency
    urgencyLevel: {
      type: String,
      enum: ["low", "medium", "high", "critical"],
      required: true,
    },

    timeframe: String,         // e.g., "Within 2 hours", "Immediately"

    // Blood Emergency Details
    bloodRequirements: [
      {
        bloodGroup: String,
        quantity: Number,       // In ML
        unit: { type: String, default: "ML" },
        type: {
          type: String,
          enum: ["whole_blood", "plasma", "platelets", "rbcs"],
        },
        status: {
          type: String,
          enum: ["needed", "partially_fulfilled", "fulfilled"],
        },
      },
    ],

    // Patient Information
    patient: {
      patientId: mongoose.Schema.Types.ObjectId,
      patientName: String,
      age: Number,
      bloodGroup: String,
      medicalConditions: [String],
      allergies: [String],
    },

    // Location & Contact
    location: {
      hospital: String,
      hospitalId: mongoose.Schema.Types.ObjectId,
      address: String,
      city: String,
      state: String,
      zipCode: String,
      latitude: Number,
      longitude: Number,
      mapUrl: String,
    },

    contactDetails: {
      primaryContact: String,
      primaryPhone: String,
      primaryEmail: String,
      doctorName: String,
      doctorPhone: String,
    },

    // Created By (Medical Professional)
    createdBy: {
      userId: mongoose.Schema.Types.ObjectId,
      name: String,
      role: String,           // Doctor, Nurse, Hospital Admin
      qualifications: [String],
    },

    // Response Coordination
    respondingOrganizations: [
      {
        orgId: mongoose.Schema.Types.ObjectId,
        orgName: String,
        status: {
          type: String,
          enum: ["notified", "responding", "fulfilled", "unable_to_respond"],
        },
        respondedAt: Date,
        assignedTo: String,
        contactNumber: String,
      },
    ],

    // Paramedic/Responder Tracking
    responders: [
      {
        responderId: mongoose.Schema.Types.ObjectId,
        responderName: String,
        responderType: String, // Paramedic, Ambulance, etc.
        status: {
          type: String,
          enum: ["en_route", "arrived", "departed"],
        },
        arrivalTime: Date,
        lastKnownLocation: {
          latitude: Number,
          longitude: Number,
          updatedAt: Date,
        },
        notes: String,
      },
    ],

    // Blood Bank Coordination
    bloodBankResponses: [
      {
        bloodBankId: mongoose.Schema.Types.ObjectId,
        bloodBankName: String,
        availableBlood: [
          {
            bloodGroup: String,
            quantity: Number,
            type: String,
          },
        ],
        estimatedDeliveryTime: Date,
        driver: String,
        vehicleNumber: String,
        status: {
          type: String,
          enum: ["available", "dispatched", "delivered"],
        },
      },
    ],

    // Timeline & Status Updates
    status: {
      type: String,
      enum: ["active", "partially_resolved", "resolved", "cancelled"],
      default: "active",
    },

    statusUpdates: [
      {
        timestamp: Date,
        status: String,
        updatedBy: String,
        comment: String,
      },
    ],

    // Resolution Details
    resolution: {
      resolvedAt: Date,
      resolvedBy: String,
      outcome: String,        // Successful, Partially, Failed
      notes: String,
      bloodFulfilled: {
        bloodGroup: String,
        quantityFulfilled: Number,
        sources: [String],     // Which blood banks supplied
      },
    },

    // Communication
    notificationsSent: [
      {
        recipientId: mongoose.Schema.Types.ObjectId,
        recipientName: String,
        recipientRole: String,
        notificationType: String, // SMS, Email, Push
        sentAt: Date,
        read: Boolean,
        readAt: Date,
      },
    ],

    // Alerts & Escalation
    escalationLevel: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      default: 1,
    },

    escalationHistory: [
      {
        escalatedAt: Date,
        escalatedTo: String,
        reason: String,
        escalatedBy: String,
      },
    ],

    // Cost & Resources
    estimatedCost: Number,
    actualCost: Number,
    resourcesUsed: [String],

    // Post-Emergency
    followUp: {
      required: Boolean,
      followUpDate: Date,
      notes: String,
    },

    // Feedback & Rating
    feedback: {
      rating: Number,         // 1-5
      comment: String,
      ratedAt: Date,
      ratedBy: mongoose.Schema.Types.ObjectId,
    },

    // Public Visibility
    isPublic: {
      type: Boolean,
      default: false,
    },

    // Statistics & Analytics
    responseTime: Number,      // In minutes
    completionTime: Number,    // In minutes
  },
  { timestamps: true }
);

// Index for faster queries
emergencyAlertSchema.index({ alertType: 1, status: 1, createdAt: -1 });
emergencyAlertSchema.index({ "location.latitude": "2dsphere", "location.longitude": "2dsphere" });
emergencyAlertSchema.index({ createdAt: -1 });

module.exports = mongoose.model("EmergencyAlert", emergencyAlertSchema);

