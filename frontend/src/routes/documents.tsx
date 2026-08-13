import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { documentsApi } from "@/lib/resources";
import type { AppDocument } from "@/lib/types";

export const Route = createFileRoute("/documents")({
  head: () => ({
    meta: [
      { title: "Document Management — Aurelia Suites" },
      {
        name: "description",
        content: "Store and manage guest documents, staff files and policies.",
      },
    ],
  }),
  component: DocumentsPage,
});

function formatSize(bytes: number) {
  if (!bytes) return "—";
  const kb = bytes / 1024;
  return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}

const columns: LiveColumn<AppDocument>[] = [
  {
    header: "Document",
    render: (d) => (
      <a
        href={d.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="font-medium underline-offset-2 hover:underline"
      >
        {d.name}
      </a>
    ),
  },
  { header: "Type", render: (d) => d.type },
  { header: "Uploaded", render: (d) => new Date(d.createdAt).toLocaleDateString() },
  { header: "Size", render: (d) => formatSize(d.size) },
  { header: "Access", render: (d) => <Badge variant="secondary">{d.access}</Badge> },
];

function DocumentsPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = documentsApi.useList({ search, sort: "-createdAt" });
  const documents = data?.data ?? [];

  const stats = {
    Documents: data?.total ?? "—",
    "Guest docs": documents.filter((d) => d.type === "GuestDoc").length,
    "Staff docs": documents.filter((d) => d.type === "StaffDoc").length,
    Policies: documents.filter((d) => d.type === "Policy").length,
  };

  return (
    <ModulePage
      title="Document Management"
      description="Store and manage guest documents, staff files and policies."
      action="Upload document"
      stats={["Documents", "Guest docs", "Staff docs", "Policies"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Guest documents", "Staff files", "Policies", "Access levels"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={documents}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No documents yet"
          emptyHint="Documents uploaded via the API will show up here."
        />
      }
    />
  );
}
