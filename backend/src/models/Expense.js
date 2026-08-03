const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema(
  {
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    date: { type: Date, default: Date.now },
    category: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    supplier: { type: mongoose.Schema.Types.ObjectId, ref: "Supplier" },
    amount: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ["Pending", "Approved", "Paid", "Rejected"], default: "Pending" },
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Expense", expenseSchema);
