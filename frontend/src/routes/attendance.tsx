import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { attendanceApi, employeesApi } from "@/lib/resources";
import type { Attendance, AttendanceFlag, Employee } from "@/lib/types";
import { api, ApiError, type ItemResponse } from "@/lib/api";
import { useQueryClient } from "@tanstack/react-query";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Staff Attendance — Aurelia Suites" },
      { name: "description", content: "Clock staff in and out, and review attendance history." },
    ],
  }),
  component: AttendancePage,
});

const FLAG_VARIANT: Record<AttendanceFlag, "default" | "secondary" | "destructive" | "outline"> = {
  OnTime: "default",
  Late: "secondary",
  Absent: "destructive",
  EarlyLeave: "outline",
};

function employeeName(e: Attendance["employee"]) {
  return typeof e === "string" ? e : ((e as Employee)?.name ?? "—");
}

const columns: LiveColumn<Attendance>[] = [
  { header: "Employee", render: (a) => employeeName(a.employee) },
  { header: "Date", render: (a) => format(new Date(a.date), "MMM d, yyyy") },
  { header: "Clock in", render: (a) => (a.clockIn ? format(new Date(a.clockIn), "HH:mm") : "—") },
  {
    header: "Clock out",
    render: (a) => (a.clockOut ? format(new Date(a.clockOut), "HH:mm") : "—"),
  },
  { header: "Hours", render: (a) => (a.hoursWorked ? a.hoursWorked.toFixed(1) : "—") },
  { header: "Flag", render: (a) => <Badge variant={FLAG_VARIANT[a.flag]}>{a.flag}</Badge> },
];

function AttendancePage() {
  const [search, setSearch] = useState("");
  const [employeeId, setEmployeeId] = useState<string>("");
  const queryClient = useQueryClient();

  const { data, isLoading, isError } = attendanceApi.useList({ search, sort: "-date" });
  const { data: employeesData } = employeesApi.useList({ limit: 200 });

  const records = data?.data ?? [];
  const employees = employeesData?.data ?? [];

  const stats = {
    "Clocked in": records.filter((r) => r.clockIn && !r.clockOut).length,
    "Clocked out": records.filter((r) => r.clockOut).length,
    "Late today": records.filter((r) => r.flag === "Late").length,
    Absent: records.filter((r) => r.flag === "Absent").length,
  };

  async function clockAction(action: "clock-in" | "clock-out") {
    if (!employeeId) {
      toast.error("Select an employee first");
      return;
    }
    try {
      await api.post<ItemResponse<Attendance>>(`/attendance/${action}`, { employee: employeeId });
      toast.success(action === "clock-in" ? "Clocked in" : "Clocked out");
      queryClient.invalidateQueries({ queryKey: ["attendance"] });
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : "Action failed");
    }
  }

  return (
    <ModulePage
      title="Staff Attendance"
      description="Clock staff in and out, and review attendance history."
      stats={["Clocked in", "Clocked out", "Late today", "Absent"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Clock in", "Clock out", "Attendance records", "Late-arrival tracking"]}
      table={
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-3">
            <Select value={employeeId} onValueChange={setEmployeeId}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((e) => (
                  <SelectItem key={e._id} value={e._id}>
                    {e.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button size="sm" onClick={() => clockAction("clock-in")}>
              Clock in
            </Button>
            <Button size="sm" variant="outline" onClick={() => clockAction("clock-out")}>
              Clock out
            </Button>
          </div>
          <LiveDataTable
            columns={columns}
            rows={records}
            isLoading={isLoading}
            isError={isError}
            search={search}
            onSearchChange={setSearch}
            recordCount={data?.total}
            emptyTitle="No attendance records yet"
            emptyHint="Clock-ins and manual entries will show up here."
          />
        </div>
      }
    />
  );
}
