const express = require("express");
const maintenanceController = require("../controllers/maintenanceController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").get(maintenanceController.getAll).post(maintenanceController.create);
router.route("/:id").get(maintenanceController.getOne).delete(maintenanceController.remove);
router.patch("/:id/status", maintenanceController.updateStatus);

module.exports = router;
