import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { s as guestsApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-VFgyOZD6.mjs";
import { t as Label } from "./label-BlJuY_i3.mjs";
import { i as Input, n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guests-mJzjwoN5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var columns = [
	{
		header: "Guest",
		render: (g) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: g.name
		})
	},
	{
		header: "Phone",
		render: (g) => g.phone || "—"
	},
	{
		header: "Email",
		render: (g) => g.email || "—"
	},
	{
		header: "Stays",
		render: (g) => g.stays
	},
	{
		header: "VIP",
		render: (g) => g.vip ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "VIP" }) : "—"
	}
];
function GuestsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const { data, isLoading, isError } = guestsApi.useList({
		search,
		sort: "name"
	});
	const createGuest = guestsApi.useCreate();
	const guests = data?.data ?? [];
	const stats = {
		"Total guests": data?.total ?? "—",
		"Returning guests": guests.filter((g) => g.stays > 1).length,
		"VIP guests": guests.filter((g) => g.vip).length
	};
	async function handleCreate(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const payload = {
			name: String(form.get("name")),
			phone: String(form.get("phone") || ""),
			email: String(form.get("email") || "")
		};
		try {
			await createGuest.mutateAsync(payload);
			toast.success("Guest added");
			setDialogOpen(false);
			e.currentTarget.reset();
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to add guest");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Guest Management",
		description: "Guest profiles, contact details, stay history, preferences and special requests.",
		action: "Add guest",
		onAction: () => setDialogOpen(true),
		stats: [
			"Total guests",
			"Returning guests",
			"VIP guests"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Guest profiles",
			"Contact information",
			"Booking history",
			"Preferences",
			"Special requests",
			"Feedback"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: guests,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No guests yet",
			emptyHint: "Add your first guest to get started."
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: dialogOpen,
		onOpenChange: setDialogOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add guest" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleCreate,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Full name"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "name",
						name: "name",
						required: true
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "phone",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "phone",
							name: "phone"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "email",
							children: "Email"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "email",
							name: "email",
							type: "email"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: createGuest.isPending,
					children: createGuest.isPending ? "Adding…" : "Add guest"
				}) })
			]
		})] })
	})] });
}
//#endregion
export { GuestsPage as component };
