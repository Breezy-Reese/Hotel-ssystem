import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-QVwyGgVH.mjs";
import { S as Inbox, g as Plus, y as LoaderCircle } from "../_libs/lucide-react.mjs";
import { i as Input, r as Button, s as cn } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/live-data-table-DGgBNISO.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Table = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: "relative w-full overflow-auto",
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
		ref,
		className: cn("w-full caption-bottom text-sm", className),
		...props
	})
}));
Table.displayName = "Table";
var TableHeader = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
	ref,
	className: cn("[&_tr]:border-b", className),
	...props
}));
TableHeader.displayName = "TableHeader";
var TableBody = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
	ref,
	className: cn("[&_tr:last-child]:border-0", className),
	...props
}));
TableBody.displayName = "TableBody";
var TableFooter = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tfoot", {
	ref,
	className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
	...props
}));
TableFooter.displayName = "TableFooter";
var TableRow = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tr", {
	ref,
	className: cn("border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted", className),
	...props
}));
TableRow.displayName = "TableRow";
var TableHead = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
	ref,
	className: cn("h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableHead.displayName = "TableHead";
var TableCell = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
	ref,
	className: cn("p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]", className),
	...props
}));
TableCell.displayName = "TableCell";
var TableCaption = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("caption", {
	ref,
	className: cn("mt-4 text-sm text-muted-foreground", className),
	...props
}));
TableCaption.displayName = "TableCaption";
function PageHeader({ title, description, action, onAction }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-wrap items-end justify-between gap-4 border-b border-border pb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-2xl",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold tracking-tight",
				children: title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1.5 text-sm text-muted-foreground",
				children: description
			})]
		}), action && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			onClick: onAction,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), action]
		})]
	});
}
function StatGrid({ stats, values, hint }) {
	if (!stats.length) return null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
		children: stats.map((label) => {
			const value = values?.[label];
			const hasValue = value !== void 0;
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "shadow-card",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
					className: "pb-2",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: label
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: hasValue ? "font-display text-3xl font-semibold text-foreground" : "font-display text-3xl font-semibold text-muted-foreground/40",
					children: hasValue ? value : "—"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-muted-foreground",
					children: hasValue ? hint ?? "" : "Awaiting data source"
				})] })]
			}, label);
		})
	});
}
function DataTableShell({ columns, emptyTitle, emptyHint, toolbar = true }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-card overflow-hidden",
		children: [toolbar && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-wrap items-center gap-3 border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search records…",
				className: "max-w-xs"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted-foreground",
				children: "0 records"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
				className: "bg-muted/50",
				children: columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: "text-xs tracking-wide uppercase",
					children: c
				}, c))
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableBody, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
				className: "hover:bg-transparent",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
					colSpan: columns.length,
					className: "py-16 text-center",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "mx-auto size-8 text-muted-foreground/40" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm font-medium",
							children: emptyTitle
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-1 max-w-md text-xs text-muted-foreground",
							children: emptyHint
						})
					]
				})
			}) })] })
		})]
	});
}
function FeatureChecklist({ title, items }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-card",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
			className: "text-sm",
			children: title
		}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "flex flex-wrap gap-2",
			children: items.map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "rounded-full border border-border bg-secondary px-3 py-1 text-xs text-secondary-foreground",
				children: i
			}, i))
		})]
	});
}
function ModulePage({ title, description, action, onAction, stats = [], statValues, columns, emptyTitle = "No records yet", emptyHint = "Connect your backend and this table will populate automatically.", capabilities = [], children, table }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PageHeader, {
				title,
				description,
				action,
				onAction
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatGrid, {
				stats,
				values: statValues
			}),
			children,
			table ?? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DataTableShell, {
				columns,
				emptyTitle,
				emptyHint
			}),
			capabilities.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FeatureChecklist, {
				title: "Module capabilities",
				items: capabilities
			})
		]
	});
}
function LiveDataTable({ columns, rows, isLoading, isError, emptyTitle = "No records yet", emptyHint = "Records will appear here once created.", search, onSearchChange, recordCount, rowActions }) {
	const [localSearch, setLocalSearch] = (0, import_react.useState)("");
	const searchValue = search ?? localSearch;
	const setSearchValue = onSearchChange ?? setLocalSearch;
	const totalColumns = columns.length + (rowActions ? 1 : 0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "shadow-card overflow-hidden",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex flex-wrap items-center gap-3 border-b border-border",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				placeholder: "Search records…",
				className: "max-w-xs",
				value: searchValue,
				onChange: (e) => setSearchValue(e.target.value)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "text-xs text-muted-foreground",
				children: [
					recordCount ?? rows.length,
					" record",
					(recordCount ?? rows.length) === 1 ? "" : "s"
				]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
			className: "p-0",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Table, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, {
				className: "bg-muted/50",
				children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, {
					className: c.className ?? "text-xs tracking-wide uppercase",
					children: c.header
				}, c.header)), rowActions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableHead, { className: "text-xs tracking-wide uppercase" })]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableBody, { children: [
				isLoading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
					className: "hover:bg-transparent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						colSpan: totalColumns,
						className: "py-16 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "mx-auto size-6 animate-spin text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm text-muted-foreground",
							children: "Loading…"
						})]
					})
				}),
				!isLoading && isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
					className: "hover:bg-transparent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						colSpan: totalColumns,
						className: "py-16 text-center",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium text-destructive",
							children: "Couldn't load data"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mx-auto mt-1 max-w-md text-xs text-muted-foreground",
							children: "Check that the backend is running and reachable at your configured API URL."
						})]
					})
				}),
				!isLoading && !isError && rows.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableRow, {
					className: "hover:bg-transparent",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableCell, {
						colSpan: totalColumns,
						className: "py-16 text-center",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Inbox, { className: "mx-auto size-8 text-muted-foreground/40" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm font-medium",
								children: emptyTitle
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mx-auto mt-1 max-w-md text-xs text-muted-foreground",
								children: emptyHint
							})
						]
					})
				}),
				!isLoading && !isError && rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TableRow, { children: [columns.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, { children: c.render(row) }, c.header)), rowActions && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TableCell, {
					className: "text-right",
					children: rowActions(row)
				})] }, row._id ?? row.id))
			] })] })
		})]
	});
}
//#endregion
export { ModulePage as n, PageHeader as r, LiveDataTable as t };
