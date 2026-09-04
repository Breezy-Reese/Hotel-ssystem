import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { paymentsApi } from "@/lib/resources";
import type { Payment, PaymentStatus } from "@/lib/types";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payment Management — Aurelia Suites" },
      {
        name: "description",
        content: "All payment transactions across reservations, orders and services.",
      },
    ],
  }),
  component: PaymentsPage,
});

const STATUS_VARIANT: Record<PaymentStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Completed: "default",
  Pending: "secondary",
  Refunded: "outline",
  Failed: "destructive",
};

const columns: LiveColumn<Payment>[] = [
  { header: "Txn ID", render: (p) => <span className="font-medium">{p.transactionId}</span> },
  { header: "Source", render: (p) => p.source },
  { header: "Method", render: (p) => p.method },
  { header: "Amount", render: (p) => formatCurrency(p.amount) },
  { header: "Date", render: (p) => format(new Date(p.date), "MMM d, yyyy") },
  { header: "Status", render: (p) => <Badge variant={STATUS_VARIANT[p.status]}>{p.status}</Badge> },
];

function PaymentsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = paymentsApi.useList({ search, sort: "-date" });
  const payments = data?.data ?? [];

  const today = new Date().toDateString();
  const stats = {
    "Collected today": formatCurrency(payments
      .filter((p) => p.status === "Completed" && new Date(p.date).toDateString() === today)
      .reduce((sum, p) => sum + p.amount, 0)
      ),
    Pending: payments.filter((p) => p.status === "Pending").length,
    Refunded: payments.filter((p) => p.status === "Refunded").length,
    Failed: payments.filter((p) => p.status === "Failed").length,
  };

  return (
    <ModulePage
      title="Payment Management"
      description="All payment transactions across reservations, orders and services."
      action="Record payment"
      stats={["Collected today", "Pending", "Refunded", "Failed"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Cash", "Card", "M-Pesa", "Bank transfer", "Transaction records", "Refunds"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={payments}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No payments yet"
          emptyHint="Payments recorded via the API — including invoice pay-offs — will show up here."
        />
      }
    />
  );
}
