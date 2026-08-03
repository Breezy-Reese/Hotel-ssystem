import { createFileRoute } from "@tanstack/react-router";

import { ModulePage } from "@/components/module-page";

export const Route = createFileRoute("/users")({
  head: () => ({
    meta: [
      { title: "Users & Roles — Aurelia Suites" },
      { name: "description", content: "Accounts and role-based permissions across every department." },
      { property: "og:title", content: "Users & Roles — Aurelia Suites" },
      { property: "og:description", content: "Accounts and role-based permissions across every department." },
    ],
  }),
  component: UsersPage,
});

function UsersPage() {
  return (
    <ModulePage
      title="Users & Roles"
      description="Accounts and role-based permissions across every department."
      action="Invite user"
      stats={["Users", "Active", "Roles", "Pending invites"]}
      columns={["User", "Email", "Role", "Branch", "Last login", "Status"]}
      capabilities={["Admin", "Manager", "Receptionist", "Hotel staff", "Restaurant staff", "Housekeeping", "Guest", "Role-based permissions"]}
    />
  );
}
