const express = require("express");

const router = express.Router();

router.use("/auth", require("./authRoutes"));
router.use("/users", require("./userRoutes"));
router.use("/branches", require("./branchRoutes"));
router.use("/rooms", require("./roomRoutes"));
router.use("/guests", require("./guestRoutes"));
router.use("/reservations", require("./reservationRoutes"));
router.use("/housekeeping", require("./housekeepingRoutes"));
router.use("/maintenance", require("./maintenanceRoutes"));
router.use("/menu-items", require("./menuItemRoutes"));
router.use("/orders", require("./orderRoutes"));
router.use("/tables", require("./tableRoutes"));
router.use("/sales", require("./saleRoutes")); // POS
router.use("/payments", require("./paymentRoutes"));
router.use("/invoices", require("./invoiceRoutes"));
router.use("/expenses", require("./expenseRoutes"));
router.use("/reports", require("./reportsRoutes"));
router.use("/inventory", require("./inventoryRoutes"));
router.use("/suppliers", require("./supplierRoutes"));
router.use("/purchases", require("./purchaseRoutes"));
router.use("/services", require("./serviceRoutes"));
router.use("/service-bookings", require("./serviceBookingRoutes"));
router.use("/reviews", require("./reviewRoutes"));
router.use("/notifications", require("./notificationRoutes"));
router.use("/employees", require("./employeeRoutes"));
router.use("/attendance", require("./attendanceRoutes"));
router.use("/tasks", require("./taskRoutes"));
router.use("/promotions", require("./promotionRoutes"));
router.use("/loyalty", require("./loyaltyRoutes"));
router.use("/audit-logs", require("./auditLogRoutes"));
router.use("/documents", require("./documentRoutes"));
router.use("/mpesa", require("./mpesaRoutes"));

module.exports = router;
