const mongoose = require("mongoose");
const generateRef = require("../utils/generateRef");

const orderItemSchema = new mongoose.Schema(
  {
    menuItem: { type: mongoose.Schema.Types.ObjectId, ref: "MenuItem", required: true },
    name: { type: String, trim: true }, // snapshot at time of order
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true, min: 0 }, // snapshot price per unit
    notes: { type: String, trim: true },
  },
  { _id: false },
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch", required: true },
    type: { type: String, enum: ["DineIn", "RoomService", "Takeaway"], required: true },
    table: { type: mongoose.Schema.Types.ObjectId, ref: "RestaurantTable" },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "Guest" },
    items: { type: [orderItemSchema], validate: (v) => v.length > 0 },
    station: { type: String, trim: true, default: "Main" }, // kitchen display grouping
    placedAt: { type: Date, default: Date.now },
    readyAt: { type: Date },
    status: {
      type: String,
      enum: ["Pending", "Preparing", "Ready", "Served", "Completed", "Cancelled"],
      default: "Pending",
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

orderSchema.virtual("total").get(function total() {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

orderSchema.pre("save", function generateOrderNumber(next) {
  if (!this.orderNumber) this.orderNumber = generateRef("ORD");
  next();
});

module.exports = mongoose.model("Order", orderSchema);
