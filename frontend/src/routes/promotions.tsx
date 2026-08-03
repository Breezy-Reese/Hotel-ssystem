import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "Promotions & Discounts — Aurelia Suites" },
      { name: "description", content: "Discount codes, seasonal campaigns and room or restaurant offers." },
      { property: "og:title", content: "Promotions & Discounts — Aurelia Suites" },
      { property: "og:description", content: "Discount codes, seasonal campaigns and room or restaurant offers." },
    ],
  }),
  component: PromotionsPage,
});

function PromotionsPage() {
  return (
    <ModulePage
      title="Promotions & Discounts"
      description="Discount codes, seasonal campaigns and room or restaurant offers."
      action="Create promotion"
      stats={["Active promos", "Scheduled", "Expired", "Redemptions"]}
      columns={["Code", "Applies to", "Discount", "Starts", "Expires", "Status"]}
      capabilities={["Discount codes", "Seasonal offers", "Room promotions", "Restaurant promotions", "Expiry dates"]}
    />
  );
}
