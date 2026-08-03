import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu Management — Aurelia Suites" },
      { name: "description", content: "Food and drink catalogue with categories, pricing, images, availability and offers." },
      { property: "og:title", content: "Menu Management — Aurelia Suites" },
      { property: "og:description", content: "Food and drink catalogue with categories, pricing, images, availability and offers." },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  return (
    <ModulePage
      title="Menu Management"
      description="Food and drink catalogue with categories, pricing, images, availability and offers."
      action="Add item"
      stats={["Menu items", "Categories", "Unavailable", "Active offers"]}
      columns={["Item", "Category", "Price", "Availability", "Offer", "Updated"]}
      capabilities={["Categories", "Prices", "Food images", "Availability", "Special offers"]}
    />
  );
}
