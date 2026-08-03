import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/employees")({
  head: () => ({
    meta: [
      { title: "Employee Management — Aurelia Suites" },
      { name: "description", content: "Staff directory with departments, roles, schedules and employment status." },
      { property: "og:title", content: "Employee Management — Aurelia Suites" },
      { property: "og:description", content: "Staff directory with departments, roles, schedules and employment status." },
    ],
  }),
  component: EmployeesPage,
});

function EmployeesPage() {
  return (
    <ModulePage
      title="Employee Management"
      description="Staff directory with departments, roles, schedules and employment status."
      action="Add employee"
      stats={["Employees", "On duty", "On leave", "Departments"]}
      columns={["Employee", "Department", "Role", "Shift", "Phone", "Status"]}
      capabilities={["Staff profiles", "Departments", "Job roles", "Work schedules", "Staff status"]}
    />
  );
}
