import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { _ as promotionsApi } from "./resources-C26hbW7X.mjs";
import { n as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/promotions-g55PhEP7.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Active: "default",
	Scheduled: "secondary",
	Expired: "outline",
	Disabled: "destructive"
};
var columns = [
	{
		header: "Code",
		render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: p.code
		})
	},
	{
		header: "Applies to",
		render: (p) => p.appliesTo
	},
	{
		header: "Discount",
		render: (p) => p.discountType === "Percent" ? `${p.discountValue}%` : `$${p.discountValue.toFixed(2)}`
	},
	{
		header: "Starts",
		render: (p) => format(new Date(p.startsAt), "MMM d, yyyy")
	},
	{
		header: "Expires",
		render: (p) => format(new Date(p.expiresAt), "MMM d, yyyy")
	},
	{
		header: "Status",
		render: (p) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[p.status ?? "Active"],
			children: p.status ?? "Active"
		})
	}
];
function PromotionsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = promotionsApi.useList({
		search,
		sort: "-startsAt"
	});
	const promotions = data?.data ?? [];
	const stats = {
		"Active promos": promotions.filter((p) => p.status === "Active").length,
		Scheduled: promotions.filter((p) => p.status === "Scheduled").length,
		Expired: promotions.filter((p) => p.status === "Expired").length,
		Redemptions: promotions.reduce((sum, p) => sum + p.redemptions, 0)
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Promotions & Discounts",
		description: "Create and schedule promo codes across rooms, menu and services.",
		action: "Create promotion",
		stats: [
			"Active promos",
			"Scheduled",
			"Expired",
			"Redemptions"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Percent or fixed discounts",
			"Scheduled windows",
			"Applies to rooms, menu or services"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: promotions,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No promotions yet",
			emptyHint: "Promo codes created via the API will show up here."
		})
	});
}
//#endregion
export { PromotionsPage as component };
