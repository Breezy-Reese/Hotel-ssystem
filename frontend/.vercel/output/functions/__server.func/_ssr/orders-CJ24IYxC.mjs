import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { h as ordersApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-CJ24IYxC.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Pending: "outline",
	Preparing: "secondary",
	Ready: "default",
	Served: "secondary",
	Completed: "default",
	Cancelled: "destructive"
};
var NEXT_STATUS = {
	Pending: "Preparing",
	Preparing: "Ready",
	Ready: "Served",
	Served: "Completed"
};
function tableOrRoom(o) {
	if (o.table) return typeof o.table === "string" ? o.table : o.table.tableNumber;
	if (o.room) return typeof o.room === "string" ? o.room : o.room.roomNumber;
	return "—";
}
function OrdersPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = ordersApi.useList({
		search,
		sort: "-placedAt"
	});
	const updateStatus = ordersApi.useAction("patch", (id) => `/orders/${id}/status`);
	const orders = data?.data ?? [];
	const stats = {
		Pending: orders.filter((o) => o.status === "Pending").length,
		Preparing: orders.filter((o) => o.status === "Preparing").length,
		Ready: orders.filter((o) => o.status === "Ready").length,
		"Completed today": orders.filter((o) => o.status === "Completed").length
	};
	async function advance(order) {
		const next = NEXT_STATUS[order.status];
		if (!next) return;
		try {
			await updateStatus.mutateAsync({
				id: order._id,
				payload: { status: next }
			});
			toast.success(`Order moved to ${next}`);
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to update order");
		}
	}
	const columns = [
		{
			header: "Order #",
			render: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: o.orderNumber
			})
		},
		{
			header: "Type",
			render: (o) => o.type
		},
		{
			header: "Table / Room",
			render: (o) => tableOrRoom(o)
		},
		{
			header: "Items",
			render: (o) => o.items.length
		},
		{
			header: "Total",
			render: (o) => o.total !== void 0 ? `$${o.total.toFixed(2)}` : "—"
		},
		{
			header: "Status",
			render: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: STATUS_VARIANT[o.status],
				children: o.status
			})
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Restaurant Orders",
		description: "Dine-in, takeaway and room-service orders with full status tracking.",
		stats: [
			"Pending",
			"Preparing",
			"Ready",
			"Completed today"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Dine-in",
			"Takeaway",
			"Room service",
			"Pending",
			"Preparing",
			"Ready",
			"Served",
			"Completed",
			"Cancelled"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: orders,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No orders yet",
			emptyHint: "Orders placed via the API or POS will show up here.",
			rowActions: (o) => NEXT_STATUS[o.status] ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => advance(o),
				children: ["Mark ", NEXT_STATUS[o.status]]
			}) : null
		})
	});
}
//#endregion
export { OrdersPage as component };
