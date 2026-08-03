const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Announcement", "Alert", "Reminder"], required: true },
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // null/omitted = broadcast to all
    message: { type: String, required: true, trim: true },
    channel: { type: String, enum: ["Email", "SMS", "InApp"], default: "InApp" },
    sentAt: { type: Date },
    status: { type: String, enum: ["Sent", "Failed", "Pending"], default: "Pending" },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Notification", notificationSchema);
