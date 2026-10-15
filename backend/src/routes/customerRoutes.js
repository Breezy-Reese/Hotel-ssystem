const express = require("express");
const mongoose = require("mongoose");

const Reservation = require("../models/Reservation");
const reservationController = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const router = express.Router();

router.use(protect);

function ownershipFilter(user) {
  const conditions = [{ createdBy: user._id }];

  if (user.guest) {
    conditions.push({ guest: user.guest });
  }

  return { $or: conditions };
}

// GET /api/v1/customer/bookings
router.get(
  "/bookings",
  catchAsync(async (req, res) => {
    const bookings = await Reservation.find(
      ownershipFilter(req.user)
    )
      .populate("room", "roomNumber type images rate status")
      .populate("branch", "name location")
      .populate("guest", "name phone email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      status: "success",
      results: bookings.length,
      total: bookings.length,
      page: 1,
      limit: bookings.length,
      pages: bookings.length ? 1 : 0,
      data: bookings,
    });
  })
);

// Check ownership before permitting a cancellation.
const ensureOwnBooking = catchAsync(async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return next(new AppError("Booking not found.", 404));
  }

  const booking = await Reservation.findOne({
    _id: req.params.id,
    ...ownershipFilter(req.user),
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
