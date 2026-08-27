import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { w as servicesApi } from "./resources-C26hbW7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/services-mZMmc5pR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var columns = [
	{
		header: "Service",
		render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: s.name
		})
	},
	{
		header: "Category",
		render: (s) => s.category
	},
	{
		header: "Price",
		render: (s) => `$${s.price.toFixed(2)}`
	},
	{
		header: "Duration",
		render: (s) => s.duration ? `${s.duration} min` : "—"
	},
	{
		header: "Availability",
		render: (s) => s.availability ? "Available" : "Unavailable"
	},
	{
		header: "Status",
		render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: s.status === "Active" ? "default" : "secondary",
			children: s.status
		})
	}
];
function ServicesPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = servicesApi.useList({
		search,
		sort: "name"
	});
	const services = data?.data ?? [];
	const stats = {
		Services: data?.total ?? "—",
		Active: services.filter((s) => s.status === "Active").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Hotel Services",
		description: "Manage bookable hotel services: spa, laundry, transport and more.",
		action: "Add service",
		stats: [
			"Services",
			"Active",
			"Bookings today",
			"Service revenue"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Laundry",
			"Airport pickup",
			"Conference rooms",
			"Spa",
			"Gym",
			"Event halls"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: services,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No services yet",
			emptyHint: "Services created via the API will show up here."
		})
	});
}
//#endregion
export { ServicesPage as component };
