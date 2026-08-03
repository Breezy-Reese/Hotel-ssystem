const express = require("express");
const factory = require("../controllers/handlerFactory");
const Service = require("../models/Service");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["name", "category"], defaultPopulate: "branch" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Service, opts))
  .post(factory.createOne(Service, { entity: "Service" }));

router
  .route("/:id")
  .get(factory.getOne(Service, opts))
  .patch(factory.updateOne(Service, { entity: "Service" }))
  .delete(factory.deleteOne(Service, { entity: "Service" }));

module.exports = router;
