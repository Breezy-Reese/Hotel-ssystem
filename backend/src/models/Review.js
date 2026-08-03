const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "Guest", required: true },
    targetType: { type: String, enum: ["Room", "Meal", "Service"], required: true },
    targetId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "targetModel" },
    targetModel: { type: String, enum: ["Room", "MenuItem", "Service"], required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
    date: { type: Date, default: Date.now },
    reviewed: { type: Boolean, default: false }, // staff has read/actioned it
  },
  { timestamps: true },
);

module.exports = mongoose.model("Review", reviewSchema);
