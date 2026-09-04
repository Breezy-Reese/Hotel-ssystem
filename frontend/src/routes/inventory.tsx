import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { inventoryApi } from "@/lib/resources";
import type { InventoryItem, InventoryStatus } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory Management — Aurelia Suites" },
      {
        name: "description",
        content: "Track stock levels, reorder thresholds and stock value across categories.",
      },
    ],
  }),
  component: InventoryPage,
});

const STATUS_VARIANT: Record<InventoryStatus, "default" | "secondary" | "destructive"> = {
  InStock: "default",
  LowStock: "secondary",
  OutOfStock: "destructive",
};

const columns: LiveColumn<InventoryItem>[] = [
  { header: "Item", render: (i) => <span className="font-medium">{i.name}</span> },
  { header: "Category", render: (i) => i.category },
  { header: "Quantity", render: (i) => `${i.quantity} ${i.unit}` },
  { header: "Reorder level", render: (i) => `${i.reorderLevel} ${i.unit}` },
  { header: "Stock value", render: (i) => formatCurrency(i.stockValue) },
  {
    header: "Status",
    render: (i) => <Badge variant={STATUS_VARIANT[i.status]}>{i.status}</Badge>,
  },
];

function InventoryPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = inventoryApi.useList({ search, sort: "name" });

  const items = data?.data ?? [];
  const stats = {
    "Total items": data?.total ?? "—",
    "In stock": items.filter((i) => i.status === "InStock").length,
    "Low stock": items.filter((i) => i.status === "LowStock").length,
    "Out of stock": items.filter((i) => i.status === "OutOfStock").length,
  };

  return (
    <ModulePage
      title="Inventory Management"
      description="Track stock levels, reorder thresholds and stock value across categories."
      stats={["Total items", "In stock", "Low stock", "Out of stock"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Stock levels",
        "Reorder thresholds",
        "Stock valuation",
        "Restocked via Purchase Orders",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={items}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No inventory items yet"
          emptyHint="Stock items created via the API will show up here."
        />
      }
    />
  );
}
