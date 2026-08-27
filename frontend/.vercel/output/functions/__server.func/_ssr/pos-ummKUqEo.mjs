import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { S as salesApi } from "./resources-C26hbW7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pos-ummKUqEo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cashierName(c) {
	if (!c) return "—";
	return typeof c === "string" ? c : c.name;
}
function saleTotal(s) {
	const subtotal = s.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
	return Math.max(subtotal - s.discount, 0);
}
var columns = [
	{
		header: "Receipt #",
		render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: s.receiptNumber
		})
	},
	{
		header: "Cashier",
		render: (s) => cashierName(s.cashier)
	},
	{
		header: "Items",
		render: (s) => `${s.items.length} item${s.items.length === 1 ? "" : "s"}`
	},
	{
		header: "Discount",
		render: (s) => `$${s.discount.toFixed(2)}`
	},
	{
		header: "Total",
		render: (s) => `$${saleTotal(s).toFixed(2)}`
	},
	{
		header: "Payment",
		render: (s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "secondary",
			children: s.paymentMethod
		})
	}
];
function PosPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = salesApi.useList({ sort: "-createdAt" });
	const sales = (data?.data ?? []).filter((s) => search ? s.receiptNumber.toLowerCase().includes(search.toLowerCase()) : true);
	const today = (/* @__PURE__ */ new Date()).toDateString();
	const stats = {
		"Sales today": `$${(data?.data ?? []).filter((s) => new Date(s.createdAt).toDateString() === today).reduce((sum, s) => sum + saleTotal(s), 0).toFixed(2)}`,
		"Discounts given": `$${(data?.data ?? []).reduce((sum, s) => sum + s.discount, 0).toFixed(2)}`,
		"Average bill": (data?.data ?? []).length > 0 ? `$${((data?.data ?? []).reduce((sum, s) => sum + saleTotal(s), 0) / (data?.data ?? []).length).toFixed(2)}` : "—"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Restaurant POS",
		description: "Point-of-sale receipts, discounts and payment methods.",
		action: "New sale",
		stats: [
			"Sales today",
			"Open tickets",
			"Discounts given",
			"Average bill"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Cash",
			"Card",
			"Mobile payment",
			"Discounts",
			"Linked to restaurant orders"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: sales,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No sales yet",
			emptyHint: "POS receipts created via the API will show up here."
		})
	});
}
//#endregion
export { PosPage as component };
