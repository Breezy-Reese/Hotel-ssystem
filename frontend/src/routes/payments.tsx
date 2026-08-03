import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/payments")({
  head: () => ({
    meta: [
      { title: "Payment Management — Aurelia Suites" },
      { name: "description", content: "All incoming payments across cash, card, M-Pesa and bank transfer, plus refunds." },
      { property: "og:title", content: "Payment Management — Aurelia Suites" },
      { property: "og:description", content: "All incoming payments across cash, card, M-Pesa and bank transfer, plus refunds." },
    ],
  }),
  component: PaymentsPage,
});

function PaymentsPage() {
  return (
    <ModulePage
      title="Payment Management"
      description="All incoming payments across cash, card, M-Pesa and bank transfer, plus refunds."
      action="Record payment"
      stats={["Collected today", "Pending", "Refunded", "Failed"]}
      columns={["Txn ID", "Source", "Method", "Amount", "Date", "Status"]}
      capabilities={["Cash", "Card", "M-Pesa", "Bank transfer", "Transaction records", "Refunds"]}
    />
  );
}
