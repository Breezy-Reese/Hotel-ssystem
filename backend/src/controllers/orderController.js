const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Order = require("../models/Order");
const RestaurantTable = require("../models/RestaurantTable");

const POPULATE = "table room guest branch createdBy items.menuItem";

exports.getAll = factory.getAll(Order, { searchableFields: ["orderNumber"], defaultPopulate: POPULATE });
exports.getOne = factory.getOne(Order, { defaultPopulate: POPULATE });
exports.deleteOrder = factory.deleteOne(Order, { entity: "Order" });

exports.createOrder = catchAsync(async (req, res) => {
  const order = await Order.create({ ...req.body, createdBy: req.user._id });

  if (order.type === "DineIn" && order.table) {
    await RestaurantTable.findByIdAndUpdate(order.table, { status: "Occupied" });
  }

  factory.logAudit({ req, action: "CREATE", entity: "Order", entityId: order._id });
  res.status(201).json({ status: "success", data: order });
});

// Kitchen Display: active tickets only, oldest first, optionally filtered by station.
exports.getKitchenTickets = catchAsync(async (req, res) => {
  const filter = { status: { $in: ["Pending", "Preparing", "Ready"] } };
  if (req.query.station) filter.station = req.query.station;

  const tickets = await Order.find(filter)
    .sort("placedAt")
    .populate("table room items.menuItem");

  res.status(200).json({ status: "success", results: tickets.length, data: tickets });
});

const VALID_TRANSITIONS = {
  Pending: ["Preparing", "Cancelled"],
  Preparing: ["Ready", "Cancelled"],
  Ready: ["Served", "Cancelled"],
  Served: ["Completed"],
  Completed: [],
  Cancelled: [],
};

exports.updateStatus = catchAsync(async (req, res, next) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id);
  if (!order) return next(new AppError("No order found with that ID", 404));

  const allowed = VALID_TRANSITIONS[order.status] || [];
  if (!allowed.includes(status)) {
    return next(new AppError(`Cannot move order from ${order.status} to ${status}`, 400));
  }

  order.status = status;
  if (status === "Ready") order.readyAt = Date.now();
  await order.save();

  if (["Completed", "Cancelled"].includes(status) && order.type === "DineIn" && order.table) {
    await RestaurantTable.findByIdAndUpdate(order.table, { status: "Available" });
  }

  factory.logAudit({ req, action: "UPDATE", entity: "Order", entityId: order._id });
  res.status(200).json({ status: "success", data: order });
});
