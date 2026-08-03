import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/inventory")({
  head: () => ({
    meta: [
      { title: "Inventory Management — Aurelia Suites" },
      { name: "description", content: "Stock levels for ingredients, drinks, cleaning supplies, toiletries and equipment." },
      { property: "og:title", content: "Inventory Management — Aurelia Suites" },
      { property: "og:description", content: "Stock levels for ingredients, drinks, cleaning supplies, toiletries and equipment." },
    ],
  }),
  component: InventoryPage,
});

function InventoryPage() {
  return (
    <ModulePage
      title="Inventory Management"
      description="Stock levels for ingredients, drinks, cleaning supplies, toiletries and equipment."
      action="Add stock item"
      stats={["Stock items", "Low stock", "Out of stock", "Stock value"]}
      columns={["Item", "Category", "Quantity", "Unit", "Reorder level", "Status"]}
      capabilities={["Food ingredients", "Drinks", "Cleaning supplies", "Toiletries", "Equipment", "Low-stock alerts", "Stock in / out"]}
    />
  );
}
