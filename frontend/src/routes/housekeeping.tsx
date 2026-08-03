import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/housekeeping")({
  head: () => ({
    meta: [
      { title: "Housekeeping — Aurelia Suites" },
      { name: "description", content: "Daily cleaning schedules, staff assignment, room readiness and damage reports." },
      { property: "og:title", content: "Housekeeping — Aurelia Suites" },
      { property: "og:description", content: "Daily cleaning schedules, staff assignment, room readiness and damage reports." },
    ],
  }),
  component: HousekeepingPage,
});

function HousekeepingPage() {
  return (
    <ModulePage
      title="Housekeeping"
      description="Daily cleaning schedules, staff assignment, room readiness and damage reports."
      action="Create schedule"
      stats={["Rooms to clean", "In progress", "Ready", "Damage reports"]}
      columns={["Room #", "Assigned to", "Schedule", "Cleaning status", "Notes", "Updated"]}
      capabilities={["Daily schedules", "Assign rooms to staff", "Update cleaning status", "Report damaged items", "Mark room ready"]}
    />
  );
}
