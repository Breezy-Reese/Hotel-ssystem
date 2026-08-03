import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Management — Aurelia Suites" },
      { name: "description", content: "Assign work to staff with deadlines, progress tracking and completion." },
      { property: "og:title", content: "Task Management — Aurelia Suites" },
      { property: "og:description", content: "Assign work to staff with deadlines, progress tracking and completion." },
    ],
  }),
  component: TasksPage,
});

function TasksPage() {
  return (
    <ModulePage
      title="Task Management"
      description="Assign work to staff with deadlines, progress tracking and completion."
      action="Assign task"
      stats={["Open tasks", "Due today", "Overdue", "Completed"]}
      columns={["Task", "Assigned to", "Department", "Deadline", "Progress", "Status"]}
      capabilities={["Assign tasks", "Set deadlines", "Track progress", "Mark completed"]}
    />
  );
}
