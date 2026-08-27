import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { u as invoicesApi, y as reservationsApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/front-desk-DsVKC_dX.js
var import_jsx_runtime = require_jsx_runtime();
function guestName(g) {
	return typeof g === "string" ? g : g.name;
}
function roomNumber(r) {
	return typeof r === "string" ? r : r.roomNumber;
}
function FrontDeskPage() {
	const { data, isLoading, isError } = reservationsApi.useList({
		sort: "checkIn",
		limit: 100
	});
	const { data: invoiceData } = invoicesApi.useList({
		status: "Open",
		limit: 1
	});
	const checkIn = reservationsApi.useAction("patch", (id) => `/reservations/${id}/check-in`);
	const checkOut = reservationsApi.useAction("patch", (id) => `/reservations/${id}/check-out`);
	const today = (/* @__PURE__ */ new Date()).toDateString();
	const reservations = (data?.data ?? []).filter((r) => {
		const inToday = new Date(r.checkIn).toDateString() === today;
		const outToday = new Date(r.checkOut).toDateString() === today;
		return inToday && ["Pending", "Confirmed"].includes(r.status) || outToday && r.status === "CheckedIn";
	});
	const stats = {
		"Awaiting check-in": reservations.filter((r) => ["Pending", "Confirmed"].includes(r.status)).length,
		"Awaiting check-out": reservations.filter((r) => r.status === "CheckedIn").length,
		"Open folios": invoiceData?.total ?? "—"
	};
	async function handleCheckIn(id) {
		try {
			await checkIn.mutateAsync({ id });
			toast.success("Guest checked in");
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Check-in failed");
		}
	}
	async function handleCheckOut(id) {
		try {
			await checkOut.mutateAsync({ id });
			toast.success("Guest checked out");
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Check-out failed");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Front Desk",
		description: "Today's arrivals, departures and guest folios.",
		action: "Walk-in booking",
		stats: [
			"Awaiting check-in",
			"Awaiting check-out",
			"Rooms assigned",
			"Open folios"
		],
		statValues: stats,
		columns: [
			"Guest",
			"Room",
			"Arrival",
			"Departure",
			"Balance",
			"Action"
		],
		capabilities: [
			"Today's arrivals & departures",
			"One-click check-in / check-out",
			"Open guest folios"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns: [
				{
					header: "Guest",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: guestName(r.guest)
					})
				},
				{
					header: "Room",
					render: (r) => roomNumber(r.room)
				},
				{
					header: "Arrival",
					render: (r) => format(new Date(r.checkIn), "MMM d")
				},
				{
					header: "Departure",
					render: (r) => format(new Date(r.checkOut), "MMM d")
				},
				{
					header: "Status",
					render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "secondary",
						children: r.status
					})
				}
			],
			rows: reservations,
			isLoading,
			isError,
			recordCount: reservations.length,
			emptyTitle: "Nothing due today",
			emptyHint: "Today's arrivals and departures will show up here.",
			rowActions: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2",
				children: [["Pending", "Confirmed"].includes(r.status) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => handleCheckIn(r._id),
					children: "Check in"
				}), r.status === "CheckedIn" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "outline",
					onClick: () => handleCheckOut(r._id),
					children: "Check out"
				})]
			})
		})
	});
}
//#endregion
export { FrontDeskPage as component };
