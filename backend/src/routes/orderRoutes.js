const express = require("express");
const orderController = require("../controllers/orderController");
const { protect } = require("../middleware/auth");

const router = express.Router();
router.use(protect);

router.get("/kitchen", orderController.getKitchenTickets);

router.route("/").get(orderController.getAll).post(orderController.createOrder);
router.route("/:id").get(orderController.getOne).delete(orderController.deleteOrder);
router.patch("/:id/status", orderController.updateStatus);

module.exports = router;
