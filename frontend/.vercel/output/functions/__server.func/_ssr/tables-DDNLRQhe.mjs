import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { E as tablesApi } from "./resources-C26hbW7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/tables-DDNLRQhe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Available: "default",
	Occupied: "outline",
	Reserved: "secondary"
};
function reservedForName(g) {
	if (!g) return "—";
	return typeof g === "string" ? g : g.name;
}
var columns = [
	{
		header: "Table #",
		render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: t.tableNumber
		})
	},
	{
		header: "Capacity",
		render: (t) => t.capacity
	},
	{
		header: "Section",
		render: (t) => t.section || "—"
	},
	{
		header: "Status",
		render: (t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[t.status],
			children: t.status
		})
	},
	{
		header: "Reserved for",
		render: (t) => reservedForName(t.reservedFor)
	},
	{
		header: "Time",
		render: (t) => t.reservedTime ? new Date(t.reservedTime).toLocaleString() : "—"
	}
];
function TablesPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = tablesApi.useList({
		search,
		sort: "tableNumber"
	});
	const tables = data?.data ?? [];
	const stats = {
		Tables: data?.total ?? "—",
		Available: tables.filter((t) => t.status === "Available").length,
		Occupied: tables.filter((t) => t.status === "Occupied").length,
		Reserved: tables.filter((t) => t.status === "Reserved").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Table Management",
		description: "Track restaurant table capacity, sections and live availability.",
		action: "Add table",
		stats: [
			"Tables",
			"Available",
			"Occupied",
			"Reserved"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Table numbers",
			"Capacity",
			"Availability status",
			"Table reservations"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: tables,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No tables yet",
			emptyHint: "Tables created via the API will show up here."
		})
	});
}
//#endregion
export { TablesPage as component };
