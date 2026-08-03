const express = require("express");
const factory = require("../controllers/handlerFactory");
const Review = require("../models/Review");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["comment"], defaultPopulate: "guest" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Review, opts))
  .post(factory.createOne(Review, { entity: "Review" }));

router
  .route("/:id")
  .get(factory.getOne(Review, opts))
  .patch(factory.updateOne(Review, { entity: "Review" }))
  .delete(factory.deleteOne(Review, { entity: "Review" }));

module.exports = router;
