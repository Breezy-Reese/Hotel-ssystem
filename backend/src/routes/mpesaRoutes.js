const express = require("express");

const mpesaController = require("../controllers/mpesaController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Safaricom callback — PUBLIC
router.post("/callback", mpesaController.handleCallback);

// Protected M-Pesa endpoints
router.use(protect);

router.post("/stk-push", mpesaController.initiatePayment);

router.get(
  "/status/:checkoutRequestId",
  mpesaController.getStatus
);

module.exports = router;