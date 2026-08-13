import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { format } from "date-fns";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { auditLogsApi } from "@/lib/resources";
import type { AuditLog } from "@/lib/types";

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Aurelia Suites" },
      {
        name: "description",
        content: "Every create, update, delete and login event, automatically recorded.",
      },
    ],
  }),
  component: AuditLogsPage,
});

function userName(u: AuditLog["user"]) {
  if (!u) return "System";
  return typeof u === "string" ? u : u.name;
}

const columns: LiveColumn<AuditLog>[] = [
  { header: "Timestamp", render: (l) => format(new Date(l.timestamp), "MMM d, HH:mm:ss") },
  { header: "User", render: (l) => userName(l.user) },
  { header: "Action", render: (l) => <span className="font-medium">{l.action}</span> },
  { header: "Entity", render: (l) => l.entity },
  { header: "IP", render: (l) => l.ip || "—" },
  {
    header: "Result",
    render: (l) => (
      <Badge variant={l.result === "Success" ? "default" : "destructive"}>{l.result}</Badge>
    ),
  },
];

function AuditLogsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = auditLogsApi.useList({ search, sort: "-timestamp" });
  const logs = data?.data ?? [];

  const today = new Date().toDateString();
  const stats = {
    "Events today": logs.filter((l) => new Date(l.timestamp).toDateString() === today).length,
    Logins: logs.filter((l) => l.action === "LOGIN").length,
    "Record changes": logs.filter((l) => ["CREATE", "UPDATE"].includes(l.action)).length,
    Deletions: logs.filter((l) => l.action === "DELETE").length,
  };

  return (
    <ModulePage
      title="Audit Logs"
      description="Every create, update, delete and login event, automatically recorded."
      action="Export log"
      stats={["Events today", "Logins", "Record changes", "Deletions"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Track created / changed data", "Login activity", "Deleted records"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={logs}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No events yet"
          emptyHint="Every write action across the API is logged here automatically."
        />
      }
    />
  );
}
