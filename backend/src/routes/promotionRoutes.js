const express = require("express");
const factory = require("../controllers/handlerFactory");
const Promotion = require("../models/Promotion");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["code", "description"], defaultPopulate: "" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Promotion, opts))
  .post(restrictTo('Admin', 'Manager'), factory.createOne(Promotion, { entity: "Promotion" }));

router
  .route("/:id")
  .get(factory.getOne(Promotion, opts))
  .patch(restrictTo('Admin', 'Manager'), factory.updateOne(Promotion, { entity: "Promotion" }))
  .delete(restrictTo('Admin', 'Manager'), factory.deleteOne(Promotion, { entity: "Promotion" }));

module.exports = router;
