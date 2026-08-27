import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-catcA_HV.mjs";
import { r as branchesApi, x as roomsApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-VFgyOZD6.mjs";
import { t as Label } from "./label-BlJuY_i3.mjs";
import { i as Input, n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rooms-B_ifr2UZ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Available: "default",
	Reserved: "secondary",
	Occupied: "outline",
	Cleaning: "secondary",
	Maintenance: "destructive"
};
var columns = [
	{
		header: "Room #",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: r.roomNumber
		})
	},
	{
		header: "Type",
		render: (r) => r.type
	},
	{
		header: "Capacity",
		render: (r) => r.capacity
	},
	{
		header: "Rate / night",
		render: (r) => `$${r.rate.toFixed(2)}`
	},
	{
		header: "Amenities",
		render: (r) => r.amenities?.join(", ") || "—"
	},
	{
		header: "Status",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[r.status],
			children: r.status
		})
	}
];
function RoomsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const { data, isLoading, isError } = roomsApi.useList({
		search,
		sort: "roomNumber"
	});
	const { data: branchesData } = branchesApi.useList({ limit: 100 });
	const createRoom = roomsApi.useCreate();
	const rooms = data?.data ?? [];
	const branches = branchesData?.data ?? [];
	const stats = {
		"Total rooms": data?.total ?? "—",
		Available: rooms.filter((r) => r.status === "Available").length,
		Occupied: rooms.filter((r) => r.status === "Occupied").length,
		"Out of service": rooms.filter((r) => r.status === "Maintenance").length
	};
	async function handleCreate(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const payload = {
			roomNumber: String(form.get("roomNumber")),
			branch: String(form.get("branch")),
			type: String(form.get("type")),
			capacity: Number(form.get("capacity")),
			rate: Number(form.get("rate")),
			amenities: String(form.get("amenities") || "").split(",").map((a) => a.trim()).filter(Boolean)
		};
		try {
			await createRoom.mutateAsync(payload);
			toast.success("Room added");
			setDialogOpen(false);
			e.currentTarget.reset();
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to add room");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Room Management",
		description: "Create and maintain room inventory: types, pricing, capacity, amenities and live status.",
		action: "Add room",
		onAction: () => setDialogOpen(true),
		stats: [
			"Total rooms",
			"Available",
			"Occupied",
			"Out of service"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Single",
			"Double",
			"Deluxe",
			"Executive",
			"Suite",
			"Room images",
			"Amenities",
			"Available",
			"Reserved",
			"Occupied",
			"Cleaning",
			"Maintenance"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: rooms,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No rooms yet",
			emptyHint: "Add your first room to get started."
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: dialogOpen,
		onOpenChange: setDialogOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add room" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleCreate,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "roomNumber",
							children: "Room number"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "roomNumber",
							name: "roomNumber",
							required: true
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "branch",
							children: "Branch"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							name: "branch",
							required: true,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "branch",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "Select branch" })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: branches.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: b._id,
								children: b.name
							}, b._id)) })]
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "type",
							children: "Type"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							name: "type",
							required: true,
							defaultValue: "Single",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "type",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"Single",
								"Double",
								"Deluxe",
								"Executive",
								"Suite"
							].map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: t,
								children: t
							}, t)) })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "capacity",
							children: "Capacity"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "capacity",
							name: "capacity",
							type: "number",
							min: 1,
							defaultValue: 2,
							required: true
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "rate",
							children: "Rate / night ($)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "rate",
							name: "rate",
							type: "number",
							min: 0,
							step: "0.01",
							required: true
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "amenities",
							children: "Amenities"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "amenities",
							name: "amenities",
							placeholder: "WiFi, TV, Minibar"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: createRoom.isPending,
					children: createRoom.isPending ? "Adding…" : "Add room"
				}) })
			]
		})] })
	})] });
}
//#endregion
export { RoomsPage as component };
