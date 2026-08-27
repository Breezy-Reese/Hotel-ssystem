import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { T as suppliersApi } from "./resources-C26hbW7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/suppliers-D5KiyalC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var columns = [
	{
		header: "Supplier",
		render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: s.name
		})
	},
	{
		header: "Contact",
		render: (s) => s.contactPhone || s.contactEmail || "—"
	},
	{
		header: "Products",
		render: (s) => s.productsSupplied?.join(", ") || "—"
	},
	{
		header: "Balance",
		render: (s) => `$${s.balanceOwed.toFixed(2)}`
	},
	{
		header: "Status",
		render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: s.status === "Active" ? "default" : "secondary",
			children: s.status
		})
	}
];
function SuppliersPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = suppliersApi.useList({
		search,
		sort: "name"
	});
	const suppliers = data?.data ?? [];
	const stats = {
		Suppliers: data?.total ?? "—",
		"Amount owed": `$${suppliers.reduce((sum, s) => sum + s.balanceOwed, 0).toFixed(2)}`
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Supplier Management",
		description: "Manage vendor contacts, products supplied and outstanding balances.",
		action: "Add supplier",
		stats: [
			"Suppliers",
			"Active orders",
			"Amount owed",
			"Paid this month"
		],
		statValues: stats,
		columns: [
			"Supplier",
			"Contact",
			"Products",
			"Orders",
			"Balance",
			"Status"
		],
		capabilities: [
			"Vendor contacts",
			"Products supplied",
			"Balance tracking",
			"Linked to purchase orders"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: suppliers,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No suppliers yet",
			emptyHint: "Suppliers created via the API will show up here."
		})
	});
}
//#endregion
export { SuppliersPage as component };
