/**
 * Emergency Alert Controller
 * 
 * Handles creation, management, and coordination of emergency alerts
 * for blood emergencies and medical emergencies
 */

const emergencyAlertModel = require("../models/emergencyAlertModel");
const healthProfileModel = require("../models/healthProfileModel");
const userModel = require("../models/userModel");
const mongoose = require("mongoose");

/**
 * Create Emergency Alert
 */
const createEmergencyAlertController = async (req, res) => {
  try {
    const { userId } = req.body;
    const {
      alertType,
      title,
      description,
      urgencyLevel,
      bloodRequirements,
      hospitalName,
      hospitalId,
      address,
      city,
      state,
      latitude,
      longitude,
      primaryContact,
      primaryPhone,
      doctorName,
    } = req.body;

    // Create emergency alert
    const alert = new emergencyAlertModel({
      alertType,
      title,
      description,
      urgencyLevel,
      bloodRequirements: bloodRequirements || [],
      location: {
        hospital: hospitalName,
        hospitalId,
        address,
        city,
        state,
        latitude,
        longitude,
      },
      contactDetails: {
        primaryContact,
        primaryPhone,
        doctorName,
      },
      createdBy: {
        userId,
        name: req.body.createdByName || "Medical Staff",
        role: "doctor",
      },
      status: "active",
    });

    await alert.save();

    // TODO: Send notifications to nearby blood banks and organizations
    // notifyBloodBanks(alert);

    return res.status(200).send({
      success: true,
      message: "Emergency alert created successfully",
      alert,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error creating emergency alert",
      error: error.message,
    });
  }
};

/**
 * Get Active Emergencies
 */
const getActiveEmergenciesController = async (req, res) => {
  try {
    const alerts = await emergencyAlertModel
      .find({ status: { $in: ["active", "partially_resolved"] } })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).send({
      success: true,
      message: "Active emergencies fetched",
      alerts,
      totalActive: alerts.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching emergencies",
      error: error.message,
    });
  }
};

/**
 * Get Emergency by ID
 */
const getEmergencyByIdController = async (req, res) => {
  try {
    const { alertId } = req.params;

    const alert = await emergencyAlertModel.findById(alertId);

    if (!alert) {
      return res.status(404).send({
        success: false,
        message: "Emergency alert not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Emergency alert fetched",
      alert,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching emergency",
      error: error.message,
    });
  }
};

/**
 * Update Emergency Status
 */
const updateEmergencyStatusController = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { status, comment } = req.body;

    const alert = await emergencyAlertModel.findByIdAndUpdate(
      alertId,
      {
        status,
        $push: {
          statusUpdates: {
            timestamp: new Date(),
            status,
            comment,
            updatedBy: req.body.updatedBy || "System",
          },
        },
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).send({
        success: false,
        message: "Emergency alert not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Emergency status updated",
      alert,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error updating emergency",
      error: error.message,
    });
  }
};

/**
 * Add Responder to Emergency
 */
const addResponderController = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { responderId, responderName, responderType, status } = req.body;

    const alert = await emergencyAlertModel.findByIdAndUpdate(
      alertId,
      {
        $push: {
          responders: {
            responderId,
            responderName,
            responderType,
            status: status || "en_route",
            arrivalTime: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).send({
        success: false,
        message: "Emergency alert not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Responder added to emergency",
      alert,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error adding responder",
      error: error.message,
    });
  }
};

/**
 * Add Blood Bank Response
 */
const addBloodBankResponseController = async (req, res) => {
  try {
    const { alertId } = req.params;
    const {
      bloodBankId,
      bloodBankName,
      availableBlood,
      estimatedDeliveryTime,
      driver,
      vehicleNumber,
    } = req.body;

    const alert = await emergencyAlertModel.findByIdAndUpdate(
      alertId,
      {
        $push: {
          bloodBankResponses: {
            bloodBankId,
            bloodBankName,
            availableBlood,
            estimatedDeliveryTime,
            driver,
            vehicleNumber,
            status: "dispatched",
          },
        },
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).send({
        success: false,
        message: "Emergency alert not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Blood bank response recorded",
      alert,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error adding blood bank response",
      error: error.message,
    });
  }
};

/**
 * Resolve Emergency
 */
const resolveEmergencyController = async (req, res) => {
  try {
    const { alertId } = req.params;
    const { outcome, notes, bloodFulfilled } = req.body;

    const alert = await emergencyAlertModel.findByIdAndUpdate(
      alertId,
      {
        status: "resolved",
        resolution: {
          resolvedAt: new Date(),
          outcome,
          notes,
          bloodFulfilled,
          resolvedBy: req.body.resolvedBy || "System",
        },
      },
      { new: true }
    );

    if (!alert) {
      return res.status(404).send({
        success: false,
        message: "Emergency alert not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Emergency resolved",
      alert,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error resolving emergency",
      error: error.message,
    });
  }
};

/**
 * Find Nearby Blood Banks
 */
const findNearbyBloodBanksController = async (req, res) => {
  try {
    const { latitude, longitude, maxDistance } = req.body;

    // Using geospatial query
    const bloodBanks = await emergencyAlertModel.find({
      "location.latitude": { $exists: true },
      "location.longitude": { $exists: true },
    });

    // Calculate distance (simplified Haversine formula)
    const nearby = bloodBanks
      .map((bb) => {
        const distance = calculateDistance(
          latitude,
          longitude,
          bb.location.latitude,
          bb.location.longitude
        );
        return {
          ...bb.toObject(),
          distance,
        };
      })
      .filter((bb) => bb.distance <= (maxDistance || 50))
      .sort((a, b) => a.distance - b.distance);

    return res.status(200).send({
      success: true,
      message: "Nearby blood banks found",
      bloodBanks: nearby.slice(0, 10),
      totalFound: nearby.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error finding nearby blood banks",
      error: error.message,
    });
  }
};

/**
 * Helper: Calculate Distance (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

module.exports = {
  createEmergencyAlertController,
  getActiveEmergenciesController,
  getEmergencyByIdController,
  updateEmergencyStatusController,
  addResponderController,
  addBloodBankResponseController,
  resolveEmergencyController,
  findNearbyBloodBanksController,
};

