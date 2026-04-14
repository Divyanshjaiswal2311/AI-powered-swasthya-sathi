const express = require("express");
const authMiddelware = require("../middlewares/authMiddleware");
const {
  getUsersListController,
  getHospitalListController,
  getOrgListController,
  deleteUserController,
} = require("../controllers/adminController");
const adminMiddleware = require("../middlewares/adminMiddleware");

//router object
const router = express.Router();

//Routes

//GET || USER LIST
router.get(
  "/user-list",
  authMiddelware,
  adminMiddleware,
  getUsersListController
);
//GET || HOSPITAL LIST
router.get(
  "/hospital-list",
  authMiddelware,
  adminMiddleware,
  getHospitalListController
);
//GET || ORG LIST
router.get("/org-list", authMiddleware, adminMiddleware, getOrgListController);
// ==========================

// DELETE USER || DELETE
router.delete(
  "/delete-user/:id",
  authMiddleware,
  adminMiddleware,
  deleteUserController
);

//EXPORT
module.exports = router;
