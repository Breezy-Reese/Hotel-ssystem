import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance — Aurelia Suites" },
      { name: "description", content: "Log faults, assign technicians, track repair progress and costs." },
      { property: "og:title", content: "Maintenance — Aurelia Suites" },
      { property: "og:description", content: "Log faults, assign technicians, track repair progress and costs." },
    ],
  }),
  component: MaintenancePage,
});

function MaintenancePage() {
  return (
    <ModulePage
      title="Maintenance"
      description="Log faults, assign technicians, track repair progress and costs."
      action="Report issue"
      stats={["Open tickets", "In progress", "Resolved", "Repair costs"]}
      columns={["Ticket", "Location", "Issue", "Assigned to", "Cost", "Status"]}
      capabilities={["Report problems", "Assign staff", "Track repair status", "Record costs", "Maintenance history"]}
    />
  );
}
