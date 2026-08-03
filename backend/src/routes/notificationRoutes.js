const express = require("express");
const factory = require("../controllers/handlerFactory");
const Notification = require("../models/Notification");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["message"], defaultPopulate: "recipient createdBy" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Notification, opts))
  .post(factory.createOne(Notification, { entity: "Notification" }));

router
  .route("/:id")
  .get(factory.getOne(Notification, opts))
  .patch(factory.updateOne(Notification, { entity: "Notification" }))
  .delete(factory.deleteOne(Notification, { entity: "Notification" }));

module.exports = router;
