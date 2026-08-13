import { createResource } from "./resource";
import type {
  AppDocument,
  Attendance,
  AuditLog,
  Branch,
  Employee,
  Expense,
  Guest,
  Housekeeping,
  Invoice,
  InventoryItem,
  LoyaltyAccount,
  MaintenanceTicket,
  MenuItem,
  Notification,
  Order,
  Payment,
  Promotion,
  Purchase,
  Reservation,
  RestaurantTable,
  Review,
  Room,
  Sale,
  Service,
  ServiceBooking,
  StaffUser,
  Supplier,
  Task,
} from "./types";

export const branchesApi = createResource<Branch>("/branches", "branches");
export const roomsApi = createResource<Room>("/rooms", "rooms");
export const guestsApi = createResource<Guest>("/guests", "guests");
export const reservationsApi = createResource<Reservation>("/reservations", "reservations");
export const menuItemsApi = createResource<MenuItem>("/menu-items", "menu-items");
export const ordersApi = createResource<Order>("/orders", "orders");
export const tablesApi = createResource<RestaurantTable>("/tables", "tables");
export const salesApi = createResource<Sale>("/sales", "sales");
export const invoicesApi = createResource<Invoice>("/invoices", "invoices");
export const paymentsApi = createResource<Payment>("/payments", "payments");
export const expensesApi = createResource<Expense>("/expenses", "expenses");
export const employeesApi = createResource<Employee>("/employees", "employees");
export const housekeepingApi = createResource<Housekeeping>("/housekeeping", "housekeeping");
export const maintenanceApi = createResource<MaintenanceTicket>("/maintenance", "maintenance");
export const inventoryApi = createResource<InventoryItem>("/inventory", "inventory");
export const suppliersApi = createResource<Supplier>("/suppliers", "suppliers");
export const purchasesApi = createResource<Purchase>("/purchases", "purchases");
export const servicesApi = createResource<Service>("/services", "services");
export const serviceBookingsApi = createResource<ServiceBooking>(
  "/service-bookings",
  "service-bookings",
);
export const reviewsApi = createResource<Review>("/reviews", "reviews");
export const notificationsApi = createResource<Notification>("/notifications", "notifications");
export const attendanceApi = createResource<Attendance>("/attendance", "attendance");
export const tasksApi = createResource<Task>("/tasks", "tasks");
export const promotionsApi = createResource<Promotion>("/promotions", "promotions");
export const loyaltyApi = createResource<LoyaltyAccount>("/loyalty", "loyalty");
export const usersApi = createResource<StaffUser>("/users", "users");
export const auditLogsApi = createResource<AuditLog>("/audit-logs", "audit-logs");
export const documentsApi = createResource<AppDocument>("/documents", "documents");
