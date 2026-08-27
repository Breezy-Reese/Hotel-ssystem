import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { O as usersApi } from "./resources-C26hbW7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/users-Chlq7Q2v.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function branchName(b) {
	if (!b) return "—";
	return typeof b === "string" ? b : b.name;
}
var columns = [
	{
		header: "User",
		render: (u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: u.name
		})
	},
	{
		header: "Email",
		render: (u) => u.email
	},
	{
		header: "Role",
		render: (u) => u.role
	},
	{
		header: "Branch",
		render: (u) => branchName(u.branch)
	},
	{
		header: "Last login",
		render: (u) => u.lastLogin ? new Date(u.lastLogin).toLocaleString() : "Never"
	},
	{
		header: "Status",
		render: (u) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: u.status === "Active" ? "default" : u.status === "Invited" ? "secondary" : "destructive",
			children: u.status
		})
	}
];
function UsersPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = usersApi.useList({
		search,
		sort: "name"
	});
	const users = data?.data ?? [];
	const stats = {
		Users: data?.total ?? "—",
		Active: users.filter((u) => u.status === "Active").length,
		Roles: new Set(users.map((u) => u.role)).size,
		"Pending invites": users.filter((u) => u.status === "Invited").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Users & Roles",
		description: "Manage staff accounts, roles and branch assignments.",
		action: "Invite user",
		stats: [
			"Users",
			"Active",
			"Roles",
			"Pending invites"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Role-based permissions",
			"Branch assignment",
			"Account status control"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: users,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No staff accounts yet",
			emptyHint: "Accounts created via POST /api/v1/auth/register will show up here."
		})
	});
}
//#endregion
export { UsersPage as component };
