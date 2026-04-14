/**
 * Medical Record Controller
 */

const medicalRecordModel = require("../models/medicalRecordModel");
const healthProfileModel = require("../models/healthProfileModel");

/**
 * Upload Medical Record
 */
const uploadMedicalRecordController = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).send({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!req.file) {
      return res.status(400).send({
        success: false,
        message: "No file uploaded",
      });
    }

    const {
      documentType,
      documentTitle,
      description,
      doctorName,
      documentDate,
      hospital,
    } = req.body;

    // Create or get health profile
    let healthProfile = await healthProfileModel.findOneAndUpdate(
      { userId },
      {
        $setOnInsert: {
          userId,
          dateOfBirth: new Date(2000, 0, 1),
          gender: "Other",
          bloodType: "O+",
          vitals: { weight: 0, height: 0 },
        },
      },
      { upsert: true, new: true }
    );

    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    const fileUrl = `/uploads/medical-records/${req.file.filename}`;

    const medicalRecord = new medicalRecordModel({
      healthProfileId: healthProfile._id,
      documentType: documentType || "other",
      documentTitle: documentTitle || fileName,
      description: description || "",
      fileUrl,
      fileName,
      mimeType,
      fileSize: req.file.size,
      documentDate: documentDate || new Date(),
      doctor: {
        name: doctorName || "Self-uploaded",
        hospital: hospital || "",
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
    console.error("UPLOAD ERROR:", error);
    return res.status(500).send({
      success: false,
      message: "Error uploading medical record",
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

    res.status(200).send({
      success: true,
      record,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

/**
 * Update Record
 */
const updateMedicalRecordController = async (req, res) => {
  try {
    const { recordId } = req.params;

    const record = await medicalRecordModel.findByIdAndUpdate(
      recordId,
      req.body,
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Record updated",
      record,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

/**
 * Delete Record
 */
const deleteMedicalRecordController = async (req, res) => {
  try {
    const { recordId } = req.params;

    await medicalRecordModel.findByIdAndDelete(recordId);

    res.status(200).send({
      success: true,
      message: "Record deleted",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

/**
 * Share Record
 */
const shareRecordController = async (req, res) => {
  try {
    const { recordId, doctorId } = req.body;

    const record = await medicalRecordModel.findByIdAndUpdate(
      recordId,
      {
        $push: {
          sharedWith: {
            userId: doctorId,
            sharedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    res.status(200).send({
      success: true,
      message: "Record shared",
      record,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
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

    res.status(200).send({
      success: true,
      message: "Record archived",
      record,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

/**
 * Get Records by Type
 */
const getRecordsByTypeController = async (req, res) => {
  try {
    const { documentType } = req.params;
    const userId = req.user.id;

    const healthProfile = await healthProfileModel.findOne({ userId });

    if (!healthProfile) {
      return res.status(404).send({
        success: false,
        message: "Health profile not found",
      });
    }

    const records = await medicalRecordModel.find({
      healthProfileId: healthProfile._id,
      documentType,
    });

    res.status(200).send({
      success: true,
      records,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ success: false, message: error.message });
  }
};

module.exports = {
  uploadMedicalRecordController,
  getRecordByIdController,
  updateMedicalRecordController,
  deleteMedicalRecordController,
  shareRecordController,
  archiveRecordController,
  getRecordsByTypeController,
};
