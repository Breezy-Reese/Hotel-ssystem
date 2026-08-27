import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { l as inventoryApi } from "./resources-C26hbW7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/inventory-B_AkjFYt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	InStock: "default",
	LowStock: "secondary",
	OutOfStock: "destructive"
};
var columns = [
	{
		header: "Item",
		render: (i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: i.name
		})
	},
	{
		header: "Category",
		render: (i) => i.category
	},
	{
		header: "Quantity",
		render: (i) => `${i.quantity} ${i.unit}`
	},
	{
		header: "Reorder level",
		render: (i) => `${i.reorderLevel} ${i.unit}`
	},
	{
		header: "Stock value",
		render: (i) => `$${i.stockValue.toFixed(2)}`
	},
	{
		header: "Status",
		render: (i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[i.status],
			children: i.status
		})
	}
];
function InventoryPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = inventoryApi.useList({
		search,
		sort: "name"
	});
	const items = data?.data ?? [];
	const stats = {
		"Total items": data?.total ?? "—",
		"In stock": items.filter((i) => i.status === "InStock").length,
		"Low stock": items.filter((i) => i.status === "LowStock").length,
		"Out of stock": items.filter((i) => i.status === "OutOfStock").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Inventory Management",
		description: "Track stock levels, reorder thresholds and stock value across categories.",
		stats: [
			"Total items",
			"In stock",
			"Low stock",
			"Out of stock"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Stock levels",
			"Reorder thresholds",
			"Stock valuation",
			"Restocked via Purchase Orders"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: items,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No inventory items yet",
			emptyHint: "Stock items created via the API will show up here."
		})
	});
}
//#endregion
export { InventoryPage as component };
