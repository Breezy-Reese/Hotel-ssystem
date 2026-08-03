const express = require("express");
const loyaltyController = require("../controllers/loyaltyController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").get(loyaltyController.getAll).post(loyaltyController.create);
router.route("/:id").get(loyaltyController.getOne).delete(loyaltyController.remove);
router.post("/:id/earn", loyaltyController.earn);
router.post("/:id/redeem", loyaltyController.redeem);

module.exports = router;
