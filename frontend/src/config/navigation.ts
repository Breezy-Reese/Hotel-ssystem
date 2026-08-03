import {
  LayoutDashboard,
  BedDouble,
  CalendarCheck,
  Users,
  ConciergeBell,
  Sparkles,
  Wrench,
  UtensilsCrossed,
  ClipboardList,
  Table2,
  ChefHat,
  Calculator,
  CreditCard,
  ReceiptText,
  Wallet,
  TrendingUp,
  Boxes,
  Truck,
  ShoppingCart,
  HandPlatter,
  CalendarRange,
  Star,
  Bell,
  IdCard,
  Fingerprint,
  ListChecks,
  BadgePercent,
  Gift,
  Building2,
  ScrollText,
  FolderOpen,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
};

export type NavGroup = {
  label: string;
  items: NavItem[];
};

export const navGroups: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/", icon: LayoutDashboard },
      { title: "Branches", url: "/branches", icon: Building2 },
    ],
  },
  {
    label: "Hotel",
    items: [
      { title: "Rooms", url: "/rooms", icon: BedDouble },
      { title: "Reservations", url: "/reservations", icon: CalendarCheck },
      { title: "Guests", url: "/guests", icon: Users },
      { title: "Front Desk", url: "/front-desk", icon: ConciergeBell },
      { title: "Housekeeping", url: "/housekeeping", icon: Sparkles },
      { title: "Maintenance", url: "/maintenance", icon: Wrench },
    ],
  },
  {
    label: "Restaurant",
    items: [
      { title: "Menu", url: "/menu", icon: UtensilsCrossed },
      { title: "Orders", url: "/orders", icon: ClipboardList },
      { title: "Tables", url: "/tables", icon: Table2 },
      { title: "Kitchen", url: "/kitchen", icon: ChefHat },
      { title: "POS", url: "/pos", icon: Calculator },
    ],
  },
  {
    label: "Finance",
    items: [
      { title: "Payments", url: "/payments", icon: CreditCard },
      { title: "Invoices", url: "/invoices", icon: ReceiptText },
      { title: "Expenses", url: "/expenses", icon: Wallet },
      { title: "Reports", url: "/reports", icon: TrendingUp },
    ],
  },
  {
    label: "Supply Chain",
    items: [
      { title: "Inventory", url: "/inventory", icon: Boxes },
      { title: "Suppliers", url: "/suppliers", icon: Truck },
      { title: "Purchases", url: "/purchases", icon: ShoppingCart },
    ],
  },
  {
    label: "Guest Services",
    items: [
      { title: "Services", url: "/services", icon: HandPlatter },
      { title: "Service Bookings", url: "/service-bookings", icon: CalendarRange },
      { title: "Reviews", url: "/reviews", icon: Star },
      { title: "Notifications", url: "/notifications", icon: Bell },
    ],
  },
  {
    label: "Staff",
    items: [
      { title: "Employees", url: "/employees", icon: IdCard },
      { title: "Attendance", url: "/attendance", icon: Fingerprint },
      { title: "Tasks", url: "/tasks", icon: ListChecks },
    ],
  },
  {
    label: "Growth",
    items: [
      { title: "Promotions", url: "/promotions", icon: BadgePercent },
      { title: "Loyalty", url: "/loyalty", icon: Gift },
    ],
  },
  {
    label: "Administration",
    items: [
      { title: "Users & Roles", url: "/users", icon: ShieldCheck },
      { title: "Audit Logs", url: "/audit-logs", icon: ScrollText },
      { title: "Documents", url: "/documents", icon: FolderOpen },
    ],
  },
];
