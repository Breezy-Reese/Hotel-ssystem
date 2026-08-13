import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { notificationsApi } from "@/lib/resources";
import type { Notification, NotificationStatus } from "@/lib/types";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — Aurelia Suites" },
      { name: "description", content: "Send announcements and alerts to staff and guests." },
    ],
  }),
  component: NotificationsPage,
});

const STATUS_VARIANT: Record<NotificationStatus, "default" | "secondary" | "destructive"> = {
  Sent: "default",
  Failed: "destructive",
  Pending: "secondary",
};

const columns: LiveColumn<Notification>[] = [
  { header: "Type", render: (n) => n.type },
  { header: "Recipient", render: () => "All staff" },
  { header: "Message", render: (n) => <span className="line-clamp-1 max-w-xs">{n.message}</span> },
  { header: "Channel", render: (n) => n.channel },
  { header: "Sent", render: (n) => (n.sentAt ? format(new Date(n.sentAt), "MMM d, HH:mm") : "—") },
  { header: "Status", render: (n) => <Badge variant={STATUS_VARIANT[n.status]}>{n.status}</Badge> },
];

function NotificationsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = notificationsApi.useList({ search, sort: "-createdAt" });
  const notifications = data?.data ?? [];

  const stats = {
    "Sent today": notifications.filter(
      (n) => n.sentAt && new Date(n.sentAt).toDateString() === new Date().toDateString(),
    ).length,
    Failed: notifications.filter((n) => n.status === "Failed").length,
  };

  return (
    <ModulePage
      title="Notifications"
      description="Send announcements and alerts to staff and guests."
      action="New announcement"
      stats={["Unread", "Sent today", "Failed", "Subscribers"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Announcements", "Alerts", "Reminders", "Email / SMS / In-app"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={notifications}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No notifications yet"
          emptyHint="Notifications created via the API will show up here."
        />
      }
    />
  );
}
