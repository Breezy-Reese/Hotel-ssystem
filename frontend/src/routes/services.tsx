import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/services")({
  head: () => ({
    meta: [
      { title: "Hotel Services — Aurelia Suites" },
      { name: "description", content: "Chargeable services offered to guests, with pricing and availability." },
      { property: "og:title", content: "Hotel Services — Aurelia Suites" },
      { property: "og:description", content: "Chargeable services offered to guests, with pricing and availability." },
    ],
  }),
  component: ServicesPage,
});

function ServicesPage() {
  return (
    <ModulePage
      title="Hotel Services"
      description="Chargeable services offered to guests, with pricing and availability."
      action="Add service"
      stats={["Services", "Active", "Bookings today", "Service revenue"]}
      columns={["Service", "Category", "Price", "Duration", "Availability", "Status"]}
      capabilities={["Laundry", "Airport pickup", "Conference rooms", "Spa", "Gym", "Event halls"]}
    />
  );
}
