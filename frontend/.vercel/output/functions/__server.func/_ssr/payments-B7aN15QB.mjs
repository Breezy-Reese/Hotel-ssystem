import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { g as paymentsApi } from "./resources-C26hbW7X.mjs";
import { n as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/payments-B7aN15QB.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Completed: "default",
	Pending: "secondary",
	Refunded: "outline",
	Failed: "destructive"
};
var columns = [
	{
		header: "Txn ID",
		render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: p.transactionId
		})
	},
	{
		header: "Source",
		render: (p) => p.source
	},
	{
		header: "Method",
		render: (p) => p.method
	},
	{
		header: "Amount",
		render: (p) => `$${p.amount.toFixed(2)}`
	},
	{
		header: "Date",
		render: (p) => format(new Date(p.date), "MMM d, yyyy")
	},
	{
		header: "Status",
		render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[p.status],
			children: p.status
		})
	}
];
function PaymentsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = paymentsApi.useList({
		search,
		sort: "-date"
	});
	const payments = data?.data ?? [];
	const today = (/* @__PURE__ */ new Date()).toDateString();
	const stats = {
		"Collected today": `$${payments.filter((p) => p.status === "Completed" && new Date(p.date).toDateString() === today).reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`,
		Pending: payments.filter((p) => p.status === "Pending").length,
		Refunded: payments.filter((p) => p.status === "Refunded").length,
		Failed: payments.filter((p) => p.status === "Failed").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Payment Management",
		description: "All payment transactions across reservations, orders and services.",
		action: "Record payment",
		stats: [
			"Collected today",
			"Pending",
			"Refunded",
			"Failed"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Cash",
			"Card",
			"M-Pesa",
			"Bank transfer",
			"Transaction records",
			"Refunds"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: payments,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No payments yet",
			emptyHint: "Payments recorded via the API — including invoice pay-offs — will show up here."
		})
	});
}
//#endregion
export { PaymentsPage as component };
