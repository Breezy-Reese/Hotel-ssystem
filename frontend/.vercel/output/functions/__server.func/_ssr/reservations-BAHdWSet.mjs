import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { y as reservationsApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as format } from "../_libs/date-fns.mjs";
import { n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reservations-BAHdWSet.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Pending: "outline",
	Confirmed: "secondary",
	CheckedIn: "default",
	CheckedOut: "secondary",
	Cancelled: "destructive",
	NoShow: "destructive"
};
function guestName(g) {
	return typeof g === "string" ? g : g.name;
}
function roomNumber(r) {
	return typeof r === "string" ? r : r.roomNumber;
}
function ReservationsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = reservationsApi.useList({
		search,
		sort: "-checkIn"
	});
	const checkIn = reservationsApi.useAction("patch", (id) => `/reservations/${id}/check-in`);
	const checkOut = reservationsApi.useAction("patch", (id) => `/reservations/${id}/check-out`);
	const reservations = data?.data ?? [];
	const stats = {
		"Total reservations": data?.total ?? "—",
		"Checked in": reservations.filter((r) => r.status === "CheckedIn").length,
		Pending: reservations.filter((r) => r.status === "Pending").length,
		Cancelled: reservations.filter((r) => r.status === "Cancelled").length
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
	const columns = [
		{
			header: "Ref",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-medium",
				children: r.ref
			})
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
			render: (r) => format(new Date(r.checkIn), "MMM d, yyyy")
		},
		{
			header: "Check-out",
			render: (r) => format(new Date(r.checkOut), "MMM d, yyyy")
		},
		{
			header: "Status",
			render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: STATUS_VARIANT[r.status],
				children: r.status
			})
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Reservations & Booking",
		description: "Book, confirm, check guests in and out, and manage cancellations across all branches.",
		stats: [
			"Total reservations",
			"Checked in",
			"Pending",
			"Cancelled"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Availability check",
			"Walk-in & online bookings",
			"Check-in / check-out",
			"Cancellations"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: reservations,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No reservations yet",
			emptyHint: "Bookings created via the API will show up here.",
			rowActions: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex justify-end gap-2",
				children: [(r.status === "Confirmed" || r.status === "Pending") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
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
export { ReservationsPage as component };
