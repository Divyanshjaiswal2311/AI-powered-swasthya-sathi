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
    const { userId, documentType, documentTitle, description, doctorName, documentDate, hospital } = req.body;

    // Get or create health profile using upsert to avoid duplicate key errors
    let healthProfile = await healthProfileModel.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          dateOfBirth: new Date(2000, 0, 1), // Default to Jan 1, 2000
          gender: "Other",
          bloodType: "O+", // Default blood type
          vitals: {
            weight: 0,
            height: 0,
          },
        },
      },
      { upsert: true, new: true }
    );

    // For now, we'll use a mock file URL or store file data
    // In production, you would use cloud storage like AWS S3, Cloudinary, or Firebase
    let fileUrl = `https://storage.example.com/medical-records/${userId}/${Date.now()}_${documentTitle}`;
    let fileName = `${documentTitle}.pdf`;
    let mimeType = 'application/octet-stream';

    // If file is provided via FormData, extract file metadata
    if (req.files && req.files.file) {
      const file = req.files.file;
      fileName = file.name;
      mimeType = file.mimetype;
      // In production: upload to cloud storage and get the URL
      // For now, we'll use a placeholder URL
      fileUrl = `/uploads/medical-records/${userId}/${fileName}`;
    } else if (req.file) {
      // If using multer
      fileName = req.file.originalname;
      mimeType = req.file.mimetype;
      fileUrl = `/uploads/medical-records/${userId}/${req.file.filename}`;
    }

    // Create medical record
    const medicalRecord = new medicalRecordModel({
      healthProfileId: healthProfile._id,
      documentType: documentType || 'other',
      documentTitle: documentTitle || fileName,
      description: description || '',
      fileUrl,
      fileName,
      mimeType,
      fileSize: req.file?.size || 0,
      documentDate: documentDate || new Date(),
      doctor: {
        name: doctorName || "Self-uploaded",
        hospital: hospital || '',
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
    console.log("Upload error:", error);
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

    // Get or create health profile using upsert to avoid duplicate key errors
    let healthProfile = await healthProfileModel.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          dateOfBirth: new Date(2000, 0, 1), // Default to Jan 1, 2000
          gender: "Other",
          bloodType: "O+", // Default blood type
          vitals: {
            weight: 0,
            height: 0,
          },
        },
      },
      { upsert: true, new: true }
    );

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

    // Get or create health profile using upsert to avoid duplicate key errors
    let healthProfile = await healthProfileModel.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          dateOfBirth: new Date(2000, 0, 1), // Default to Jan 1, 2000
          gender: "Other",
          bloodType: "O+", // Default blood type
          vitals: {
            weight: 0,
            height: 0,
          },
        },
      },
      { upsert: true, new: true }
    );

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

