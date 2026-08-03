const factory = require("./handlerFactory");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const Reservation = require("../models/Reservation");
const Room = require("../models/Room");

const POPULATE = "guest room branch createdBy";

exports.getAllReservations = factory.getAll(Reservation, {
  searchableFields: ["ref"],
  defaultPopulate: POPULATE,
});
exports.getReservation = factory.getOne(Reservation, { defaultPopulate: POPULATE });
exports.deleteReservation = factory.deleteOne(Reservation, { entity: "Reservation" });

// Checks whether a room has any overlapping, non-cancelled reservation for the
// given date range. Used both as a standalone endpoint and before creating a booking.
async function isRoomAvailable(roomId, checkIn, checkOut, excludeReservationId) {
  const overlap = await Reservation.findOne({
    room: roomId,
    status: { $nin: ["Cancelled", "NoShow", "CheckedOut"] },
    ...(excludeReservationId && { _id: { $ne: excludeReservationId } }),
    checkIn: { $lt: new Date(checkOut) },
    checkOut: { $gt: new Date(checkIn) },
  });
  return !overlap;
}

exports.checkAvailability = catchAsync(async (req, res, next) => {
  const { room, checkIn, checkOut } = req.query;
  if (!room || !checkIn || !checkOut) {
    return next(new AppError("room, checkIn and checkOut query params are required", 400));
  }
  const available = await isRoomAvailable(room, checkIn, checkOut);
  res.status(200).json({ status: "success", data: { available } });
});

exports.createReservation = catchAsync(async (req, res, next) => {
  const { room, checkIn, checkOut } = req.body;

  const available = await isRoomAvailable(room, checkIn, checkOut);
  if (!available) {
    return next(new AppError("Room is not available for the selected dates", 409));
  }

  const reservation = await Reservation.create({
    ...req.body,
    createdBy: req.user._id,
    status: req.body.status || "Confirmed",
  });

  await Room.findByIdAndUpdate(room, { status: "Reserved" });

  factory.logAudit({ req, action: "CREATE", entity: "Reservation", entityId: reservation._id });

  res.status(201).json({ status: "success", data: reservation });
});

exports.updateReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!reservation) return next(new AppError("No reservation found with that ID", 404));

  factory.logAudit({ req, action: "UPDATE", entity: "Reservation", entityId: reservation._id });
  res.status(200).json({ status: "success", data: reservation });
});

exports.checkIn = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return next(new AppError("No reservation found with that ID", 404));
  if (reservation.status === "CheckedIn") {
    return next(new AppError("Reservation is already checked in", 400));
  }

  reservation.status = "CheckedIn";
  await reservation.save();
  await Room.findByIdAndUpdate(reservation.room, { status: "Occupied" });

  factory.logAudit({ req, action: "CHECK_IN", entity: "Reservation", entityId: reservation._id });
  res.status(200).json({ status: "success", data: reservation });
});

exports.checkOut = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return next(new AppError("No reservation found with that ID", 404));
  if (reservation.status !== "CheckedIn") {
    return next(new AppError("Reservation must be checked in before it can be checked out", 400));
  }

  reservation.status = "CheckedOut";
  await reservation.save();
  // Room goes to Cleaning, not straight back to Available — housekeeping clears it.
  await Room.findByIdAndUpdate(reservation.room, { status: "Cleaning" });

  factory.logAudit({ req, action: "CHECK_OUT", entity: "Reservation", entityId: reservation._id });
  res.status(200).json({ status: "success", data: reservation });
});

exports.cancelReservation = catchAsync(async (req, res, next) => {
  const reservation = await Reservation.findById(req.params.id);
  if (!reservation) return next(new AppError("No reservation found with that ID", 404));

  reservation.status = "Cancelled";
  await reservation.save();

  const room = await Room.findById(reservation.room);
  if (room && room.status === "Reserved") {
    room.status = "Available";
    await room.save();
  }

  factory.logAudit({ req, action: "CANCEL", entity: "Reservation", entityId: reservation._id });
  res.status(200).json({ status: "success", data: reservation });
});
