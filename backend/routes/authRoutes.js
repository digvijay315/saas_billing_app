const express = require("express");
const router = express.Router();
const {
  loginUser,
  registerHotel,
  registerStaff,
  getStaff,
  deleteStaff,
} = require("../controllers/authController");
const { protect, admin } = require("../middleware/auth");

router.post("/register-hotel", registerHotel);
router.post("/login", loginUser);
router.post("/register-staff", protect, admin, registerStaff);
router.get("/staff", protect, admin, getStaff);
router.delete("/staff/:id", protect, admin, deleteStaff);

module.exports = router;
