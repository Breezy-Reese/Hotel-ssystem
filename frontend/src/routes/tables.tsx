import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/tables")({
  head: () => ({
    meta: [
      { title: "Table Management — Aurelia Suites" },
      { name: "description", content: "Restaurant floor plan: table numbers, capacity, occupancy and reservations." },
      { property: "og:title", content: "Table Management — Aurelia Suites" },
      { property: "og:description", content: "Restaurant floor plan: table numbers, capacity, occupancy and reservations." },
    ],
  }),
  component: TablesPage,
});

function TablesPage() {
  return (
    <ModulePage
      title="Table Management"
      description="Restaurant floor plan: table numbers, capacity, occupancy and reservations."
      action="Add table"
      stats={["Tables", "Available", "Occupied", "Reserved"]}
      columns={["Table #", "Capacity", "Section", "Status", "Reserved for", "Time"]}
      capabilities={["Table numbers", "Capacity", "Availability status", "Table reservations"]}
    />
  );
}
