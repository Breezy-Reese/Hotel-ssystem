import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-catcA_HV.mjs";
import { i as useQueryClient } from "../_libs/tanstack__react-query.mjs";
import { a as employeesApi, t as attendanceApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { a as api, n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/attendance-DikX9lmK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var FLAG_VARIANT = {
	OnTime: "default",
	Late: "secondary",
	Absent: "destructive",
	EarlyLeave: "outline"
};
function employeeName(e) {
	return typeof e === "string" ? e : e?.name ?? "—";
}
var columns = [
	{
		header: "Employee",
		render: (a) => employeeName(a.employee)
	},
	{
		header: "Date",
		render: (a) => format(new Date(a.date), "MMM d, yyyy")
	},
	{
		header: "Clock in",
		render: (a) => a.clockIn ? format(new Date(a.clockIn), "HH:mm") : "—"
	},
	{
		header: "Clock out",
		render: (a) => a.clockOut ? format(new Date(a.clockOut), "HH:mm") : "—"
	},
	{
		header: "Hours",
		render: (a) => a.hoursWorked ? a.hoursWorked.toFixed(1) : "—"
	},
	{
		header: "Flag",
		render: (a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: FLAG_VARIANT[a.flag],
			children: a.flag
		})
	}
];
function AttendancePage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [employeeId, setEmployeeId] = (0, import_react.useState)("");
	const queryClient = useQueryClient();
	const { data, isLoading, isError } = attendanceApi.useList({
		search,
		sort: "-date"
	});
	const { data: employeesData } = employeesApi.useList({ limit: 200 });
	const records = data?.data ?? [];
	const employees = employeesData?.data ?? [];
	const stats = {
		"Clocked in": records.filter((r) => r.clockIn && !r.clockOut).length,
		"Clocked out": records.filter((r) => r.clockOut).length,
		"Late today": records.filter((r) => r.flag === "Late").length,
		Absent: records.filter((r) => r.flag === "Absent").length
	};
	async function clockAction(action) {
		if (!employeeId) {
			toast.error("Select an employee first");
			return;
		}
		try {
			await api.post(`/attendance/${action}`, { employee: employeeId });
			toast.success(action === "clock-in" ? "Clocked in" : "Clocked out");
			queryClient.invalidateQueries({ queryKey: ["attendance"] });
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Action failed");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Staff Attendance",
		description: "Clock staff in and out, and review attendance history.",
		stats: [
			"Clocked in",
			"Clocked out",
			"Late today",
			"Absent"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Clock in",
			"Clock out",
			"Attendance records",
			"Late-arrival tracking"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-2 rounded-md border border-border bg-card p-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: employeeId,
						onValueChange: setEmployeeId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-56",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select employee" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: employees.map((e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: e._id,
							children: e.name
						}, e._id)) })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						onClick: () => clockAction("clock-in"),
						children: "Clock in"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						size: "sm",
						variant: "outline",
						onClick: () => clockAction("clock-out"),
						children: "Clock out"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
				columns,
				rows: records,
				isLoading,
				isError,
				search,
				onSearchChange: setSearch,
				recordCount: data?.total,
				emptyTitle: "No attendance records yet",
				emptyHint: "Clock-ins and manual entries will show up here."
			})]
		})
	});
}
//#endregion
export { AttendancePage as component };
