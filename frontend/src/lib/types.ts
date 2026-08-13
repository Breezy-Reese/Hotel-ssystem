export interface Branch {
  _id: string;
  name: string;
  location: string;
  status: "Active" | "Inactive";
}

export type RoomType = "Single" | "Double" | "Deluxe" | "Executive" | "Suite";
export type RoomStatus = "Available" | "Reserved" | "Occupied" | "Cleaning" | "Maintenance";

export interface Room {
  _id: string;
  roomNumber: string;
  branch: string | Branch;
  type: RoomType;
  capacity: number;
  rate: number;
  amenities: string[];
  status: RoomStatus;
}

export interface Guest {
  _id: string;
  name: string;
  phone?: string;
  email?: string;
  vip: boolean;
  stays: number;
}

export type ReservationStatus =
  "Pending" | "Confirmed" | "CheckedIn" | "CheckedOut" | "Cancelled" | "NoShow";

export interface Reservation {
  _id: string;
  ref: string;
  guest: string | Guest;
  room: string | Room;
  branch: string | Branch;
  checkIn: string;
  checkOut: string;
  nights: number;
  adults: number;
  children: number;
  rateAtBooking: number;
  status: ReservationStatus;
}

export interface DashboardStats {
  rooms: { total: number; available: number; occupied: number; outOfService: number };
  reservations: {
    arrivalsToday: number;
    departuresToday: number;
    inHouse: number;
    cancellationsToday: number;
  };
  orders: { pending: number; preparing: number; ready: number; completedToday: number };
  billing: { openInvoices: number; revenueToday: number };
  housekeeping: { roomsToClean: number; inProgress: number; damageReports: number };
  maintenance: { openTickets: number; inProgress: number };
  inventory: { lowStock: number; outOfStock: number };
  employees: { total: number; onLeave: number };
  tasks: { open: number; overdue: number };
  guests: { total: number; vip: number };
  users: { total: number; active: number };
}

export interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  branch?: string | Branch;
  availability: boolean;
  description?: string;
  updatedAt: string;
}

export type OrderType = "DineIn" | "RoomService" | "Takeaway";
export type OrderStatus = "Pending" | "Preparing" | "Ready" | "Served" | "Completed" | "Cancelled";

export interface OrderItem {
  menuItem: string | MenuItem;
  name?: string;
  quantity: number;
  price: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  branch: string | Branch;
  type: OrderType;
  table?: string | { tableNumber: string };
  room?: string | Room;
  items: OrderItem[];
  status: OrderStatus;
  total?: number;
  station?: string;
  placedAt: string;
}

export type InvoiceStatus = "Open" | "Issued" | "Paid" | "Overdue" | "Cancelled";

export interface InvoiceCharge {
  description: string;
  amount: number;
}

export interface Invoice {
  _id: string;
  invoiceNumber: string;
  guest: string | Guest;
  charges: InvoiceCharge[];
  tax: number;
  discount: number;
  status: InvoiceStatus;
  total?: number;
  dueDate?: string;
  updatedAt: string;
}

export type EmployeeStatus = "Active" | "OnLeave" | "Terminated";

export interface Employee {
  _id: string;
  name: string;
  department: string;
  role: string;
  branch?: string | Branch;
  shift: "Morning" | "Afternoon" | "Night";
  phone?: string;
  email?: string;
  status: EmployeeStatus;
}

export type CleaningStatus = "Pending" | "InProgress" | "Ready" | "DamageReported";

export interface Housekeeping {
  _id: string;
  room: string | Room;
  assignedTo?: string | Employee;
  scheduledFor: string;
  cleaningStatus: CleaningStatus;
  notes?: string;
  updatedAt: string;
}

export type MaintenancePriority = "Low" | "Medium" | "High" | "Urgent";
export type MaintenanceStatus = "Open" | "InProgress" | "Resolved";

export interface MaintenanceTicket {
  _id: string;
  ticketNumber: string;
  room?: string | Room;
  location?: string;
  issue: string;
  priority: MaintenancePriority;
  assignedTo?: string | Employee;
  cost: number;
  status: MaintenanceStatus;
}

export type InventoryStatus = "InStock" | "LowStock" | "OutOfStock";

export interface InventoryItem {
  _id: string;
  name: string;
  branch?: string | Branch;
  category: string;
  quantity: number;
  unit: string;
  reorderLevel: number;
  costPerUnit: number;
  status: InventoryStatus;
  stockValue: number;
}

export interface Supplier {
  _id: string;
  name: string;
  contactPhone?: string;
  contactEmail?: string;
  productsSupplied: string[];
  balanceOwed: number;
  status: "Active" | "Inactive";
}

export type RestaurantTableStatus = "Available" | "Occupied" | "Reserved";

export interface RestaurantTable {
  _id: string;
  tableNumber: string;
  capacity: number;
  section?: string;
  status: RestaurantTableStatus;
  reservedFor?: string | Guest;
  reservedTime?: string;
}

export interface SaleItem {
  name?: string;
  quantity: number;
  price: number;
}

export interface Sale {
  _id: string;
  receiptNumber: string;
  cashier?: string | { name: string };
  items: SaleItem[];
  discount: number;
  subtotal?: number;
  total?: number;
  paymentMethod: "Cash" | "Card" | "Mobile";
  createdAt: string;
}

export type PaymentStatus = "Completed" | "Pending" | "Refunded" | "Failed";

export interface Payment {
  _id: string;
  transactionId: string;
  source: string;
  method: "Cash" | "Card" | "Mobile" | "Bank";
  amount: number;
  date: string;
  status: PaymentStatus;
}

export type ExpenseStatus = "Pending" | "Approved" | "Paid" | "Rejected";

export interface Expense {
  _id: string;
  date: string;
  category: string;
  description?: string;
  supplier?: string | Supplier;
  amount: number;
  status: ExpenseStatus;
}

export type PurchaseStatus = "Draft" | "Ordered" | "AwaitingDelivery" | "Received" | "Cancelled";

export interface PurchaseItem {
  name?: string;
  quantity: number;
  cost: number;
}

export interface Purchase {
  _id: string;
  poNumber: string;
  supplier?: string | Supplier;
  items: PurchaseItem[];
  expectedDate?: string;
  totalCost?: number;
  status: PurchaseStatus;
}

export interface Service {
  _id: string;
  name: string;
  category: string;
  price: number;
  duration: number;
  availability: boolean;
  status: "Active" | "Inactive";
}

export type ServiceBookingStatus =
  "Requested" | "Scheduled" | "InProgress" | "Completed" | "Cancelled";

export interface ServiceBooking {
  _id: string;
  ref: string;
  guest?: string | Guest;
  service?: string | Service;
  dateTime: string;
  charge: number;
  status: ServiceBookingStatus;
}

export interface Review {
  _id: string;
  guest?: string | Guest;
  targetType: "Room" | "Meal" | "Service";
  rating: number;
  comment?: string;
  date: string;
  reviewed: boolean;
}

export type NotificationStatus = "Sent" | "Failed" | "Pending";

export interface Notification {
  _id: string;
  type: "Announcement" | "Alert" | "Reminder";
  message: string;
  channel: "Email" | "SMS" | "InApp";
  sentAt?: string;
  status: NotificationStatus;
  createdAt: string;
}

export type AttendanceFlag = "OnTime" | "Late" | "Absent" | "EarlyLeave";

export interface Attendance {
  _id: string;
  employee?: string | Employee;
  date: string;
  clockIn?: string;
  clockOut?: string;
  hoursWorked?: number;
  flag: AttendanceFlag;
}

export type TaskStatus = "Open" | "InProgress" | "Completed" | "Overdue";

export interface Task {
  _id: string;
  title: string;
  assignedTo?: string | Employee;
  department?: string;
  deadline?: string;
  progress: number;
  status: TaskStatus;
}

export type PromotionStatus = "Active" | "Scheduled" | "Expired" | "Disabled";

export interface Promotion {
  _id: string;
  code: string;
  appliesTo: "Room" | "Menu" | "Service" | "All";
  discountType: "Percent" | "Fixed";
  discountValue: number;
  startsAt: string;
  expiresAt: string;
  redemptions: number;
  status?: PromotionStatus;
}

export type LoyaltyTier = "Bronze" | "Silver" | "Gold" | "Platinum";

export interface LoyaltyAccount {
  _id: string;
  guest?: string | Guest;
  tier: LoyaltyTier;
  points: number;
  lifetimeSpend: number;
  lastActivity?: string;
  status: "Active" | "Inactive";
}

export interface StaffUser {
  _id: string;
  name: string;
  email: string;
  role: string;
  branch?: string | Branch;
  lastLogin?: string;
  status: "Active" | "Invited" | "Disabled";
}

export interface AuditLog {
  _id: string;
  user?: string | { name: string };
  action: string;
  entity: string;
  entityId?: string;
  ip?: string;
  result: "Success" | "Failure";
  timestamp: string;
}

export type DocumentAccess = "Public" | "Restricted" | "Private";

export interface AppDocument {
  _id: string;
  name: string;
  type: "GuestDoc" | "StaffDoc" | "Policy" | "Other";
  fileUrl: string;
  size: number;
  access: DocumentAccess;
  createdAt: string;
}
