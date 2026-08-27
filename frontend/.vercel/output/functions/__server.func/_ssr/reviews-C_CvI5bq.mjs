import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { l as Star } from "../_libs/lucide-react.mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { b as reviewsApi } from "./resources-C26hbW7X.mjs";
import { n as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reviews-C_CvI5bq.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function guestName(g) {
	return typeof g === "string" ? g : g?.name ?? "—";
}
var columns = [
	{
		header: "Guest",
		render: (r) => guestName(r.guest)
	},
	{
		header: "Target",
		render: (r) => r.targetType
	},
	{
		header: "Rating",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "inline-flex items-center gap-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "size-3.5 fill-accent text-accent" }),
				" ",
				r.rating,
				"/5"
			]
		})
	},
	{
		header: "Comment",
		render: (r) => r.comment || "—"
	},
	{
		header: "Date",
		render: (r) => format(new Date(r.date), "MMM d, yyyy")
	},
	{
		header: "Reviewed",
		render: (r) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: r.reviewed ? "default" : "outline",
			children: r.reviewed ? "Yes" : "No"
		})
	}
];
function ReviewsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = reviewsApi.useList({
		search,
		sort: "-date"
	});
	const reviews = data?.data ?? [];
	const stats = {
		"Average rating": reviews.length > 0 ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1) : "—",
		"Room reviews": reviews.filter((r) => r.targetType === "Room").length,
		"Meal reviews": reviews.filter((r) => r.targetType === "Meal").length,
		Unread: reviews.filter((r) => !r.reviewed).length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Reviews & Feedback",
		description: "Collect and act on guest feedback for rooms, meals and services.",
		stats: [
			"Average rating",
			"Room reviews",
			"Meal reviews",
			"Unread"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Rate rooms",
			"Rate meals",
			"Comments",
			"Admin review"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: reviews,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No reviews yet",
			emptyHint: "Guest reviews submitted via the API will show up here."
		})
	});
}
//#endregion
export { ReviewsPage as component };
