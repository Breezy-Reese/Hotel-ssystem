const mongoose = require("mongoose");

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    idNumber: { type: String, trim: true },
    address: { type: String, trim: true },
    vip: { type: Boolean, default: false },
    stays: { type: Number, default: 0 },
    lastVisit: { type: Date },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Guest", guestSchema);
