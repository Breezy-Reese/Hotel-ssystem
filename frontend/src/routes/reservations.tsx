import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/reservations")({
  head: () => ({
    meta: [
      { title: "Reservations & Booking — Aurelia Suites" },
      { name: "description", content: "Online and walk-in bookings, availability checks, confirmations and cancellations." },
      { property: "og:title", content: "Reservations & Booking — Aurelia Suites" },
      { property: "og:description", content: "Online and walk-in bookings, availability checks, confirmations and cancellations." },
    ],
  }),
  component: ReservationsPage,
});

function ReservationsPage() {
  return (
    <ModulePage
      title="Reservations & Booking"
      description="Online and walk-in bookings, availability checks, confirmations and cancellations."
      action="New reservation"
      stats={["Arrivals today", "Departures today", "In-house", "Cancellations"]}
      columns={["Ref", "Guest", "Room", "Check-in", "Check-out", "Nights", "Status"]}
      capabilities={["Online booking", "Availability search", "Check-in / check-out", "Booking confirmation", "Cancellation", "Booking history", "Walk-in bookings"]}
    />
  );
}
