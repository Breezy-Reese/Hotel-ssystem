const mongoose = require("mongoose");

const saleItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem" },
    name: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const saleSchema = new mongoose.Schema(
  {
    receiptNumber: { type: String, unique: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    cashier: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    order: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    items: { type: [saleItemSchema], validate: (v) => v.length > 0 },
    discount: { type: Number, default: 0, min: 0 },
    paymentMethod: { type: String, enum: ["Cash", "Card", "Mobile"], required: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

saleSchema.virtual("subtotal").get(function subtotal() {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

saleSchema.virtual("total").get(function total() {
  return Math.max(this.subtotal - this.discount, 0);
});

saleSchema.pre("save", function generateReceipt(next) {
  if (!this.receiptNumber) this.receiptNumber = `RCT-${Date.now().toString(36).toUpperCase()}`;
  next();
});

module.exports = mongoose.model("Sale", saleSchema);
