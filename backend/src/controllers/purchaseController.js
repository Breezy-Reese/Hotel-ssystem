const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Purchase = require("../models/Purchase");
const InventoryItem = require("../models/InventoryItem");
const Supplier = require("../models/Supplier");

const POPULATE = "supplier branch createdBy items.item";

exports.getAll = factory.getAll(Purchase, { searchableFields: ["poNumber"], defaultPopulate: POPULATE });
exports.getOne = factory.getOne(Purchase, { defaultPopulate: POPULATE });
exports.remove = factory.deleteOne(Purchase, { entity: "Purchase" });

exports.create = catchAsync(async (req, res) => {
  const purchase = await Purchase.create({ ...req.body, createdBy: req.user._id });
  factory.logAudit({ req, action: "CREATE", entity: "Purchase", entityId: purchase._id });
  res.status(201).json({ status: "success", data: purchase });
});

exports.update = catchAsync(async (req, res, next) => {
  const purchase = await Purchase.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!purchase) return next(new AppError("No purchase order found with that ID", 404));
  factory.logAudit({ req, action: "UPDATE", entity: "Purchase", entityId: purchase._id });
  res.status(200).json({ status: "success", data: purchase });
});

// Marks the PO Received, increments matched inventory item stock, and adds the
// PO's total cost to the supplier's outstanding balance.
exports.receive = catchAsync(async (req, res, next) => {
  const purchase = await Purchase.findById(req.params.id);
  if (!purchase) return next(new AppError("No purchase order found with that ID", 404));
  if (purchase.status === "Received") return next(new AppError("Purchase order already received", 400));

  await Promise.all(
    purchase.items
      .filter((line) => line.item)
      .map((line) => InventoryItem.findByIdAndUpdate(line.item, { $inc: { quantity: line.quantity } })),
  );

  purchase.status = "Received";
  purchase.receivedDate = Date.now();
  await purchase.save();

  await Supplier.findByIdAndUpdate(purchase.supplier, { $inc: { balanceOwed: purchase.totalCost } });

  factory.logAudit({ req, action: "RECEIVE", entity: "Purchase", entityId: purchase._id });
  res.status(200).json({ status: "success", data: purchase });
});
