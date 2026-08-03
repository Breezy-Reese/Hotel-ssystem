const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { type: String, enum: ["GuestDoc", "StaffDoc", "Policy", "Other"], required: true },
    ownerModel: { type: String, enum: ["Guest", "Employee"] },
    owner: { type: mongoose.Schema.Types.ObjectId, refPath: "ownerModel" },
    fileUrl: { type: String, required: true, trim: true },
    size: { type: Number, default: 0 }, // bytes
    access: { type: String, enum: ["Public", "Restricted", "Private"], default: "Private" },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Document", documentSchema);
