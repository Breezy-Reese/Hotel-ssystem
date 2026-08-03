const express = require("express");
const factory = require("../controllers/handlerFactory");
const Room = require("../models/Room");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["roomNumber", "type"], defaultPopulate: "branch" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Room, opts))
  .post(factory.createOne(Room, { entity: "Room" }));

router
  .route("/:id")
  .get(factory.getOne(Room, opts))
  .patch(factory.updateOne(Room, { entity: "Room" }))
  .delete(factory.deleteOne(Room, { entity: "Room" }));

module.exports = router;
