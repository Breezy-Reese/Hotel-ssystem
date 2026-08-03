import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Aurelia Suites" },
      { name: "description", content: "System and guest notifications across bookings, payments, orders and alerts." },
      { property: "og:title", content: "Notifications — Aurelia Suites" },
      { property: "og:description", content: "System and guest notifications across bookings, payments, orders and alerts." },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <ModulePage
      title="Notifications"
      description="System and guest notifications across bookings, payments, orders and alerts."
      action="New announcement"
      stats={["Unread", "Sent today", "Failed", "Subscribers"]}
      columns={["Type", "Recipient", "Message", "Channel", "Sent", "Status"]}
      capabilities={["Booking confirmation", "Check-in reminders", "Payment confirmation", "Order updates", "Low-stock alerts", "Maintenance alerts"]}
    />
  );
}
