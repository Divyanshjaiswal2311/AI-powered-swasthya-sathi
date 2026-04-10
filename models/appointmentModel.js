/**
 * Appointment Model
 * 
 * Manages doctor consultations and medical appointments
 * Supports both in-person and telemedicine consultations
 */

const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    // Appointment Details
    appointmentType: {
      type: String,
      enum: ["in_person", "video_consultation", "phone_consultation", "follow_up"],
      required: true,
    },

    title: String,

    description: String,

    // Doctor Information
    doctor: {
      doctorId: mongoose.Schema.Types.ObjectId,
      name: String,
      specialization: String,
      qualification: [String],
      experience: Number,      // Years
      hospital: String,
      hospitalId: mongoose.Schema.Types.ObjectId,
      photo: String,
      phone: String,
      email: String,
    },

    // Patient Information
    patient: {
      patientId: mongoose.Schema.Types.ObjectId,
      name: String,
      age: Number,
      phone: String,
      email: String,
      bloodGroup: String,
    },

    // Appointment Scheduling
    scheduledDate: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      required: true,          // HH:MM format
    },

    endTime: String,           // HH:MM format

    duration: Number,          // In minutes

    timezone: {
      type: String,
      default: "UTC",
    },

    // Location (for in-person)
    location: {
      hospitalName: String,
      clinic: String,
      address: String,
      city: String,
      state: String,
      room: String,
      landmarks: String,
    },

    // Reason for Consultation
    reason: String,

    relatedCondition: String,

    previousRecords: [
      {
        recordId: mongoose.Schema.Types.ObjectId,
        recordType: String,
      },
    ],

    // Status & Confirmation
    status: {
      type: String,
      enum: ["scheduled", "confirmed", "cancelled", "completed", "no_show", "rescheduled"],
      default: "scheduled",
    },

    confirmationStatus: {
      type: String,
      enum: ["pending", "confirmed_by_doctor", "confirmed_by_patient", "confirmed_both"],
    },

    patientConfirmed: {
      confirmed: Boolean,
      confirmedAt: Date,
    },

    doctorConfirmed: {
      confirmed: Boolean,
      confirmedAt: Date,
    },

    // Cancellation Details
    cancellation: {
      cancelledAt: Date,
      cancelledBy: String,     // patient or doctor
      reason: String,
      refundStatus: String,    // if applicable
    },

    // Telemedicine Details
    telemedicine: {
      platformUsed: String,    // Zoom, Google Meet, Custom, etc.
      meetingLink: String,
      meetingId: String,
      password: String,
      recordingUrl: String,
      recordingPermission: Boolean,
    },

    // Pre-Appointment
    questionnaire: {
      currentSymptoms: [String],
      medicationList: [String],
      labReportsAttached: [String],
      previousTreatment: String,
      expectations: String,
    },

    preparationInstructions: [String],

    // During Appointment
    consultationNotes: {
      patientHistory: String,
      physicalExamination: String,
      preliminary Diagnosis: String,
      discussedTreatments: [String],
    },

    // Post-Appointment
    prescription: {
      prescriptionId: mongoose.Schema.Types.ObjectId,
      medications: [
        {
          name: String,
          dosage: String,
          frequency: String,
          duration: String,
        },
      ],
    },

    followUpRequired: Boolean,

    followUpInstructions: String,

    recommendedTests: [
      {
        testName: String,
        urgency: String,
        labReference: String,
      },
    ],

    referrals: [
      {
        specialistName: String,
        specialization: String,
        reason: String,
        urgency: String,
      },
    ],

    notes: String,

    // Reminders
    reminders: {
      oneWeekBefore: {
        sent: Boolean,
        sentAt: Date,
      },
      oneDayBefore: {
        sent: Boolean,
        sentAt: Date,
      },
      oneHourBefore: {
        sent: Boolean,
        sentAt: Date,
      },
    },

    // Payment Information
    payment: {
      consultationFee: Number,
      paymentMethod: String,
      paymentStatus: {
        type: String,
        enum: ["pending", "completed", "refunded"],
      },
      transactionId: String,
      paidAt: Date,
    },

    // Rating & Feedback
    rating: {
      doctorRating: Number,    // 1-5
      appointmentRating: Number, // 1-5
      comment: String,
      ratedAt: Date,
    },

    // Follow-up Appointments
    linkedAppointments: [
      {
        appointmentId: mongoose.Schema.Types.ObjectId,
        type: String,          // Follow-up, Referral, etc.
      },
    ],

    // Document Access
    documentsShared: [
      {
        documentId: mongoose.Schema.Types.ObjectId,
        sharedAt: Date,
      },
    ],

    // Emergency Contact
    emergencyContact: {
      name: String,
      relationship: String,
      phone: String,
    },

    // Insurance
    insuranceCovered: Boolean,
    insuranceDetails: String,

    // Accessibility Features
    accessibilityNeeds: [String],

    // Consent & Compliance
    consentDocuments: [
      {
        documentName: String,
        signedAt: Date,
        consentGiven: Boolean,
      },
    ],
  },
  { timestamps: true }
);

// Index for faster queries
appointmentSchema.index({ "doctor.doctorId": 1, scheduledDate: 1 });
appointmentSchema.index({ "patient.patientId": 1, scheduledDate: -1 });
appointmentSchema.index({ status: 1, scheduledDate: 1 });
appointmentSchema.index({ scheduledDate: 1 });

module.exports = mongoose.model("Appointment", appointmentSchema);

