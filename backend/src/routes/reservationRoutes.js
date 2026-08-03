const express = require("express");
const reservationController = require("../controllers/reservationController");
const { protect } = require("../middleware/auth");

const router = express.Router();

router.use(protect);

router.get("/availability", reservationController.checkAvailability);

router
  .route("/")
  .get(reservationController.getAllReservations)
  .post(reservationController.createReservation);

router
  .route("/:id")
  .get(reservationController.getReservation)
  .patch(reservationController.updateReservation)
  .delete(reservationController.deleteReservation);

router.patch("/:id/check-in", reservationController.checkIn);
router.patch("/:id/check-out", reservationController.checkOut);
router.patch("/:id/cancel", reservationController.cancelReservation);

module.exports = router;
