import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { u as invoicesApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/invoices-Cr0iRv-c.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Open: "outline",
	Issued: "secondary",
	Paid: "default",
	Overdue: "destructive",
	Cancelled: "destructive"
};
function guestName(g) {
	return typeof g === "string" ? g : g.name;
}
function invoiceTotal(inv) {
	if (inv.total !== void 0) return inv.total;
	const subtotal = inv.charges.reduce((s, c) => s + c.amount, 0);
	return subtotal + subtotal * inv.tax / 100 - inv.discount;
}
function InvoicesPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = invoicesApi.useList({
		search,
		sort: "-updatedAt"
	});
	const payInvoice = invoicesApi.useAction("post", (id) => `/invoices/${id}/pay`);
	const invoices = data?.data ?? [];
	const stats = {
		"Open folios": invoices.filter((i) => i.status === "Open").length,
		Issued: invoices.filter((i) => i.status === "Issued").length,
		Paid: invoices.filter((i) => i.status === "Paid").length,
		Outstanding: invoices.filter((i) => i.status !== "Paid" && i.status !== "Cancelled").length
	};
	async function markPaid(inv) {
		try {
			await payInvoice.mutateAsync({
				id: inv._id,
				payload: {
					method: "Cash",
					amount: invoiceTotal(inv)
				}
			});
			toast.success("Invoice marked paid");
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Payment failed");
		}
	}
	const columns = [
		{
			header: "Invoice #",
			render: (i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: i.invoiceNumber
			})
		},
		{
			header: "Guest",
			render: (i) => guestName(i.guest)
		},
		{
			header: "Tax",
			render: (i) => `${i.tax}%`
		},
		{
			header: "Discount",
			render: (i) => `$${i.discount.toFixed(2)}`
		},
		{
			header: "Total",
			render: (i) => `$${invoiceTotal(i).toFixed(2)}`
		},
		{
			header: "Status",
			render: (i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: STATUS_VARIANT[i.status],
				children: i.status
			})
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Billing & Invoicing",
		description: "Consolidated folios: room, restaurant, room service, extras, taxes and discounts.",
		stats: [
			"Open folios",
			"Issued",
			"Paid",
			"Outstanding"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Room charges",
			"Restaurant charges",
			"Room service",
			"Additional services",
			"Taxes",
			"Discounts",
			"Download / print"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: invoices,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No invoices yet",
			emptyHint: "Invoices created via the API will show up here.",
			rowActions: (i) => i.status !== "Paid" && i.status !== "Cancelled" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => markPaid(i),
				children: "Mark paid"
			}) : null
		})
	});
}
//#endregion
export { InvoicesPage as component };
