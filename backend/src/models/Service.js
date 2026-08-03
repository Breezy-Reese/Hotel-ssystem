const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    category: { type: String, required: true, trim: true }, // Spa, Laundry, Transport, etc.
    price: { type: Number, required: true, min: 0 },
    duration: { type: Number, default: 0 }, // minutes
    availability: { type: Boolean, default: true },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Service", serviceSchema);
