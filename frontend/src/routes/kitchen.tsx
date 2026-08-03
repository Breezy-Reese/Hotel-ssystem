import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/kitchen")({
  head: () => ({
    meta: [
      { title: "Kitchen Display — Aurelia Suites" },
      { name: "description", content: "Live kitchen queue with preparation status, timers and waiter notifications." },
      { property: "og:title", content: "Kitchen Display — Aurelia Suites" },
      { property: "og:description", content: "Live kitchen queue with preparation status, timers and waiter notifications." },
    ],
  }),
  component: KitchenPage,
});

function KitchenPage() {
  return (
    <ModulePage
      title="Kitchen Display"
      description="Live kitchen queue with preparation status, timers and waiter notifications."
      
      stats={["New tickets", "Preparing", "Ready to serve", "Avg prep time"]}
      columns={["Ticket", "Items", "Placed", "Elapsed", "Station", "Status"]}
      capabilities={["Kitchen order display", "New orders", "Update prep status", "Track prep time", "Notify waiters"]}
    />
  );
}
