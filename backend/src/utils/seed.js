require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");

const User = require("../models/User");
const Branch = require("../models/Branch");
const Room = require("../models/Room");
const Guest = require("../models/Guest");
const Employee = require("../models/Employee");
const Reservation = require("../models/Reservation");
const MenuItem = require("../models/MenuItem");
const RestaurantTable = require("../models/RestaurantTable");
const Order = require("../models/Order");
const InventoryItem = require("../models/InventoryItem");
const Supplier = require("../models/Supplier");
const Service = require("../models/Service");
const Task = require("../models/Task");
const Promotion = require("../models/Promotion");
const Housekeeping = require("../models/Housekeeping");
const Maintenance = require("../models/Maintenance");
const Invoice = require("../models/Invoice");
const Expense = require("../models/Expense");

function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}

// Creates the doc only if nothing matches `find` — makes this script safe to re-run.
async function upsertMany(Model, items, findKeys) {
  const created = [];
  for (const item of items) {
    const query = {};
    for (const key of findKeys) query[key] = item[key];
    let doc = await Model.findOne(query);
    if (!doc) {
      doc = await Model.create(item);
      created.push(doc);
    }
  }
  return created;
}

(async () => {
  await connectDB();

  // --- Branch ---
  const branchName = "Aurelia Suites — Main Branch";
  let branch = await Branch.findOne({ name: branchName });
  if (!branch) {
    branch = await Branch.create({ name: branchName, location: "Nairobi, Kenya", status: "Active" });
    console.log(`Created branch: ${branch.name}`);
  } else {
    console.log(`Branch already exists: ${branch.name}`);
  }

  // --- Admin user ---
  const adminEmail = process.env.SEED_ADMIN_EMAIL || "admin@aureliasuites.com";
  let admin = await User.findOne({ email: adminEmail });
  if (!admin) {
    admin = await User.create({
      name: process.env.SEED_ADMIN_NAME || "System Administrator",
      email: adminEmail,
      password: process.env.SEED_ADMIN_PASSWORD || "ChangeMe123!",
      role: "Admin",
      branch: branch._id,
      status: "Active",
    });
    console.log(`Created admin user: ${admin.email}`);
  } else {
    console.log(`Admin user already exists: ${admin.email}`);
  }

  // --- Employees ---
  const employees = await upsertMany(
    Employee,
    [
      { name: "Grace Wanjiru", department: "Front Desk", role: "Receptionist", branch: branch._id, shift: "Morning", email: "grace@aureliasuites.com" },
      { name: "Kevin Otieno", department: "Housekeeping", role: "Housekeeper", branch: branch._id, shift: "Morning", email: "kevin@aureliasuites.com" },
      { name: "Amina Hassan", department: "Kitchen", role: "Head Chef", branch: branch._id, shift: "Afternoon", email: "amina@aureliasuites.com" },
      { name: "Peter Kamau", department: "Maintenance", role: "Technician", branch: branch._id, shift: "Morning", email: "peter@aureliasuites.com" },
      { name: "Lucy Njeri", department: "Restaurant", role: "Waiter", branch: branch._id, shift: "Afternoon", email: "lucy@aureliasuites.com" },
      { name: "Samuel Mwangi", department: "Management", role: "Duty Manager", branch: branch._id, shift: "Morning", email: "samuel@aureliasuites.com" },
    ],
    ["email"],
  );
  console.log(`Employees: ${employees.length} created`);

  // --- Rooms ---
  const roomDefs = [
    { roomNumber: "101", type: "Single", capacity: 1, rate: 60, amenities: ["WiFi", "TV"], status: "Available" },
    { roomNumber: "102", type: "Single", capacity: 1, rate: 60, amenities: ["WiFi", "TV"], status: "Available" },
    { roomNumber: "201", type: "Double", capacity: 2, rate: 95, amenities: ["WiFi", "TV", "Minibar"], status: "Occupied" },
    { roomNumber: "202", type: "Double", capacity: 2, rate: 95, amenities: ["WiFi", "TV", "Minibar"], status: "Available" },
    { roomNumber: "301", type: "Deluxe", capacity: 2, rate: 140, amenities: ["WiFi", "TV", "Minibar", "Balcony"], status: "Cleaning" },
    { roomNumber: "302", type: "Deluxe", capacity: 3, rate: 150, amenities: ["WiFi", "TV", "Minibar", "Balcony"], status: "Available" },
    { roomNumber: "401", type: "Executive", capacity: 2, rate: 210, amenities: ["WiFi", "TV", "Minibar", "Lounge access"], status: "Available" },
    { roomNumber: "501", type: "Suite", capacity: 4, rate: 350, amenities: ["WiFi", "TV", "Minibar", "Jacuzzi", "Lounge access"], status: "Maintenance" },
  ].map((r) => ({ ...r, branch: branch._id }));
  const rooms = await upsertMany(Room, roomDefs, ["branch", "roomNumber"]);
  const allRooms = await Room.find({ branch: branch._id });
  console.log(`Rooms: ${rooms.length} created (${allRooms.length} total)`);

  // --- Guests ---
  const guestDefs = [
    { name: "John Doe", phone: "+254700111222", email: "john.doe@example.com", vip: true, stays: 5 },
    { name: "Mary Achieng", phone: "+254700333444", email: "mary.a@example.com", vip: false, stays: 1 },
    { name: "David Kiprotich", phone: "+254700555666", email: "david.k@example.com", vip: false, stays: 2 },
    { name: "Fatuma Ali", phone: "+254700777888", email: "fatuma.ali@example.com", vip: true, stays: 8 },
    { name: "Brian Mutiso", phone: "+254700999000", email: "brian.m@example.com", vip: false, stays: 1 },
  ];
  const guests = await upsertMany(Guest, guestDefs, ["email"]);
  const allGuests = await Guest.find();
  console.log(`Guests: ${guests.length} created (${allGuests.length} total)`);

  // --- Reservations ---
  if ((await Reservation.countDocuments()) === 0 && allGuests.length && allRooms.length) {
    const reservationDefs = [
      { guest: allGuests[0]._id, room: allRooms[2]._id, checkIn: daysFromNow(-1), checkOut: daysFromNow(2), rateAtBooking: allRooms[2].rate, status: "CheckedIn", source: "Online" },
      { guest: allGuests[1]._id, room: allRooms[0]._id, checkIn: daysFromNow(0), checkOut: daysFromNow(3), rateAtBooking: allRooms[0].rate, status: "Confirmed", source: "WalkIn" },
      { guest: allGuests[2]._id, room: allRooms[5]._id, checkIn: daysFromNow(1), checkOut: daysFromNow(4), rateAtBooking: allRooms[5].rate, status: "Pending", source: "Online" },
      { guest: allGuests[3]._id, room: allRooms[6]._id, checkIn: daysFromNow(-3), checkOut: daysFromNow(-1), rateAtBooking: allRooms[6].rate, status: "CheckedOut", source: "Online" },
      { guest: allGuests[4]._id, room: allRooms[1]._id, checkIn: daysFromNow(5), checkOut: daysFromNow(7), rateAtBooking: allRooms[1].rate, status: "Cancelled", source: "WalkIn" },
    ].map((r) => ({ ...r, branch: branch._id, createdBy: admin._id }));
    const reservations = await Reservation.create(reservationDefs);
    console.log(`Reservations: ${reservations.length} created`);
  } else {
    console.log("Reservations already exist — skipping");
  }

  // --- Menu items ---
  const menuDefs = [
    { name: "Grilled Chicken", category: "Main Course", price: 12.5 },
    { name: "Beef Burger", category: "Main Course", price: 9.0 },
    { name: "Caesar Salad", category: "Starters", price: 6.5 },
    { name: "Margherita Pizza", category: "Main Course", price: 10.0 },
    { name: "Chocolate Cake", category: "Desserts", price: 5.0 },
    { name: "Fresh Juice", category: "Beverages", price: 3.5 },
    { name: "Espresso", category: "Beverages", price: 2.5 },
  ].map((m) => ({ ...m, branch: branch._id }));
  const menuItems = await upsertMany(MenuItem, menuDefs, ["branch", "name"]);
  const allMenuItems = await MenuItem.find({ branch: branch._id });
  console.log(`Menu items: ${menuItems.length} created (${allMenuItems.length} total)`);

  // --- Tables ---
  const tableDefs = [
    { tableNumber: "T1", capacity: 2, section: "Main Hall", status: "Available" },
    { tableNumber: "T2", capacity: 4, section: "Main Hall", status: "Occupied" },
    { tableNumber: "T3", capacity: 4, section: "Terrace", status: "Available" },
    { tableNumber: "T4", capacity: 6, section: "Terrace", status: "Reserved" },
  ].map((t) => ({ ...t, branch: branch._id }));
  const tables = await upsertMany(RestaurantTable, tableDefs, ["branch", "tableNumber"]);
  const allTables = await RestaurantTable.find({ branch: branch._id });
  console.log(`Tables: ${tables.length} created (${allTables.length} total)`);

  // --- Orders ---
  if ((await Order.countDocuments()) === 0 && allMenuItems.length && allTables.length) {
    const orderDefs = [
      {
        type: "DineIn",
        table: allTables[1]._id,
        items: [
          { menuItem: allMenuItems[0]._id, name: allMenuItems[0].name, quantity: 2, price: allMenuItems[0].price },
          { menuItem: allMenuItems[5]._id, name: allMenuItems[5].name, quantity: 2, price: allMenuItems[5].price },
        ],
        status: "Preparing",
        station: "Grill",
      },
      {
        type: "RoomService",
        room: allRooms[2]._id,
        items: [{ menuItem: allMenuItems[3]._id, name: allMenuItems[3].name, quantity: 1, price: allMenuItems[3].price }],
        status: "Pending",
        station: "Main",
      },
      {
        type: "Takeaway",
        items: [
          { menuItem: allMenuItems[1]._id, name: allMenuItems[1].name, quantity: 1, price: allMenuItems[1].price },
          { menuItem: allMenuItems[6]._id, name: allMenuItems[6].name, quantity: 1, price: allMenuItems[6].price },
        ],
        status: "Ready",
        station: "Main",
      },
      {
        type: "DineIn",
        table: allTables[0]._id,
        items: [{ menuItem: allMenuItems[2]._id, name: allMenuItems[2].name, quantity: 2, price: allMenuItems[2].price }],
        status: "Completed",
        station: "Cold",
      },
    ].map((o) => ({ ...o, branch: branch._id, createdBy: admin._id }));
    const orders = await Order.create(orderDefs);
    console.log(`Orders: ${orders.length} created`);
  } else {
    console.log("Orders already exist — skipping");
  }

  // --- Inventory ---
  const inventoryDefs = [
    { name: "Rice", category: "Dry goods", quantity: 80, unit: "kg", reorderLevel: 20, costPerUnit: 1.2 },
    { name: "Chicken breast", category: "Meat", quantity: 15, unit: "kg", reorderLevel: 20, costPerUnit: 5.5 },
    { name: "Tomatoes", category: "Produce", quantity: 0, unit: "kg", reorderLevel: 10, costPerUnit: 0.8 },
    { name: "Bath towels", category: "Housekeeping", quantity: 120, unit: "pcs", reorderLevel: 30, costPerUnit: 4.0 },
    { name: "Bed sheets", category: "Housekeeping", quantity: 45, unit: "pcs", reorderLevel: 25, costPerUnit: 8.0 },
    { name: "Coffee beans", category: "Beverages", quantity: 8, unit: "kg", reorderLevel: 10, costPerUnit: 9.0 },
  ].map((i) => ({ ...i, branch: branch._id }));
  const inventoryItems = await upsertMany(InventoryItem, inventoryDefs, ["branch", "name"]);
  console.log(`Inventory items: ${inventoryItems.length} created`);

  // --- Suppliers ---
  const supplierDefs = [
    { name: "Nairobi Fresh Produce Ltd", contactPhone: "+254711000111", contactEmail: "sales@nairobifresh.co.ke", productsSupplied: ["Tomatoes", "Vegetables", "Fruits"] },
    { name: "Coast Linen Supplies", contactPhone: "+254711222333", contactEmail: "orders@coastlinen.co.ke", productsSupplied: ["Bath towels", "Bed sheets"] },
    { name: "Highland Coffee Roasters", contactPhone: "+254711444555", contactEmail: "info@highlandcoffee.co.ke", productsSupplied: ["Coffee beans"] },
  ];
  const suppliers = await upsertMany(Supplier, supplierDefs, ["contactEmail"]);
  console.log(`Suppliers: ${suppliers.length} created`);

  // --- Services ---
  const serviceDefs = [
    { name: "Airport Pickup", category: "Transport", price: 25, duration: 60 },
    { name: "Full Body Massage", category: "Spa", price: 40, duration: 45 },
    { name: "Laundry Service", category: "Laundry", price: 8, duration: 120 },
    { name: "Conference Room (half day)", category: "Events", price: 100, duration: 240 },
  ].map((s) => ({ ...s, branch: branch._id }));
  const services = await upsertMany(Service, serviceDefs, ["branch", "name"]);
  console.log(`Services: ${services.length} created`);

  // --- Tasks ---
  const allEmployees = await Employee.find({ branch: branch._id });
  const taskDefs = [
    { title: "Deep clean Suite 501", assignedTo: allEmployees[1]._id, department: "Housekeeping", deadline: daysFromNow(1), progress: 20, status: "InProgress" },
    { title: "Fix AC in Room 301", assignedTo: allEmployees[3]._id, department: "Maintenance", deadline: daysFromNow(2), progress: 0, status: "Open" },
    { title: "Restock bar inventory", assignedTo: allEmployees[4]._id, department: "Restaurant", deadline: daysFromNow(-1), progress: 60, status: "Overdue" },
    { title: "Prepare weekly menu specials", assignedTo: allEmployees[2]._id, department: "Kitchen", deadline: daysFromNow(3), progress: 100, status: "Completed" },
  ];
  const tasks = await upsertMany(Task, taskDefs, ["title"]);
  console.log(`Tasks: ${tasks.length} created`);

  // --- Promotions ---
  const promoDefs = [
    { code: "SUMMER25", appliesTo: "Room", discountType: "Percent", discountValue: 25, startsAt: daysFromNow(-5), expiresAt: daysFromNow(10) },
    { code: "WELCOME10", appliesTo: "All", discountType: "Percent", discountValue: 10, startsAt: daysFromNow(-30), expiresAt: daysFromNow(60) },
    { code: "FIXED20", appliesTo: "Menu", discountType: "Fixed", discountValue: 20, startsAt: daysFromNow(1), expiresAt: daysFromNow(5) },
  ];
  const promotions = await upsertMany(Promotion, promoDefs, ["code"]);
  console.log(`Promotions: ${promotions.length} created`);

  // --- Housekeeping tasks ---
  if ((await Housekeeping.countDocuments()) === 0) {
    const hkDefs = [
      { room: allRooms[4]._id, assignedTo: allEmployees[1]._id, cleaningStatus: "InProgress" },
      { room: allRooms[1]._id, assignedTo: allEmployees[1]._id, cleaningStatus: "Pending" },
      { room: allRooms[6]._id, assignedTo: allEmployees[1]._id, cleaningStatus: "Ready" },
    ];
    const hk = await Housekeeping.create(hkDefs);
    console.log(`Housekeeping tasks: ${hk.length} created`);
  } else {
    console.log("Housekeeping tasks already exist — skipping");
  }

  // --- Maintenance tickets ---
  if ((await Maintenance.countDocuments()) === 0) {
    const maintDefs = [
      { room: allRooms[7]._id, issue: "Jacuzzi not heating", priority: "High", assignedTo: allEmployees[3]._id, reportedBy: admin._id, status: "Open" },
      { location: "Lobby", issue: "Flickering light fixture", priority: "Low", assignedTo: allEmployees[3]._id, reportedBy: admin._id, status: "InProgress" },
    ];
    const maint = await Maintenance.create(maintDefs);
    console.log(`Maintenance tickets: ${maint.length} created`);
  } else {
    console.log("Maintenance tickets already exist — skipping");
  }

  // --- Invoices ---
  if ((await Invoice.countDocuments()) === 0) {
    const invoiceDefs = [
      {
        branch: branch._id,
        guest: allGuests[0]._id,
        charges: [
          { description: "Room charge (3 nights)", amount: 285 },
          { description: "Room service", amount: 10 },
        ],
        tax: 16,
        discount: 0,
        status: "Open",
      },
      {
        branch: branch._id,
        guest: allGuests[3]._id,
        charges: [{ description: "Room charge (2 nights)", amount: 420 }],
        tax: 16,
        discount: 20,
        status: "Paid",
      },
    ];
    const invoices = await Invoice.create(invoiceDefs);
    console.log(`Invoices: ${invoices.length} created`);
  } else {
    console.log("Invoices already exist — skipping");
  }

  // --- Expenses ---
  const allSuppliers = await Supplier.find();
  if ((await Expense.countDocuments()) === 0) {
    const expenseDefs = [
      { branch: branch._id, category: "Utilities", description: "Electricity bill", amount: 340, status: "Paid" },
      { branch: branch._id, category: "Supplies", description: "Linen restock", supplier: allSuppliers[1]?._id, amount: 210, status: "Approved" },
      { branch: branch._id, category: "Maintenance", description: "AC repair parts", amount: 85, status: "Pending" },
    ];
    const expenses = await Expense.create(expenseDefs);
    console.log(`Expenses: ${expenses.length} created`);
  } else {
    console.log("Expenses already exist — skipping");
  }

  await mongoose.disconnect();
  console.log("\nSeed complete. Log in with:");
  console.log(`  Email:    ${adminEmail}`);
  console.log(`  Password: ${process.env.SEED_ADMIN_PASSWORD ? "(from your .env)" : "ChangeMe123!"}`);
  process.exit(0);
})().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
