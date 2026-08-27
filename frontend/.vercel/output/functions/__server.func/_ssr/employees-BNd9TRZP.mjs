import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as ModulePage, t as LiveDataTable } from "./live-data-table-DGgBNISO.mjs";
import { t as Badge } from "./badge-3N8-UGGY.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-catcA_HV.mjs";
import { a as employeesApi } from "./resources-C26hbW7X.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { a as DialogTitle, i as DialogHeader, n as DialogContent, r as DialogFooter, t as Dialog } from "./dialog-VFgyOZD6.mjs";
import { t as Label } from "./label-BlJuY_i3.mjs";
import { i as Input, n as ApiError, r as Button } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/employees-BNd9TRZP.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATUS_VARIANT = {
	Active: "default",
	OnLeave: "secondary",
	Terminated: "destructive"
};
var columns = [
	{
		header: "Employee",
		render: (e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-medium",
			children: e.name
		})
	},
	{
		header: "Department",
		render: (e) => e.department
	},
	{
		header: "Role",
		render: (e) => e.role
	},
	{
		header: "Shift",
		render: (e) => e.shift
	},
	{
		header: "Phone",
		render: (e) => e.phone || "—"
	},
	{
		header: "Status",
		render: (e) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
			variant: STATUS_VARIANT[e.status],
			children: e.status
		})
	}
];
var DEPARTMENTS = [
	"Front Desk",
	"Housekeeping",
	"Maintenance",
	"Kitchen",
	"Restaurant",
	"Accounting",
	"HR",
	"Management",
	"Inventory",
	"Security"
];
function EmployeesPage() {
	const [search, setSearch] = (0, import_react.useState)("");
	const [dialogOpen, setDialogOpen] = (0, import_react.useState)(false);
	const { data, isLoading, isError } = employeesApi.useList({
		search,
		sort: "name"
	});
	const createEmployee = employeesApi.useCreate();
	const employees = data?.data ?? [];
	const stats = {
		Employees: data?.total ?? "—",
		"On duty": employees.filter((e) => e.status === "Active").length,
		"On leave": employees.filter((e) => e.status === "OnLeave").length,
		Departments: new Set(employees.map((e) => e.department)).size
	};
	async function handleCreate(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const payload = {
			name: String(form.get("name")),
			department: String(form.get("department")),
			role: String(form.get("role")),
			shift: String(form.get("shift")),
			phone: String(form.get("phone") || ""),
			email: String(form.get("email") || "")
		};
		try {
			await createEmployee.mutateAsync(payload);
			toast.success("Employee added");
			setDialogOpen(false);
			e.currentTarget.reset();
		} catch (err) {
			toast.error(err instanceof ApiError ? err.message : "Failed to add employee");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModulePage, {
		title: "Employee Management",
		description: "Staff directory with departments, roles, schedules and employment status.",
		action: "Add employee",
		onAction: () => setDialogOpen(true),
		stats: [
			"Employees",
			"On duty",
			"On leave",
			"Departments"
		],
		statValues: stats,
		columns: columns.map((c) => c.header),
		capabilities: [
			"Staff profiles",
			"Departments",
			"Job roles",
			"Work schedules",
			"Staff status"
		],
		table: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LiveDataTable, {
			columns,
			rows: employees,
			isLoading,
			isError,
			search,
			onSearchChange: setSearch,
			recordCount: data?.total,
			emptyTitle: "No employees yet",
			emptyHint: "Add your first staff member to get started."
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
		open: dialogOpen,
		onOpenChange: setDialogOpen,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Add employee" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleCreate,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "name",
						children: "Full name"
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
							htmlFor: "department",
							children: "Department"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							name: "department",
							required: true,
							defaultValue: DEPARTMENTS[0],
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "department",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: DEPARTMENTS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: d,
								children: d
							}, d)) })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "role",
							children: "Role"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "role",
							name: "role",
							placeholder: "e.g. Receptionist",
							required: true
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "shift",
							children: "Shift"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							name: "shift",
							required: true,
							defaultValue: "Morning",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								id: "shift",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContent, { children: [
								"Morning",
								"Afternoon",
								"Night"
							].map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
								value: s,
								children: s
							}, s)) })]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "phone",
							children: "Phone"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "phone",
							name: "phone"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "email",
						children: "Email"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "email",
						name: "email",
						type: "email"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: createEmployee.isPending,
					children: createEmployee.isPending ? "Adding…" : "Add employee"
				}) })
			]
		})] })
	})] });
}
//#endregion
export { EmployeesPage as component };
