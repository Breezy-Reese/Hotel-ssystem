const express = require("express");
const mpesaController = require("../controllers/mpesaController");
const { protect } = require("../middleware/auth");

const router = express.Router();

/*
 * IMPORTANT:
 * Safaricom calls this endpoint directly.
 * Therefore it MUST remain public and MUST NOT be behind `protect`.
 */
router.post("/callback", mpesaController.handleCallback);

/*
 * Everything below this point requires an authenticated user.
 */
router.use(protect);

// POST /api/v1/mpesa/stk-push
router.post("/stk-push", mpesaController.initiatePayment);

// GET /api/v1/mpesa/status/:checkoutRequestId
router.get("/status/:checkoutRequestId", mpesaController.getStatus);

module.exports = router;