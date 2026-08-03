const express = require("express");
const authController = require("../controllers/authController");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

router.post("/login", authController.login);

// Staff accounts are provisioned by Admin/Manager, not self-registered.
router.post("/register", protect, restrictTo("Admin", "Manager"), authController.register);

router.get("/me", protect, authController.getMe);
router.patch("/update-password", protect, authController.updateMyPassword);

module.exports = router;
