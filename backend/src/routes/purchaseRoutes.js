const express = require("express");
const purchaseController = require("../controllers/purchaseController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").get(purchaseController.getAll).post(purchaseController.create);
router
  .route("/:id")
  .get(purchaseController.getOne)
  .patch(purchaseController.update)
  .delete(purchaseController.remove);
router.post("/:id/receive", purchaseController.receive);

module.exports = router;
