import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as api } from "./router-DChNDNRD.mjs";
import { t as useDashboardStats } from "./reports-CsK-QB5O.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-DPyMYAie.js
var import_jsx_runtime = require_jsx_runtime();
function useRevenueReport() {
	return useQuery({
		queryKey: ["reports", "revenue"],
		queryFn: () => api.get("/reports/revenue?groupBy=day")
	});
}
var columns = [
	{
		header: "Period",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: r.period
		})
	},
	{
		header: "Hotel revenue",
		render: (r) => `$${r.hotelRevenue.toFixed(2)}`
	},
	{
		header: "Restaurant revenue",
		render: (r) => `$${r.restaurantRevenue.toFixed(2)}`
	},
	{
		header: "Expenses",
		render: (r) => `$${r.expenses.toFixed(2)}`
	},
	{
		header: "Profit",
		render: (r) => `$${r.profit.toFixed(2)}`
	}
];
function ReportsPage() {
	const { data: statsRes, isLoading: statsLoading } = useDashboardStats();
	const { data: revenueRes, isLoading: revenueLoading, isError } = useRevenueReport();
	const rows = (revenueRes?.data.rows ?? []).map((r) => ({
		...r,
		_id: r.period
	}));
	const stats = statsRes?.data;
	const totals = revenueRes?.data.totals;
	const statValues = {
		"Revenue today": stats ? `$${stats.billing.revenueToday.toFixed(2)}` : "—",
		"Hotel revenue": totals ? `$${totals.hotelRevenue.toFixed(2)}` : "—",
		"Restaurant revenue": totals ? `$${totals.restaurantRevenue.toFixed(2)}` : "—",
		"Estimated profit": totals ? `$${totals.profit.toFixed(2)}` : "—"
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Revenue & Financial Reports",
		description: "Hotel and restaurant revenue, expenses and profit by period.",
		action: "Export",
		stats: [
			"Revenue today",
			"Hotel revenue",
			"Restaurant revenue",
			"Estimated profit"
		],
		statValues: statsLoading ? void 0 : statValues,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Daily & monthly breakdown",
			"Hotel vs restaurant split",
			"Expense tracking",
			"Profit estimate"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows,
			isLoading: revenueLoading,
			isError,
			recordCount: rows.length,
			emptyTitle: "No revenue recorded yet",
			emptyHint: "Paid invoices and POS sales will populate this report."
		})
	});
}
//#endregion
export { ReportsPage as component };
