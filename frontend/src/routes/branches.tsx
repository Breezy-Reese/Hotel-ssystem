import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { branchesApi } from "@/lib/resources";
import type { Branch } from "@/lib/types";

export const Route = createFileRoute("/branches")({
  head: () => ({
    meta: [
      { title: "Branch Management — Aurelia Suites" },
      {
        name: "description",
        content: "Manage every property location, its rooms, staff and status.",
      },
    ],
  }),
  component: BranchesPage,
});

const columns: LiveColumn<Branch>[] = [
  { header: "Branch", render: (b) => <span className="font-medium">{b.name}</span> },
  { header: "Location", render: (b) => b.location },
  {
    header: "Status",
    render: (b) => (
      <Badge variant={b.status === "Active" ? "default" : "secondary"}>{b.status}</Badge>
    ),
  },
];

function BranchesPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = branchesApi.useList({ search, sort: "name" });
  const branches = data?.data ?? [];

  return (
    <ModulePage
      title="Branch Management"
      description="Manage every property location, its rooms, staff and status."
      action="Add branch"
      stats={["Branches", "Active rooms", "Staff assigned", "Branch revenue"]}
      statValues={{ Branches: data?.total ?? "—" }}
      columns={["Branch", "Location", "Rooms", "Staff", "Manager", "Status"]}
      capabilities={["Multiple locations", "Per-branch rooms & staff", "Branch status"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={branches}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No branches yet"
          emptyHint="Branches created via the API will show up here."
        />
      }
    />
  );
}
