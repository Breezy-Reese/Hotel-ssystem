import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { tasksApi } from "@/lib/resources";
import type { Employee, Task, TaskStatus } from "@/lib/types";

export const Route = createFileRoute("/tasks")({
  head: () => ({
    meta: [
      { title: "Task Management — Aurelia Suites" },
      {
        name: "description",
        content: "Assign, track and complete operational tasks across departments.",
      },
    ],
  }),
  component: TasksPage,
});

const STATUS_VARIANT: Record<TaskStatus, "default" | "secondary" | "destructive" | "outline"> = {
  Open: "outline",
  InProgress: "secondary",
  Completed: "default",
  Overdue: "destructive",
};

function assigneeName(e: Task["assignedTo"]) {
  return typeof e === "string" ? e : ((e as Employee)?.name ?? "Unassigned");
}

const columns: LiveColumn<Task>[] = [
  { header: "Task", render: (t) => <span className="font-medium">{t.title}</span> },
  { header: "Assigned to", render: (t) => assigneeName(t.assignedTo) },
  { header: "Department", render: (t) => t.department || "—" },
  {
    header: "Deadline",
    render: (t) => (t.deadline ? format(new Date(t.deadline), "MMM d, yyyy") : "—"),
  },
  { header: "Progress", render: (t) => <Progress value={t.progress} className="w-24" /> },
  { header: "Status", render: (t) => <Badge variant={STATUS_VARIANT[t.status]}>{t.status}</Badge> },
];

function TasksPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = tasksApi.useList({ search, sort: "deadline" });
  const tasks = data?.data ?? [];

  const stats = {
    "Open tasks": tasks.filter((t) => t.status === "Open" || t.status === "InProgress").length,
    Overdue: tasks.filter((t) => t.status === "Overdue").length,
    Completed: tasks.filter((t) => t.status === "Completed").length,
  };

  return (
    <ModulePage
      title="Task Management"
      description="Assign, track and complete operational tasks across departments."
      action="Assign task"
      stats={["Open tasks", "Due today", "Overdue", "Completed"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Assign tasks", "Set deadlines", "Track progress", "Mark completed"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={tasks}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No tasks yet"
          emptyHint="Tasks created via the API will show up here."
        />
      }
    />
  );
}
