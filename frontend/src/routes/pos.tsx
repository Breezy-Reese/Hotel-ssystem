import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { salesApi } from "@/lib/resources";
import type { Sale } from "@/lib/types";

export const Route = createFileRoute("/pos")({
  head: () => ({
    meta: [
      { title: "Restaurant POS — Aurelia Suites" },
      { name: "description", content: "Point-of-sale receipts, discounts and payment methods." },
    ],
  }),
  component: PosPage,
});

function cashierName(c: Sale["cashier"]) {
  if (!c) return "—";
  return typeof c === "string" ? c : c.name;
}

function saleTotal(s: Sale) {
  const subtotal = s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  return Math.max(subtotal - s.discount, 0);
}

const columns: LiveColumn<Sale>[] = [
  { header: "Receipt #", render: (s) => <span className="font-medium">{s.receiptNumber}</span> },
  { header: "Cashier", render: (s) => cashierName(s.cashier) },
  { header: "Items", render: (s) => `${s.items.length} item${s.items.length === 1 ? "" : "s"}` },
  { header: "Discount", render: (s) => `$${s.discount.toFixed(2)}` },
  { header: "Total", render: (s) => `$${saleTotal(s).toFixed(2)}` },
  { header: "Payment", render: (s) => <Badge variant="secondary">{s.paymentMethod}</Badge> },
];

function PosPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = salesApi.useList({ sort: "-createdAt" });
  const sales = (data?.data ?? []).filter((s) =>
    search ? s.receiptNumber.toLowerCase().includes(search.toLowerCase()) : true,
  );

  const today = new Date().toDateString();
  const salesToday = (data?.data ?? []).filter(
    (s) => new Date(s.createdAt).toDateString() === today,
  );
  const stats = {
    "Sales today": `$${salesToday.reduce((sum, s) => sum + saleTotal(s), 0).toFixed(2)}`,
    "Discounts given": `$${(data?.data ?? []).reduce((sum, s) => sum + s.discount, 0).toFixed(2)}`,
    "Average bill":
      (data?.data ?? []).length > 0
        ? `$${((data?.data ?? []).reduce((sum, s) => sum + saleTotal(s), 0) / (data?.data ?? []).length).toFixed(2)}`
        : "—",
  };

  return (
    <ModulePage
      title="Restaurant POS"
      description="Point-of-sale receipts, discounts and payment methods."
      action="New sale"
      stats={["Sales today", "Open tickets", "Discounts given", "Average bill"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Cash", "Card", "Mobile payment", "Discounts", "Linked to restaurant orders"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={sales}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No sales yet"
          emptyHint="POS receipts created via the API will show up here."
        />
      }
    />
  );
}
