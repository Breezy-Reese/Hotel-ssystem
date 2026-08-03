const express = require("express");
const housekeepingController = require("../controllers/housekeepingController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").get(housekeepingController.getAll).post(housekeepingController.create);
router
  .route("/:id")
  .get(housekeepingController.getOne)
  .delete(housekeepingController.remove);
router.patch("/:id/status", housekeepingController.updateStatus);

module.exports = router;
