const express = require("express");
const reportsController = require("../controllers/reportsController");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.get("/dashboard", reportsController.getDashboard);
router.get("/revenue", restrictTo("Admin", "Manager", "Accountant"), reportsController.getRevenueReport);

module.exports = router;
