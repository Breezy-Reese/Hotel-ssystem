import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/audit-logs")({
  head: () => ({
    meta: [
      { title: "Audit Logs — Aurelia Suites" },
      { name: "description", content: "Accountability trail for record changes, deletions and login activity." },
      { property: "og:title", content: "Audit Logs — Aurelia Suites" },
      { property: "og:description", content: "Accountability trail for record changes, deletions and login activity." },
    ],
  }),
  component: AuditLogsPage,
});

function AuditLogsPage() {
  return (
    <ModulePage
      title="Audit Logs"
      description="Accountability trail for record changes, deletions and login activity."
      action="Export log"
      stats={["Events today", "Logins", "Record changes", "Deletions"]}
      columns={["Timestamp", "User", "Action", "Entity", "IP", "Result"]}
      capabilities={["Track created / changed data", "Login activity", "Deleted records"]}
    />
  );
}
