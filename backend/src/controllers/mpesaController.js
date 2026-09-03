const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const mpesaService = require("../services/mpesaService");
const MpesaTransaction = require("../models/MpesaTransaction");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");

const VALID_SOURCES = ["Reservation", "Order", "Service", "Invoice", "Sale"];

// POST /api/v1/mpesa/stk-push
// Starts an STK Push (the "Enter M-Pesa PIN" prompt) against any payable
// entity — mirrors the generic source/sourceId shape the Payment model uses.
exports.initiatePayment = catchAsync(async (req, res, next) => {
  const { phone, amount, source, sourceId, accountReference, transactionDesc } = req.body;

  if (!phone || !amount || !source || !sourceId) {
    return next(new AppError("phone, amount, source and sourceId are required", 400));
  }
  if (!VALID_SOURCES.includes(source)) {
    return next(new AppError(`source must be one of: ${VALID_SOURCES.join(", ")}`, 400));
  }
  if (Number(amount) <= 0) {
    return next(new AppError("amount must be greater than 0", 400));
  }

  const callbackUrl = process.env.MPESA_CALLBACK_URL;
  if (!callbackUrl) {
    return next(new AppError("MPESA_CALLBACK_URL is not configured on the server", 500));
  }

  const response = await mpesaService.initiateSTKPush({
    phone,
    amount,
    accountReference,
    transactionDesc,
    callbackUrl,
  });

  if (response.ResponseCode !== "0") {
    return next(new AppError(response.ResponseDescription || "STK push request failed", 400));
  }

  const txn = await MpesaTransaction.create({
    checkoutRequestId: response.CheckoutRequestID,
    merchantRequestId: response.MerchantRequestID,
    phone: mpesaService.normalizePhone(phone),
    amount,
    source,
    sourceId,
    accountReference,
    transactionDesc,
    initiatedBy: req.user._id,
  });

  res.status(200).json({
    status: "success",
    message: response.CustomerMessage || "Check your phone to complete payment.",
    data: {
      checkoutRequestId: txn.checkoutRequestId,
      transactionId: txn.transactionId,
    },
  });
});

// POST /api/v1/mpesa/callback
// PUBLIC — Safaricom's servers call this directly with the payment result.
// No auth header will be present; intentionally NOT behind `protect`.
// Always responds 200 with this exact shape — even on an internal error — so a
// transient DB hiccup doesn't cause Safaricom to retry-storm this endpoint.
// The idempotency check below (txn.status === "Pending") makes retries safe.
exports.handleCallback = async (req, res) => {
  try {
    const callback = req.body?.Body?.stkCallback;
    if (!callback) return res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });

    const { CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = callback;
    const txn = await MpesaTransaction.findOne({ checkoutRequestId: CheckoutRequestID });

    if (txn && txn.status === "Pending") {
      txn.resultCode = ResultCode;
      txn.resultDesc = ResultDesc;

      if (ResultCode === 0) {
        const items = CallbackMetadata?.Item || [];
        const getItem = (name) => items.find((i) => i.Name === name)?.Value;

        const paidAmount = Number(getItem("Amount") ?? txn.amount);

        txn.status = "Success";
        txn.mpesaReceiptNumber = getItem("MpesaReceiptNumber");
        txn.transactionDate = String(getItem("TransactionDate") ?? "");
        txn.amount = paidAmount;

        await Payment.create({
          source: txn.source,
          sourceId: txn.sourceId,
          method: "Mobile",
          amount: paidAmount,
          status: "Completed",
          recordedBy: txn.initiatedBy,
        });

        // Invoice is the one entity with a bespoke "mark as paid" side effect today.
        if (txn.source === "Invoice") {
          const invoice = await Invoice.findById(txn.sourceId);
          if (invoice) {
            invoice.status = paidAmount >= invoice.total ? "Paid" : "Issued";
            await invoice.save();
          }
        }
      } else {
        // ResultCode 1032 = cancelled by the user on their phone; anything else = failed.
        txn.status = ResultCode === 1032 ? "Cancelled" : "Failed";
      }

      await txn.save();
    }
  } catch (err) {
    console.error("M-Pesa callback processing failed:", err);
  }

  res.status(200).json({ ResultCode: 0, ResultDesc: "Accepted" });
};

// GET /api/v1/mpesa/status/:checkoutRequestId
// The frontend polls this after initiating a push to know when to stop waiting.
exports.getStatus = catchAsync(async (req, res, next) => {
  const txn = await MpesaTransaction.findOne({ checkoutRequestId: req.params.checkoutRequestId });
  if (!txn) return next(new AppError("No transaction found with that checkout request ID", 404));

  res.status(200).json({ status: "success", data: txn });
});