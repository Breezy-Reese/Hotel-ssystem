import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "Restaurant POS — Aurelia Suites" },
      { name: "description", content: "Build orders, apply discounts, calculate totals, take payment and print receipts." },
      { property: "og:title", content: "Restaurant POS — Aurelia Suites" },
      { property: "og:description", content: "Build orders, apply discounts, calculate totals, take payment and print receipts." },
    ],
  }),
  component: POSPage,
});

function POSPage() {
  return (
    <ModulePage
      title="Restaurant POS"
      description="Build orders, apply discounts, calculate totals, take payment and print receipts."
      action="New sale"
      stats={["Sales today", "Open tickets", "Discounts given", "Average bill"]}
      columns={["Receipt #", "Cashier", "Items", "Discount", "Total", "Payment"]}
      capabilities={["Add meals to cart", "Calculate totals", "Apply discounts", "Generate receipts", "Record payments"]}
    />
  );
}
