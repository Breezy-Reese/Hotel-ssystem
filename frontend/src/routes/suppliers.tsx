import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/suppliers")({
  head: () => ({
    meta: [
      { title: "Supplier Management — Aurelia Suites" },
      { name: "description", content: "Supplier directory, supplied products, purchase records and payment status." },
      { property: "og:title", content: "Supplier Management — Aurelia Suites" },
      { property: "og:description", content: "Supplier directory, supplied products, purchase records and payment status." },
    ],
  }),
  component: SuppliersPage,
});

function SuppliersPage() {
  return (
    <ModulePage
      title="Supplier Management"
      description="Supplier directory, supplied products, purchase records and payment status."
      action="Add supplier"
      stats={["Suppliers", "Active orders", "Amount owed", "Paid this month"]}
      columns={["Supplier", "Contact", "Products", "Orders", "Balance", "Status"]}
      capabilities={["Supplier profiles", "Contact details", "Products supplied", "Purchase records", "Payment status"]}
    />
  );
}
