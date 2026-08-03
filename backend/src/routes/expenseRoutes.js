const express = require("express");
const factory = require("../controllers/handlerFactory");
const Expense = require("../models/Expense");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["category", "description"], defaultPopulate: "supplier approvedBy branch" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Expense, opts))
  .post(factory.createOne(Expense, { entity: "Expense" }));

router
  .route("/:id")
  .get(factory.getOne(Expense, opts))
  .patch(restrictTo('Admin', 'Manager', 'Accountant'), factory.updateOne(Expense, { entity: "Expense" }))
  .delete(restrictTo('Admin', 'Manager', 'Accountant'), factory.deleteOne(Expense, { entity: "Expense" }));

module.exports = router;
