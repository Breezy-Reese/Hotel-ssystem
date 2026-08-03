const express = require("express");
const factory = require("../controllers/handlerFactory");
const InventoryItem = require("../models/InventoryItem");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["name", "category"], defaultPopulate: "branch" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(InventoryItem, opts))
  .post(factory.createOne(InventoryItem, { entity: "InventoryItem" }));

router
  .route("/:id")
  .get(factory.getOne(InventoryItem, opts))
  .patch(factory.updateOne(InventoryItem, { entity: "InventoryItem" }))
  .delete(factory.deleteOne(InventoryItem, { entity: "InventoryItem" }));

module.exports = router;
