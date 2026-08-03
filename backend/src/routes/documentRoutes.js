const express = require("express");
const factory = require("../controllers/handlerFactory");
const Document = require("../models/Document");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["name"], defaultPopulate: "owner uploadedBy" };

router.use(protect);

router
  .route("/")
  .get(factory.getAll(Document, opts))
  .post(factory.createOne(Document, { entity: "Document" }));

router
  .route("/:id")
  .get(factory.getOne(Document, opts))
  .patch(factory.updateOne(Document, { entity: "Document" }))
  .delete(factory.deleteOne(Document, { entity: "Document" }));

module.exports = router;
