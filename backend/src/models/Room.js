const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    roomNumber: { type: String, required: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    type: {
      type: String,
      enum: ["Single", "Double", "Deluxe", "Executive", "Suite"],
      required: true,
    },
    capacity: { type: Number, required: true, min: 1 },
    rate: { type: Number, required: true, min: 0 }, // rate per night
    amenities: [{ type: String, trim: true }],
    images: [{ type: String, trim: true }],
    status: {
      type: String,
      enum: ["Available", "Reserved", "Occupied", "Cleaning", "Maintenance"],
      default: "Available",
    },
  },
  { timestamps: true },
);

roomSchema.index({ branch: 1, roomNumber: 1 }, { unique: true });

module.exports = mongoose.model("Room", roomSchema);
