import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { serviceBookingsApi } from "@/lib/resources";
import type { Guest, Service, ServiceBooking, ServiceBookingStatus } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/service-bookings")({
  head: () => ({
    meta: [
      { title: "Service Bookings — Aurelia Suites" },
      { name: "description", content: "Schedule and track guest bookings for hotel services." },
    ],
  }),
  component: ServiceBookingsPage,
});

const STATUS_VARIANT: Record<
  ServiceBookingStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Requested: "outline",
  Scheduled: "secondary",
  InProgress: "secondary",
  Completed: "default",
  Cancelled: "destructive",
};

function guestName(g: ServiceBooking["guest"]) {
  return typeof g === "string" ? g : ((g as Guest)?.name ?? "—");
}
function serviceName(s: ServiceBooking["service"]) {
  return typeof s === "string" ? s : ((s as Service)?.name ?? "—");
}

const columns: LiveColumn<ServiceBooking>[] = [
  { header: "Ref", render: (b) => <span className="font-medium">{b.ref}</span> },
  { header: "Guest", render: (b) => guestName(b.guest) },
  { header: "Service", render: (b) => serviceName(b.service) },
  { header: "Date & time", render: (b) => format(new Date(b.dateTime), "MMM d, HH:mm") },
  { header: "Charge", render: (b) => formatCurrency(b.charge) },
  { header: "Status", render: (b) => <Badge variant={STATUS_VARIANT[b.status]}>{b.status}</Badge> },
];

function ServiceBookingsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = serviceBookingsApi.useList({ search, sort: "-dateTime" });
  const bookings = data?.data ?? [];

  const stats = {
    Requested: bookings.filter((b) => b.status === "Requested").length,
    Scheduled: bookings.filter((b) => b.status === "Scheduled").length,
    "In progress": bookings.filter((b) => b.status === "InProgress").length,
    Completed: bookings.filter((b) => b.status === "Completed").length,
  };

  return (
    <ModulePage
      title="Service Bookings"
      description="Schedule and track guest bookings for hotel services."
      action="New booking"
      stats={["Requested", "Scheduled", "In progress", "Completed"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Select date and time", "Track service status", "Add charges to guest bill"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={bookings}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No service bookings yet"
          emptyHint="Bookings created via the API will show up here."
        />
      }
    />
  );
}
