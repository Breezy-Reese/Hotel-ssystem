import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { expensesApi } from "@/lib/resources";
import type { Expense, ExpenseStatus, Supplier } from "@/lib/types";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Expense Management — Aurelia Suites" },
      {
        name: "description",
        content: "Track operating expenses, categories and supplier payments.",
      },
    ],
  }),
  component: ExpensesPage,
});

const STATUS_VARIANT: Record<ExpenseStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Pending: "outline",
  Approved: "secondary",
  Paid: "default",
  Rejected: "destructive",
};

function supplierName(s: Expense["supplier"]) {
  if (!s) return "—";
  return typeof s === "string" ? s : (s as Supplier).name;
}

const columns: LiveColumn<Expense>[] = [
  { header: "Date", render: (e) => format(new Date(e.date), "MMM d, yyyy") },
  { header: "Category", render: (e) => e.category },
  { header: "Description", render: (e) => e.description || "—" },
  { header: "Supplier", render: (e) => supplierName(e.supplier) },
  { header: "Amount", render: (e) => `$${e.amount.toFixed(2)}` },
  { header: "Status", render: (e) => <Badge variant={STATUS_VARIANT[e.status]}>{e.status}</Badge> },
];

function ExpensesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = expensesApi.useList({ search, sort: "-date" });
  const expenses = data?.data ?? [];

  const now = new Date();
  const thisMonth = expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });

  const stats = {
    "Expenses this month": `$${thisMonth.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}`,
    Categories: new Set(expenses.map((e) => e.category)).size,
    "Pending approvals": expenses.filter((e) => e.status === "Pending").length,
  };

  return (
    <ModulePage
      title="Expense Management"
      description="Track operating expenses, categories and supplier payments."
      action="Add expense"
      stats={["Expenses this month", "Categories", "Supplier payments", "Pending approvals"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Expense categories", "Supplier payments", "Monthly expense reports"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={expenses}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No expenses yet"
          emptyHint="Expenses created via the API will show up here."
        />
      }
    />
  );
}
