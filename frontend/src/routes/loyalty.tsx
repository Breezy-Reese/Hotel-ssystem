import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/loyalty")({
  head: () => ({
    meta: [
      { title: "Loyalty & Rewards — Aurelia Suites" },
      { name: "description", content: "Guest points, membership tiers, reward discounts and redemptions." },
      { property: "og:title", content: "Loyalty & Rewards — Aurelia Suites" },
      { property: "og:description", content: "Guest points, membership tiers, reward discounts and redemptions." },
    ],
  }),
  component: LoyaltyPage,
});

function LoyaltyPage() {
  return (
    <ModulePage
      title="Loyalty & Rewards"
      description="Guest points, membership tiers, reward discounts and redemptions."
      action="Add reward"
      stats={["Members", "Points issued", "Points redeemed", "Active rewards"]}
      columns={["Member", "Tier", "Points", "Lifetime spend", "Last activity", "Status"]}
      capabilities={["Customer points", "Membership levels", "Reward discounts", "Redeem points"]}
    />
  );
}
