import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { v as purchasesApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/purchases-CV9FDETk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Draft: "outline",
	Ordered: "secondary",
	AwaitingDelivery: "secondary",
	Received: "default",
	Cancelled: "destructive"
};
function supplierName(s) {
	return typeof s === "string" ? s : s?.name ?? "—";
}
function PurchasesPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = purchasesApi.useList({
		search,
		sort: "-createdAt"
	});
	const receive = purchasesApi.useAction("post", (id) => `/purchases/${id}/receive`);
	const purchases = data?.data ?? [];
	const stats = {
		"Open POs": purchases.filter((p) => p.status === "Ordered" || p.status === "Draft").length,
		"Awaiting delivery": purchases.filter((p) => p.status === "AwaitingDelivery").length,
		Received: purchases.filter((p) => p.status === "Received").length,
		"Purchase cost": `$${purchases.reduce((sum, p) => sum + (p.totalCost ?? 0), 0).toFixed(2)}`
	};
	async function handleReceive(id) {
		try {
			await receive.mutateAsync({ id });
			toast.success("Purchase order received — inventory updated");
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to receive order");
		}
	}
	const columns = [
		{
			header: "PO #",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: p.poNumber
			})
		},
		{
			header: "Supplier",
			render: (p) => supplierName(p.supplier)
		},
		{
			header: "Items",
			render: (p) => `${p.items.length} item${p.items.length === 1 ? "" : "s"}`
		},
		{
			header: "Expected",
			render: (p) => p.expectedDate ? format(new Date(p.expectedDate), "MMM d, yyyy") : "—"
		},
		{
			header: "Cost",
			render: (p) => `$${(p.totalCost ?? 0).toFixed(2)}`
		},
		{
			header: "Status",
			render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: STATUS_VARIANT[p.status],
				children: p.status
			})
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Purchase Management",
		description: "Create purchase orders and receive stock from suppliers.",
		action: "New purchase order",
		stats: [
			"Open POs",
			"Awaiting delivery",
			"Received",
			"Purchase cost"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Purchase orders",
			"Multi-item lines",
			"Receive stock",
			"Auto inventory & supplier balance update"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: purchases,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No purchase orders yet",
			emptyHint: "Purchase orders created via the API will show up here.",
			rowActions: (p) => p.status !== "Received" && p.status !== "Cancelled" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => handleReceive(p._id),
				children: "Receive"
			})
		})
	});
}
//#endregion
export { PurchasesPage as component };
