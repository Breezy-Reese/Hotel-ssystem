import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/orders")({
  head: () => ({
    meta: [
      { title: "Restaurant Orders — Aurelia Suites" },
      { name: "description", content: "Dine-in, takeaway and room-service orders with full status tracking." },
      { property: "og:title", content: "Restaurant Orders — Aurelia Suites" },
      { property: "og:description", content: "Dine-in, takeaway and room-service orders with full status tracking." },
    ],
  }),
  component: OrdersPage,
});

function OrdersPage() {
  return (
    <ModulePage
      title="Restaurant Orders"
      description="Dine-in, takeaway and room-service orders with full status tracking."
      action="New order"
      stats={["Pending", "Preparing", "Ready", "Completed today"]}
      columns={["Order #", "Type", "Table / Room", "Items", "Total", "Status"]}
      capabilities={["Dine-in", "Takeaway", "Room service", "Pending", "Preparing", "Ready", "Served", "Completed", "Cancelled"]}
    />
  );
}
