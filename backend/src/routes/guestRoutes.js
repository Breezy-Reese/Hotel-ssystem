const express = require("express");
const factory = require("../controllers/handlerFactory");
const Guest = require("../models/Guest");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["name", "phone", "email"], defaultPopulate: "" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Guest, opts))
  .post(factory.createOne(Guest, { entity: "Guest" }));

router
  .route("/:id")
  .get(factory.getOne(Guest, opts))
  .patch(factory.updateOne(Guest, { entity: "Guest" }))
  .delete(factory.deleteOne(Guest, { entity: "Guest" }));

module.exports = router;
