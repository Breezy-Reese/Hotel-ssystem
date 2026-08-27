import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { d as loyaltyApi } from "./resources-C26hbW7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/loyalty-BUUH46Ra.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var TIER_VARIANT = {
	Bronze: "outline",
	Silver: "secondary",
	Gold: "default",
	Platinum: "default"
};
function guestName(g) {
	return typeof g === "string" ? g : g?.name ?? "—";
}
var columns = [
	{
		header: "Member",
		render: (a) => guestName(a.guest)
	},
	{
		header: "Tier",
		render: (a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: TIER_VARIANT[a.tier],
			children: a.tier
		})
	},
	{
		header: "Points",
		render: (a) => a.points.toLocaleString()
	},
	{
		header: "Lifetime spend",
		render: (a) => `$${a.lifetimeSpend.toFixed(2)}`
	},
	{
		header: "Last activity",
		render: (a) => a.lastActivity ? new Date(a.lastActivity).toLocaleDateString() : "—"
	},
	{
		header: "Status",
		render: (a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: a.status === "Active" ? "default" : "secondary",
			children: a.status
		})
	}
];
function LoyaltyPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = loyaltyApi.useList({ search });
	const accounts = data?.data ?? [];
	const stats = {
		Members: data?.total ?? "—",
		"Points issued": accounts.reduce((sum, a) => sum + a.points, 0).toLocaleString()
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Loyalty & Rewards",
		description: "Manage guest loyalty tiers, points balances and redemptions.",
		action: "Add reward",
		stats: [
			"Members",
			"Points issued",
			"Points redeemed",
			"Active rewards"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Customer points",
			"Membership levels",
			"Reward discounts",
			"Redeem points"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: accounts,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No loyalty accounts yet",
			emptyHint: "Accounts created via the API will show up here."
		})
	});
}
//#endregion
export { LoyaltyPage as component };
