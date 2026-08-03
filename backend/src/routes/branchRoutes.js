const express = require("express");
const factory = require("../controllers/handlerFactory");
const Branch = require("../models/Branch");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["name", "location"], defaultPopulate: "manager" };

router.use(protect);

router.route("/").get(factory.getAll(Branch, opts)).post(restrictTo("Admin"), factory.createOne(Branch));

router
  .route("/:id")
  .get(factory.getOne(Branch, opts))
  .patch(restrictTo("Admin", "Manager"), factory.updateOne(Branch))
  .delete(restrictTo("Admin"), factory.deleteOne(Branch));

module.exports = router;
