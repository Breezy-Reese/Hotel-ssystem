import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { i as documentsApi } from "./resources-C26hbW7X.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/documents-B9KdjR4_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function formatSize(bytes) {
	if (!bytes) return "—";
	const kb = bytes / 1024;
	return kb < 1024 ? `${kb.toFixed(0)} KB` : `${(kb / 1024).toFixed(1)} MB`;
}
var columns = [
	{
		header: "Document",
		render: (d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
			href: d.fileUrl,
			target: "_blank",
			rel: "noreferrer",
			className: "font-medium underline-offset-2 hover:underline",
			children: d.name
		})
	},
	{
		header: "Type",
		render: (d) => d.type
	},
	{
		header: "Uploaded",
		render: (d) => new Date(d.createdAt).toLocaleDateString()
	},
	{
		header: "Size",
		render: (d) => formatSize(d.size)
	},
	{
		header: "Access",
		render: (d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: "secondary",
			children: d.access
		})
	}
];
function DocumentsPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const { data, isLoading, isError } = documentsApi.useList({
		search,
		sort: "-createdAt"
	});
	const documents = data?.data ?? [];
	const stats = {
		Documents: data?.total ?? "—",
		"Guest docs": documents.filter((d) => d.type === "GuestDoc").length,
		"Staff docs": documents.filter((d) => d.type === "StaffDoc").length,
		Policies: documents.filter((d) => d.type === "Policy").length
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Document Management",
		description: "Store and manage guest documents, staff files and policies.",
		action: "Upload document",
		stats: [
			"Documents",
			"Guest docs",
			"Staff docs",
			"Policies"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Guest documents",
			"Staff files",
			"Policies",
			"Access levels"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: documents,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No documents yet",
			emptyHint: "Documents uploaded via the API will show up here."
		})
	});
}
//#endregion
export { DocumentsPage as component };
