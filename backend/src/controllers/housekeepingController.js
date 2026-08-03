const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Housekeeping = require("../models/Housekeeping");
const Room = require("../models/Room");

const POPULATE = "room assignedTo";

exports.getAll = factory.getAll(Housekeeping, { defaultPopulate: POPULATE });
exports.getOne = factory.getOne(Housekeeping, { defaultPopulate: POPULATE });
exports.create = factory.createOne(Housekeeping, { entity: "Housekeeping" });
exports.remove = factory.deleteOne(Housekeeping, { entity: "Housekeeping" });

exports.updateStatus = catchAsync(async (req, res, next) => {
  const { cleaningStatus, notes } = req.body;
  const task = await Housekeeping.findById(req.params.id);
  if (!task) return next(new AppError("No housekeeping task found with that ID", 404));

  if (cleaningStatus) task.cleaningStatus = cleaningStatus;
  if (notes !== undefined) task.notes = notes;
  await task.save();

  // Ready -> room becomes Available again; DamageReported -> room flagged for Maintenance.
  if (cleaningStatus === "Ready") {
    await Room.findByIdAndUpdate(task.room, { status: "Available" });
  } else if (cleaningStatus === "InProgress") {
    await Room.findByIdAndUpdate(task.room, { status: "Cleaning" });
  } else if (cleaningStatus === "DamageReported") {
    await Room.findByIdAndUpdate(task.room, { status: "Maintenance" });
  }

  factory.logAudit({ req, action: "UPDATE", entity: "Housekeeping", entityId: task._id });
  res.status(200).json({ status: "success", data: task });
});
