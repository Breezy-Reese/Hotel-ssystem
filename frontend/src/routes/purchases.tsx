import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { purchasesApi } from "@/lib/resources";
import type { Purchase, PurchaseStatus, Supplier } from "@/lib/types";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/purchases")({
  head: () => ({
    meta: [
      { title: "Purchase Management — Aurelia Suites" },
      { name: "description", content: "Create purchase orders and receive stock from suppliers." },
    ],
  }),
  component: PurchasesPage,
});

const STATUS_VARIANT: Record<PurchaseStatus, "default" | "secondary" | "destructive" | "outline"> =
  {
    Draft: "outline",
    Ordered: "secondary",
    AwaitingDelivery: "secondary",
    Received: "default",
    Cancelled: "destructive",
  };

function supplierName(s: Purchase["supplier"]) {
  return typeof s === "string" ? s : ((s as Supplier)?.name ?? "—");
}

function PurchasesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = purchasesApi.useList({ search, sort: "-createdAt" });
  const receive = purchasesApi.useAction<void, { status: string; data: Purchase }>(
    "post",
    (id) => `/purchases/${id}/receive`,
  );

  const purchases = data?.data ?? [];
  const stats = {
    "Open POs": purchases.filter((p) => p.status === "Ordered" || p.status === "Draft").length,
    "Awaiting delivery": purchases.filter((p) => p.status === "AwaitingDelivery").length,
    Received: purchases.filter((p) => p.status === "Received").length,
    "Purchase cost": formatCurrency(purchases.reduce((sum, p) => sum + (p.totalCost ?? 0), 0)),
  };

  async function handleReceive(id: string) {
    try {
      await receive.mutateAsync({ id });
      toast.success("Purchase order received — inventory updated");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to receive order");
    }
  }

  const columns: LiveColumn<Purchase>[] = [
    { header: "PO #", render: (p) => <span className="font-medium">{p.poNumber}</span> },
    { header: "Supplier", render: (p) => supplierName(p.supplier) },
    { header: "Items", render: (p) => `${p.items.length} item${p.items.length === 1 ? "" : "s"}` },
    {
      header: "Expected",
      render: (p) => (p.expectedDate ? format(new Date(p.expectedDate), "MMM d, yyyy") : "—"),
    },
    { header: "Cost", render: (p) => formatCurrency((p.totalCost ?? 0)) },
    {
      header: "Status",
      render: (p) => <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge>,
    },
  ];

  return (
    <ModulePage
      title="Purchase Management"
      description="Create purchase orders and receive stock from suppliers."
      action="New purchase order"
      stats={["Open POs", "Awaiting delivery", "Received", "Purchase cost"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Purchase orders",
        "Multi-item lines",
        "Receive stock",
        "Auto inventory & supplier balance update",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={purchases}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No purchase orders yet"
          emptyHint="Purchase orders created via the API will show up here."
          rowActions={(p) =>
            p.status !== "Received" &&
            p.status !== "Cancelled" && (
              <Button size="sm" variant="outline" onClick={() => handleReceive(p._id)}>
                Receive
              </Button>
            )
          }
        />
      }
    />
  );
}
