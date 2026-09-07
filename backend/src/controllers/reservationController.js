const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

const Reservation = require("../models/Reservation");
const Room = require("../models/Room");
const Guest = require("../models/Guest");

const POPULATE = "guest room branch createdBy";

// ============================================================
// CONSTANTS
// ============================================================

const PENDING_HOLD_MINUTES = 15;

const BLOCKING_STATUSES = [
  "Pending",
  "Confirmed",
  "CheckedIn",
];

// ============================================================
// HELPER: Validate Kenyan M-Pesa phone
// ============================================================

function isValidKenyanPhone(phone) {
  if (!phone) {
    return false;
  }

  const cleanPhone = String(phone)
    .trim()
    .replace(/\s+/g, "");

  return (
    /^(?:07|01)\d{8}$/.test(cleanPhone) ||
    /^254(?:7|1)\d{8}$/.test(cleanPhone) ||
    /^\+254(?:7|1)\d{8}$/.test(cleanPhone)
  );
}

// ============================================================
// HELPER: Normalize Kenyan phone
// ============================================================

function normalizeKenyanPhone(phone) {
  if (!phone) {
    return null;
  }

  let cleanPhone = String(phone)
    .trim()
    .replace(/\s+/g, "");

  // +254712345678 -> 254712345678
  if (cleanPhone.startsWith("+254")) {
    cleanPhone = cleanPhone.substring(1);
  }

  // 0712345678 -> 254712345678
  // 0112345678 -> 254112345678
  if (
    cleanPhone.startsWith("07") ||
    cleanPhone.startsWith("01")
  ) {
    cleanPhone = `254${cleanPhone.substring(1)}`;
  }

  if (!/^254(?:7|1)\d{8}$/.test(cleanPhone)) {
    return null;
  }

  return cleanPhone;
}

// ============================================================
// HELPER: Release room when appropriate
// ============================================================

async function releaseRoomIfNoActiveReservation(roomId) {
  const activeReservation = await Reservation.findOne({
    room: roomId,
    status: {
      $in: BLOCKING_STATUSES,
    },
    checkOut: {
      $gt: new Date(),
    },
  });

  if (activeReservation) {
    return;
  }

  const room = await Room.findById(roomId);

  if (!room) {
    return;
  }

  if (room.status === "Reserved") {
    room.status = "Available";
    await room.save();
  }
}

// ============================================================
// HELPER: Check room availability
// ============================================================
//
// Pending:
//   Blocks room for 15 minutes.
//
// Confirmed:
//   Blocks room.
//
// CheckedIn:
//   Blocks room.
//
// CheckedOut:
//   Does NOT block.
//
// Cancelled:
//   Does NOT block.
//
// NoShow:
//   Does NOT block.
//
// Expired Pending reservations are automatically cancelled.
// ============================================================

async function isRoomAvailable(
  roomId,
  checkIn,
  checkOut,
  excludeReservationId,
) {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  if (
    Number.isNaN(checkInDate.getTime()) ||
    Number.isNaN(checkOutDate.getTime())
  ) {
    return false;
  }

  if (checkOutDate <= checkInDate) {
    return false;
  }

  const pendingExpiry = new Date(
    Date.now() - PENDING_HOLD_MINUTES * 60 * 1000,
  );

  const overlapQuery = {
    room: roomId,

    status: {
      $in: BLOCKING_STATUSES,
    },

    checkIn: {
      $lt: checkOutDate,
    },

    checkOut: {
      $gt: checkInDate,
    },
  };

  // When updating a reservation, exclude itself.
  if (excludeReservationId) {
    overlapQuery._id = {
      $ne: excludeReservationId,
    };
  }

  const reservations = await Reservation.find(
    overlapQuery,
  );

  for (const reservation of reservations) {
    // --------------------------------------------------------
    // Confirmed and CheckedIn always block.
    // --------------------------------------------------------

    if (
      ["Confirmed", "CheckedIn"].includes(
        reservation.status,
      )
    ) {
      return false;
    }

    // --------------------------------------------------------
    // Pending reservation is still within payment window.
    // --------------------------------------------------------

    if (
      reservation.status === "Pending" &&
      reservation.createdAt > pendingExpiry
    ) {
      return false;
    }

    // --------------------------------------------------------
    // Pending reservation has expired.
    // Cancel it and continue checking.
    // --------------------------------------------------------

    if (
      reservation.status === "Pending" &&
      reservation.createdAt <= pendingExpiry
    ) {
      reservation.status = "Cancelled";

      await reservation.save();

      await releaseRoomIfNoActiveReservation(
        reservation.room,
      );
    }
  }

  return true;
}

// ============================================================
// GET ALL RESERVATIONS
// ============================================================

exports.getAllReservations = factory.getAll(
  Reservation,
  {
    searchableFields: ["ref"],
    defaultPopulate: POPULATE,
  },
);

// ============================================================
// GET ONE RESERVATION
// ============================================================

exports.getReservation = factory.getOne(
  Reservation,
  {
    defaultPopulate: POPULATE,
  },
);

// ============================================================
// DELETE RESERVATION
// ============================================================

exports.deleteReservation = factory.deleteOne(
  Reservation,
  {
    entity: "Reservation",
  },
);

// ============================================================
// GET /api/v1/reservations/availability
// ============================================================

exports.checkAvailability = catchAsync(
  async (req, res, next) => {
    const {
      room: roomId,
      checkIn,
      checkOut,
    } = req.query;

    // --------------------------------------------------------
    // Required fields
    // --------------------------------------------------------

    if (!roomId || !checkIn || !checkOut) {
      return next(
        new AppError(
          "room, checkIn and checkOut query params are required",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // Validate dates
    // --------------------------------------------------------

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return next(
        new AppError(
          "Invalid check-in or check-out date",
          400,
        ),
      );
    }

    if (checkOutDate <= checkInDate) {
      return next(
        new AppError(
          "Check-out date must be after check-in date",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // Find room
    // --------------------------------------------------------

    const room = await Room.findById(roomId);

    if (!room) {
      return next(
        new AppError(
          "No room found with that ID",
          404,
        ),
      );
    }

    // --------------------------------------------------------
    // Check reservation availability
    // --------------------------------------------------------

    const available = await isRoomAvailable(
      room._id,
      checkInDate,
      checkOutDate,
    );

    return res.status(200).json({
      status: "success",

      data: {
        available,
        room: room._id,
        checkIn: checkInDate,
        checkOut: checkOutDate,
      },
    });
  },
);

// ============================================================
// POST /api/v1/reservations
// Customer creates online reservation
// ============================================================

exports.createReservation = catchAsync(
  async (req, res, next) => {
    const {
      room: roomId,
      checkIn,
      checkOut,
      adults = 1,
      children = 0,
      phone,
    } = req.body;

    // --------------------------------------------------------
    // 1. Authentication
    // --------------------------------------------------------

    if (!req.user) {
      return next(
        new AppError(
          "You must be logged in to make a reservation",
          401,
        ),
      );
    }

    // --------------------------------------------------------
    // 2. Room
    // --------------------------------------------------------

    if (!roomId) {
      return next(
        new AppError(
          "Room is required",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // 3. Dates
    // --------------------------------------------------------

    if (!checkIn) {
      return next(
        new AppError(
          "Check-in date is required",
          400,
        ),
      );
    }

    if (!checkOut) {
      return next(
        new AppError(
          "Check-out date is required",
          400,
        ),
      );
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return next(
        new AppError(
          "Invalid check-in or check-out date",
          400,
        ),
      );
    }

    if (checkOutDate <= checkInDate) {
      return next(
        new AppError(
          "Check-out date must be after check-in date",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // 4. Guest counts
    // --------------------------------------------------------

    const adultCount = Number(adults);
    const childCount = Number(children);

    if (
      !Number.isInteger(adultCount) ||
      adultCount < 1
    ) {
      return next(
        new AppError(
          "Adults must be at least 1",
          400,
        ),
      );
    }

    if (
      !Number.isInteger(childCount) ||
      childCount < 0
    ) {
      return next(
        new AppError(
          "Children cannot be negative",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // 5. Find room
    // --------------------------------------------------------

    const room = await Room.findById(roomId);

    if (!room) {
      return next(
        new AppError(
          "No room found with that ID",
          404,
        ),
      );
    }

    // --------------------------------------------------------
    // 6. Branch
    // --------------------------------------------------------

    if (!room.branch) {
      return next(
        new AppError(
          "This room is not assigned to a branch",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // 7. Capacity
    // --------------------------------------------------------

    const totalGuests =
      adultCount + childCount;

    if (
      room.capacity != null &&
      totalGuests > Number(room.capacity)
    ) {
      return next(
        new AppError(
          `This room can accommodate a maximum of ${room.capacity} guests`,
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // 8. Phone
    // --------------------------------------------------------

    if (!phone) {
      return next(
        new AppError(
          "M-Pesa phone number is required",
          400,
        ),
      );
    }

    if (!isValidKenyanPhone(phone)) {
      return next(
        new AppError(
          "Please provide a valid Kenyan M-Pesa phone number. Use 07XXXXXXXX, 01XXXXXXXX, 254XXXXXXXXX or +254XXXXXXXXX.",
          400,
        ),
      );
    }

    const cleanPhone =
      normalizeKenyanPhone(phone);

    if (!cleanPhone) {
      return next(
        new AppError(
          "Invalid Kenyan M-Pesa phone number",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // 9. Customer guest profile
    // --------------------------------------------------------

    if (!req.user.guest) {
      return next(
        new AppError(
          "Your customer account is not linked to a guest profile",
          400,
        ),
      );
    }

    const guest = await Guest.findById(
      req.user.guest,
    );

    if (!guest) {
      return next(
        new AppError(
          "Your guest profile could not be found",
          404,
        ),
      );
    }

    // --------------------------------------------------------
    // 10. Update guest phone
    // --------------------------------------------------------

    guest.phone = cleanPhone;

    await guest.save();

    // --------------------------------------------------------
    // 11. Calculate nights
    // --------------------------------------------------------

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const nights = Math.round(
      (checkOutDate.getTime() -
        checkInDate.getTime()) /
        millisecondsPerDay,
    );

    if (nights < 1) {
      return next(
        new AppError(
          "Reservation must be at least one night",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // 12. Room rate
    // --------------------------------------------------------

    const rateAtBooking =
      Number(room.rate);

    if (
      !Number.isFinite(rateAtBooking) ||
      rateAtBooking < 0
    ) {
      return next(
        new AppError(
          "The selected room has an invalid rate",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // 13. Check availability
    // --------------------------------------------------------

    const available =
      await isRoomAvailable(
        room._id,
        checkInDate,
        checkOutDate,
      );

    if (!available) {
      return next(
        new AppError(
          "Room is not available for the selected dates",
          409,
        ),
      );
    }

    // --------------------------------------------------------
    // 14. Prevent duplicate pending reservation
    // --------------------------------------------------------

    const pendingSince = new Date(
      Date.now() -
        PENDING_HOLD_MINUTES * 60 * 1000,
    );

    const existingPending =
      await Reservation.findOne({
        guest: guest._id,

        room: room._id,

        status: "Pending",

        checkIn: checkInDate,

        checkOut: checkOutDate,

        createdAt: {
          $gt: pendingSince,
        },
      });

    if (existingPending) {
      return next(
        new AppError(
          `You already have a pending reservation (${existingPending.ref}) for this room. Please complete the payment or cancel the reservation before trying again.`,
          409,
        ),
      );
    }

    // --------------------------------------------------------
    // 15. Calculate total
    // --------------------------------------------------------

    const totalAmount =
      rateAtBooking * nights;

    if (
      !Number.isFinite(totalAmount) ||
      totalAmount <= 0
    ) {
      return next(
        new AppError(
          "The reservation total must be greater than zero",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // 16. Create reservation
    // --------------------------------------------------------

    const reservation =
      await Reservation.create({
        guest: guest._id,

        room: room._id,

        branch: room.branch,

        checkIn: checkInDate,

        checkOut: checkOutDate,

        adults: adultCount,

        children: childCount,

        rateAtBooking,

        source: "Online",

        // Payment is not complete yet.
        status: "Pending",

        createdBy: req.user._id,
      });

    // --------------------------------------------------------
    // 17. Mark room Reserved
    // --------------------------------------------------------

    await Room.findByIdAndUpdate(
      room._id,
      {
        status: "Reserved",
      },
    );

    // --------------------------------------------------------
    // 18. Audit
    // --------------------------------------------------------

    factory.logAudit({
      req,
      action: "CREATE",
      entity: "Reservation",
      entityId: reservation._id,
    });

    // --------------------------------------------------------
    // 19. Response
    // --------------------------------------------------------

    return res.status(201).json({
      status: "success",

      data: {
        _id: reservation._id,

        ref: reservation.ref,

        status: reservation.status,

        guest: reservation.guest,

        room: reservation.room,

        branch: reservation.branch,

        checkIn: reservation.checkIn,

        checkOut: reservation.checkOut,

        adults: reservation.adults,

        children: reservation.children,

        rateAtBooking:
          reservation.rateAtBooking,

        nights,

        totalAmount,

        phone: cleanPhone,
      },
    });
  },
);

// ============================================================
// PATCH /api/v1/reservations/:id
// Update reservation
// ============================================================

exports.updateReservation = catchAsync(
  async (req, res, next) => {
    const reservation =
      await Reservation.findById(
        req.params.id,
      );

    if (!reservation) {
      return next(
        new AppError(
          "No reservation found with that ID",
          404,
        ),
      );
    }

    // Do not allow updates to completed/cancelled
    // reservations through this endpoint.
    if (
      ["CheckedOut", "Cancelled"].includes(
        reservation.status,
      )
    ) {
      return next(
        new AppError(
          "This reservation cannot be updated",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // Determine values
    // --------------------------------------------------------

    const newRoomId =
      req.body.room || reservation.room;

    const newCheckIn =
      req.body.checkIn ||
      reservation.checkIn;

    const newCheckOut =
      req.body.checkOut ||
      reservation.checkOut;

    const checkInDate =
      new Date(newCheckIn);

    const checkOutDate =
      new Date(newCheckOut);

    // --------------------------------------------------------
    // Validate dates
    // --------------------------------------------------------

    if (
      Number.isNaN(checkInDate.getTime()) ||
      Number.isNaN(checkOutDate.getTime())
    ) {
      return next(
        new AppError(
          "Invalid check-in or check-out date",
          400,
        ),
      );
    }

    if (checkOutDate <= checkInDate) {
      return next(
        new AppError(
          "Check-out date must be after check-in date",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // Find room
    // --------------------------------------------------------

    const room = await Room.findById(
      newRoomId,
    );

    if (!room) {
      return next(
        new AppError(
          "No room found with that ID",
          404,
        ),
      );
    }

    if (!room.branch) {
      return next(
        new AppError(
          "This room is not assigned to a branch",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // Guest counts
    // --------------------------------------------------------

    const adultCount =
      req.body.adults !== undefined
        ? Number(req.body.adults)
        : reservation.adults;

    const childCount =
      req.body.children !== undefined
        ? Number(req.body.children)
        : reservation.children;

    if (
      !Number.isInteger(adultCount) ||
      adultCount < 1
    ) {
      return next(
        new AppError(
          "Adults must be at least 1",
          400,
        ),
      );
    }

    if (
      !Number.isInteger(childCount) ||
      childCount < 0
    ) {
      return next(
        new AppError(
          "Children cannot be negative",
          400,
        ),
      );
    }

    const totalGuests =
      adultCount + childCount;

    if (
      room.capacity != null &&
      totalGuests > Number(room.capacity)
    ) {
      return next(
        new AppError(
          `This room can accommodate a maximum of ${room.capacity} guests`,
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // Availability
    // --------------------------------------------------------

    const available =
      await isRoomAvailable(
        newRoomId,
        checkInDate,
        checkOutDate,
        reservation._id,
      );

    if (!available) {
      return next(
        new AppError(
          "Room is not available for the selected dates",
          409,
        ),
      );
    }

    // --------------------------------------------------------
    // Rate
    // --------------------------------------------------------

    const rateAtBooking =
      Number(room.rate);

    if (
      !Number.isFinite(rateAtBooking) ||
      rateAtBooking < 0
    ) {
      return next(
        new AppError(
          "The selected room has an invalid rate",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // Calculate nights
    // --------------------------------------------------------

    const millisecondsPerDay =
      1000 * 60 * 60 * 24;

    const nights = Math.round(
      (checkOutDate.getTime() -
        checkInDate.getTime()) /
        millisecondsPerDay,
    );

    if (nights < 1) {
      return next(
        new AppError(
          "Reservation must be at least one night",
          400,
        ),
      );
    }

    // --------------------------------------------------------
    // Safe update
    // --------------------------------------------------------

    const updateData = {
      ...req.body,

      room: room._id,

      branch: room.branch,

      checkIn: checkInDate,

      checkOut: checkOutDate,

      adults: adultCount,

      children: childCount,

      rateAtBooking,
    };

    // Never allow these fields to be changed.
    delete updateData.status;
    delete updateData.createdBy;
    delete updateData.ref;
    delete updateData.guest;
    delete updateData.source;

    const updatedReservation =
      await Reservation.findByIdAndUpdate(
        req.params.id,
        updateData,
        {
          new: true,
          runValidators: true,
        },
      );

    if (!updatedReservation) {
      return next(
        new AppError(
          "No reservation found with that ID",
          404,
        ),
      );
    }

    // --------------------------------------------------------
    // Audit
    // --------------------------------------------------------

    factory.logAudit({
      req,
      action: "UPDATE",
      entity: "Reservation",
      entityId: updatedReservation._id,
    });

    return res.status(200).json({
      status: "success",
      data: updatedReservation,
    });
  },
);

// ============================================================
// CHECK IN
// PATCH /api/v1/reservations/:id/check-in
// ============================================================

exports.checkIn = catchAsync(
  async (req, res, next) => {
    const reservation =
      await Reservation.findById(
        req.params.id,
      );

    if (!reservation) {
      return next(
        new AppError(
          "No reservation found with that ID",
          404,
        ),
      );
    }

    if (
      reservation.status === "CheckedIn"
    ) {
      return next(
        new AppError(
          "Reservation is already checked in",
          400,
        ),
      );
    }

    // Payment must be completed.
    if (
      reservation.status !== "Confirmed"
    ) {
      return next(
        new AppError(
          "Only a confirmed reservation can be checked in",
          400,
        ),
      );
    }

    reservation.status = "CheckedIn";

    await reservation.save();

    await Room.findByIdAndUpdate(
      reservation.room,
      {
        status: "Occupied",
      },
    );

    factory.logAudit({
      req,
      action: "CHECK_IN",
      entity: "Reservation",
      entityId: reservation._id,
    });

    return res.status(200).json({
      status: "success",
      data: reservation,
    });
  },
);

// ============================================================
// CHECK OUT
// PATCH /api/v1/reservations/:id/check-out
// ============================================================

exports.checkOut = catchAsync(
  async (req, res, next) => {
    const reservation =
      await Reservation.findById(
        req.params.id,
      );

    if (!reservation) {
      return next(
        new AppError(
          "No reservation found with that ID",
          404,
        ),
      );
    }

    if (
      reservation.status !== "CheckedIn"
    ) {
      return next(
        new AppError(
          "Reservation must be checked in before it can be checked out",
          400,
        ),
      );
    }

    reservation.status = "CheckedOut";

    await reservation.save();

    await Room.findByIdAndUpdate(
      reservation.room,
      {
        status: "Cleaning",
      },
    );

    factory.logAudit({
      req,
      action: "CHECK_OUT",
      entity: "Reservation",
      entityId: reservation._id,
    });

    return res.status(200).json({
      status: "success",
      data: reservation,
    });
  },
);

// ============================================================
// CANCEL RESERVATION
// PATCH /api/v1/reservations/:id/cancel
// ============================================================

exports.cancelReservation =
  catchAsync(async (req, res, next) => {
    const reservation =
      await Reservation.findById(
        req.params.id,
      );

    if (!reservation) {
      return next(
        new AppError(
          "No reservation found with that ID",
          404,
        ),
      );
    }

    if (
      ["CheckedOut", "Cancelled"].includes(
        reservation.status,
      )
    ) {
      return next(
        new AppError(
          "This reservation cannot be cancelled",
          400,
        ),
      );
    }

    // Do not allow a CheckedIn reservation
    // to be cancelled through this endpoint.
    if (reservation.status === "CheckedIn") {
      return next(
        new AppError(
          "A checked-in reservation cannot be cancelled",
          400,
        ),
      );
    }

    reservation.status = "Cancelled";

    await reservation.save();

    // --------------------------------------------------------
    // Release room only if no other active reservation
    // requires it.
    // --------------------------------------------------------

    await releaseRoomIfNoActiveReservation(
      reservation.room,
    );

    // --------------------------------------------------------
    // Audit
    // --------------------------------------------------------

    factory.logAudit({
      req,
      action: "CANCEL",
      entity: "Reservation",
      entityId: reservation._id,
    });

    return res.status(200).json({
      status: "success",
      data: reservation,
    });
  });

// ============================================================
// EXPORT AVAILABILITY HELPER
// ============================================================

module.exports.isRoomAvailable =
  isRoomAvailable;