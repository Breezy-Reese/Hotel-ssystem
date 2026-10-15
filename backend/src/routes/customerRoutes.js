const express = require("express");
const mongoose = require("mongoose");

const Reservation = require("../models/Reservation");
const reservationController = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const router = express.Router();

// Every customer booking endpoint requires a valid login.
router.use(protect);

// Return reservations created by the current user, plus reservations
// linked to that user's Guest record when a guest association exists.
function customerOwnershipFilter(user) {
  const owners = [{ createdBy: user._id }];

  if (user.guest) {
    owners.push({ guest: user.guest });
  }

  return { $or: owners };
}

// GET /api/v1/customer/bookings
router.get(
  "/bookings",
  catchAsync(async (req, res) => {
    const bookings = await Reservation.find(
      customerOwnershipFilter(req.user)
    )
      .populate({
        path: "room",
        select: "roomNumber type images rate status",
      })
      .populate({
        path: "branch",
        select: "name location",
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: bookings.length,
      total: bookings.length,
      page: 1,
      limit: bookings.length,
      pages: bookings.length > 0 ? 1 : 0,
      data: bookings,
    });
  })
);

// Check ownership before allowing the existing cancellation controller
// to execute its normal reservation cancellation logic.
const ensureOwnBooking = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new AppError("Booking not found.", 404));
  }

  const booking = await Reservation.findOne({
    _id: req.params.id,
    ...customerOwnershipFilter(req.user),
  }).select("_id");

  if (!booking) {
    return next(
      new AppError(
        "Booking not found or you do not have permission to cancel it.",
        404
      )
    );
  }

  next();
});

// PATCH /api/v1/customer/bookings/:id/cancel
router.patch(
  "/bookings/:id/cancel",
  ensureOwnBooking,
  reservationController.cancelReservation
);

module.exports = router;
