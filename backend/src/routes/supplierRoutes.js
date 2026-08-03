const express = require("express");
const factory = require("../controllers/handlerFactory");
const Supplier = require("../models/Supplier");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["name", "contactEmail"], defaultPopulate: "" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Supplier, opts))
  .post(factory.createOne(Supplier, { entity: "Supplier" }));

router
  .route("/:id")
  .get(factory.getOne(Supplier, opts))
  .patch(factory.updateOne(Supplier, { entity: "Supplier" }))
  .delete(factory.deleteOne(Supplier, { entity: "Supplier" }));

module.exports = router;
