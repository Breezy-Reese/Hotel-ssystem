const mongoose = require("mongoose");

const promotionSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    description: { type: String, trim: true },
    appliesTo: { type: String, enum: ["Room", "Menu", "Service", "All"], required: true },
    discountType: { type: String, enum: ["Percent", "Fixed"], required: true },
    discountValue: { type: Number, required: true, min: 0 },
    startsAt: { type: Date, required: true },
    expiresAt: { type: Date, required: true },
    redemptions: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true }, // manual disable switch
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

promotionSchema.virtual("status").get(function status() {
  if (!this.active) return "Disabled";
  const now = new Date();
  if (now < this.startsAt) return "Scheduled";
  if (now > this.expiresAt) return "Expired";
  return "Active";
});

module.exports = mongoose.model("Promotion", promotionSchema);
