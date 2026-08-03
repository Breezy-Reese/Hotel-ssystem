import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Revenue & Financial Reports — Aurelia Suites" },
      { name: "description", content: "Daily, weekly and monthly performance across hotel and restaurant operations." },
      { property: "og:title", content: "Revenue & Financial Reports — Aurelia Suites" },
      { property: "og:description", content: "Daily, weekly and monthly performance across hotel and restaurant operations." },
    ],
  }),
  component: ReportsPage,
});

function ReportsPage() {
  return (
    <ModulePage
      title="Revenue & Financial Reports"
      description="Daily, weekly and monthly performance across hotel and restaurant operations."
      action="Export"
      stats={["Revenue today", "Hotel revenue", "Restaurant revenue", "Estimated profit"]}
      columns={["Period", "Hotel revenue", "Restaurant revenue", "Expenses", "Profit"]}
      capabilities={["Daily revenue", "Weekly revenue", "Monthly revenue", "Expenses", "Profit estimates", "Charts"]}
    />
  );
}
