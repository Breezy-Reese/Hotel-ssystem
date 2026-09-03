const express = require("express");
const mpesaController = require("../controllers/mpesaController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// PUBLIC — Safaricom calls this directly and cannot send a Bearer token.
// Must be registered before router.use(protect) below.
router.post("/callback", mpesaController.handleCallback);

router.use(protect);
router.post("/stk-push", mpesaController.initiatePayment);
router.get("/status/:checkoutRequestId", mpesaController.getStatus);

module.exports = router;