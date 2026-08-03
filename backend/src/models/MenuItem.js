const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    availability: { type: Boolean, default: true },
    offer: { type: mongoose.Schema.Types.ObjectId, ref: "Promotion" },
    description: { type: String, trim: true },
    image: { type: String, trim: true },
  },
  { timestamps: true },
);

module.exports = mongoose.model("MenuItem", menuItemSchema);
