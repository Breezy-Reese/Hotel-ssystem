import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/front-desk")({
  head: () => ({
    meta: [
      { title: "Reception / Front Desk — Aurelia Suites" },
      { name: "description", content: "Check-ins, check-outs, room assignment, stay extensions, transfers and invoices." },
      { property: "og:title", content: "Reception / Front Desk — Aurelia Suites" },
      { property: "og:description", content: "Check-ins, check-outs, room assignment, stay extensions, transfers and invoices." },
    ],
  }),
  component: FrontDeskPage,
});

function FrontDeskPage() {
  return (
    <ModulePage
      title="Reception / Front Desk"
      description="Check-ins, check-outs, room assignment, stay extensions, transfers and invoices."
      action="Walk-in booking"
      stats={["Awaiting check-in", "Awaiting check-out", "Rooms assigned", "Open folios"]}
      columns={["Guest", "Room", "Arrival", "Departure", "Balance", "Action"]}
      capabilities={["Check-in", "Check-out", "Walk-in reservation", "Room assignment", "Extend stay", "Room transfer", "Print invoice"]}
    />
  );
}
