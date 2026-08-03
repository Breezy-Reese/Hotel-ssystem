import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/expenses")({
  head: () => ({
    meta: [
      { title: "Expense Management — Aurelia Suites" },
      { name: "description", content: "Operating expenses by category with supplier payments and monthly summaries." },
      { property: "og:title", content: "Expense Management — Aurelia Suites" },
      { property: "og:description", content: "Operating expenses by category with supplier payments and monthly summaries." },
    ],
  }),
  component: ExpensesPage,
});

function ExpensesPage() {
  return (
    <ModulePage
      title="Expense Management"
      description="Operating expenses by category with supplier payments and monthly summaries."
      action="Add expense"
      stats={["Expenses this month", "Categories", "Supplier payments", "Pending approvals"]}
      columns={["Date", "Category", "Description", "Supplier", "Amount", "Status"]}
      capabilities={["Expense categories", "Supplier payments", "Monthly expense reports"]}
    />
  );
}
