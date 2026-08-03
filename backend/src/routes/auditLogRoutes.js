const express = require("express");
const factory = require("../controllers/handlerFactory");
const AuditLog = require("../models/AuditLog");
const { protect, restrictTo } = require("../middleware/auth");

const router = express.Router();
const opts = { searchableFields: ["action", "entity"], defaultPopulate: "user" };

router.use(protect, restrictTo("Admin", "Manager"));

router.get("/", factory.getAll(AuditLog, opts));
router.get("/:id", factory.getOne(AuditLog, opts));

module.exports = router;
