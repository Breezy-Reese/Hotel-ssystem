import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { n as auditLogsApi } from "./resources-C26hbW7X.mjs";
import { n as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/audit-logs-S-ueIQBA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function userName(u) {
	if (!u) return "System";
	return typeof u === "string" ? u : u.name;
}
var columns = [
	{
		header: "Timestamp",
		render: (l) => format(new Date(l.timestamp), "MMM d, HH:mm:ss")
	},
	{
		header: "User",
		render: (l) => userName(l.user)
	},
	{
		header: "Action",
		render: (l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: l.action
		})
	},
	{
		header: "Entity",
		render: (l) => l.entity
	},
	{
		header: "IP",
		render: (l) => l.ip || "—"
	},
	{
		header: "Result",
		render: (l) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: l.result === "Success" ? "default" : "destructive",
			children: l.result
		})
	}
];
function AuditLogsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = auditLogsApi.useList({
		search,
		sort: "-timestamp"
	});
	const logs = data?.data ?? [];
	const today = (/* @__PURE__ */ new Date()).toDateString();
	const stats = {
		"Events today": logs.filter((l) => new Date(l.timestamp).toDateString() === today).length,
		Logins: logs.filter((l) => l.action === "LOGIN").length,
		"Record changes": logs.filter((l) => ["CREATE", "UPDATE"].includes(l.action)).length,
		Deletions: logs.filter((l) => l.action === "DELETE").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Audit Logs",
		description: "Every create, update, delete and login event, automatically recorded.",
		action: "Export log",
		stats: [
			"Events today",
			"Logins",
			"Record changes",
			"Deletions"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Track created / changed data",
			"Login activity",
			"Deleted records"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: logs,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No events yet",
			emptyHint: "Every write action across the API is logged here automatically."
		})
	});
}
//#endregion
export { AuditLogsPage as component };
