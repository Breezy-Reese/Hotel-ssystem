import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { m as notificationsApi } from "./resources-C26hbW7X.mjs";
import { n as format } from "../_libs/date-fns.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/notifications-BAcmYLn8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Sent: "default",
	Failed: "destructive",
	Pending: "secondary"
};
var columns = [
	{
		header: "Type",
		render: (n) => n.type
	},
	{
		header: "Recipient",
		render: () => "All staff"
	},
	{
		header: "Message",
		render: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "line-clamp-1 max-w-xs",
			children: n.message
		})
	},
	{
		header: "Channel",
		render: (n) => n.channel
	},
	{
		header: "Sent",
		render: (n) => n.sentAt ? format(new Date(n.sentAt), "MMM d, HH:mm") : "—"
	},
	{
		header: "Status",
		render: (n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[n.status],
			children: n.status
		})
	}
];
function NotificationsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = notificationsApi.useList({
		search,
		sort: "-createdAt"
	});
	const notifications = data?.data ?? [];
	const stats = {
		"Sent today": notifications.filter((n) => n.sentAt && new Date(n.sentAt).toDateString() === (/* @__PURE__ */ new Date()).toDateString()).length,
		Failed: notifications.filter((n) => n.status === "Failed").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Notifications",
		description: "Send announcements and alerts to staff and guests.",
		action: "New announcement",
		stats: [
			"Unread",
			"Sent today",
			"Failed",
			"Subscribers"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Announcements",
			"Alerts",
			"Reminders",
			"Email / SMS / In-app"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: notifications,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No notifications yet",
			emptyHint: "Notifications created via the API will show up here."
		})
	});
}
//#endregion
export { NotificationsPage as component };
