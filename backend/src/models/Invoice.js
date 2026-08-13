const mongoose = require("mongoose");
const generateRef = require("../utils/generateRef");

const chargeSchema = new mongoose.Schema(
  {
    description: { type: String, required: true, trim: true },
    amount: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, unique: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "Guest", required: true },
    reservation: { type: mongoose.Schema.Types.ObjectId, ref: "Reservation" },
    charges: { type: [chargeSchema], default: [] },
    tax: { type: Number, default: 0, min: 0 }, // percentage
    discount: { type: Number, default: 0, min: 0 }, // flat amount
    status: {
      type: String,
      enum: ["Open", "Issued", "Paid", "Overdue", "Cancelled"],
      default: "Open",
    },
    dueDate: { type: Date },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

invoiceSchema.virtual("subtotal").get(function subtotal() {
  return this.charges.reduce((sum, c) => sum + c.amount, 0);
});

invoiceSchema.virtual("taxAmount").get(function taxAmount() {
  return (this.subtotal * this.tax) / 100;
});

invoiceSchema.virtual("total").get(function total() {
  return Math.max(this.subtotal + this.taxAmount - this.discount, 0);
});

invoiceSchema.pre("save", function generateInvoiceNumber(next) {
  if (!this.invoiceNumber) this.invoiceNumber = generateRef("INV");
  next();
});

module.exports = mongoose.model("Invoice", invoiceSchema);
