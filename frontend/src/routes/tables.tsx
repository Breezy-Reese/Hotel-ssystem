import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { tablesApi } from "@/lib/resources";
import type { Guest, RestaurantTable, RestaurantTableStatus } from "@/lib/types";

export const Route = createFileRoute("/tables")({
  head: () => ({
    meta: [
      { title: "Table Management — Aurelia Suites" },
      {
        name: "description",
        content: "Track restaurant table capacity, sections and live availability.",
      },
    ],
  }),
  component: TablesPage,
});

const STATUS_VARIANT: Record<RestaurantTableStatus, "default" | "secondary" | "outline"> = {
  Available: "default",
  Occupied: "outline",
  Reserved: "secondary",
};

function reservedForName(g: RestaurantTable["reservedFor"]) {
  if (!g) return "—";
  return typeof g === "string" ? g : (g as Guest).name;
}

const columns: LiveColumn<RestaurantTable>[] = [
  { header: "Table #", render: (t) => <span className="font-medium">{t.tableNumber}</span> },
  { header: "Capacity", render: (t) => t.capacity },
  { header: "Section", render: (t) => t.section || "—" },
  { header: "Status", render: (t) => <Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge> },
  { header: "Reserved for", render: (t) => reservedForName(t.reservedFor) },
  {
    header: "Time",
    render: (t) => (t.reservedTime ? new Date(t.reservedTime).toLocaleString() : "—"),
  },
];

function TablesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = tablesApi.useList({ search, sort: "tableNumber" });
  const tables = data?.data ?? [];

  const stats = {
    Tables: data?.total ?? "—",
    Available: tables.filter((t) => t.status === "Available").length,
    Occupied: tables.filter((t) => t.status === "Occupied").length,
    Reserved: tables.filter((t) => t.status === "Reserved").length,
  };

  return (
    <ModulePage
      title="Table Management"
      description="Track restaurant table capacity, sections and live availability."
      action="Add table"
      stats={["Tables", "Available", "Occupied", "Reserved"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Table numbers", "Capacity", "Availability status", "Table reservations"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={tables}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No tables yet"
          emptyHint="Tables created via the API will show up here."
        />
      }
    />
  );
}
