const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Attendance = require("../models/Attendance");

const POPULATE = "employee";

function startOfDay(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

exports.getAll = factory.getAll(Attendance, { defaultPopulate: POPULATE });
exports.getOne = factory.getOne(Attendance, { defaultPopulate: POPULATE });
exports.create = factory.createOne(Attendance, { entity: "Attendance" }); // manual entry
exports.update = factory.updateOne(Attendance, { entity: "Attendance" });
exports.remove = factory.deleteOne(Attendance, { entity: "Attendance" });

const LATE_CUTOFF_HOUR = 9; // after 9am counts as Late — adjust to your shift policy

exports.clockIn = catchAsync(async (req, res, next) => {
  const { employee } = req.body;
  if (!employee) return next(new AppError("employee is required", 400));

  const today = startOfDay(Date.now());
  let record = await Attendance.findOne({ employee, date: today });

  const now = new Date();
  const flag = now.getHours() >= LATE_CUTOFF_HOUR ? "Late" : "OnTime";

  if (record) {
    if (record.clockIn) return next(new AppError("Employee already clocked in today", 400));
    record.clockIn = now;
    record.flag = flag;
    await record.save();
  } else {
    record = await Attendance.create({ employee, date: today, clockIn: now, flag });
  }

  factory.logAudit({ req, action: "CLOCK_IN", entity: "Attendance", entityId: record._id });
  res.status(200).json({ status: "success", data: record });
});

exports.clockOut = catchAsync(async (req, res, next) => {
  const { employee } = req.body;
  if (!employee) return next(new AppError("employee is required", 400));

  const today = startOfDay(Date.now());
  const record = await Attendance.findOne({ employee, date: today });
  if (!record || !record.clockIn) {
    return next(new AppError("Employee has not clocked in today", 400));
  }
  if (record.clockOut) return next(new AppError("Employee already clocked out today", 400));

  record.clockOut = new Date();
  await record.save();

  factory.logAudit({ req, action: "CLOCK_OUT", entity: "Attendance", entityId: record._id });
  res.status(200).json({ status: "success", data: record });
});
