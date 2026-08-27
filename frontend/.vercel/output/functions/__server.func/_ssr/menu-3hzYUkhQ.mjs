import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { p as menuItemsApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-VFgyOZD6.mjs";
import { t as Label } from "./label-BlJuY_i3.mjs";
import { i as Input, n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/menu-3hzYUkhQ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var columns = [
	{
		header: "Item",
		render: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: m.name
		})
	},
	{
		header: "Category",
		render: (m) => m.category
	},
	{
		header: "Price",
		render: (m) => `$${m.price.toFixed(2)}`
	},
	{
		header: "Availability",
		render: (m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: m.availability ? "default" : "destructive",
			children: m.availability ? "Available" : "Unavailable"
		})
	},
	{
		header: "Updated",
		render: (m) => format(new Date(m.updatedAt), "MMM d, yyyy")
	}
];
function MenuPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const { data, isLoading, isError } = menuItemsApi.useList({
		search,
		sort: "category"
	});
	const createItem = menuItemsApi.useCreate();
	const items = data?.data ?? [];
	const stats = {
		"Menu items": data?.total ?? "—",
		Categories: new Set(items.map((i) => i.category)).size,
		Unavailable: items.filter((i) => !i.availability).length
	};
	async function handleCreate(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const payload = {
			name: String(form.get("name")),
			category: String(form.get("category")),
			price: Number(form.get("price")),
			description: String(form.get("description") || "")
		};
		try {
			await createItem.mutateAsync(payload);
			toast.success("Menu item added");
			setDialogOpen(false);
			e.currentTarget.reset();
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to add item");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Menu Management",
		description: "Food and drink catalogue with categories, pricing, images, availability and offers.",
		action: "Add item",
		onAction: () => setDialogOpen(true),
		stats: [
			"Menu items",
			"Categories",
			"Unavailable"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Categories",
			"Prices",
			"Food images",
			"Availability",
			"Special offers"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: items,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No menu items yet",
			emptyHint: "Add your first dish or drink to get started."
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: dialogOpen,
		onOpenChange: setDialogOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add menu item" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleCreate,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Name"
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
							htmlFor: "category",
							children: "Category"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "category",
							name: "category",
							placeholder: "Starters",
							required: true
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "price",
							children: "Price ($)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "price",
							name: "price",
							type: "number",
							min: 0,
							step: "0.01",
							required: true
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "description",
						children: "Description"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "description",
						name: "description"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: createItem.isPending,
					children: createItem.isPending ? "Adding…" : "Add item"
				}) })
			]
		})] })
	})] });
}
//#endregion
export { MenuPage as component };
