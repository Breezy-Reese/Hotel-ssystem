import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { servicesApi } from "@/lib/resources";
import type { Service } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Hotel Services — Aurelia Suites" },
      {
        name: "description",
        content: "Manage bookable hotel services: spa, laundry, transport and more.",
      },
    ],
  }),
  component: ServicesPage,
});

const columns: LiveColumn<Service>[] = [
  { header: "Service", render: (s) => <span className="font-medium">{s.name}</span> },
  { header: "Category", render: (s) => s.category },
  { header: "Price", render: (s) => formatCurrency(s.price) },
  { header: "Duration", render: (s) => (s.duration ? `${s.duration} min` : "—") },
  { header: "Availability", render: (s) => (s.availability ? "Available" : "Unavailable") },
  {
    header: "Status",
    render: (s) => (
      <Badge variant={s.status === "Active" ? "default" : "secondary"}>{s.status}</Badge>
    ),
  },
];

function ServicesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = servicesApi.useList({ search, sort: "name" });
  const services = data?.data ?? [];

  const stats = {
    Services: data?.total ?? "—",
    Active: services.filter((s) => s.status === "Active").length,
  };

  return (
    <ModulePage
      title="Hotel Services"
      description="Manage bookable hotel services: spa, laundry, transport and more."
      action="Add service"
      stats={["Services", "Active", "Bookings today", "Service revenue"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Laundry", "Airport pickup", "Conference rooms", "Spa", "Gym", "Event halls"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={services}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No services yet"
          emptyHint="Services created via the API will show up here."
        />
      }
    />
  );
}
