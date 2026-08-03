const mongoose = require("mongoose");

const loyaltyTransactionSchema = new mongoose.Schema(
  {
    type: { type: String, enum: ["Earn", "Redeem", "Adjustment"], required: true },
    points: { type: Number, required: true },
    reason: { type: String, trim: true },
    date: { type: Date, default: Date.now },
  },
  { _id: false },
);

const loyaltyAccountSchema = new mongoose.Schema(
  {
    guest: { type: mongoose.Schema.Types.ObjectId, ref: "Guest", required: true, unique: true },
    tier: { type: String, enum: ["Bronze", "Silver", "Gold", "Platinum"], default: "Bronze" },
    points: { type: Number, default: 0, min: 0 },
    lifetimeSpend: { type: Number, default: 0, min: 0 },
    lastActivity: { type: Date },
    status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
    history: { type: [loyaltyTransactionSchema], default: [] },
  },
  { timestamps: true },
);

module.exports = mongoose.model("LoyaltyAccount", loyaltyAccountSchema);
