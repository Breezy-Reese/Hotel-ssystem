import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { i as useQueryClient, n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as formatDistanceToNowStrict } from "../_libs/date-fns.mjs";
import { a as api, n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/kitchen-B7qHeHsO.js
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Pending: "outline",
	Preparing: "secondary",
	Ready: "default",
	Served: "default",
	Completed: "default",
	Cancelled: "outline"
};
var NEXT_STATUS = {
	Pending: "Preparing",
	Preparing: "Ready",
	Ready: "Served"
};
function useKitchenTickets() {
	return useQuery({
		queryKey: ["orders", "kitchen"],
		queryFn: () => api.get("/orders/kitchen"),
		refetchInterval: 15e3
	});
}
function KitchenPage() {
	const { data, isLoading, isError } = useKitchenTickets();
	const queryClient = useQueryClient();
	const tickets = data?.data ?? [];
	const stats = {
		"New tickets": tickets.filter((t) => t.status === "Pending").length,
		Preparing: tickets.filter((t) => t.status === "Preparing").length,
		"Ready to serve": tickets.filter((t) => t.status === "Ready").length
	};
	async function advance(order) {
		const next = NEXT_STATUS[order.status];
		if (!next) return;
		try {
			await api.patch(`/orders/${order._id}/status`, { status: next });
			toast.success(`Order marked ${next}`);
			queryClient.invalidateQueries({ queryKey: ["orders"] });
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to update order");
		}
	}
	const columns = [
		{
			header: "Ticket",
			render: (o) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: o.orderNumber
			})
		},
		{
			header: "Items",
			render: (o) => o.items.map((i) => `${i.quantity}× ${i.name ?? "item"}`).join(", ")
		},
		{
			header: "Placed",
			render: (o) => new Date(o.placedAt).toLocaleTimeString()
		},
		{
			header: "Elapsed",
			render: (o) => formatDistanceToNowStrict(new Date(o.placedAt))
		},
		{
			header: "Station",
			render: (o) => o.station || "Main"
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
		title: "Kitchen Display",
		description: "Live ticket queue for the kitchen — pending, preparing and ready orders.",
		stats: [
			"New tickets",
			"Preparing",
			"Ready to serve",
			"Avg prep time"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Live ticket queue",
			"Station grouping",
			"Status flow: Pending → Preparing → Ready → Served"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: tickets,
			isLoading,
			isError,
			recordCount: tickets.length,
			emptyTitle: "No active tickets",
			emptyHint: "New orders will appear here automatically.",
			rowActions: (o) => NEXT_STATUS[o.status] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				size: "sm",
				variant: "outline",
				onClick: () => advance(o),
				children: ["Mark ", NEXT_STATUS[o.status]]
			})
		})
	});
}
//#endregion
export { KitchenPage as component };
