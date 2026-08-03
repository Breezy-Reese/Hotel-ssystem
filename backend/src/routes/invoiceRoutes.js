const express = require("express");
const invoiceController = require("../controllers/invoiceController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.route("/").get(invoiceController.getAll).post(invoiceController.create);
router
  .route("/:id")
  .get(invoiceController.getOne)
  .patch(invoiceController.update)
  .delete(invoiceController.remove);
router.post("/:id/pay", invoiceController.pay);

module.exports = router;
