const mongoose = require("mongoose");
const generateRef = require("../utils/generateRef");

const reservationSchema = new mongoose.Schema(
  {
    ref: { type: String, unique: true, trim: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "Guest", required: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    adults: { type: Number, default: 1, min: 1 },
    children: { type: Number, default: 0, min: 0 },
    rateAtBooking: { type: Number, required: true, min: 0 },
    source: { type: String, enum: ["Online", "WalkIn"], default: "WalkIn" },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "CheckedIn", "CheckedOut", "Cancelled", "NoShow"],
      default: "Pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

reservationSchema.virtual("nights").get(function nights() {
  if (!this.checkIn || !this.checkOut) return 0;
  const ms = new Date(this.checkOut) - new Date(this.checkIn);
  return Math.max(Math.round(ms / (1000 * 60 * 60 * 24)), 0);
});

reservationSchema.pre("validate", function validateDates(next) {
  if (this.checkIn && this.checkOut && this.checkOut <= this.checkIn) {
    next(new Error("checkOut must be after checkIn"));
  } else {
    next();
  }
});

reservationSchema.pre("save", function setRef(next) {
  if (!this.ref) {
    this.ref = generateRef("RES");
  }
  next();
});

module.exports = mongoose.model("Reservation", reservationSchema);
