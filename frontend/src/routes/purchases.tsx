import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/purchases")({
  head: () => ({
    meta: [
      { title: "Purchase Management — Aurelia Suites" },
      { name: "description", content: "Purchase orders, goods receipt and automatic inventory updates." },
      { property: "og:title", content: "Purchase Management — Aurelia Suites" },
      { property: "og:description", content: "Purchase orders, goods receipt and automatic inventory updates." },
    ],
  }),
  component: PurchasesPage,
});

function PurchasesPage() {
  return (
    <ModulePage
      title="Purchase Management"
      description="Purchase orders, goods receipt and automatic inventory updates."
      action="New purchase order"
      stats={["Open POs", "Awaiting delivery", "Received", "Purchase cost"]}
      columns={["PO #", "Supplier", "Items", "Expected", "Cost", "Status"]}
      capabilities={["Create purchase orders", "Receive stock", "Auto-update inventory", "Track purchase costs"]}
    />
  );
}
