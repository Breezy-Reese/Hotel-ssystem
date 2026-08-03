const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const ROLES = [
  "Admin",
  "Manager",
  "FrontDesk",
  "Housekeeping",
  "Maintenance",
  "Kitchen",
  "Waiter",
  "Cashier",
  "Accountant",
  "HR",
  "Inventory",
];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Name is required"], trim: true },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 8,
      select: false,
    },
    role: { type: String, enum: ROLES, default: "FrontDesk" },
    branch: { type: mongoose.Schema.Types.ObjectId, ref: "Branch" },
    phone: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Active", "Invited", "Disabled"],
      default: "Invited",
    },
    lastLogin: { type: Date },
    passwordChangedAt: { type: Date },
  },
  { timestamps: true },
);

userSchema.pre("save", async function hashPassword(next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  if (!this.isNew) this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = function correctPassword(candidate, actual) {
  return bcrypt.compare(candidate, actual);
};

userSchema.methods.changedPasswordAfter = function changedPasswordAfter(jwtTimestamp) {
  if (!this.passwordChangedAt) return false;
  const changedTimestamp = parseInt(this.passwordChangedAt.getTime() / 1000, 10);
  return jwtTimestamp < changedTimestamp;
};

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.password;
    return ret;
  },
});

module.exports = mongoose.model("User", userSchema);
module.exports.ROLES = ROLES;
