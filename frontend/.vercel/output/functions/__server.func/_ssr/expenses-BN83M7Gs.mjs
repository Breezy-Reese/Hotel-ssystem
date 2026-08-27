import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { o as expensesApi } from "./resources-C26hbW7X.mjs";
import { n as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/expenses-BN83M7Gs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Pending: "outline",
	Approved: "secondary",
	Paid: "default",
	Rejected: "destructive"
};
function supplierName(s) {
	if (!s) return "—";
	return typeof s === "string" ? s : s.name;
}
var columns = [
	{
		header: "Date",
		render: (e) => format(new Date(e.date), "MMM d, yyyy")
	},
	{
		header: "Category",
		render: (e) => e.category
	},
	{
		header: "Description",
		render: (e) => e.description || "—"
	},
	{
		header: "Supplier",
		render: (e) => supplierName(e.supplier)
	},
	{
		header: "Amount",
		render: (e) => `$${e.amount.toFixed(2)}`
	},
	{
		header: "Status",
		render: (e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[e.status],
			children: e.status
		})
	}
];
function ExpensesPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = expensesApi.useList({
		search,
		sort: "-date"
	});
	const expenses = data?.data ?? [];
	const now = /* @__PURE__ */ new Date();
	const stats = {
		"Expenses this month": `$${expenses.filter((e) => {
			const d = new Date(e.date);
			return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
		}).reduce((sum, e) => sum + e.amount, 0).toFixed(2)}`,
		Categories: new Set(expenses.map((e) => e.category)).size,
		"Pending approvals": expenses.filter((e) => e.status === "Pending").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Expense Management",
		description: "Track operating expenses, categories and supplier payments.",
		action: "Add expense",
		stats: [
			"Expenses this month",
			"Categories",
			"Supplier payments",
			"Pending approvals"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Expense categories",
			"Supplier payments",
			"Monthly expense reports"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: expenses,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No expenses yet",
			emptyHint: "Expenses created via the API will show up here."
		})
	});
}
//#endregion
export { ExpensesPage as component };
