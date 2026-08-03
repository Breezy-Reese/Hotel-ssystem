const mongoose = require("mongoose");

const serviceBookingSchema = new mongoose.Schema(
  {
    ref: { type: String, unique: true, trim: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "Guest", required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: "Service", required: true },
    dateTime: { type: Date, required: true },
    charge: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["Requested", "Scheduled", "InProgress", "Completed", "Cancelled"],
      default: "Requested",
    },
  },
  { timestamps: true },
);

serviceBookingSchema.pre("save", function generateRef(next) {
  if (!this.ref) this.ref = `SB-${Date.now().toString(36).toUpperCase()}`;
  next();
});

module.exports = mongoose.model("ServiceBooking", serviceBookingSchema);
