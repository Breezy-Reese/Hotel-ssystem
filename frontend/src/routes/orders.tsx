import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ordersApi } from "@/lib/resources";
import type { Order, OrderStatus, Room } from "@/lib/types";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Restaurant Orders — Aurelia Suites" },
      {
        name: "description",
        content: "Dine-in, takeaway and room-service orders with full status tracking.",
      },
    ],
  }),
  component: OrdersPage,
});

const STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "outline",
  Preparing: "secondary",
  Ready: "default",
  Served: "secondary",
  Completed: "default",
  Cancelled: "destructive",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  Pending: "Preparing",
  Preparing: "Ready",
  Ready: "Served",
  Served: "Completed",
};

function tableOrRoom(o: Order) {
  if (o.table) return typeof o.table === "string" ? o.table : o.table.tableNumber;
  if (o.room) return typeof o.room === "string" ? o.room : (o.room as Room).roomNumber;
  return "—";
}

function OrdersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = ordersApi.useList({ search, sort: "-placedAt" });
  const updateStatus = ordersApi.useAction<
    { status: OrderStatus },
    { status: string; data: Order }
  >("patch", (id) => `/orders/${id}/status`);

  const orders = data?.data ?? [];
  const stats = {
    Pending: orders.filter((o) => o.status === "Pending").length,
    Preparing: orders.filter((o) => o.status === "Preparing").length,
    Ready: orders.filter((o) => o.status === "Ready").length,
    "Completed today": orders.filter((o) => o.status === "Completed").length,
  };

  async function advance(order: Order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await updateStatus.mutateAsync({ id: order._id, payload: { status: next } });
      toast.success(`Order moved to ${next}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update order");
    }
  }

  const columns: LiveColumn<Order>[] = [
    { header: "Order #", render: (o) => <span className="font-medium">{o.orderNumber}</span> },
    { header: "Type", render: (o) => o.type },
    { header: "Table / Room", render: (o) => tableOrRoom(o) },
    { header: "Items", render: (o) => o.items.length },
    { header: "Total", render: (o) => (o.total !== undefined ? `$${o.total.toFixed(2)}` : "—") },
    {
      header: "Status",
      render: (o) => <Badge variant={STATUS_VARIANT[o.status]}>{o.status}</Badge>,
    },
  ];

  return (
    <ModulePage
      title="Restaurant Orders"
      description="Dine-in, takeaway and room-service orders with full status tracking."
      stats={["Pending", "Preparing", "Ready", "Completed today"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Dine-in",
        "Takeaway",
        "Room service",
        "Pending",
        "Preparing",
        "Ready",
        "Served",
        "Completed",
        "Cancelled",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={orders}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No orders yet"
          emptyHint="Orders placed via the API or POS will show up here."
          rowActions={(o) =>
            NEXT_STATUS[o.status] ? (
              <Button size="sm" variant="outline" onClick={() => advance(o)}>
                Mark {NEXT_STATUS[o.status]}
              </Button>
            ) : null
          }
        />
      }
    />
  );
}
