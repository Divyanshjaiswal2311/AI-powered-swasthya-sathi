/**
 * Medical Record Controller
 * 
 * Handles CRUD operations for medical records,
 * document uploads, and AI analysis
 */

const medicalRecordModel = require("../models/medicalRecordModel");
const healthProfileModel = require("../models/healthProfileModel");

/**
 * Upload Medical Record
 */
const uploadMedicalRecordController = async (req, res) => {
  try {
    const { userId, documentType, documentTitle, description, fileUrl, doctorName } = req.body;

    // Get health profile
    const healthProfile = await healthProfileModel.findOne({ userId });
    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    // Create medical record
    const medicalRecord = new medicalRecordModel({
      healthProfileId: healthProfile._id,
      documentType,
      documentTitle,
      description,
      fileUrl,
      fileName: req.body.fileName || documentTitle,
      documentDate: req.body.documentDate || new Date(),
      doctor: {
        name: doctorName || "Self-uploaded",
        hospital: req.body.hospital,
      },
      visibility: "private",
    });

    await medicalRecord.save();

    return res.status(200).send({
      success: true,
      message: "Medical record uploaded successfully",
      record: medicalRecord,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error uploading medical record",
      error: error.message,
    });
  }
};

/**
 * Get Medical Records
 */
const getMedicalRecordsController = async (req, res) => {
  try {
    const { userId } = req.body;

    const healthProfile = await healthProfileModel.findOne({ userId });
    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    const records = await medicalRecordModel
      .find({ healthProfileId: healthProfile._id })
      .sort({ documentDate: -1 });

    return res.status(200).send({
      success: true,
      message: "Medical records fetched successfully",
      records,
      totalRecords: records.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching medical records",
      error: error.message,
    });
  }
};

/**
 * Get Record by ID
 */
const getRecordByIdController = async (req, res) => {
  try {
    const { recordId } = req.params;

    const record = await medicalRecordModel.findById(recordId);

    if (!record) {
      return res.status(404).send({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Record fetched successfully",
      record,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching record",
      error: error.message,
    });
  }
};

/**
 * Update Medical Record
 */
const updateMedicalRecordController = async (req, res) => {
  try {
    const { recordId } = req.params;

    const record = await medicalRecordModel.findByIdAndUpdate(recordId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return res.status(404).send({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Record updated successfully",
      record,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error updating record",
      error: error.message,
    });
  }
};

/**
 * Delete Medical Record
 */
const deleteMedicalRecordController = async (req, res) => {
  try {
    const { recordId } = req.params;

    await medicalRecordModel.findByIdAndDelete(recordId);

    return res.status(200).send({
      success: true,
      message: "Record deleted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error deleting record",
      error: error.message,
    });
  }
};

/**
 * Share Record with Doctor
 */
const shareRecordController = async (req, res) => {
  try {
    const { recordId, doctorId, doctorName, doctorEmail } = req.body;

    const record = await medicalRecordModel.findByIdAndUpdate(
      recordId,
      {
        $push: {
          sharedWith: {
            userId: doctorId,
            userRole: "doctor",
            sharedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!record) {
      return res.status(404).send({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: `Record shared with ${doctorName}`,
      record,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error sharing record",
      error: error.message,
    });
  }
};

/**
 * Archive Record
 */
const archiveRecordController = async (req, res) => {
  try {
    const { recordId } = req.params;

    const record = await medicalRecordModel.findByIdAndUpdate(
      recordId,
      {
        isArchived: true,
        archivedAt: new Date(),
      },
      { new: true }
    );

    if (!record) {
      return res.status(404).send({
        success: false,
        message: "Record not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "Record archived successfully",
      record,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error archiving record",
      error: error.message,
    });
  }
};

/**
 * Get Records by Type
 */
const getRecordsByTypeController = async (req, res) => {
  try {
    const { userId } = req.body;
    const { documentType } = req.params;

    const healthProfile = await healthProfileModel.findOne({ userId });
    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    const records = await medicalRecordModel
      .find({
        healthProfileId: healthProfile._id,
        documentType,
      })
      .sort({ documentDate: -1 });

    return res.status(200).send({
      success: true,
      message: "Records fetched successfully",
      records,
      totalRecords: records.length,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      success: false,
      message: "Error fetching records",
      error: error.message,
    });
  }
};

module.exports = {
  uploadMedicalRecordController,
  getMedicalRecordsController,
  getRecordByIdController,
  updateMedicalRecordController,
  deleteMedicalRecordController,
  shareRecordController,
  archiveRecordController,
  getRecordsByTypeController,
};

