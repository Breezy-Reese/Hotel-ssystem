const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Maintenance = require("../models/Maintenance");
const Room = require("../models/Room");

const POPULATE = "room assignedTo reportedBy";

exports.getAll = factory.getAll(Maintenance, { searchableFields: ["ticketNumber", "issue"], defaultPopulate: POPULATE });
exports.getOne = factory.getOne(Maintenance, { defaultPopulate: POPULATE });
exports.remove = factory.deleteOne(Maintenance, { entity: "Maintenance" });

exports.create = catchAsync(async (req, res) => {
  const ticket = await Maintenance.create({ ...req.body, reportedBy: req.user._id });

  if (ticket.room) {
    await Room.findByIdAndUpdate(ticket.room, { status: "Maintenance" });
  }

  factory.logAudit({ req, action: "CREATE", entity: "Maintenance", entityId: ticket._id });
  res.status(201).json({ status: "success", data: ticket });
});

exports.updateStatus = catchAsync(async (req, res, next) => {
  const { status, cost } = req.body;
  const ticket = await Maintenance.findById(req.params.id);
  if (!ticket) return next(new AppError("No maintenance ticket found with that ID", 404));

  if (status) ticket.status = status;
  if (cost !== undefined) ticket.cost = cost;
  await ticket.save();

  if (status === "Resolved" && ticket.room) {
    await Room.findByIdAndUpdate(ticket.room, { status: "Available" });
  }

  factory.logAudit({ req, action: "UPDATE", entity: "Maintenance", entityId: ticket._id });
  res.status(200).json({ status: "success", data: ticket });
});
