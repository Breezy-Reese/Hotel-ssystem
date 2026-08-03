const express = require("express");
const factory = require("../controllers/handlerFactory");
const Task = require("../models/Task");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["title", "department"], defaultPopulate: "assignedTo createdBy" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Task, opts))
  .post(factory.createOne(Task, { entity: "Task" }));

router
  .route("/:id")
  .get(factory.getOne(Task, opts))
  .patch(factory.updateOne(Task, { entity: "Task" }))
  .delete(factory.deleteOne(Task, { entity: "Task" }));

module.exports = router;
