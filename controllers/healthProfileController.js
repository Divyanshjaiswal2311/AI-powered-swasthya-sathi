/**
 * Health Profile Controller
 * 
 * Handles CRUD operations for user health profiles
 * Including medical history, vitals, and eligibility assessment
 */

const healthProfileModel = require("../models/healthProfileModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

/**
 * Create or Update Health Profile
 */
const createHealthProfileController = async (req, res) => {
  try {
    const { userId } = req.body;

    // Validate user exists
    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Check if profile already exists
    let healthProfile = await healthProfileModel.findOne({ userId });

    if (healthProfile) {
      // Update existing profile
      healthProfile = await healthProfileModel.findByIdAndUpdate(
        healthProfile._id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      // Create new profile
      healthProfile = new healthProfileModel({
        ...req.body,
        userId,
      });
      await healthProfile.save();
    }

    return res.status(200).send({
      success: true,
      message: "Health profile saved successfully",
      healthProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error creating/updating health profile",
      error: error.message,
    });
  }
};

/**
 * Get Health Profile
 */
const getHealthProfileController = async (req, res) => {
  try {
    const { userId } = req.body;

    const healthProfile = await healthProfileModel.findOne({ userId });

    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Health profile fetched successfully",
      healthProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching health profile",
      error: error.message,
    });
  }
};

/**
 * Update Vitals
 */
const updateVitalsController = async (req, res) => {
  try {
    const { userId } = req.body;
    const { vitals } = req.body;

    // Add timestamp
    vitals.lastUpdated = new Date();

    const healthProfile = await healthProfileModel.findOneAndUpdate(
      { userId },
      { vitals },
      { new: true }
    );

    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Vitals updated successfully",
      healthProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error updating vitals",
      error: error.message,
    });
  }
};

/**
 * Add Medical Condition
 */
const addConditionController = async (req, res) => {
  try {
    const { userId } = req.body;
    const { condition, diagnosedDate, status, severity } = req.body;

    const healthProfile = await healthProfileModel.findOne({ userId });

    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    healthProfile.medicalConditions.push({
      condition,
      diagnosedDate,
      status,
      severity,
    });

    await healthProfile.save();

    return res.status(200).send({
      success: true,
      message: "Medical condition added successfully",
      healthProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error adding medical condition",
      error: error.message,
    });
  }
};

/**
 * Add Allergy
 */
const addAllergyController = async (req, res) => {
  try {
    const { userId } = req.body;
    const { allergen, severity, reaction } = req.body;

    const healthProfile = await healthProfileModel.findOne({ userId });

    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    healthProfile.allergies.push({
      allergen,
      severity,
      reaction,
      lastOccurrence: new Date(),
    });

    await healthProfile.save();

    return res.status(200).send({
      success: true,
      message: "Allergy added successfully",
      healthProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error adding allergy",
      error: error.message,
    });
  }
};

/**
 * Add Medication
 */
const addMedicationController = async (req, res) => {
  try {
    const { userId } = req.body;
    const { name, dosage, frequency, startDate, endDate, prescribedBy, reason } = req.body;

    const healthProfile = await healthProfileModel.findOne({ userId });

    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    healthProfile.medications.push({
      name,
      dosage,
      frequency,
      startDate,
      endDate,
      prescribedBy,
      reason,
    });

    await healthProfile.save();

    return res.status(200).send({
      success: true,
      message: "Medication added successfully",
      healthProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error adding medication",
      error: error.message,
    });
  }
};

/**
 * Get Health Summary
 */
const getHealthSummaryController = async (req, res) => {
  try {
    const { userId } = req.body;

    const healthProfile = await healthProfileModel.findOne({ userId });

    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    // Generate summary
    const summary = {
      userId,
      age: calculateAge(healthProfile.dateOfBirth),
      bloodType: healthProfile.bloodType,
      gender: healthProfile.gender,
      bmi: healthProfile.vitals?.bmi || "Not recorded",
      bloodPressure: healthProfile.vitals?.systolic
        ? `${healthProfile.vitals.systolic}/${healthProfile.vitals.diastolic}`
        : "Not recorded",
      heartRate: healthProfile.vitals?.heartRate || "Not recorded",
      activeConditions: healthProfile.medicalConditions.filter((c) => c.status === "active"),
      allergies: healthProfile.allergies,
      currentMedications: healthProfile.medications.filter(
        (m) => !m.endDate || new Date(m.endDate) > new Date()
      ),
      donationEligibility: healthProfile.donationEligibility,
    };

    return res.status(200).send({
      success: true,
      message: "Health summary fetched successfully",
      summary,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching health summary",
      error: error.message,
    });
  }
};

/**
 * Check Donation Eligibility
 */
const checkDonationEligibilityController = async (req, res) => {
  try {
    const { userId } = req.body;

    const healthProfile = await healthProfileModel.findOne({ userId });

    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    // Eligibility criteria
    const age = calculateAge(healthProfile.dateOfBirth);
    const bmi = healthProfile.vitals?.bmi || 0;
    const hasExcludingConditions = healthProfile.medicalConditions.some((c) =>
      ["HIV", "Hepatitis", "Syphilis", "Malaria"].includes(c.condition)
    );
    const hasSevereAllergies = healthProfile.allergies.some((a) => a.severity === "severe");
    const minimumWeight = 50; // kg
    const weight = healthProfile.vitals?.weight || 0;

    let isEligible = true;
    let ineligibilityReasons = [];
    let eligibilityScore = 100;

    // Age check (18-65 typically)
    if (age < 18 || age > 65) {
      isEligible = false;
      ineligibilityReasons.push(`Age must be between 18-65 years (Current: ${age})`);
      eligibilityScore -= 30;
    }

    // Weight check
    if (weight < minimumWeight) {
      isEligible = false;
      ineligibilityReasons.push(`Minimum weight of ${minimumWeight}kg required (Current: ${weight}kg)`);
      eligibilityScore -= 25;
    }

    // Medical conditions
    if (hasExcludingConditions) {
      isEligible = false;
      ineligibilityReasons.push("Medical conditions contraindicate donation");
      eligibilityScore -= 40;
    }

    // Allergies
    if (hasSevereAllergies) {
      eligibilityScore -= 15;
    }

    // BMI check
    if (bmi < 18.5 || bmi > 29.9) {
      eligibilityScore -= 10;
    }

    const eligibilityData = {
      isEligible,
      eligibilityScore: Math.max(0, eligibilityScore),
      ineligibilityReason: isEligible ? "" : ineligibilityReasons.join(", "),
      nextEligibleDate: isEligible
        ? new Date(Date.now() + 56 * 24 * 60 * 60 * 1000)
        : new Date(),
    };

    healthProfile.donationEligibility = eligibilityData;
    await healthProfile.save();

    return res.status(200).send({
      success: true,
      message: "Eligibility check completed",
      eligibilityData,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error checking eligibility",
      error: error.message,
    });
  }
};

/**
 * Helper function to calculate age
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
  createHealthProfileController,
  getHealthProfileController,
  updateVitalsController,
  addConditionController,
  addAllergyController,
  addMedicationController,
  getHealthSummaryController,
  checkDonationEligibilityController,
};

