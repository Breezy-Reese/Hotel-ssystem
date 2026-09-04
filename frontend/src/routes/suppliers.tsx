import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { suppliersApi } from "@/lib/resources";
import type { Supplier } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Supplier Management — Aurelia Suites" },
      {
        name: "description",
        content: "Manage vendor contacts, products supplied and outstanding balances.",
      },
    ],
  }),
  component: SuppliersPage,
});

const columns: LiveColumn<Supplier>[] = [
  { header: "Supplier", render: (s) => <span className="font-medium">{s.name}</span> },
  { header: "Contact", render: (s) => s.contactPhone || s.contactEmail || "—" },
  { header: "Products", render: (s) => s.productsSupplied?.join(", ") || "—" },
  { header: "Balance", render: (s) => formatCurrency(s.balanceOwed) },
  {
    header: "Status",
    render: (s) => (
      <Badge variant={s.status === "Active" ? "default" : "secondary"}>{s.status}</Badge>
    ),
  },
];

function SuppliersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = suppliersApi.useList({ search, sort: "name" });
  const suppliers = data?.data ?? [];

  const stats = {
    Suppliers: data?.total ?? "—",
    "Amount owed": formatCurrency(suppliers.reduce((sum, s) => sum + s.balanceOwed, 0)),
  };

  return (
    <ModulePage
      title="Supplier Management"
      description="Manage vendor contacts, products supplied and outstanding balances."
      action="Add supplier"
      stats={["Suppliers", "Active orders", "Amount owed", "Paid this month"]}
      statValues={stats}
      columns={["Supplier", "Contact", "Products", "Orders", "Balance", "Status"]}
      capabilities={[
        "Vendor contacts",
        "Products supplied",
        "Balance tracking",
        "Linked to purchase orders",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={suppliers}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No suppliers yet"
          emptyHint="Suppliers created via the API will show up here."
        />
      }
    />
  );
}
