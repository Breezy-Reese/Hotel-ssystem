const express = require("express");
const factory = require("../controllers/handlerFactory");
const User = require("../models/User");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["name", "email"], defaultPopulate: "branch" };

router.use(protect, restrictTo("Admin", "Manager"));

// Creation happens through POST /api/v1/auth/register (handles password hashing + token).
router.get("/", factory.getAll(User, opts));

router
  .route("/:id")
  .get(factory.getOne(User, opts))
  .patch(factory.updateOne(User, { entity: "User" })) // role/status/branch changes — not password
  .delete(restrictTo("Admin"), factory.deleteOne(User, { entity: "User" }));

module.exports = router;
