const mongoose = require("mongoose");
const generateRef = require("../utils/generateRef");

const mpesaTransactionSchema = new mongoose.Schema(
  {
    transactionId: { type: String, unique: true, trim: true },
    checkoutRequestId: { type: String, required: true, unique: true, trim: true },
    merchantRequestId: { type: String, trim: true },
    phone: { type: String, required: true, trim: true }, // normalized 2547XXXXXXXX
    amount: { type: Number, required: true, min: 1 },
    // Mirrors Payment's source/sourceId pattern so any part of the app can
    // request an M-Pesa charge against any payable entity.
    source: {
      type: String,
      enum: ["Reservation", "Order", "Service", "Invoice", "Sale"],
      required: true,
    },
    sourceId: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: "source" },
    accountReference: { type: String, trim: true },
    transactionDesc: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Pending", "Success", "Failed", "Cancelled"],
      default: "Pending",
    },
    resultCode: { type: Number },
    resultDesc: { type: String, trim: true },
    mpesaReceiptNumber: { type: String, trim: true },
    transactionDate: { type: String, trim: true }, // raw yyyyMMddHHmmss from Safaricom
    initiatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

mpesaTransactionSchema.pre("save", function setTransactionId(next) {
  if (!this.transactionId) this.transactionId = generateRef("MPX");
  next();
});

module.exports = mongoose.model("MpesaTransaction", mpesaTransactionSchema);