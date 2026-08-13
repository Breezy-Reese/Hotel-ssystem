import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { housekeepingApi } from "@/lib/resources";
import type { CleaningStatus, Employee, Housekeeping, Room } from "@/lib/types";
import { ApiError } from "@/lib/api";

export const Route = createFileRoute("/housekeeping")({
  head: () => ({
    meta: [
      { title: "Housekeeping — Aurelia Suites" },
      {
        name: "description",
        content: "Daily cleaning schedules, staff assignment, room readiness and damage reports.",
      },
    ],
  }),
  component: HousekeepingPage,
});

const STATUS_VARIANT: Record<CleaningStatus, "default" | "secondary" | "destructive" | "outline"> =
  {
    Pending: "outline",
    InProgress: "secondary",
    Ready: "default",
    DamageReported: "destructive",
  };

const NEXT_STATUS: Partial<Record<CleaningStatus, CleaningStatus>> = {
  Pending: "InProgress",
  InProgress: "Ready",
};

function roomNumber(r: Housekeeping["room"]) {
  return typeof r === "string" ? r : (r as Room).roomNumber;
}
function employeeName(e: Housekeeping["assignedTo"]) {
  if (!e) return "Unassigned";
  return typeof e === "string" ? e : (e as Employee).name;
}

function HousekeepingPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = housekeepingApi.useList({ search, sort: "-scheduledFor" });
  const updateStatus = housekeepingApi.useAction<
    { cleaningStatus: CleaningStatus },
    { status: string; data: Housekeeping }
  >("patch", (id) => `/housekeeping/${id}/status`);

  const tasks = data?.data ?? [];
  const stats = {
    "Rooms to clean": tasks.filter((t) => t.cleaningStatus === "Pending").length,
    "In progress": tasks.filter((t) => t.cleaningStatus === "InProgress").length,
    Ready: tasks.filter((t) => t.cleaningStatus === "Ready").length,
    "Damage reports": tasks.filter((t) => t.cleaningStatus === "DamageReported").length,
  };

  async function advance(task: Housekeeping) {
    const next = NEXT_STATUS[task.cleaningStatus];
    if (!next) return;
    try {
      await updateStatus.mutateAsync({ id: task._id, payload: { cleaningStatus: next } });
      toast.success(`Room marked ${next}`);
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to update status");
    }
  }

  async function reportDamage(task: Housekeeping) {
    try {
      await updateStatus.mutateAsync({
        id: task._id,
        payload: { cleaningStatus: "DamageReported" },
      });
      toast.success("Damage reported — room flagged for maintenance");
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Failed to report damage");
    }
  }

  const columns: LiveColumn<Housekeeping>[] = [
    { header: "Room #", render: (t) => <span className="font-medium">{roomNumber(t.room)}</span> },
    { header: "Assigned to", render: (t) => employeeName(t.assignedTo) },
    { header: "Schedule", render: (t) => format(new Date(t.scheduledFor), "MMM d, HH:mm") },
    {
      header: "Cleaning status",
      render: (t) => <Badge variant={STATUS_VARIANT[t.cleaningStatus]}>{t.cleaningStatus}</Badge>,
    },
    { header: "Notes", render: (t) => t.notes || "—" },
    { header: "Updated", render: (t) => format(new Date(t.updatedAt), "MMM d, HH:mm") },
  ];

  return (
    <ModulePage
      title="Housekeeping"
      description="Daily cleaning schedules, staff assignment, room readiness and damage reports."
      stats={["Rooms to clean", "In progress", "Ready", "Damage reports"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={[
        "Daily schedules",
        "Assign rooms to staff",
        "Update cleaning status",
        "Report damaged items",
        "Mark room ready",
      ]}
      table={
        <LiveDataTable
          columns={columns}
          rows={tasks}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No housekeeping tasks yet"
          emptyHint="Cleaning tasks created via the API will show up here."
          rowActions={(t) => (
            <div className="flex justify-end gap-2">
              {NEXT_STATUS[t.cleaningStatus] && (
                <Button size="sm" variant="outline" onClick={() => advance(t)}>
                  Mark {NEXT_STATUS[t.cleaningStatus]}
                </Button>
              )}
              {t.cleaningStatus !== "DamageReported" && (
                <Button size="sm" variant="ghost" onClick={() => reportDamage(t)}>
                  Report damage
                </Button>
              )}
            </div>
          )}
        />
      }
    />
  );
}
