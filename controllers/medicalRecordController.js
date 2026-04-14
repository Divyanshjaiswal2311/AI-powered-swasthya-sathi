const uploadMedicalRecordController = async (req, res) => {
  try {
    console.log("FILE:", req.file);
    console.log("BODY:", req.body);

    const userId = req.user?.id || req.body.userId; // safe fallback

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

    // ✅ FIXED FILE HANDLING
    const fileName = req.file.originalname;
    const mimeType = req.file.mimetype;

    // IMPORTANT: match actual storage path
    const fileUrl = `/uploads/medical-records/${req.file.filename}`;

    // Create record
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
module.exports = {
  uploadMedicalRecordController,
  getRecordByIdController,
  updateMedicalRecordController,
  deleteMedicalRecordController,
  shareRecordController,
  archiveRecordController,
  getRecordsByTypeController,
};
