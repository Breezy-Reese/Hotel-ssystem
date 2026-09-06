const express = require("express");
const authController = require("../controllers/authController");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();

router.post("/login", authController.login);

// Customer self-registration
router.post(
  "/customer-register",
  authController.customerRegister,
);

// Staff accounts are created by Admin/Manager
router.post(
  "/register",
  protect,
  restrictTo("Admin", "Manager"),
  authController.register,
);

router.get("/me", protect, authController.getMe);

router.patch(
  "/update-password",
  protect,
  authController.updateMyPassword,
);

module.exports = router;