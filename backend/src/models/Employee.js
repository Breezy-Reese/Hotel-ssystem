const mongoose = require("mongoose");

const employeeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    department: {
      type: String,
      enum: [
        "Front Desk",
        "Housekeeping",
        "Maintenance",
        "Kitchen",
        "Restaurant",
        "Accounting",
        "HR",
        "Management",
        "Inventory",
        "Security",
      ],
      required: true,
    },
    role: { type: String, required: true, trim: true },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    shift: { type: String, enum: ["Morning", "Afternoon", "Night"], default: "Morning" },
    phone: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    hireDate: { type: Date, default: Date.now },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    status: { type: String, enum: ["Active", "OnLeave", "Terminated"], default: "Active" },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Employee", employeeSchema);
