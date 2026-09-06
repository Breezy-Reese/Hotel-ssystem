const express = require("express");
const customerAuthController = require("../controllers/customerAuthController");
const { protectCustomer } = require("../middleware/customerAuth");

const router = express.Router();

router.post("/register", customerAuthController.register);
router.post("/login", customerAuthController.login);
router.get("/me", protectCustomer, customerAuthController.getMe);

module.exports = router;