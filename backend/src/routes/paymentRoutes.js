const express = require("express");
const factory = require("../controllers/handlerFactory");
const Payment = require("../models/Payment");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["transactionId"], defaultPopulate: "branch recordedBy" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Payment, opts))
  .post(restrictTo("Admin", "Manager", "Cashier", "FrontDesk", "Accountant"), factory.createOne(Payment, { entity: "Payment" }));

router
  .route("/:id")
  .get(factory.getOne(Payment, opts))
  .patch(restrictTo("Admin", "Manager", "Accountant"), factory.updateOne(Payment, { entity: "Payment" }))
  .delete(restrictTo("Admin"), factory.deleteOne(Payment, { entity: "Payment" }));

module.exports = router;
