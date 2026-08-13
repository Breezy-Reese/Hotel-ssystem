const mongoose = require("mongoose");
const generateRef = require("../utils/generateRef");

const purchaseItemSchema = new mongoose.Schema(
  {
    item: { type: mongoose.Schema.Types.ObjectId, ref: "InventoryItem" },
    name: { type: String, trim: true },
    quantity: { type: Number, required: true, min: 1 },
    cost: { type: Number, required: true, min: 0 }, // cost per unit
  },
  { _id: false },
);

const purchaseSchema = new mongoose.Schema(
  {
    poNumber: { type: String, unique: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier", required: true },
    items: { type: [purchaseItemSchema], validate: (v) => v.length > 0 },
    expectedDate: { type: Date },
    receivedDate: { type: Date },
    status: {
      type: String,
      enum: ["Draft", "Ordered", "AwaitingDelivery", "Received", "Cancelled"],
      default: "Draft",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

purchaseSchema.virtual("totalCost").get(function totalCost() {
  return this.items.reduce((sum, i) => sum + i.cost * i.quantity, 0);
});

purchaseSchema.pre("save", function generatePO(next) {
  if (!this.poNumber) this.poNumber = generateRef("PO");
  next();
});

module.exports = mongoose.model("Purchase", purchaseSchema);
