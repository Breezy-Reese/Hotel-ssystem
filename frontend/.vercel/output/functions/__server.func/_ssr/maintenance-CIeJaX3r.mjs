import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { f as maintenanceApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/maintenance-CIeJaX3r.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Open: "destructive",
	InProgress: "secondary",
	Resolved: "default"
};
var PRIORITY_VARIANT = {
	Low: "outline",
	Medium: "secondary",
	High: "destructive",
	Urgent: "destructive"
};
var NEXT_STATUS = {
	Open: "InProgress",
	InProgress: "Resolved"
};
function roomLabel(t) {
	if (t.room) return typeof t.room === "string" ? t.room : t.room.roomNumber;
	return t.location || "—";
}
function employeeName(e) {
	if (!e) return "Unassigned";
	return typeof e === "string" ? e : e.name;
}
function MaintenancePage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = maintenanceApi.useList({
		search,
		sort: "-createdAt"
	});
	const updateStatus = maintenanceApi.useAction("patch", (id) => `/maintenance/${id}/status`);
	const tickets = data?.data ?? [];
	const stats = {
		"Open tickets": tickets.filter((t) => t.status === "Open").length,
		"In progress": tickets.filter((t) => t.status === "InProgress").length,
		Resolved: tickets.filter((t) => t.status === "Resolved").length,
		Urgent: tickets.filter((t) => t.priority === "Urgent").length
	};
	async function advance(ticket) {
		const next = NEXT_STATUS[ticket.status];
		if (!next) return;
		try {
			await updateStatus.mutateAsync({
				id: ticket._id,
				payload: { status: next }
			});
			toast.success(`Ticket marked ${next}`);
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to update ticket");
		}
	}
	const columns = [
		{
			header: "Ticket #",
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: t.ticketNumber
			})
		},
		{
			header: "Location",
			render: (t) => roomLabel(t)
		},
		{
			header: "Issue",
			render: (t) => t.issue
		},
		{
			header: "Priority",
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: PRIORITY_VARIANT[t.priority],
				children: t.priority
			})
		},
		{
			header: "Assigned to",
			render: (t) => employeeName(t.assignedTo)
		},
		{
			header: "Cost",
			render: (t) => `$${t.cost.toFixed(2)}`
		},
		{
			header: "Status",
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: STATUS_VARIANT[t.status],
				children: t.status
			})
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Maintenance",
		description: "Log, assign and resolve maintenance tickets across rooms and common areas.",
		stats: [
			"Open tickets",
			"In progress",
			"Resolved",
			"Urgent"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Log tickets",
			"Priority levels",
			"Assign to staff",
			"Track cost",
			"Auto room status sync"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: tickets,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No maintenance tickets yet",
			emptyHint: "Tickets created via the API will show up here.",
			rowActions: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex justify-end gap-2",
				children: NEXT_STATUS[t.status] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => advance(t),
					children: ["Mark ", NEXT_STATUS[t.status]]
				})
			})
		})
	});
}
//#endregion
export { MaintenancePage as component };
