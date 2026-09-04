import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { promotionsApi } from "@/lib/resources";
import type { Promotion, PromotionStatus } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/promotions")({
  head: () => ({
    meta: [
      { title: "Promotions & Discounts — Aurelia Suites" },
      {
        name: "description",
        content: "Create and schedule promo codes across rooms, menu and services.",
      },
    ],
  }),
  component: PromotionsPage,
});

const STATUS_VARIANT: Record<PromotionStatus, "default" | "secondary" | "destructive" | "outline"> =
  {
    Active: "default",
    Scheduled: "secondary",
    Expired: "outline",
    Disabled: "destructive",
  };

const columns: LiveColumn<Promotion>[] = [
  { header: "Code", render: (p) => <span className="font-medium">{p.code}</span> },
  { header: "Applies to", render: (p) => p.appliesTo },
  {
    header: "Discount",
    render: (p) =>
      p.discountType === "Percent" ? `${p.discountValue}%` : formatCurrency(p.discountValue),
  },
  { header: "Starts", render: (p) => format(new Date(p.startsAt), "MMM d, yyyy") },
  { header: "Expires", render: (p) => format(new Date(p.expiresAt), "MMM d, yyyy") },
  {
    header: "Status",
    render: (p) => (
      <Badge variant={STATUS_VARIANT[p.status ?? "Active"]}>{p.status ?? "Active"}</Badge>
    ),
  },
];

function PromotionsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = promotionsApi.useList({ search, sort: "-startsAt" });
  const promotions = data?.data ?? [];

  const stats = {
    "Active promos": promotions.filter((p) => p.status === "Active").length,
    Scheduled: promotions.filter((p) => p.status === "Scheduled").length,
    Expired: promotions.filter((p) => p.status === "Expired").length,
    Redemptions: promotions.reduce((sum, p) => sum + p.redemptions, 0),
  };

  return (
    <ModulePage
      title="Promotions & Discounts"
      description="Create and schedule promo codes across rooms, menu and services."
      action="Create promotion"
      stats={["Active promos", "Scheduled", "Expired", "Redemptions"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Percent or fixed discounts",
        "Scheduled windows",
        "Applies to rooms, menu or services",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={promotions}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No promotions yet"
          emptyHint="Promo codes created via the API will show up here."
        />
      }
    />
  );
}
