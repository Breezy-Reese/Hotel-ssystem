const express = require("express");
const factory = require("../controllers/handlerFactory");
const Sale = require("../models/Sale");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: [], defaultPopulate: "cashier branch order" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Sale, opts))
  .post(factory.createOne(Sale, { entity: "Sale" }));

router
  .route("/:id")
  .get(factory.getOne(Sale, opts))
  .patch(factory.updateOne(Sale, { entity: "Sale" }))
  .delete(factory.deleteOne(Sale, { entity: "Sale" }));

module.exports = router;
