import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/rooms")({
  head: () => ({
    meta: [
      { title: "Room Management — Aurelia Suites" },
      { name: "description", content: "Create and maintain room inventory: types, pricing, capacity, amenities and live status." },
      { property: "og:title", content: "Room Management — Aurelia Suites" },
      { property: "og:description", content: "Create and maintain room inventory: types, pricing, capacity, amenities and live status." },
    ],
  }),
  component: RoomsPage,
});

function RoomsPage() {
  return (
    <ModulePage
      title="Room Management"
      description="Create and maintain room inventory: types, pricing, capacity, amenities and live status."
      action="Add room"
      stats={["Total rooms", "Available", "Occupied", "Out of service"]}
      columns={["Room #", "Type", "Capacity", "Rate / night", "Amenities", "Status"]}
      capabilities={["Single", "Double", "Deluxe", "Executive", "Suite", "Room images", "Amenities", "Available", "Reserved", "Occupied", "Cleaning", "Maintenance"]}
    />
  );
}
