const express = require("express");
const factory = require("../controllers/handlerFactory");
const ServiceBooking = require("../models/ServiceBooking");
const { protect } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["ref"], defaultPopulate: "guest service" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(ServiceBooking, opts))
  .post(factory.createOne(ServiceBooking, { entity: "ServiceBooking" }));

router
  .route("/:id")
  .get(factory.getOne(ServiceBooking, opts))
  .patch(factory.updateOne(ServiceBooking, { entity: "ServiceBooking" }))
  .delete(factory.deleteOne(ServiceBooking, { entity: "ServiceBooking" }));

module.exports = router;
