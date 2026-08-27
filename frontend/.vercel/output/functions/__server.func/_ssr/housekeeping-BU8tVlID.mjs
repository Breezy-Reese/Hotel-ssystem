import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { c as housekeepingApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/housekeeping-BU8tVlID.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Pending: "outline",
	InProgress: "secondary",
	Ready: "default",
	DamageReported: "destructive"
};
var NEXT_STATUS = {
	Pending: "InProgress",
	InProgress: "Ready"
};
function roomNumber(r) {
	return typeof r === "string" ? r : r.roomNumber;
}
function employeeName(e) {
	if (!e) return "Unassigned";
	return typeof e === "string" ? e : e.name;
}
function HousekeepingPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = housekeepingApi.useList({
		search,
		sort: "-scheduledFor"
	});
	const updateStatus = housekeepingApi.useAction("patch", (id) => `/housekeeping/${id}/status`);
	const tasks = data?.data ?? [];
	const stats = {
		"Rooms to clean": tasks.filter((t) => t.cleaningStatus === "Pending").length,
		"In progress": tasks.filter((t) => t.cleaningStatus === "InProgress").length,
		Ready: tasks.filter((t) => t.cleaningStatus === "Ready").length,
		"Damage reports": tasks.filter((t) => t.cleaningStatus === "DamageReported").length
	};
	async function advance(task) {
		const next = NEXT_STATUS[task.cleaningStatus];
		if (!next) return;
		try {
			await updateStatus.mutateAsync({
				id: task._id,
				payload: { cleaningStatus: next }
			});
			toast.success(`Room marked ${next}`);
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to update status");
		}
	}
	async function reportDamage(task) {
		try {
			await updateStatus.mutateAsync({
				id: task._id,
				payload: { cleaningStatus: "DamageReported" }
			});
			toast.success("Damage reported — room flagged for maintenance");
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to report damage");
		}
	}
	const columns = [
		{
			header: "Room #",
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: roomNumber(t.room)
			})
		},
		{
			header: "Assigned to",
			render: (t) => employeeName(t.assignedTo)
		},
		{
			header: "Schedule",
			render: (t) => format(new Date(t.scheduledFor), "MMM d, HH:mm")
		},
		{
			header: "Cleaning status",
			render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: STATUS_VARIANT[t.cleaningStatus],
				children: t.cleaningStatus
			})
		},
		{
			header: "Notes",
			render: (t) => t.notes || "—"
		},
		{
			header: "Updated",
			render: (t) => format(new Date(t.updatedAt), "MMM d, HH:mm")
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Housekeeping",
		description: "Daily cleaning schedules, staff assignment, room readiness and damage reports.",
		stats: [
			"Rooms to clean",
			"In progress",
			"Ready",
			"Damage reports"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Daily schedules",
			"Assign rooms to staff",
			"Update cleaning status",
			"Report damaged items",
			"Mark room ready"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: tasks,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No housekeeping tasks yet",
			emptyHint: "Cleaning tasks created via the API will show up here.",
			rowActions: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2",
				children: [NEXT_STATUS[t.cleaningStatus] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => advance(t),
					children: ["Mark ", NEXT_STATUS[t.cleaningStatus]]
				}), t.cleaningStatus !== "DamageReported" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: () => reportDamage(t),
					children: "Report damage"
				})]
			})
		})
	});
}
//#endregion
export { HousekeepingPage as component };
