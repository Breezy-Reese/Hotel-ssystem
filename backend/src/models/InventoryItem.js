const mongoose = require("mongoose");

const inventoryItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    category: { type: String, required: true, trim: true },
    quantity: { type: Number, required: true, default: 0, min: 0 },
    unit: { type: String, required: true, trim: true }, // kg, litres, pcs, etc
    reorderLevel: { type: Number, default: 0, min: 0 },
    costPerUnit: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

inventoryItemSchema.virtual("status").get(function status() {
  if (this.quantity <= 0) return "OutOfStock";
  if (this.quantity <= this.reorderLevel) return "LowStock";
  return "InStock";
});

inventoryItemSchema.virtual("stockValue").get(function stockValue() {
  return this.quantity * this.costPerUnit;
});

module.exports = mongoose.model("InventoryItem", inventoryItemSchema);
