import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-QVwyGgVH.mjs";
import { H as BedDouble, L as CalendarCheck, W as ArrowUpRight, i as UtensilsCrossed, r as Wallet, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { r as PageHeader, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { y as reservationsApi } from "./resources-C26hbW7X.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as navGroups } from "./router-DChNDNRD2.mjs";
import { t as useDashboardStats } from "./reports-CsK-QB5O.mjs";
import { t as Progress } from "./progress-DAjxSBGn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-w5_-6LAD.js
var import_jsx_runtime = require_jsx_runtime();
function guestName(g) {
	return typeof g === "string" ? g : g.name;
}
function roomNumber(r) {
	return typeof r === "string" ? r : r.roomNumber;
}
var recentColumns = [
	{
		header: "Ref",
		render: (r) => r.ref
	},
	{
		header: "Guest",
		render: (r) => guestName(r.guest)
	},
	{
		header: "Room",
		render: (r) => roomNumber(r.room)
	},
	{
		header: "Check-in",
		render: (r) => format(new Date(r.checkIn), "MMM d")
	},
	{
		header: "Status",
		render: (r) => r.status
	}
];
function Dashboard() {
	const shortcuts = navGroups.flatMap((g) => g.items).filter((i) => i.url !== "/");
	const { data: statsRes, isLoading: statsLoading } = useDashboardStats();
	const { data: recentRes, isLoading: recentLoading } = reservationsApi.useList({
		sort: "-createdAt",
		limit: 5
	});
	const stats = statsRes?.data;
	const occupancyRate = stats && stats.rooms.total > 0 ? Math.round(stats.rooms.occupied / stats.rooms.total * 100) : 0;
	const kpis = [
		{
			label: "Total bookings",
			icon: CalendarCheck,
			hint: "All reservations",
			value: stats ? stats.reservations.inHouse + stats.reservations.arrivalsToday : void 0
		},
		{
			label: "Available rooms",
			icon: BedDouble,
			hint: "Ready to sell",
			value: stats?.rooms.available
		},
		{
			label: "Open invoices",
			icon: UtensilsCrossed,
			hint: "Awaiting payment",
			value: stats?.billing.openInvoices
		},
		{
			label: "Revenue today",
			icon: Wallet,
			hint: "Hotel + restaurant",
			value: stats ? `$${stats.billing.revenueToday.toFixed(2)}` : void 0
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title: "Property Overview",
				description: "A single console for rooms, reservations, dining, finance, inventory and staff."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
				children: kpis.map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
						className: "flex flex-row items-center justify-between pb-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
							className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
							children: k.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(k.icon, { className: "size-4 text-accent" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [statsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "size-6 animate-spin text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-3xl font-semibold text-foreground",
						children: k.value ?? "—"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: k.hint
					})] })]
				}, k.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "shadow-card lg:col-span-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-sm",
						children: "Occupancy rate"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-display text-4xl font-semibold text-foreground",
								children: stats ? `${occupancyRate}%` : "—%"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: occupancyRate }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Occupied"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: stats?.rooms.occupied ?? "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Available"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: stats?.rooms.available ?? "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Rooms to clean"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: stats?.housekeeping.roomsToClean ?? "—"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground",
									children: "Maintenance"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-medium",
									children: stats?.rooms.outOfService ?? "—"
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-4 lg:col-span-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
						columns: recentColumns,
						rows: recentRes?.data ?? [],
						isLoading: recentLoading,
						emptyTitle: "No recent bookings",
						emptyHint: "Recent reservations will appear here."
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-sm",
					children: "All modules"
				}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "grid gap-2 sm:grid-cols-2 lg:grid-cols-4",
					children: shortcuts.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: s.url,
						className: "group flex items-center gap-3 rounded-md border border-border bg-card px-3 py-2.5 text-sm transition-colors hover:border-accent hover:bg-secondary",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(s.icon, { className: "size-4 text-accent" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate",
								children: s.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowUpRight, { className: "ml-auto size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" })
						]
					}, s.url))
				})]
			})
		]
	});
}
//#endregion
export { Dashboard as component };
