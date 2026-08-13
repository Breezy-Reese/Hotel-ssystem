import { createFileRoute } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { formatDistanceToNowStrict } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { api, ApiError, type ItemResponse } from "@/lib/api";
import type { Order, OrderStatus } from "@/lib/types";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Kitchen Display — Aurelia Suites" },
      {
        name: "description",
        content: "Live ticket queue for the kitchen — pending, preparing and ready orders.",
      },
    ],
  }),
  component: KitchenPage,
});

const STATUS_VARIANT: Record<OrderStatus, "default" | "secondary" | "outline"> = {
  Pending: "outline",
  Preparing: "secondary",
  Ready: "default",
  Served: "default",
  Completed: "default",
  Cancelled: "outline",
};

const NEXT_STATUS: Partial<Record<OrderStatus, OrderStatus>> = {
  Pending: "Preparing",
  Preparing: "Ready",
  Ready: "Served",
};

function useKitchenTickets() {
  return useQuery({
    queryKey: ["orders", "kitchen"],
    queryFn: () => api.get<{ status: string; results: number; data: Order[] }>("/orders/kitchen"),
    refetchInterval: 15_000,
  });
}

function KitchenPage() {
  const { data, isLoading, isError } = useKitchenTickets();
  const queryClient = useQueryClient();
  const tickets = data?.data ?? [];

  const stats = {
    "New tickets": tickets.filter((t) => t.status === "Pending").length,
    Preparing: tickets.filter((t) => t.status === "Preparing").length,
    "Ready to serve": tickets.filter((t) => t.status === "Ready").length,
  };

  async function advance(order: Order) {
    const next = NEXT_STATUS[order.status];
    if (!next) return;
    try {
      await api.patch<ItemResponse<Order>>(`/orders/${order._id}/status`, { status: next });
      toast.success(`Order marked ${next}`);
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update order");
    }
  }

  const columns: LiveColumn<Order>[] = [
    { header: "Ticket", render: (o) => <span className="font-medium">{o.orderNumber}</span> },
    {
      header: "Items",
      render: (o) => o.items.map((i) => `${i.quantity}× ${i.name ?? "item"}`).join(", "),
    },
    { header: "Placed", render: (o) => new Date(o.placedAt).toLocaleTimeString() },
    {
      header: "Elapsed",
      render: (o) => formatDistanceToNowStrict(new Date(o.placedAt)),
    },
    { header: "Station", render: (o) => o.station || "Main" },
    {
      header: "Status",
      render: (o) => <Badge variant={STATUS_VARIANT[o.status]}>{o.status}</Badge>,
    },
  ];

  return (
    <ModulePage
      title="Kitchen Display"
      description="Live ticket queue for the kitchen — pending, preparing and ready orders."
      stats={["New tickets", "Preparing", "Ready to serve", "Avg prep time"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Live ticket queue",
        "Station grouping",
        "Status flow: Pending → Preparing → Ready → Served",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={tickets}
          isLoading={isLoading}
          isError={isError}
          recordCount={tickets.length}
          emptyTitle="No active tickets"
          emptyHint="New orders will appear here automatically."
          rowActions={(o) =>
            NEXT_STATUS[o.status] && (
              <Button size="sm" variant="outline" onClick={() => advance(o)}>
                Mark {NEXT_STATUS[o.status]}
              </Button>
            )
          }
        />
      }
    />
  );
}
