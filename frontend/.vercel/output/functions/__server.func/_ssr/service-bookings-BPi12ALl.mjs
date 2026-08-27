import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { C as serviceBookingsApi } from "./resources-C26hbW7X.mjs";
import { n as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/service-bookings-BPi12ALl.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Requested: "outline",
	Scheduled: "secondary",
	InProgress: "secondary",
	Completed: "default",
	Cancelled: "destructive"
};
function guestName(g) {
	return typeof g === "string" ? g : g?.name ?? "—";
}
function serviceName(s) {
	return typeof s === "string" ? s : s?.name ?? "—";
}
var columns = [
	{
		header: "Ref",
		render: (b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: b.ref
		})
	},
	{
		header: "Guest",
		render: (b) => guestName(b.guest)
	},
	{
		header: "Service",
		render: (b) => serviceName(b.service)
	},
	{
		header: "Date & time",
		render: (b) => format(new Date(b.dateTime), "MMM d, HH:mm")
	},
	{
		header: "Charge",
		render: (b) => `$${b.charge.toFixed(2)}`
	},
	{
		header: "Status",
		render: (b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[b.status],
			children: b.status
		})
	}
];
function ServiceBookingsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = serviceBookingsApi.useList({
		search,
		sort: "-dateTime"
	});
	const bookings = data?.data ?? [];
	const stats = {
		Requested: bookings.filter((b) => b.status === "Requested").length,
		Scheduled: bookings.filter((b) => b.status === "Scheduled").length,
		"In progress": bookings.filter((b) => b.status === "InProgress").length,
		Completed: bookings.filter((b) => b.status === "Completed").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Service Bookings",
		description: "Schedule and track guest bookings for hotel services.",
		action: "New booking",
		stats: [
			"Requested",
			"Scheduled",
			"In progress",
			"Completed"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Select date and time",
			"Track service status",
			"Add charges to guest bill"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: bookings,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No service bookings yet",
			emptyHint: "Bookings created via the API will show up here."
		})
	});
}
//#endregion
export { ServiceBookingsPage as component };
