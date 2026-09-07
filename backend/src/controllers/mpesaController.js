const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const mpesaService = require("../services/mpesaService");

const MpesaTransaction = require("../models/MpesaTransaction");
const Payment = require("../models/Payment");
const Invoice = require("../models/Invoice");
const Reservation = require("../models/Reservation");

const VALID_SOURCES = [
  "Reservation",
  "Order",
  "Service",
  "Invoice",
  "Sale",
];

/*
 * POST /api/v1/mpesa/stk-push
 *
 * Starts an M-Pesa STK Push.
 *
 * This endpoint is protected because it is called by an authenticated
 * customer/admin from the application.
 */
exports.initiatePayment = catchAsync(async (req, res, next) => {
  const {
    phone,
    amount,
    source,
    sourceId,
    accountReference,
    transactionDesc,
  } = req.body;

  // ---------------------------------------------------------
  // Validate required fields
  // ---------------------------------------------------------

  if (!phone || !amount || !source || !sourceId) {
    return next(
      new AppError(
        "phone, amount, source and sourceId are required",
        400
      )
    );
  }

  // ---------------------------------------------------------
  // Validate payment source
  // ---------------------------------------------------------

  if (!VALID_SOURCES.includes(source)) {
    return next(
      new AppError(
        `source must be one of: ${VALID_SOURCES.join(", ")}`,
        400
      )
    );
  }

  // ---------------------------------------------------------
  // Validate amount
  // ---------------------------------------------------------

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
    return next(
      new AppError("amount must be greater than 0", 400)
    );
  }

  // ---------------------------------------------------------
  // Validate phone number before contacting Safaricom
  // ---------------------------------------------------------

  let normalizedPhone;

  try {
    normalizedPhone = mpesaService.normalizePhone(phone);
  } catch (error) {
    return next(new AppError(error.message, 400));
  }

  // ---------------------------------------------------------
  // Make sure callback URL is configured
  //
  // We intentionally DO NOT accept a callback URL from the
  // frontend/request body.
  // ---------------------------------------------------------

  if (!process.env.MPESA_CALLBACK_URL) {
    return next(
      new AppError(
        "MPESA_CALLBACK_URL is not configured on the server",
        500
      )
    );
  }

  // ---------------------------------------------------------
  // Initiate STK Push
  //
  // The service gets the callback URL directly from the
  // server environment.
  // ---------------------------------------------------------

  const response = await mpesaService.initiateSTKPush({
    phone: normalizedPhone,
    amount: numericAmount,
    accountReference,
    transactionDesc,
  });

  // ---------------------------------------------------------
  // Safaricom response validation
  // ---------------------------------------------------------

  if (String(response.ResponseCode) !== "0") {
    return next(
      new AppError(
        response.ResponseDescription ||
          response.CustomerMessage ||
          "STK push request failed",
        400
      )
    );
  }

  if (!response.CheckoutRequestID) {
    return next(
      new AppError(
        "Safaricom did not return a CheckoutRequestID",
        500
      )
    );
  }

  // ---------------------------------------------------------
  // Save transaction
  // ---------------------------------------------------------

  const txn = await MpesaTransaction.create({
    checkoutRequestId: response.CheckoutRequestID,
    merchantRequestId: response.MerchantRequestID,
    phone: normalizedPhone,
    amount: numericAmount,
    source,
    sourceId,
    accountReference,
    transactionDesc,
    initiatedBy: req.user._id,
    status: "Pending",
  });

  // ---------------------------------------------------------
  // Return response to frontend
  // ---------------------------------------------------------

  return res.status(200).json({
    status: "success",
    message:
      response.CustomerMessage ||
      "Check your phone to complete payment.",
    data: {
      checkoutRequestId: txn.checkoutRequestId,
      transactionId: txn.transactionId,
    },
  });
});

/*
 * POST /api/v1/mpesa/callback
 *
 * PUBLIC endpoint.
 *
 * Safaricom sends the result of the STK Push here.
 *
 * DO NOT put this route behind authentication.
 */
exports.handleCallback = async (req, res) => {
  try {
    console.log(
      "M-Pesa callback received:",
      JSON.stringify(req.body, null, 2)
    );

    const callback = req.body?.Body?.stkCallback;

    // -------------------------------------------------------
    // Invalid/empty callback
    // -------------------------------------------------------

    if (!callback) {
      console.warn("M-Pesa callback did not contain stkCallback");

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    const {
      CheckoutRequestID,
      ResultCode,
      ResultDesc,
      CallbackMetadata,
    } = callback;

    if (!CheckoutRequestID) {
      console.warn(
        "M-Pesa callback missing CheckoutRequestID"
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    // -------------------------------------------------------
    // Find our transaction
    // -------------------------------------------------------

    const txn = await MpesaTransaction.findOne({
      checkoutRequestId: CheckoutRequestID,
    });

    if (!txn) {
      console.warn(
        `M-Pesa transaction not found: ${CheckoutRequestID}`
      );

      /*
       * Still return 200 to Safaricom.
       */
      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    // -------------------------------------------------------
    // Idempotency
    //
    // Ignore duplicate callbacks once transaction has already
    // been processed.
    // -------------------------------------------------------

    if (txn.status !== "Pending") {
      console.log(
        `M-Pesa transaction already processed: ${CheckoutRequestID}`
      );

      return res.status(200).json({
        ResultCode: 0,
        ResultDesc: "Accepted",
      });
    }

    txn.resultCode = ResultCode;
    txn.resultDesc = ResultDesc;

    // =======================================================
    // SUCCESSFUL PAYMENT
    // =======================================================

    if (Number(ResultCode) === 0) {
      const items = CallbackMetadata?.Item || [];

      const getItem = (name) => {
        const item = items.find(
          (entry) => entry.Name === name
        );

        return item?.Value;
      };

      const paidAmount = Number(
        getItem("Amount") ?? txn.amount
      );

      const receiptNumber = getItem(
        "MpesaReceiptNumber"
      );

      const transactionDate = getItem(
        "TransactionDate"
      );

      // -----------------------------------------------------
      // Update M-Pesa transaction
      // -----------------------------------------------------

      txn.status = "Success";
      txn.amount = paidAmount;

      if (receiptNumber) {
        txn.mpesaReceiptNumber = String(receiptNumber);
      }

      if (transactionDate) {
        txn.transactionDate = String(transactionDate);
      }

      await txn.save();

      // -----------------------------------------------------
      // Record payment
      // -----------------------------------------------------

      await Payment.create({
        source: txn.source,
        sourceId: txn.sourceId,
        method: "Mobile",
        amount: paidAmount,
        status: "Completed",
        recordedBy: txn.initiatedBy,
      });

      // =====================================================
      // RESERVATION PAYMENT
      // =====================================================

      if (txn.source === "Reservation") {
        const reservation = await Reservation.findById(
          txn.sourceId
        );

        if (reservation) {
          /*
           * Only confirm a reservation that is still pending.
           */
          if (reservation.status === "Pending") {
            reservation.status = "Confirmed";

            await reservation.save();

            console.log(
              `Reservation ${reservation.ref} confirmed after M-Pesa payment.`
            );
          }
        } else {
          console.warn(
            `Reservation not found for payment: ${txn.sourceId}`
          );
        }
      }

      // =====================================================
      // INVOICE PAYMENT
      // =====================================================

      if (txn.source === "Invoice") {
        const invoice = await Invoice.findById(
          txn.sourceId
        );

        if (invoice) {
          invoice.status =
            paidAmount >= invoice.total
              ? "Paid"
              : "Issued";

          await invoice.save();
        }
      }

      console.log(
        `M-Pesa payment successful: ${CheckoutRequestID}`
      );
    }

    // =======================================================
    // CANCELLED / FAILED PAYMENT
    // =======================================================

    else {
      /*
       * 1032 = customer cancelled the STK prompt.
       *
       * Other non-zero result codes are treated as failed.
       */
      txn.status =
        Number(ResultCode) === 1032
          ? "Cancelled"
          : "Failed";

      await txn.save();

      console.log(
        `M-Pesa payment ${txn.status}: ${CheckoutRequestID} - ${ResultDesc}`
      );
    }
  } catch (error) {
    /*
     * Never crash the callback endpoint.
     *
     * Safaricom should receive HTTP 200 even if our internal
     * database processing encounters a temporary problem.
     */
    console.error(
      "M-Pesa callback processing failed:",
      error
    );
  }

  return res.status(200).json({
    ResultCode: 0,
    ResultDesc: "Accepted",
  });
};

/*
 * GET /api/v1/mpesa/status/:checkoutRequestId
 *
 * Used by the frontend to poll the transaction status.
 */
exports.getStatus = catchAsync(
  async (req, res, next) => {
    const { checkoutRequestId } = req.params;

    if (!checkoutRequestId) {
      return next(
        new AppError(
          "CheckoutRequestID is required",
          400
        )
      );
    }

    const txn = await MpesaTransaction.findOne({
      checkoutRequestId,
    });

    if (!txn) {
      return next(
        new AppError(
          "No transaction found with that checkout request ID",
          404
        )
      );
    }

    return res.status(200).json({
      status: "success",
      data: txn,
    });
  }
);