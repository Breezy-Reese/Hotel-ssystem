import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Management — Aurelia Suites" },
      { name: "description", content: "Guest and staff documents, hotel policies and downloadable reports." },
      { property: "og:title", content: "Document Management — Aurelia Suites" },
      { property: "og:description", content: "Guest and staff documents, hotel policies and downloadable reports." },
    ],
  }),
  component: DocumentsPage,
});

function DocumentsPage() {
  return (
    <ModulePage
      title="Document Management"
      description="Guest and staff documents, hotel policies and downloadable reports."
      action="Upload document"
      stats={["Documents", "Guest docs", "Staff docs", "Policies"]}
      columns={["Document", "Type", "Owner", "Uploaded", "Size", "Access"]}
      capabilities={["Guest documents", "Staff documents", "Hotel policies", "Downloadable invoices & reports"]}
    />
  );
}
