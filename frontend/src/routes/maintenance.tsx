import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { maintenanceApi } from "@/lib/resources";
import type {
  Employee,
  MaintenancePriority,
  MaintenanceStatus,
  MaintenanceTicket,
  Room,
} from "@/lib/types";
import { ApiError } from "@/lib/api";
import { formatCurrency } from "../lib/currency";

export const Route = createFileRoute("/maintenance")({
  head: () => ({
    meta: [
      { title: "Maintenance — Aurelia Suites" },
      {
        name: "description",
        content: "Log, assign and resolve maintenance tickets across rooms and common areas.",
      },
    ],
  }),
  component: MaintenancePage,
});

const STATUS_VARIANT: Record<
  MaintenanceStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Open: "destructive",
  InProgress: "secondary",
  Resolved: "default",
};

const PRIORITY_VARIANT: Record<
  MaintenancePriority,
  "default" | "secondary" | "destructive" | "outline"
> = {
  Low: "outline",
  Medium: "secondary",
  High: "destructive",
  Urgent: "destructive",
};

const NEXT_STATUS: Partial<Record<MaintenanceStatus, MaintenanceStatus>> = {
  Open: "InProgress",
  InProgress: "Resolved",
};

function roomLabel(t: MaintenanceTicket) {
  if (t.room) return typeof t.room === "string" ? t.room : (t.room as Room).roomNumber;
  return t.location || "—";
}
function employeeName(e: MaintenanceTicket["assignedTo"]) {
  if (!e) return "Unassigned";
  return typeof e === "string" ? e : (e as Employee).name;
}

function MaintenancePage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = maintenanceApi.useList({ search, sort: "-createdAt" });
  const updateStatus = maintenanceApi.useAction<
    { status: MaintenanceStatus },
    { status: string; data: MaintenanceTicket }
  >("patch", (id) => `/maintenance/${id}/status`);

  const tickets = data?.data ?? [];
  const stats = {
    "Open tickets": tickets.filter((t) => t.status === "Open").length,
    "In progress": tickets.filter((t) => t.status === "InProgress").length,
    Resolved: tickets.filter((t) => t.status === "Resolved").length,
    Urgent: tickets.filter((t) => t.priority === "Urgent").length,
  };

  async function advance(ticket: MaintenanceTicket) {
    const next = NEXT_STATUS[ticket.status];
    if (!next) return;
    try {
      await updateStatus.mutateAsync({ id: ticket._id, payload: { status: next } });
      toast.success(`Ticket marked ${next}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update ticket");
    }
  }

  const columns: LiveColumn<MaintenanceTicket>[] = [
    { header: "Ticket #", render: (t) => <span className="font-medium">{t.ticketNumber}</span> },
    { header: "Location", render: (t) => roomLabel(t) },
    { header: "Issue", render: (t) => t.issue },
    {
      header: "Priority",
      render: (t) => <Badge variant={PRIORITY_VARIANT[t.priority]}>{t.priority}</Badge>,
    },
    { header: "Assigned to", render: (t) => employeeName(t.assignedTo) },
    { header: "Cost", render: (t) => formatCurrency(t.cost) },
    {
      header: "Status",
      render: (t) => <Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge>,
    },
  ];

  return (
    <ModulePage
      title="Maintenance"
      description="Log, assign and resolve maintenance tickets across rooms and common areas."
      stats={["Open tickets", "In progress", "Resolved", "Urgent"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Log tickets",
        "Priority levels",
        "Assign to staff",
        "Track cost",
        "Auto room status sync",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={tickets}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No maintenance tickets yet"
          emptyHint="Tickets created via the API will show up here."
          rowActions={(t) => (
            <div className="flex justify-end gap-2">
              {NEXT_STATUS[t.status] && (
                <Button size="sm" variant="outline" onClick={() => advance(t)}>
                  Mark {NEXT_STATUS[t.status]}
                </Button>
              )}
            </div>
          )}
        />
      }
    />
  );
}
