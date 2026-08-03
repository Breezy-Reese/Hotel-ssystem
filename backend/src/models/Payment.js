const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    source: {
      type: String,
      enum: ["Reservation", "Order", "Service", "Invoice", "Sale"],
      required: true,
    },
    sourceId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "source" },
    method: { type: String, enum: ["Cash", "Card", "Mobile", "Bank"], required: true },
    amount: { type: Number, required: true, min: 0 },
    date: { type: Date, default: Date.now },
    status: { type: String, enum: ["Completed", "Pending", "Refunded", "Failed"], default: "Completed" },
    recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

paymentSchema.pre("save", function generateTxnId(next) {
  if (!this.transactionId) this.transactionId = `TXN-${Date.now().toString(36).toUpperCase()}`;
  next();
});

module.exports = mongoose.model("Payment", paymentSchema);
