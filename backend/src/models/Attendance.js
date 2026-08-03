const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    employee: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true },
    date: { type: Date, required: true, default: Date.now },
    clockIn: { type: Date },
    clockOut: { type: Date },
    flag: {
      type: String,
      enum: ["OnTime", "Late", "Absent", "EarlyLeave"],
      default: "OnTime",
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } },
);

attendanceSchema.virtual("hoursWorked").get(function hoursWorked() {
  if (!this.clockIn || !this.clockOut) return 0;
  const ms = new Date(this.clockOut) - new Date(this.clockIn);
  return Math.max(Math.round((ms / (1000 * 60 * 60)) * 100) / 100, 0);
});

attendanceSchema.index({ employee: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("Attendance", attendanceSchema);
