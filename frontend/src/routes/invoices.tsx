import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/invoices")({
  head: () => ({
    meta: [
      { title: "Billing & Invoicing — Aurelia Suites" },
      { name: "description", content: "Consolidated folios: room, restaurant, room service, extras, taxes and discounts." },
      { property: "og:title", content: "Billing & Invoicing — Aurelia Suites" },
      { property: "og:description", content: "Consolidated folios: room, restaurant, room service, extras, taxes and discounts." },
    ],
  }),
  component: InvoicesPage,
});

function InvoicesPage() {
  return (
    <ModulePage
      title="Billing & Invoicing"
      description="Consolidated folios: room, restaurant, room service, extras, taxes and discounts."
      action="Create invoice"
      stats={["Open folios", "Issued", "Paid", "Outstanding"]}
      columns={["Invoice #", "Guest", "Charges", "Tax", "Discount", "Total", "Status"]}
      capabilities={["Room charges", "Restaurant charges", "Room service", "Additional services", "Taxes", "Discounts", "Download / print"]}
    />
  );
}
