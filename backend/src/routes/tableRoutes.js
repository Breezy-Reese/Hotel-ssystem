const express = require("express");
const factory = require("../controllers/handlerFactory");
const RestaurantTable = require("../models/RestaurantTable");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["tableNumber", "section"], defaultPopulate: "branch reservedFor" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(RestaurantTable, opts))
  .post(factory.createOne(RestaurantTable, { entity: "RestaurantTable" }));

router
  .route("/:id")
  .get(factory.getOne(RestaurantTable, opts))
  .patch(factory.updateOne(RestaurantTable, { entity: "RestaurantTable" }))
  .delete(factory.deleteOne(RestaurantTable, { entity: "RestaurantTable" }));

module.exports = router;
