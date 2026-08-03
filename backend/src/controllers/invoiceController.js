const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");

const POPULATE = "guest reservation branch";

exports.getAll = factory.getAll(Invoice, { searchableFields: ["invoiceNumber"], defaultPopulate: POPULATE });
exports.getOne = factory.getOne(Invoice, { defaultPopulate: POPULATE });
exports.create = factory.createOne(Invoice, { entity: "Invoice" });
exports.update = factory.updateOne(Invoice, { entity: "Invoice" });
exports.remove = factory.deleteOne(Invoice, { entity: "Invoice" });

// Records a payment against the invoice and marks it Paid if fully covered.
exports.pay = catchAsync(async (req, res, next) => {
  const { method, amount } = req.body;
  const invoice = await Invoice.findById(req.params.id);
  if (!invoice) return next(new AppError("No invoice found with that ID", 404));
  if (invoice.status === "Paid") return next(new AppError("Invoice is already paid", 400));
  if (invoice.status === "Cancelled") return next(new AppError("Invoice is cancelled", 400));

  const payment = await Payment.create({
    branch: invoice.branch,
    source: "Invoice",
    sourceId: invoice._id,
    method,
    amount,
    recordedBy: req.user._id,
  });

  if (amount >= invoice.total) {
    invoice.status = "Paid";
  } else {
    invoice.status = "Issued";
  }
  await invoice.save();

  factory.logAudit({ req, action: "PAYMENT", entity: "Invoice", entityId: invoice._id });
  res.status(200).json({ status: "success", data: { invoice, payment } });
});
