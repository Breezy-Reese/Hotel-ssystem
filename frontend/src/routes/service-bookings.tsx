import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/service-bookings")({
  head: () => ({
    meta: [
      { title: "Service Bookings — Aurelia Suites" },
      { name: "description", content: "Guest service requests with schedules, status tracking and billing to folio." },
      { property: "og:title", content: "Service Bookings — Aurelia Suites" },
      { property: "og:description", content: "Guest service requests with schedules, status tracking and billing to folio." },
    ],
  }),
  component: ServiceBookingsPage,
});

function ServiceBookingsPage() {
  return (
    <ModulePage
      title="Service Bookings"
      description="Guest service requests with schedules, status tracking and billing to folio."
      action="New booking"
      stats={["Requested", "Scheduled", "In progress", "Completed"]}
      columns={["Ref", "Guest", "Service", "Date & time", "Charge", "Status"]}
      capabilities={["Select date and time", "Track service status", "Add charges to guest bill"]}
    />
  );
}
