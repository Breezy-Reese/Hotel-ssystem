const express = require("express");
const factory = require("../controllers/handlerFactory");
const Employee = require("../models/Employee");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["name", "role", "department"], defaultPopulate: "branch user" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Employee, opts))
  .post(restrictTo('Admin', 'Manager', 'HR'), factory.createOne(Employee, { entity: "Employee" }));

router
  .route("/:id")
  .get(factory.getOne(Employee, opts))
  .patch(restrictTo('Admin', 'Manager', 'HR'), factory.updateOne(Employee, { entity: "Employee" }))
  .delete(restrictTo('Admin', 'Manager', 'HR'), factory.deleteOne(Employee, { entity: "Employee" }));

module.exports = router;
