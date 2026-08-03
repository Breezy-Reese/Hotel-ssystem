import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/attendance")({
  head: () => ({
    meta: [
      { title: "Staff Attendance — Aurelia Suites" },
      { name: "description", content: "Clock-in and clock-out records with lateness and absence tracking." },
      { property: "og:title", content: "Staff Attendance — Aurelia Suites" },
      { property: "og:description", content: "Clock-in and clock-out records with lateness and absence tracking." },
    ],
  }),
  component: AttendancePage,
});

function AttendancePage() {
  return (
    <ModulePage
      title="Staff Attendance"
      description="Clock-in and clock-out records with lateness and absence tracking."
      action="Manual entry"
      stats={["Clocked in", "Clocked out", "Late today", "Absent"]}
      columns={["Employee", "Date", "Clock in", "Clock out", "Hours", "Flag"]}
      capabilities={["Clock in", "Clock out", "Attendance records", "Late-arrival tracking"]}
    />
  );
}
