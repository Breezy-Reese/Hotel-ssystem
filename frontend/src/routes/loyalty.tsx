import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { loyaltyApi } from "@/lib/resources";
import type { Guest, LoyaltyAccount, LoyaltyTier } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/loyalty")({
  head: () => ({
    meta: [
      { title: "Loyalty & Rewards — Aurelia Suites" },
      {
        name: "description",
        content: "Manage guest loyalty tiers, points balances and redemptions.",
      },
    ],
  }),
  component: LoyaltyPage,
});

const TIER_VARIANT: Record<LoyaltyTier, "default" | "secondary" | "outline"> = {
  Bronze: "outline",
  Silver: "secondary",
  Gold: "default",
  Platinum: "default",
};

function guestName(g: LoyaltyAccount["guest"]) {
  return typeof g === "string" ? g : ((g as Guest)?.name ?? "—");
}

const columns: LiveColumn<LoyaltyAccount>[] = [
  { header: "Member", render: (a) => guestName(a.guest) },
  { header: "Tier", render: (a) => <Badge variant={TIER_VARIANT[a.tier]}>{a.tier}</Badge> },
  { header: "Points", render: (a) => a.points.toLocaleString() },
  { header: "Lifetime spend", render: (a) => formatCurrency(a.lifetimeSpend) },
  {
    header: "Last activity",
    render: (a) => (a.lastActivity ? new Date(a.lastActivity).toLocaleDateString() : "—"),
  },
  {
    header: "Status",
    render: (a) => (
      <Badge variant={a.status === "Active" ? "default" : "secondary"}>{a.status}</Badge>
    ),
  },
];

function LoyaltyPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = loyaltyApi.useList({ search });
  const accounts = data?.data ?? [];

  const stats = {
    Members: data?.total ?? "—",
    "Points issued": accounts.reduce((sum, a) => sum + a.points, 0).toLocaleString(),
  };

  return (
    <ModulePage
      title="Loyalty & Rewards"
      description="Manage guest loyalty tiers, points balances and redemptions."
      action="Add reward"
      stats={["Members", "Points issued", "Points redeemed", "Active rewards"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Customer points", "Membership levels", "Reward discounts", "Redeem points"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={accounts}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No loyalty accounts yet"
          emptyHint="Accounts created via the API will show up here."
        />
      }
    />
  );
}
