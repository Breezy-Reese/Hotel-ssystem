const express = require("express");
const attendanceController = require("../controllers/attendanceController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.post("/clock-in", attendanceController.clockIn);
router.post("/clock-out", attendanceController.clockOut);

router.route("/").get(attendanceController.getAll).post(attendanceController.create);
router
  .route("/:id")
  .get(attendanceController.getOne)
  .patch(attendanceController.update)
  .delete(attendanceController.remove);

module.exports = router;
