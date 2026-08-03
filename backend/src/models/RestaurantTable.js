const mongoose = require("mongoose");

const restaurantTableSchema = new mongoose.Schema(
  {
    tableNumber: { type: String, required: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    capacity: { type: Number, required: true, min: 1 },
    section: { type: String, trim: true },
    status: { type: String, enum: ["Available", "Occupied", "Reserved"], default: "Available" },
    reservedFor: { type: mongoose.Schema.Types.ObjectId, ref: "Guest" },
    reservedTime: { type: Date },
  },
  { timestamps: true },
);

restaurantTableSchema.index({ branch: 1, tableNumber: 1 }, { unique: true });

module.exports = mongoose.model("RestaurantTable", restaurantTableSchema);
