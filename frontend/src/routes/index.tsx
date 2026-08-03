import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, BedDouble, CalendarCheck, UtensilsCrossed, Wallet } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { DataTableShell, PageHeader } from "@/components/module-page";
import { navGroups } from "@/config/navigation";

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

const kpis = [
  { label: "Total bookings", icon: CalendarCheck, hint: "All reservations" },
  { label: "Available rooms", icon: BedDouble, hint: "Ready to sell" },
  { label: "Restaurant sales", icon: UtensilsCrossed, hint: "Today" },
  { label: "Total revenue", icon: Wallet, hint: "Hotel + restaurant" },
];

function Dashboard() {
  const shortcuts = navGroups.flatMap((g) => g.items).filter((i) => i.url !== "/");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Property Overview"
        description="A single console for rooms, reservations, dining, finance, inventory and staff. Metrics populate once your backend is connected."
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
              <p className="font-display text-3xl font-semibold text-muted-foreground/40">—</p>
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
            <p className="font-display text-4xl font-semibold text-muted-foreground/40">—%</p>
            <Progress value={0} />
            {["Occupied", "Reserved", "Cleaning", "Maintenance"].map((s) => (
              <div key={s} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{s}</span>
                <span className="font-medium text-muted-foreground/50">—</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="space-y-4 lg:col-span-2">
          <DataTableShell
            toolbar={false}
            columns={["Ref", "Guest", "Room", "Check-in", "Status"]}
            emptyTitle="No recent bookings"
            emptyHint="Recent reservations will appear here."
          />
          <DataTableShell
            toolbar={false}
            columns={["Order #", "Type", "Items", "Total", "Status"]}
            emptyTitle="No recent food orders"
            emptyHint="Restaurant orders will appear here."
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
