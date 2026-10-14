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
const Purchase = require("../models/Purchase");
const ServiceBooking = require("../models/ServiceBooking");
const Sale = require("../models/Sale");
const Payment = require("../models/Payment");
const Attendance = require("../models/Attendance");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const LoyaltyAccount = require("../models/LoyaltyAccount");
const Document = require("../models/Document");

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
      { name: "Esther Nyambura", department: "Front Desk", role: "Night Auditor", branch: branch._id, shift: "Night", email: "esther@aureliasuites.com" },
      { name: "Joseph Kiplagat", department: "Kitchen", role: "Sous Chef", branch: branch._id, shift: "Afternoon", email: "joseph@aureliasuites.com" },
      { name: "Faith Chebet", department: "Housekeeping", role: "Housekeeping Supervisor", branch: branch._id, shift: "Morning", email: "faith@aureliasuites.com" },
      { name: "Dennis Mwakio", department: "Security", role: "Security Officer", branch: branch._id, shift: "Night", email: "dennis@aureliasuites.com" },
      { name: "Winnie Auma", department: "Accounting", role: "Accountant", branch: branch._id, shift: "Morning", email: "winnie@aureliasuites.com" },
      { name: "Collins Barasa", department: "Inventory", role: "Store Keeper", branch: branch._id, shift: "Morning", email: "collins@aureliasuites.com" },
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
    { roomNumber: "103", type: "Single", capacity: 1, rate: 60, amenities: ["WiFi", "TV"], status: "Available" },
    { roomNumber: "203", type: "Double", capacity: 2, rate: 95, amenities: ["WiFi", "TV", "Minibar"], status: "Reserved" },
    { roomNumber: "204", type: "Double", capacity: 2, rate: 95, amenities: ["WiFi", "TV", "Minibar"], status: "Occupied" },
    { roomNumber: "303", type: "Deluxe", capacity: 2, rate: 140, amenities: ["WiFi", "TV", "Minibar", "Balcony"], status: "Available" },
    { roomNumber: "402", type: "Executive", capacity: 3, rate: 220, amenities: ["WiFi", "TV", "Minibar", "Lounge access"], status: "Cleaning" },
    { roomNumber: "502", type: "Suite", capacity: 4, rate: 380, amenities: ["WiFi", "TV", "Minibar", "Jacuzzi", "Lounge access", "Private balcony"], status: "Available" },
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
    { name: "Susan Wambui", phone: "+254701111333", email: "susan.w@example.com", vip: false, stays: 3 },
    { name: "James Odhiambo", phone: "+254701222444", email: "james.o@example.com", vip: true, stays: 6 },
    { name: "Aisha Mohamed", phone: "+254701333555", email: "aisha.m@example.com", vip: false, stays: 2 },
    { name: "Nicholas Ruto", phone: "+254701444666", email: "nicholas.r@example.com", vip: false, stays: 1 },
    { name: "Diana Cherop", phone: "+254701555777", email: "diana.c@example.com", vip: true, stays: 4 },
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
    { name: "Fish Fillet", category: "Main Course", price: 14.0 },
    { name: "Vegetable Stir Fry", category: "Main Course", price: 8.5 },
    { name: "Onion Soup", category: "Starters", price: 5.0 },
    { name: "Spring Rolls", category: "Starters", price: 4.5 },
    { name: "Cheesecake", category: "Desserts", price: 5.5 },
    { name: "Iced Tea", category: "Beverages", price: 3.0 },
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
    { tableNumber: "T5", capacity: 2, section: "Main Hall", status: "Available" },
    { tableNumber: "T6", capacity: 8, section: "Private Room", status: "Available" },
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
    { name: "Cooking oil", category: "Dry goods", quantity: 25, unit: "l", reorderLevel: 15, costPerUnit: 2.3 },
    { name: "Toilet paper", category: "Housekeeping", quantity: 200, unit: "pcs", reorderLevel: 50, costPerUnit: 0.5 },
    { name: "Onions", category: "Produce", quantity: 5, unit: "kg", reorderLevel: 15, costPerUnit: 0.6 },
    { name: "Sugar", category: "Dry goods", quantity: 60, unit: "kg", reorderLevel: 20, costPerUnit: 1.0 },
  ].map((i) => ({ ...i, branch: branch._id }));
  const inventoryItems = await upsertMany(InventoryItem, inventoryDefs, ["branch", "name"]);
  console.log(`Inventory items: ${inventoryItems.length} created`);

  // --- Suppliers ---
  const supplierDefs = [
    { name: "Nairobi Fresh Produce Ltd", contactPhone: "+254711000111", contactEmail: "sales@nairobifresh.co.ke", productsSupplied: ["Tomatoes", "Vegetables", "Fruits"] },
    { name: "Coast Linen Supplies", contactPhone: "+254711222333", contactEmail: "orders@coastlinen.co.ke", productsSupplied: ["Bath towels", "Bed sheets"] },
    { name: "Highland Coffee Roasters", contactPhone: "+254711444555", contactEmail: "info@highlandcoffee.co.ke", productsSupplied: ["Coffee beans"] },
    { name: "Rift Valley Grain Millers", contactPhone: "+254711666777", contactEmail: "sales@riftvalleygrain.co.ke", productsSupplied: ["Rice", "Sugar", "Cooking oil"] },
    { name: "CleanCo Hygiene Supplies", contactPhone: "+254711888999", contactEmail: "orders@cleanco.co.ke", productsSupplied: ["Toilet paper", "Cleaning supplies"] },
  ];
  const suppliers = await upsertMany(Supplier, supplierDefs, ["contactEmail"]);
  console.log(`Suppliers: ${suppliers.length} created`);

  // --- Services ---
  const serviceDefs = [
    { name: "Airport Pickup", category: "Transport", price: 25, duration: 60 },
    { name: "Full Body Massage", category: "Spa", price: 40, duration: 45 },
    { name: "Laundry Service", category: "Laundry", price: 8, duration: 120 },
    { name: "Conference Room (half day)", category: "Events", price: 100, duration: 240 },
    { name: "Airport Drop-off", category: "Transport", price: 25, duration: 60 },
    { name: "Facial Treatment", category: "Spa", price: 30, duration: 40 },
    { name: "Gym Day Pass", category: "Fitness", price: 10, duration: 0 },
    { name: "City Tour", category: "Transport", price: 50, duration: 180 },
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
    { title: "Night audit reconciliation", assignedTo: allEmployees[6]?._id, department: "Front Desk", deadline: daysFromNow(0), progress: 40, status: "InProgress" },
    { title: "Security patrol log review", assignedTo: allEmployees[9]?._id, department: "Security", deadline: daysFromNow(1), progress: 0, status: "Open" },
    { title: "Monthly supplier invoice reconciliation", assignedTo: allEmployees[10]?._id, department: "Accounting", deadline: daysFromNow(4), progress: 10, status: "Open" },
    { title: "Stock count — dry goods store", assignedTo: allEmployees[11]?._id, department: "Inventory", deadline: daysFromNow(2), progress: 0, status: "Open" },
  ];
  const tasks = await upsertMany(Task, taskDefs, ["title"]);
  console.log(`Tasks: ${tasks.length} created`);

  // --- Promotions ---
  const promoDefs = [
    { code: "SUMMER25", appliesTo: "Room", discountType: "Percent", discountValue: 25, startsAt: daysFromNow(-5), expiresAt: daysFromNow(10) },
    { code: "WELCOME10", appliesTo: "All", discountType: "Percent", discountValue: 10, startsAt: daysFromNow(-30), expiresAt: daysFromNow(60) },
    { code: "FIXED20", appliesTo: "Menu", discountType: "Fixed", discountValue: 20, startsAt: daysFromNow(1), expiresAt: daysFromNow(5) },
    { code: "SPA15", appliesTo: "Service", discountType: "Percent", discountValue: 15, startsAt: daysFromNow(0), expiresAt: daysFromNow(20) },
    { code: "EXPIRED5", appliesTo: "Room", discountType: "Fixed", discountValue: 5, startsAt: daysFromNow(-60), expiresAt: daysFromNow(-30) },
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

  // --- Purchase orders ---
  const allInventory = await InventoryItem.find({ branch: branch._id });
  if ((await Purchase.countDocuments()) === 0 && allSuppliers.length && allInventory.length) {
    const purchaseDefs = [
      {
        branch: branch._id,
        supplier: allSuppliers[0]._id,
        items: [
          { item: allInventory[2]._id, name: allInventory[2].name, quantity: 40, cost: 0.8 },
        ],
        expectedDate: daysFromNow(2),
        status: "Ordered",
        createdBy: admin._id,
      },
      {
        branch: branch._id,
        supplier: allSuppliers[1]._id,
        items: [
          { item: allInventory[3]._id, name: allInventory[3].name, quantity: 50, cost: 4.0 },
          { item: allInventory[4]._id, name: allInventory[4].name, quantity: 30, cost: 8.0 },
        ],
        expectedDate: daysFromNow(-1),
        status: "AwaitingDelivery",
        createdBy: admin._id,
      },
      {
        branch: branch._id,
        supplier: allSuppliers[2]._id,
        items: [{ item: allInventory[5]._id, name: allInventory[5].name, quantity: 20, cost: 9.0 }],
        expectedDate: daysFromNow(-5),
        status: "Received",
        receivedDate: daysFromNow(-4),
        createdBy: admin._id,
      },
    ];
    const purchases = await Purchase.create(purchaseDefs);
    console.log(`Purchase orders: ${purchases.length} created`);
  } else {
    console.log("Purchase orders already exist — skipping");
  }

  // --- Service bookings ---
  const allServices = await Service.find({ branch: branch._id });
  if ((await ServiceBooking.countDocuments()) === 0 && allGuests.length && allServices.length) {
    const bookingDefs = [
      { guest: allGuests[0]._id, service: allServices[1]._id, dateTime: daysFromNow(0), charge: allServices[1].price, status: "Scheduled" },
      { guest: allGuests[3]._id, service: allServices[0]._id, dateTime: daysFromNow(-2), charge: allServices[0].price, status: "Completed" },
      { guest: allGuests[1]._id, service: allServices[2]._id, dateTime: daysFromNow(1), charge: allServices[2].price, status: "Requested" },
    ];
    const bookings = await ServiceBooking.create(bookingDefs);
    console.log(`Service bookings: ${bookings.length} created`);
  } else {
    console.log("Service bookings already exist — skipping");
  }

  // --- POS sales ---
  if ((await Sale.countDocuments()) === 0 && allMenuItems.length) {
    const saleDefs = [
      {
        branch: branch._id,
        cashier: admin._id,
        items: [
          { menuItem: allMenuItems[1]._id, name: allMenuItems[1].name, quantity: 1, price: allMenuItems[1].price },
          { menuItem: allMenuItems[5]._id, name: allMenuItems[5].name, quantity: 1, price: allMenuItems[5].price },
        ],
        discount: 0,
        paymentMethod: "Cash",
      },
      {
        branch: branch._id,
        cashier: admin._id,
        items: [{ menuItem: allMenuItems[3]._id, name: allMenuItems[3].name, quantity: 2, price: allMenuItems[3].price }],
        discount: 2,
        paymentMethod: "Card",
      },
      {
        branch: branch._id,
        cashier: admin._id,
        items: [{ menuItem: allMenuItems[4]._id, name: allMenuItems[4].name, quantity: 3, price: allMenuItems[4].price }],
        discount: 0,
        paymentMethod: "Mobile",
      },
    ];
    const sales = await Sale.create(saleDefs);
    console.log(`POS sales: ${sales.length} created`);
  } else {
    console.log("POS sales already exist — skipping");
  }

  // --- Payments ---
  const allInvoices = await Invoice.find({ branch: branch._id });
  if ((await Payment.countDocuments()) === 0 && allInvoices.length) {
    const paidInvoice = allInvoices.find((i) => i.status === "Paid");
    const paymentDefs = [
      paidInvoice && {
        branch: branch._id,
        source: "Invoice",
        sourceId: paidInvoice._id,
        method: "Card",
        amount: 464,
        status: "Completed",
        recordedBy: admin._id,
      },
      {
        branch: branch._id,
        source: "Service",
        sourceId: allServices[0]._id,
        method: "Cash",
        amount: allServices[0].price,
        status: "Completed",
        recordedBy: admin._id,
      },
      {
        branch: branch._id,
        source: "Reservation",
        sourceId: (await Reservation.findOne({ status: "CheckedIn" }))?._id ?? allGuests[0]._id,
        method: "Mobile",
        amount: 150,
        status: "Pending",
        recordedBy: admin._id,
      },
    ].filter(Boolean);
    const payments = await Payment.create(paymentDefs);
    console.log(`Payments: ${payments.length} created`);
  } else {
    console.log("Payments already exist — skipping");
  }

  // --- Attendance ---
  if ((await Attendance.countDocuments()) === 0) {
    const now = new Date();
    const morning = (h, m) => new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m);
    const attendanceDefs = [
      { employee: allEmployees[0]._id, date: daysFromNow(0), clockIn: morning(8, 2), clockOut: morning(17, 5), flag: "OnTime" },
      { employee: allEmployees[1]._id, date: daysFromNow(0), clockIn: morning(9, 20), flag: "Late" },
      { employee: allEmployees[2]._id, date: daysFromNow(0), clockIn: morning(7, 55), clockOut: morning(15, 30), flag: "EarlyLeave" },
      { employee: allEmployees[3]._id, date: daysFromNow(-1), flag: "Absent" },
      { employee: allEmployees[4]._id, date: daysFromNow(-1), clockIn: morning(8, 0), clockOut: morning(16, 0), flag: "OnTime" },
    ];
    const attendance = await Attendance.create(attendanceDefs);
    console.log(`Attendance records: ${attendance.length} created`);
  } else {
    console.log("Attendance records already exist — skipping");
  }

  // --- Reviews ---
  if ((await Review.countDocuments()) === 0 && allGuests.length && allRooms.length) {
    const reviewDefs = [
      { guest: allGuests[0]._id, targetType: "Room", targetId: allRooms[2]._id, targetModel: "Room", rating: 5, comment: "Spotless room and great view.", reviewed: true },
      { guest: allGuests[3]._id, targetType: "Meal", targetId: allMenuItems[0]._id, targetModel: "MenuItem", rating: 4, comment: "Tasty but a bit slow to arrive.", reviewed: false },
      { guest: allGuests[1]._id, targetType: "Service", targetId: allServices[1]._id, targetModel: "Service", rating: 5, comment: "Incredible massage, will book again.", reviewed: false },
      { guest: allGuests[2]._id, targetType: "Room", targetId: allRooms[0]._id, targetModel: "Room", rating: 3, comment: "Comfortable but a bit noisy at night.", reviewed: true },
    ];
    const reviews = await Review.create(reviewDefs);
    console.log(`Reviews: ${reviews.length} created`);
  } else {
    console.log("Reviews already exist — skipping");
  }

  // --- Notifications ---
  if ((await Notification.countDocuments()) === 0) {
    const notificationDefs = [
      { type: "Announcement", message: "Staff meeting this Friday at 9am in the main hall.", channel: "InApp", sentAt: daysFromNow(-1), status: "Sent", createdBy: admin._id },
      { type: "Alert", message: "Tomatoes are out of stock — reorder needed.", channel: "Email", sentAt: daysFromNow(0), status: "Sent", createdBy: admin._id },
      { type: "Reminder", message: "Room 501 maintenance ticket is still open.", channel: "InApp", status: "Pending", createdBy: admin._id },
    ];
    const notifications = await Notification.create(notificationDefs);
    console.log(`Notifications: ${notifications.length} created`);
  } else {
    console.log("Notifications already exist — skipping");
  }

  // --- Loyalty accounts ---
  if ((await LoyaltyAccount.countDocuments()) === 0 && allGuests.length) {
    const loyaltyDefs = [
      { guest: allGuests[0]._id, tier: "Gold", points: 5400, lifetimeSpend: 6200, lastActivity: daysFromNow(-1), history: [{ type: "Earn", points: 285, reason: "Room stay" }] },
      { guest: allGuests[3]._id, tier: "Platinum", points: 12300, lifetimeSpend: 15800, lastActivity: daysFromNow(-2), history: [{ type: "Redeem", points: -500, reason: "Free spa session" }] },
      { guest: allGuests[1]._id, tier: "Bronze", points: 150, lifetimeSpend: 210, lastActivity: daysFromNow(0), history: [{ type: "Earn", points: 150, reason: "First stay" }] },
      { guest: allGuests[2]._id, tier: "Silver", points: 1800, lifetimeSpend: 2100, lastActivity: daysFromNow(-5), history: [] },
    ];
    const loyaltyAccounts = await LoyaltyAccount.create(loyaltyDefs);
    console.log(`Loyalty accounts: ${loyaltyAccounts.length} created`);
  } else {
    console.log("Loyalty accounts already exist — skipping");
  }

  // --- Documents ---
  if ((await Document.countDocuments()) === 0) {
    const documentDefs = [
      { name: "John Doe - Passport Copy", type: "GuestDoc", ownerModel: "Guest", owner: allGuests[0]._id, fileUrl: "https://example.com/docs/passport-john-doe.pdf", size: 245000, access: "Restricted", uploadedBy: admin._id },
      { name: "Grace Wanjiru - Employment Contract", type: "StaffDoc", ownerModel: "Employee", owner: allEmployees[0]._id, fileUrl: "https://example.com/docs/contract-grace.pdf", size: 180000, access: "Private", uploadedBy: admin._id },
      { name: "Fire Safety Policy", type: "Policy", fileUrl: "https://example.com/docs/fire-safety-policy.pdf", size: 95000, access: "Public", uploadedBy: admin._id },
      { name: "Guest Refund Policy", type: "Policy", fileUrl: "https://example.com/docs/refund-policy.pdf", size: 62000, access: "Public", uploadedBy: admin._id },
    ];
    const documents = await Document.create(documentDefs);
    console.log(`Documents: ${documents.length} created`);
  } else {
    console.log("Documents already exist — skipping");
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