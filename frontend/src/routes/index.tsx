import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowUpRight,
  BedDouble,
  CalendarCheck,
  Loader2,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PageHeader } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { navGroups } from "@/config/navigation";
import { useDashboardStats } from "@/lib/reports";
import { reservationsApi } from "@/lib/resources";
import type { Guest, Reservation, Room } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Aurelia Suites Hospitality System" },
      {
        name: "description",
        content:
          "Live overview of occupancy, bookings, restaurant sales and revenue across the property.",
      },
      { property: "og:title", content: "Dashboard — Aurelia Suites Hospitality System" },
      {
        property: "og:description",
        content: "Live overview of occupancy, bookings, restaurant sales and revenue.",
      },
    ],
  }),
  component: Dashboard,
});

function guestName(g: Reservation["guest"]) {
  return typeof g === "string" ? g : (g as Guest).name;
}
function roomNumber(r: Reservation["room"]) {
  return typeof r === "string" ? r : (r as Room).roomNumber;
}

const recentColumns: LiveColumn<Reservation>[] = [
  { header: "Ref", render: (r) => r.ref },
  { header: "Guest", render: (r) => guestName(r.guest) },
  { header: "Room", render: (r) => roomNumber(r.room) },
  { header: "Check-in", render: (r) => format(new Date(r.checkIn), "MMM d") },
  { header: "Status", render: (r) => r.status },
];

function Dashboard() {
  const shortcuts = navGroups.flatMap((g) => g.items).filter((i) => i.url !== "/");
  const { data: statsRes, isLoading: statsLoading } = useDashboardStats();
  const { data: recentRes, isLoading: recentLoading } = reservationsApi.useList({
    sort: "-createdAt",
    limit: 5,
  });

  const stats = statsRes?.data;
  const occupancyRate =
    stats && stats.rooms.total > 0
      ? Math.round((stats.rooms.occupied / stats.rooms.total) * 100)
      : 0;

  const kpis = [
    {
      label: "Total bookings",
      icon: CalendarCheck,
      hint: "All reservations",
      value: stats ? stats.reservations.inHouse + stats.reservations.arrivalsToday : undefined,
    },
    {
      label: "Available rooms",
      icon: BedDouble,
      hint: "Ready to sell",
      value: stats?.rooms.available,
    },
    {
      label: "Open invoices",
      icon: UtensilsCrossed,
      hint: "Awaiting payment",
      value: stats?.billing.openInvoices,
    },
    {
      label: "Revenue today",
      icon: Wallet,
      hint: "Hotel + restaurant",
      value: stats ? formatCurrency(stats.billing.revenueToday) : undefined,
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Overview"
        description="A single console for rooms, reservations, dining, finance, inventory and staff."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <Card key={k.label} className="shadow-card">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {k.label}
              </CardTitle>
              <k.icon className="size-4 text-accent" />
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
              ) : (
                <p className="font-display text-3xl font-semibold text-foreground">
                  {k.value ?? "—"}
                </p>
              )}
              <p className="mt-1 text-xs text-muted-foreground">{k.hint}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="shadow-card lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Occupancy rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="font-display text-4xl font-semibold text-foreground">
              {stats ? `${occupancyRate}%` : "—%"}
            </p>
            <Progress value={occupancyRate} />
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Occupied</span>
              <span className="font-medium">{stats?.rooms.occupied ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Available</span>
              <span className="font-medium">{stats?.rooms.available ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Rooms to clean</span>
              <span className="font-medium">{stats?.housekeeping.roomsToClean ?? "—"}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Maintenance</span>
              <span className="font-medium">{stats?.rooms.outOfService ?? "—"}</span>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <LiveDataTable
            columns={recentColumns}
            rows={recentRes?.data ?? []}
            isLoading={recentLoading}
            emptyTitle="No recent bookings"
            emptyHint="Recent reservations will appear here."
          />
        </div>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-sm">All modules</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {shortcuts.map((s) => (
            <Link
              key={s.url}
              to={s.url}
              className="group flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:border-accent hover:bg-secondary"
            >
              <s.icon className="size-4 text-accent" />
              <span className="truncate">{s.title}</span>
              <ArrowUpRight className="ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </Link>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
