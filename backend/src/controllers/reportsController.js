const catchAsync = require("../utils/catchAsync");

const Room = require("../models/Room");
const Reservation = require("../models/Reservation");
const Order = require("../models/Order");
const Invoice = require("../models/Invoice");
const Payment = require("../models/Payment");
const Sale = require("../models/Sale");
const Expense = require("../models/Expense");
const Housekeeping = require("../models/Housekeeping");
const Maintenance = require("../models/Maintenance");
const InventoryItem = require("../models/InventoryItem");
const Employee = require("../models/Employee");
const Task = require("../models/Task");
const Guest = require("../models/Guest");
const User = require("../models/User");

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
function endOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// One combined payload feeding the stat cards across most module pages
// (Room Management, Reservations, Front Desk, Housekeeping, Maintenance,
// Orders, Inventory, Employees, Tasks) so the frontend can hit a single
// endpoint on dashboard load instead of N separate ones.
exports.getDashboard = catchAsync(async (req, res) => {
  const today = { $gte: startOfDay(), $lte: endOfDay() };

  const [
    totalRooms,
    availableRooms,
    occupiedRooms,
    outOfServiceRooms,
    arrivalsToday,
    departuresToday,
    inHouse,
    cancellationsToday,
    pendingOrders,
    preparingOrders,
    readyOrders,
    completedOrdersToday,
    openInvoices,
    revenueTodayAgg,
    roomsToClean,
    housekeepingInProgress,
    damageReports,
    openMaintenanceTickets,
    maintenanceInProgress,
    lowStockItems,
    outOfStockItems,
    totalEmployees,
    onLeaveEmployees,
    openTasks,
    overdueTasks,
    totalGuests,
    vipGuests,
    totalUsers,
    activeUsers,
  ] = await Promise.all([
    Room.countDocuments(),
    Room.countDocuments({ status: "Available" }),
    Room.countDocuments({ status: "Occupied" }),
    Room.countDocuments({ status: "Maintenance" }),
    Reservation.countDocuments({ checkIn: today, status: { $in: ["Confirmed", "Pending"] } }),
    Reservation.countDocuments({ checkOut: today, status: "CheckedIn" }),
    Reservation.countDocuments({ status: "CheckedIn" }),
    Reservation.countDocuments({ status: "Cancelled", updatedAt: today }),
    Order.countDocuments({ status: "Pending" }),
    Order.countDocuments({ status: "Preparing" }),
    Order.countDocuments({ status: "Ready" }),
    Order.countDocuments({ status: "Completed", updatedAt: today }),
    Invoice.countDocuments({ status: { $in: ["Open", "Issued"] } }),
    Payment.aggregate([
      { $match: { date: today, status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]),
    Housekeeping.countDocuments({ cleaningStatus: "Pending" }),
    Housekeeping.countDocuments({ cleaningStatus: "InProgress" }),
    Housekeeping.countDocuments({ cleaningStatus: "DamageReported" }),
    Maintenance.countDocuments({ status: "Open" }),
    Maintenance.countDocuments({ status: "InProgress" }),
    InventoryItem.countDocuments({ $expr: { $and: [{ $lte: ["$quantity", "$reorderLevel"] }, { $gt: ["$quantity", 0] }] } }),
    InventoryItem.countDocuments({ quantity: { $lte: 0 } }),
    Employee.countDocuments(),
    Employee.countDocuments({ status: "OnLeave" }),
    Task.countDocuments({ status: { $in: ["Open", "InProgress"] } }),
    Task.countDocuments({ status: "Overdue" }),
    Guest.countDocuments(),
    Guest.countDocuments({ vip: true }),
    User.countDocuments(),
    User.countDocuments({ status: "Active" }),
  ]);

  res.status(200).json({
    status: "success",
    data: {
      rooms: { total: totalRooms, available: availableRooms, occupied: occupiedRooms, outOfService: outOfServiceRooms },
      reservations: { arrivalsToday, departuresToday, inHouse, cancellationsToday },
      orders: { pending: pendingOrders, preparing: preparingOrders, ready: readyOrders, completedToday: completedOrdersToday },
      billing: { openInvoices, revenueToday: revenueTodayAgg[0]?.total || 0 },
      housekeeping: { roomsToClean, inProgress: housekeepingInProgress, damageReports },
      maintenance: { openTickets: openMaintenanceTickets, inProgress: maintenanceInProgress },
      inventory: { lowStock: lowStockItems, outOfStock: outOfStockItems },
      employees: { total: totalEmployees, onLeave: onLeaveEmployees },
      tasks: { open: openTasks, overdue: overdueTasks },
      guests: { total: totalGuests, vip: vipGuests },
      users: { total: totalUsers, active: activeUsers },
    },
  });
});

// Revenue & Financial Reports module: rows of { period, hotelRevenue,
// restaurantRevenue, expenses, profit } grouped by day or month.
exports.getRevenueReport = catchAsync(async (req, res) => {
  const { groupBy = "day", from, to } = req.query;
  const dateFormat = groupBy === "month" ? "%Y-%m" : "%Y-%m-%d";

  const dateMatch = {};
  if (from) dateMatch.$gte = new Date(from);
  if (to) dateMatch.$lte = new Date(to);
  const hasRange = Object.keys(dateMatch).length > 0;

  const [hotelRevenue, restaurantRevenue, expenses] = await Promise.all([
    Invoice.aggregate([
      { $match: { status: "Paid", ...(hasRange && { updatedAt: dateMatch }) } },
      {
        $addFields: {
          subtotal: { $sum: "$charges.amount" },
        },
      },
      {
        $addFields: {
          total: { $add: [{ $add: ["$subtotal", { $multiply: ["$subtotal", { $divide: ["$tax", 100] }] }] }, { $multiply: ["$discount", -1] }] },
        },
      },
      { $group: { _id: { $dateToString: { format: dateFormat, date: "$updatedAt" } }, total: { $sum: "$total" } } },
    ]),
    Sale.aggregate([
      ...(hasRange ? [{ $match: { createdAt: dateMatch } }] : []),
      { $addFields: { subtotal: { $sum: { $map: { input: "$items", as: "i", in: { $multiply: ["$$i.price", "$$i.quantity"] } } } } } },
      { $addFields: { total: { $subtract: ["$subtotal", "$discount"] } } },
      { $group: { _id: { $dateToString: { format: dateFormat, date: "$createdAt" } }, total: { $sum: "$total" } } },
    ]),
    Expense.aggregate([
      { $match: { status: { $in: ["Approved", "Paid"] }, ...(hasRange && { date: dateMatch }) } },
      { $group: { _id: { $dateToString: { format: dateFormat, date: "$date" } }, total: { $sum: "$amount" } } },
    ]),
  ]);

  const periods = new Set([
    ...hotelRevenue.map((r) => r._id),
    ...restaurantRevenue.map((r) => r._id),
    ...expenses.map((r) => r._id),
  ]);

  const toMap = (arr) => Object.fromEntries(arr.map((r) => [r._id, r.total]));
  const hotelMap = toMap(hotelRevenue);
  const restaurantMap = toMap(restaurantRevenue);
  const expenseMap = toMap(expenses);

  const rows = [...periods]
    .sort()
    .map((period) => {
      const hotel = hotelMap[period] || 0;
      const restaurant = restaurantMap[period] || 0;
      const exp = expenseMap[period] || 0;
      return {
        period,
        hotelRevenue: hotel,
        restaurantRevenue: restaurant,
        expenses: exp,
        profit: hotel + restaurant - exp,
      };
    });

  const totals = rows.reduce(
    (acc, r) => ({
      hotelRevenue: acc.hotelRevenue + r.hotelRevenue,
      restaurantRevenue: acc.restaurantRevenue + r.restaurantRevenue,
      expenses: acc.expenses + r.expenses,
      profit: acc.profit + r.profit,
    }),
    { hotelRevenue: 0, restaurantRevenue: 0, expenses: 0, profit: 0 },
  );

  res.status(200).json({ status: "success", data: { rows, totals } });
});
