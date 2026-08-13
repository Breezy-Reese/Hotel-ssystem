const mongoose = require("mongoose");
const generateRef = require("../utils/generateRef");

const maintenanceSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, unique: true, trim: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    location: { type: String, trim: true }, // free-text fallback (e.g. "Lobby", "Kitchen")
    issue: { type: String, required: true, trim: true },
    priority: { type: String, enum: ["Low", "Medium", "High", "Urgent"], default: "Medium" },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Employee" },
    reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cost: { type: Number, default: 0, min: 0 },
    status: { type: String, enum: ["Open", "InProgress", "Resolved"], default: "Open" },
  },
  { timestamps: true },
);

maintenanceSchema.pre("save", function generateTicket(next) {
  if (!this.ticketNumber) this.ticketNumber = generateRef("MT");
  next();
});

module.exports = mongoose.model("Maintenance", maintenanceSchema);
