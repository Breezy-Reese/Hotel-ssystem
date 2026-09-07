const express = require("express");

const reservationController = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All reservation routes require authentication.
router.use(protect);

// Availability
router.get(
  "/availability",
  reservationController.checkAvailability,
);

// Reservations
router
  .route("/")
  .get(reservationController.getAllReservations)
  .post(reservationController.createReservation);

// Individual reservation
router
  .route("/:id")
  .get(reservationController.getReservation)
  .patch(reservationController.updateReservation)
  .delete(reservationController.deleteReservation);

// Check-in
router.patch(
  "/:id/check-in",
  reservationController.checkIn,
);

// Check-out
router.patch(
  "/:id/check-out",
  reservationController.checkOut,
);

// Cancel
router.patch(
  "/:id/cancel",
  reservationController.cancelReservation,
);

module.exports = router;