import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/guests")({
  head: () => ({
    meta: [
      { title: "Guest Management — Aurelia Suites" },
      { name: "description", content: "Guest profiles, contact details, stay history, preferences and special requests." },
      { property: "og:title", content: "Guest Management — Aurelia Suites" },
      { property: "og:description", content: "Guest profiles, contact details, stay history, preferences and special requests." },
    ],
  }),
  component: GuestsPage,
});

function GuestsPage() {
  return (
    <ModulePage
      title="Guest Management"
      description="Guest profiles, contact details, stay history, preferences and special requests."
      action="Add guest"
      stats={["Total guests", "Returning guests", "VIP guests", "Open requests"]}
      columns={["Guest", "Phone", "Email", "Stays", "Loyalty tier", "Last visit"]}
      capabilities={["Guest profiles", "Contact information", "Booking history", "Preferences", "Special requests", "Feedback"]}
    />
  );
}
