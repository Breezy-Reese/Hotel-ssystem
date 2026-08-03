const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: { type: String, required: true, trim: true }, // CREATE, UPDATE, DELETE, LOGIN, etc.
    entity: { type: String, required: true, trim: true },
    entityId: { type: mongoose.Schema.Types.ObjectId },
    ip: { type: String, trim: true },
    result: { type: String, enum: ["Success", "Failure"], default: "Success" },
    meta: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: { createdAt: "timestamp", updatedAt: false } },
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
