import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Branch Management — Aurelia Suites" },
      { name: "description", content: "Manage multiple hotel branches, their rooms, staff and consolidated reporting." },
      { property: "og:title", content: "Branch Management — Aurelia Suites" },
      { property: "og:description", content: "Manage multiple hotel branches, their rooms, staff and consolidated reporting." },
    ],
  }),
  component: BranchesPage,
});

function BranchesPage() {
  return (
    <ModulePage
      title="Branch Management"
      description="Manage multiple hotel branches, their rooms, staff and consolidated reporting."
      action="Add branch"
      stats={["Branches", "Active rooms", "Staff assigned", "Branch revenue"]}
      columns={["Branch", "Location", "Rooms", "Staff", "Manager", "Status"]}
      capabilities={["Branch-specific rooms", "Branch-specific staff", "Branch reports", "Central admin dashboard"]}
    />
  );
}
