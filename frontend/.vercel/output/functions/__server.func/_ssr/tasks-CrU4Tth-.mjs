import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { D as tasksApi } from "./resources-C26hbW7X.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { t as Progress } from "./progress-DAjxSBGn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tasks-CrU4Tth-.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Open: "outline",
	InProgress: "secondary",
	Completed: "default",
	Overdue: "destructive"
};
function assigneeName(e) {
	return typeof e === "string" ? e : e?.name ?? "Unassigned";
}
var columns = [
	{
		header: "Task",
		render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: t.title
		})
	},
	{
		header: "Assigned to",
		render: (t) => assigneeName(t.assignedTo)
	},
	{
		header: "Department",
		render: (t) => t.department || "—"
	},
	{
		header: "Deadline",
		render: (t) => t.deadline ? format(new Date(t.deadline), "MMM d, yyyy") : "—"
	},
	{
		header: "Progress",
		render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
			value: t.progress,
			className: "w-24"
		})
	},
	{
		header: "Status",
		render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[t.status],
			children: t.status
		})
	}
];
function TasksPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = tasksApi.useList({
		search,
		sort: "deadline"
	});
	const tasks = data?.data ?? [];
	const stats = {
		"Open tasks": tasks.filter((t) => t.status === "Open" || t.status === "InProgress").length,
		Overdue: tasks.filter((t) => t.status === "Overdue").length,
		Completed: tasks.filter((t) => t.status === "Completed").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Task Management",
		description: "Assign, track and complete operational tasks across departments.",
		action: "Assign task",
		stats: [
			"Open tasks",
			"Due today",
			"Overdue",
			"Completed"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Assign tasks",
			"Set deadlines",
			"Track progress",
			"Mark completed"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: tasks,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No tasks yet",
			emptyHint: "Tasks created via the API will show up here."
		})
	});
}
//#endregion
export { TasksPage as component };
