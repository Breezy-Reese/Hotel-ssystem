const mongoose = require("mongoose");

const housekeepingSchema = new mongoose.Schema(
  {
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    scheduledFor: { type: Date, default: Date.now },
    cleaningStatus: {
      type: String,
      enum: ["Pending", "InProgress", "Ready", "DamageReported"],
      default: "Pending",
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Housekeeping", housekeepingSchema);
