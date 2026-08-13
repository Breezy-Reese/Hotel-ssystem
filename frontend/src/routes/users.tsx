import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

import { ModulePage } from "@/components/module-page";
import { LiveDataTable, type LiveColumn } from "@/components/live-data-table";
import { Badge } from "@/components/ui/badge";
import { usersApi } from "@/lib/resources";
import type { Branch, StaffUser } from "@/lib/types";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — Aurelia Suites" },
      { name: "description", content: "Manage staff accounts, roles and branch assignments." },
    ],
  }),
  component: UsersPage,
});

function branchName(b: StaffUser["branch"]) {
  if (!b) return "—";
  return typeof b === "string" ? b : (b as Branch).name;
}

const columns: LiveColumn<StaffUser>[] = [
  { header: "User", render: (u) => <span className="font-medium">{u.name}</span> },
  { header: "Email", render: (u) => u.email },
  { header: "Role", render: (u) => u.role },
  { header: "Branch", render: (u) => branchName(u.branch) },
  {
    header: "Last login",
    render: (u) => (u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never"),
  },
  {
    header: "Status",
    render: (u) => (
      <Badge
        variant={
          u.status === "Active" ? "default" : u.status === "Invited" ? "secondary" : "destructive"
        }
      >
        {u.status}
      </Badge>
    ),
  },
];

function UsersPage() {
  const [search, setSearch] = useState("");
  const { data, isLoading, isError } = usersApi.useList({ search, sort: "name" });
  const users = data?.data ?? [];

  const stats = {
    Users: data?.total ?? "—",
    Active: users.filter((u) => u.status === "Active").length,
    Roles: new Set(users.map((u) => u.role)).size,
    "Pending invites": users.filter((u) => u.status === "Invited").length,
  };

  return (
    <ModulePage
      title="Users & Roles"
      description="Manage staff accounts, roles and branch assignments."
      action="Invite user"
      stats={["Users", "Active", "Roles", "Pending invites"]}
      statValues={stats}
      columns={columns.map((c) => c.header)}
      capabilities={["Role-based permissions", "Branch assignment", "Account status control"]}
      table={
        <LiveDataTable
          columns={columns}
          rows={users}
          isLoading={isLoading}
          isError={isError}
          search={search}
          onSearchChange={setSearch}
          recordCount={data?.total}
          emptyTitle="No staff accounts yet"
          emptyHint="Accounts created via POST /api/v1/auth/register will show up here."
        />
      }
    />
  );
}
