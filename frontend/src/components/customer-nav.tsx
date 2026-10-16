import { Link } from "@tanstack/react-router";

const links = [
  { to: "/customer/rooms", label: "Rooms" },
  { to: "/customer/restaurant", label: "Restaurant" },
  { to: "/customer/bookings", label: "My Bookings" },
] as const;

export function CustomerNav() {
  return (
    <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
      {links.map((link) => (
        <Link
          key={link.to}
          to={link.to}
          className="hover:text-slate-900"
          activeProps={{ className: "text-slate-900 font-semibold" }}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}