const express = require("express");
const factory = require("../controllers/handlerFactory");
const MenuItem = require("../models/MenuItem");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["name", "category"], defaultPopulate: "offer branch" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(MenuItem, opts))
  .post(factory.createOne(MenuItem, { entity: "MenuItem" }));

router
  .route("/:id")
  .get(factory.getOne(MenuItem, opts))
  .patch(factory.updateOne(MenuItem, { entity: "MenuItem" }))
  .delete(factory.deleteOne(MenuItem, { entity: "MenuItem" }));

module.exports = router;
