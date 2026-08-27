import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { r as branchesApi } from "./resources-C26hbW7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/branches-C233o2tq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var columns = [
	{
		header: "Branch",
		render: (b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: b.name
		})
	},
	{
		header: "Location",
		render: (b) => b.location
	},
	{
		header: "Status",
		render: (b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: b.status === "Active" ? "default" : "secondary",
			children: b.status
		})
	}
];
function BranchesPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = branchesApi.useList({
		search,
		sort: "name"
	});
	const branches = data?.data ?? [];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Branch Management",
		description: "Manage every property location, its rooms, staff and status.",
		action: "Add branch",
		stats: [
			"Branches",
			"Active rooms",
			"Staff assigned",
			"Branch revenue"
		],
		statValues: { Branches: data?.total ?? "—" },
		columns: [
			"Branch",
			"Location",
			"Rooms",
			"Staff",
			"Manager",
			"Status"
		],
		capabilities: [
			"Multiple locations",
			"Per-branch rooms & staff",
			"Branch status"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: branches,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No branches yet",
			emptyHint: "Branches created via the API will show up here."
		})
	});
}
//#endregion
export { BranchesPage as component };
