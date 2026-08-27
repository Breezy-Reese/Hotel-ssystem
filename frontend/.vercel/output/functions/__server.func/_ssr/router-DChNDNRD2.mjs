import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { A as ConciergeBell, B as Boxes, C as IdCard, D as FolderOpen, E as Gift, H as BedDouble, I as CalendarRange, L as CalendarCheck, O as FingerprintPattern, P as ChefHat, R as Calculator, T as HandPlatter, U as BadgePercent, V as Bell, _ as PanelLeft, a as Users, b as ListChecks, c as Table2, d as ShoppingCart, f as ShieldCheck, h as ReceiptText, i as UtensilsCrossed, j as ClipboardList, k as CreditCard, l as Star, m as ScrollText, n as Wrench, o as Truck, p as Search, r as Wallet, s as TrendingUp, t as X, u as Sparkles, v as LogOut, w as Hotel, x as LayoutDashboard, z as Building2 } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { r as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { _ as useNavigate, c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRouteWithContext, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts, v as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as Root } from "../_libs/radix-ui__react-separator.mjs";
import { a as Trigger, i as Root3, n as Portal, r as Provider, t as Content2 } from "../_libs/radix-ui__react-tooltip.mjs";
import { a as api, c as getStoredUser, d as setSession, i as Input, l as getToken, o as clearSession, r as Button, s as cn, u as onUnauthorized } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-DChNDNRD.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var navGroups = [
	{
		label: "Overview",
		items: [{
			title: "Dashboard",
			url: "/",
			icon: LayoutDashboard
		}, {
			title: "Branches",
			url: "/branches",
			icon: Building2
		}]
	},
	{
		label: "Hotel",
		items: [
			{
				title: "Rooms",
				url: "/rooms",
				icon: BedDouble
			},
			{
				title: "Reservations",
				url: "/reservations",
				icon: CalendarCheck
			},
			{
				title: "Guests",
				url: "/guests",
				icon: Users
			},
			{
				title: "Front Desk",
				url: "/front-desk",
				icon: ConciergeBell
			},
			{
				title: "Housekeeping",
				url: "/housekeeping",
				icon: Sparkles
			},
			{
				title: "Maintenance",
				url: "/maintenance",
				icon: Wrench
			}
		]
	},
	{
		label: "Restaurant",
		items: [
			{
				title: "Menu",
				url: "/menu",
				icon: UtensilsCrossed
			},
			{
				title: "Orders",
				url: "/orders",
				icon: ClipboardList
			},
			{
				title: "Tables",
				url: "/tables",
				icon: Table2
			},
			{
				title: "Kitchen",
				url: "/kitchen",
				icon: ChefHat
			},
			{
				title: "POS",
				url: "/pos",
				icon: Calculator
			}
		]
	},
	{
		label: "Finance",
		items: [
			{
				title: "Payments",
				url: "/payments",
				icon: CreditCard
			},
			{
				title: "Invoices",
				url: "/invoices",
				icon: ReceiptText
			},
			{
				title: "Expenses",
				url: "/expenses",
				icon: Wallet
			},
			{
				title: "Reports",
				url: "/reports",
				icon: TrendingUp
			}
		]
	},
	{
		label: "Supply Chain",
		items: [
			{
				title: "Inventory",
				url: "/inventory",
				icon: Boxes
			},
			{
				title: "Suppliers",
				url: "/suppliers",
				icon: Truck
			},
			{
				title: "Purchases",
				url: "/purchases",
				icon: ShoppingCart
			}
		]
	},
	{
		label: "Guest Services",
		items: [
			{
				title: "Services",
				url: "/services",
				icon: HandPlatter
			},
			{
				title: "Service Bookings",
				url: "/service-bookings",
				icon: CalendarRange
			},
			{
				title: "Reviews",
				url: "/reviews",
				icon: Star
			},
			{
				title: "Notifications",
				url: "/notifications",
				icon: Bell
			}
		]
	},
	{
		label: "Staff",
		items: [
			{
				title: "Employees",
				url: "/employees",
				icon: IdCard
			},
			{
				title: "Attendance",
				url: "/attendance",
				icon: FingerprintPattern
			},
			{
				title: "Tasks",
				url: "/tasks",
				icon: ListChecks
			}
		]
	},
	{
		label: "Growth",
		items: [{
			title: "Promotions",
			url: "/promotions",
			icon: BadgePercent
		}, {
			title: "Loyalty",
			url: "/loyalty",
			icon: Gift
		}]
	},
	{
		label: "Administration",
		items: [
			{
				title: "Users & Roles",
				url: "/users",
				icon: ShieldCheck
			},
			{
				title: "Audit Logs",
				url: "/audit-logs",
				icon: ScrollText
			},
			{
				title: "Documents",
				url: "/documents",
				icon: FolderOpen
			}
		]
	}
];
var MOBILE_BREAKPOINT = 768;
function useIsMobile() {
	const [isMobile, setIsMobile] = import_react.useState(void 0);
	import_react.useEffect(() => {
		const mql = window.matchMedia(`(max-width: 767px)`);
		const onChange = () => {
			setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		};
		mql.addEventListener("change", onChange);
		setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
		return () => mql.removeEventListener("change", onChange);
	}, []);
	return !!isMobile;
}
var Separator = import_react.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root, {
	ref,
	decorative,
	orientation,
	className: cn("shrink-0 bg-border", orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]", className),
	...props
}));
Separator.displayName = Root.displayName;
var Sheet = Dialog;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
var TooltipProvider = Provider;
var Tooltip = Root3;
var TooltipTrigger = Trigger;
var TooltipContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 overflow-hidden rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-tooltip-content-transform-origin)", className),
	...props
}) }));
TooltipContent.displayName = Content2.displayName;
var SIDEBAR_COOKIE_NAME = "sidebar_state";
var SIDEBAR_COOKIE_MAX_AGE = 604800;
var SIDEBAR_WIDTH = "16rem";
var SIDEBAR_WIDTH_MOBILE = "18rem";
var SIDEBAR_WIDTH_ICON = "3rem";
var SIDEBAR_KEYBOARD_SHORTCUT = "b";
var SidebarContext = import_react.createContext(null);
function useSidebar() {
	const context = import_react.useContext(SidebarContext);
	if (!context) throw new Error("useSidebar must be used within a SidebarProvider.");
	return context;
}
var SidebarProvider = import_react.forwardRef(({ defaultOpen = true, open: openProp, onOpenChange: setOpenProp, className, style, children, ...props }, ref) => {
	const isMobile = useIsMobile();
	const [openMobile, setOpenMobile] = import_react.useState(false);
	const [_open, _setOpen] = import_react.useState(defaultOpen);
	const open = openProp ?? _open;
	const setOpen = import_react.useCallback((value) => {
		const openState = typeof value === "function" ? value(open) : value;
		if (setOpenProp) setOpenProp(openState);
		else _setOpen(openState);
		document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
	}, [setOpenProp, open]);
	const toggleSidebar = import_react.useCallback(() => {
		return isMobile ? setOpenMobile((open) => !open) : setOpen((open) => !open);
	}, [
		isMobile,
		setOpen,
		setOpenMobile
	]);
	import_react.useEffect(() => {
		const handleKeyDown = (event) => {
			if (event.key === SIDEBAR_KEYBOARD_SHORTCUT && (event.metaKey || event.ctrlKey)) {
				event.preventDefault();
				toggleSidebar();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [toggleSidebar]);
	const state = open ? "expanded" : "collapsed";
	const contextValue = import_react.useMemo(() => ({
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	}), [
		state,
		open,
		setOpen,
		isMobile,
		openMobile,
		setOpenMobile,
		toggleSidebar
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContext.Provider, {
		value: contextValue,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, {
			delayDuration: 0,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				style: {
					"--sidebar-width": SIDEBAR_WIDTH,
					"--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
					...style
				},
				className: cn("group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar", className),
				ref,
				...props,
				children
			})
		})
	});
});
SidebarProvider.displayName = "SidebarProvider";
var Sidebar = import_react.forwardRef(({ side = "left", variant = "sidebar", collapsible = "offcanvas", className, children, ...props }, ref) => {
	const { isMobile, state, openMobile, setOpenMobile } = useSidebar();
	if (collapsible === "none") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground", className),
		ref,
		...props,
		children
	});
	if (isMobile) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
		open: openMobile,
		onOpenChange: setOpenMobile,
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
			"data-sidebar": "sidebar",
			"data-mobile": "true",
			className: "w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden",
			style: { "--sidebar-width": SIDEBAR_WIDTH_MOBILE },
			side,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, {
				className: "sr-only",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Sidebar" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetDescription, { children: "Displays the mobile sidebar." })]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex h-full w-full flex-col",
				children
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		className: "group peer hidden text-sidebar-foreground md:block",
		"data-state": state,
		"data-collapsible": state === "collapsed" ? collapsible : "",
		"data-variant": variant,
		"data-side": side,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: cn("relative w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear", "group-data-[collapsible=offcanvas]:w-0", "group-data-[side=right]:rotate-180", variant === "floating" || variant === "inset" ? "group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4))]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon)") }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: cn("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex", side === "left" ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]" : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]", variant === "floating" || variant === "inset" ? "p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)_+_theme(spacing.4)_+2px)]" : "group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l", className),
			...props,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				"data-sidebar": "sidebar",
				className: "flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow",
				children
			})
		})]
	});
});
Sidebar.displayName = "Sidebar";
var SidebarTrigger = import_react.forwardRef(({ className, onClick, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
		ref,
		"data-sidebar": "trigger",
		variant: "ghost",
		size: "icon",
		className: cn("h-7 w-7", className),
		onClick: (event) => {
			onClick?.(event);
			toggleSidebar();
		},
		...props,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelLeft, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Toggle Sidebar"
		})]
	});
});
SidebarTrigger.displayName = "SidebarTrigger";
var SidebarRail = import_react.forwardRef(({ className, ...props }, ref) => {
	const { toggleSidebar } = useSidebar();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		ref,
		"data-sidebar": "rail",
		"aria-label": "Toggle Sidebar",
		tabIndex: -1,
		onClick: toggleSidebar,
		title: "Toggle Sidebar",
		className: cn("absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex", "[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize", "[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize", "group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar", "[[data-side=left][data-collapsible=offcanvas]_&]:-right-2", "[[data-side=right][data-collapsible=offcanvas]_&]:-left-2", className),
		...props
	});
});
SidebarRail.displayName = "SidebarRail";
var SidebarInset = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
		ref,
		className: cn("relative flex w-full flex-1 flex-col bg-background", "md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow", className),
		...props
	});
});
SidebarInset.displayName = "SidebarInset";
var SidebarInput = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
		ref,
		"data-sidebar": "input",
		className: cn("h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring", className),
		...props
	});
});
SidebarInput.displayName = "SidebarInput";
var SidebarHeader = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "header",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarHeader.displayName = "SidebarHeader";
var SidebarFooter = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "footer",
		className: cn("flex flex-col gap-2 p-2", className),
		...props
	});
});
SidebarFooter.displayName = "SidebarFooter";
var SidebarSeparator = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator, {
		ref,
		"data-sidebar": "separator",
		className: cn("mx-2 w-auto bg-sidebar-border", className),
		...props
	});
});
SidebarSeparator.displayName = "SidebarSeparator";
var SidebarContent = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "content",
		className: cn("flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden", className),
		...props
	});
});
SidebarContent.displayName = "SidebarContent";
var SidebarGroup = import_react.forwardRef(({ className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref,
		"data-sidebar": "group",
		className: cn("relative flex w-full min-w-0 flex-col p-2", className),
		...props
	});
});
SidebarGroup.displayName = "SidebarGroup";
var SidebarGroupLabel = import_react.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "div", {
		ref,
		"data-sidebar": "group-label",
		className: cn("flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0", className),
		...props
	});
});
SidebarGroupLabel.displayName = "SidebarGroupLabel";
var SidebarGroupAction = import_react.forwardRef(({ className, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "group-action",
		className: cn("absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarGroupAction.displayName = "SidebarGroupAction";
var SidebarGroupContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	"data-sidebar": "group-content",
	className: cn("w-full text-sm", className),
	...props
}));
SidebarGroupContent.displayName = "SidebarGroupContent";
var SidebarMenu = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
	ref,
	"data-sidebar": "menu",
	className: cn("flex w-full min-w-0 flex-col gap-1", className),
	...props
}));
SidebarMenu.displayName = "SidebarMenu";
var SidebarMenuItem = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	ref,
	"data-sidebar": "menu-item",
	className: cn("group/menu-item relative", className),
	...props
}));
SidebarMenuItem.displayName = "SidebarMenuItem";
var sidebarMenuButtonVariants = cva("peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring cursor-pointer transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0", {
	variants: {
		variant: {
			default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
			outline: "bg-background shadow-[0_0_0_1px_var(--sidebar-border)] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_var(--sidebar-accent)]"
		},
		size: {
			default: "h-8 text-sm",
			sm: "h-7 text-xs",
			lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var SidebarMenuButton = import_react.forwardRef(({ asChild = false, isActive = false, variant = "default", size = "default", tooltip, className, ...props }, ref) => {
	const Comp = asChild ? Slot : "button";
	const { isMobile, state } = useSidebar();
	const button = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Comp, {
		ref,
		"data-sidebar": "menu-button",
		"data-size": size,
		"data-active": isActive,
		className: cn(sidebarMenuButtonVariants({
			variant,
			size
		}), className),
		...props
	});
	if (!tooltip) return button;
	if (typeof tooltip === "string") tooltip = { children: tooltip };
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tooltip, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: button
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipContent, {
		side: "right",
		align: "center",
		hidden: state !== "collapsed" || isMobile,
		...tooltip
	})] });
});
SidebarMenuButton.displayName = "SidebarMenuButton";
var SidebarMenuAction = import_react.forwardRef(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		ref,
		"data-sidebar": "menu-action",
		className: cn("absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0", "after:absolute after:-inset-2 after:md:hidden", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", showOnHover && "group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0", className),
		...props
	});
});
SidebarMenuAction.displayName = "SidebarMenuAction";
var SidebarMenuBadge = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	ref,
	"data-sidebar": "menu-badge",
	className: cn("pointer-events-none absolute right-1 flex h-5 min-w-5 select-none items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground", "peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground", "peer-data-[size=sm]/menu-button:top-1", "peer-data-[size=default]/menu-button:top-1.5", "peer-data-[size=lg]/menu-button:top-2.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuBadge.displayName = "SidebarMenuBadge";
var SidebarMenuSkeleton = import_react.forwardRef(({ className, showIcon = false, ...props }, ref) => {
	const width = import_react.useMemo(() => {
		return `${Math.floor(Math.random() * 40) + 50}%`;
	}, []);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		ref,
		"data-sidebar": "menu-skeleton",
		className: cn("flex h-8 items-center gap-2 rounded-md px-2", className),
		...props,
		children: [showIcon && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
			className: "size-4 rounded-md",
			"data-sidebar": "menu-skeleton-icon"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, {
			className: "h-4 max-w-(--skeleton-width) flex-1",
			"data-sidebar": "menu-skeleton-text",
			style: { "--skeleton-width": width }
		})]
	});
});
SidebarMenuSkeleton.displayName = "SidebarMenuSkeleton";
var SidebarMenuSub = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
	ref,
	"data-sidebar": "menu-sub",
	className: cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", className),
	...props
}));
SidebarMenuSub.displayName = "SidebarMenuSub";
var SidebarMenuSubItem = import_react.forwardRef(({ ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", {
	ref,
	...props
}));
SidebarMenuSubItem.displayName = "SidebarMenuSubItem";
var SidebarMenuSubButton = import_react.forwardRef(({ asChild = false, size = "md", isActive, className, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "a", {
		ref,
		"data-sidebar": "menu-sub-button",
		"data-size": size,
		"data-active": isActive,
		className: cn("flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring cursor-pointer hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground", "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground", size === "sm" && "text-xs", size === "md" && "text-sm", "group-data-[collapsible=icon]:hidden", className),
		...props
	});
});
SidebarMenuSubButton.displayName = "SidebarMenuSubButton";
function AppSidebar() {
	const { state } = useSidebar();
	const collapsed = state === "collapsed";
	const currentPath = useRouterState({ select: (r) => r.location.pathname });
	const isActive = (url) => url === "/" ? currentPath === "/" : currentPath.startsWith(url);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sidebar, {
		collapsible: "icon",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarHeader, {
			className: "border-b border-sidebar-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2.5 px-1 py-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "bg-brass flex size-8 shrink-0 items-center justify-center rounded-md text-sidebar-primary-foreground",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Hotel, { className: "size-4" })
				}), !collapsed && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display truncate text-sm leading-tight font-semibold",
						children: "Aurelia Suites"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "truncate text-[11px] text-sidebar-foreground/60",
						children: "Hospitality Suite"
					})]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarContent, { children: navGroups.map((group) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SidebarGroup, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupLabel, { children: group.label }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarGroupContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenu, { children: group.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarMenuButton, {
			asChild: true,
			isActive: isActive(item.url),
			tooltip: item.title,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.url,
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: item.title })]
			})
		}) }, item.url)) }) })] }, group.label)) })]
	});
}
var Toaster$1 = ({ ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
		className: "toaster group",
		toastOptions: { classNames: {
			toast: "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg",
			description: "group-[.toast]:text-muted-foreground",
			actionButton: "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground",
			cancelButton: "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground"
		} },
		...props
	});
};
var styles_default = "/assets/styles-DHH6N70t.css";
var AuthContext = (0, import_react.createContext)(null);
function AuthProvider({ children }) {
	const [user, setUser] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		const token = getToken();
		const storedUser = getStoredUser();
		if (token && storedUser) setUser(storedUser);
		setIsLoading(false);
	}, []);
	(0, import_react.useEffect)(() => onUnauthorized(() => setUser(null)), []);
	async function login(email, password) {
		const res = await api.post("/auth/login", {
			email,
			password
		});
		setSession(res.token, res.data.user);
		setUser(res.data.user);
	}
	function logout() {
		clearSession();
		setUser(null);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthContext.Provider, {
		value: {
			user,
			isAuthenticated: !!user,
			isLoading,
			login,
			logout
		},
		children
	});
}
function useAuth() {
	const ctx = (0, import_react.useContext)(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
	return ctx;
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$33 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "Aurelia Suites — Hotel & Restaurant Management" },
			{
				name: "description",
				content: "Unified hotel, restaurant and hospitality management console for rooms, bookings, dining, finance and staff."
			},
			{
				property: "og:title",
				content: "Aurelia Suites — Hospitality Management System"
			},
			{
				property: "og:description",
				content: "Run rooms, reservations, restaurant, finance, inventory and staff from one console."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Outfit:wght@300;400;500;600&display=swap"
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$33.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client: queryClient,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})]
	});
}
function AppShell() {
	const { isAuthenticated, isLoading, user, logout } = useAuth();
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	const navigate = useNavigate();
	const isLoginRoute = pathname === "/login";
	(0, import_react.useEffect)(() => {
		if (isLoading) return;
		if (!isAuthenticated && !isLoginRoute) navigate({ to: "/login" });
		if (isAuthenticated && isLoginRoute) navigate({ to: "/" });
	}, [
		isLoading,
		isAuthenticated,
		isLoginRoute,
		navigate
	]);
	if (isLoading) return null;
	if (isLoginRoute || !isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-screen w-full bg-background",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppSidebar, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex min-w-0 flex-1 flex-col",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex h-14 items-center gap-3 border-b border-border bg-background/85 px-4 backdrop-blur",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SidebarTrigger, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative hidden w-full max-w-sm items-center sm:flex",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							placeholder: "Search rooms, guests, orders…",
							className: "h-9 pl-8"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "ml-auto flex items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Notifications",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bell, { className: "size-4" })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "bg-brass flex size-8 items-center justify-center rounded-full text-xs font-semibold text-accent-foreground",
								title: user?.name,
								children: user?.name?.[0]?.toUpperCase() ?? "A"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "icon",
								"aria-label": "Sign out",
								onClick: () => logout(),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" })
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "flex-1 p-4 sm:p-6 lg:p-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {})
			})]
		})]
	}) });
}
var $$splitComponentImporter$32 = () => import("./routes-w5_-6LAD.mjs");
var Route$32 = createFileRoute("/")({
	head: () => ({ meta: [
		{ title: "Dashboard — Aurelia Suites Hospitality System" },
		{
			name: "description",
			content: "Live overview of occupancy, bookings, restaurant sales and revenue across the property."
		},
		{
			property: "og:title",
			content: "Dashboard — Aurelia Suites Hospitality System"
		},
		{
			property: "og:description",
			content: "Live overview of occupancy, bookings, restaurant sales and revenue."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$32, "component")
});
var $$splitComponentImporter$31 = () => import("./attendance-DikX9lmK.mjs");
var Route$31 = createFileRoute("/attendance")({
	head: () => ({ meta: [{ title: "Staff Attendance — Aurelia Suites" }, {
		name: "description",
		content: "Clock staff in and out, and review attendance history."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$31, "component")
});
var $$splitComponentImporter$30 = () => import("./audit-logs-S-ueIQBA.mjs");
var Route$30 = createFileRoute("/audit-logs")({
	head: () => ({ meta: [{ title: "Audit Logs — Aurelia Suites" }, {
		name: "description",
		content: "Every create, update, delete and login event, automatically recorded."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$30, "component")
});
var $$splitComponentImporter$29 = () => import("./branches-C233o2tq.mjs");
var Route$29 = createFileRoute("/branches")({
	head: () => ({ meta: [{ title: "Branch Management — Aurelia Suites" }, {
		name: "description",
		content: "Manage every property location, its rooms, staff and status."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$29, "component")
});
var $$splitComponentImporter$28 = () => import("./documents-B9KdjR4_.mjs");
var Route$28 = createFileRoute("/documents")({
	head: () => ({ meta: [{ title: "Document Management — Aurelia Suites" }, {
		name: "description",
		content: "Store and manage guest documents, staff files and policies."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$28, "component")
});
var $$splitComponentImporter$27 = () => import("./employees-BNd9TRZP.mjs");
var Route$27 = createFileRoute("/employees")({
	head: () => ({ meta: [{ title: "Employee Management — Aurelia Suites" }, {
		name: "description",
		content: "Staff directory with departments, roles, schedules and employment status."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$27, "component")
});
var $$splitComponentImporter$26 = () => import("./expenses-BN83M7Gs.mjs");
var Route$26 = createFileRoute("/expenses")({
	head: () => ({ meta: [{ title: "Expense Management — Aurelia Suites" }, {
		name: "description",
		content: "Track operating expenses, categories and supplier payments."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$26, "component")
});
var $$splitComponentImporter$25 = () => import("./front-desk-DsVKC_dX.mjs");
var Route$25 = createFileRoute("/front-desk")({
	head: () => ({ meta: [{ title: "Front Desk — Aurelia Suites" }, {
		name: "description",
		content: "Today's arrivals, departures and guest folios."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$25, "component")
});
var $$splitComponentImporter$24 = () => import("./guests-mJzjwoN5.mjs");
var Route$24 = createFileRoute("/guests")({
	head: () => ({ meta: [{ title: "Guest Management — Aurelia Suites" }, {
		name: "description",
		content: "Guest profiles, contact details, stay history, preferences and special requests."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$24, "component")
});
var $$splitComponentImporter$23 = () => import("./housekeeping-BU8tVlID.mjs");
var Route$23 = createFileRoute("/housekeeping")({
	head: () => ({ meta: [{ title: "Housekeeping — Aurelia Suites" }, {
		name: "description",
		content: "Daily cleaning schedules, staff assignment, room readiness and damage reports."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$23, "component")
});
var $$splitComponentImporter$22 = () => import("./inventory-B_AkjFYt.mjs");
var Route$22 = createFileRoute("/inventory")({
	head: () => ({ meta: [{ title: "Inventory Management — Aurelia Suites" }, {
		name: "description",
		content: "Track stock levels, reorder thresholds and stock value across categories."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$22, "component")
});
var $$splitComponentImporter$21 = () => import("./invoices-Cr0iRv-c.mjs");
var Route$21 = createFileRoute("/invoices")({
	head: () => ({ meta: [{ title: "Billing & Invoicing — Aurelia Suites" }, {
		name: "description",
		content: "Consolidated folios: room, restaurant, room service, extras, taxes and discounts."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$21, "component")
});
var $$splitComponentImporter$20 = () => import("./kitchen-B7qHeHsO.mjs");
var Route$20 = createFileRoute("/kitchen")({
	head: () => ({ meta: [{ title: "Kitchen Display — Aurelia Suites" }, {
		name: "description",
		content: "Live ticket queue for the kitchen — pending, preparing and ready orders."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$20, "component")
});
var $$splitComponentImporter$19 = () => import("./login-Cas8nTJx.mjs");
var Route$19 = createFileRoute("/login")({
	head: () => ({ meta: [{ title: "Sign in — Aurelia Suites" }] }),
	component: lazyRouteComponent($$splitComponentImporter$19, "component")
});
var $$splitComponentImporter$18 = () => import("./loyalty-BUUH46Ra.mjs");
var Route$18 = createFileRoute("/loyalty")({
	head: () => ({ meta: [{ title: "Loyalty & Rewards — Aurelia Suites" }, {
		name: "description",
		content: "Manage guest loyalty tiers, points balances and redemptions."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$18, "component")
});
var $$splitComponentImporter$17 = () => import("./maintenance-CIeJaX3r.mjs");
var Route$17 = createFileRoute("/maintenance")({
	head: () => ({ meta: [{ title: "Maintenance — Aurelia Suites" }, {
		name: "description",
		content: "Log, assign and resolve maintenance tickets across rooms and common areas."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$17, "component")
});
var $$splitComponentImporter$16 = () => import("./menu-3hzYUkhQ.mjs");
var Route$16 = createFileRoute("/menu")({
	head: () => ({ meta: [{ title: "Menu Management — Aurelia Suites" }, {
		name: "description",
		content: "Food and drink catalogue with categories, pricing, images, availability and offers."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$16, "component")
});
var $$splitComponentImporter$15 = () => import("./notifications-BAcmYLn8.mjs");
var Route$15 = createFileRoute("/notifications")({
	head: () => ({ meta: [{ title: "Notifications — Aurelia Suites" }, {
		name: "description",
		content: "Send announcements and alerts to staff and guests."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$15, "component")
});
var $$splitComponentImporter$14 = () => import("./orders-CJ24IYxC.mjs");
var Route$14 = createFileRoute("/orders")({
	head: () => ({ meta: [{ title: "Restaurant Orders — Aurelia Suites" }, {
		name: "description",
		content: "Dine-in, takeaway and room-service orders with full status tracking."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$14, "component")
});
var $$splitComponentImporter$13 = () => import("./payments-B7aN15QB.mjs");
var Route$13 = createFileRoute("/payments")({
	head: () => ({ meta: [{ title: "Payment Management — Aurelia Suites" }, {
		name: "description",
		content: "All payment transactions across reservations, orders and services."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$13, "component")
});
var $$splitComponentImporter$12 = () => import("./pos-ummKUqEo.mjs");
var Route$12 = createFileRoute("/pos")({
	head: () => ({ meta: [{ title: "Restaurant POS — Aurelia Suites" }, {
		name: "description",
		content: "Point-of-sale receipts, discounts and payment methods."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$12, "component")
});
var $$splitComponentImporter$11 = () => import("./promotions-g55PhEP7.mjs");
var Route$11 = createFileRoute("/promotions")({
	head: () => ({ meta: [{ title: "Promotions & Discounts — Aurelia Suites" }, {
		name: "description",
		content: "Create and schedule promo codes across rooms, menu and services."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$11, "component")
});
var $$splitComponentImporter$10 = () => import("./purchases-CV9FDETk.mjs");
var Route$10 = createFileRoute("/purchases")({
	head: () => ({ meta: [{ title: "Purchase Management — Aurelia Suites" }, {
		name: "description",
		content: "Create purchase orders and receive stock from suppliers."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$10, "component")
});
var $$splitComponentImporter$9 = () => import("./reports-DPyMYAie.mjs");
var Route$9 = createFileRoute("/reports")({
	head: () => ({ meta: [{ title: "Revenue & Financial Reports — Aurelia Suites" }, {
		name: "description",
		content: "Hotel and restaurant revenue, expenses and profit by period."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$9, "component")
});
var $$splitComponentImporter$8 = () => import("./reservations-BAHdWSet.mjs");
var Route$8 = createFileRoute("/reservations")({
	head: () => ({ meta: [{ title: "Reservations & Booking — Aurelia Suites" }, {
		name: "description",
		content: "Book, confirm, check guests in and out, and manage cancellations across all branches."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./reviews-C_CvI5bq.mjs");
var Route$7 = createFileRoute("/reviews")({
	head: () => ({ meta: [{ title: "Reviews & Feedback — Aurelia Suites" }, {
		name: "description",
		content: "Collect and act on guest feedback for rooms, meals and services."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./rooms-B_ifr2UZ.mjs");
var Route$6 = createFileRoute("/rooms")({
	head: () => ({ meta: [
		{ title: "Room Management — Aurelia Suites" },
		{
			name: "description",
			content: "Create and maintain room inventory: types, pricing, capacity, amenities and live status."
		},
		{
			property: "og:title",
			content: "Room Management — Aurelia Suites"
		},
		{
			property: "og:description",
			content: "Create and maintain room inventory: types, pricing, capacity, amenities and live status."
		}
	] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./service-bookings-BPi12ALl.mjs");
var Route$5 = createFileRoute("/service-bookings")({
	head: () => ({ meta: [{ title: "Service Bookings — Aurelia Suites" }, {
		name: "description",
		content: "Schedule and track guest bookings for hotel services."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./services-mZMmc5pR.mjs");
var Route$4 = createFileRoute("/services")({
	head: () => ({ meta: [{ title: "Hotel Services — Aurelia Suites" }, {
		name: "description",
		content: "Manage bookable hotel services: spa, laundry, transport and more."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./suppliers-D5KiyalC.mjs");
var Route$3 = createFileRoute("/suppliers")({
	head: () => ({ meta: [{ title: "Supplier Management — Aurelia Suites" }, {
		name: "description",
		content: "Manage vendor contacts, products supplied and outstanding balances."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("./tables-DDNLRQhe.mjs");
var Route$2 = createFileRoute("/tables")({
	head: () => ({ meta: [{ title: "Table Management — Aurelia Suites" }, {
		name: "description",
		content: "Track restaurant table capacity, sections and live availability."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./tasks-CrU4Tth-.mjs");
var Route$1 = createFileRoute("/tasks")({
	head: () => ({ meta: [{ title: "Task Management — Aurelia Suites" }, {
		name: "description",
		content: "Assign, track and complete operational tasks across departments."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("./users-Chlq7Q2v.mjs");
var Route = createFileRoute("/users")({
	head: () => ({ meta: [{ title: "Users & Roles — Aurelia Suites" }, {
		name: "description",
		content: "Manage staff accounts, roles and branch assignments."
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$32.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$33
	}),
	AttendanceRoute: Route$31.update({
		id: "/attendance",
		path: "/attendance",
		getParentRoute: () => Route$33
	}),
	AuditLogsRoute: Route$30.update({
		id: "/audit-logs",
		path: "/audit-logs",
		getParentRoute: () => Route$33
	}),
	BranchesRoute: Route$29.update({
		id: "/branches",
		path: "/branches",
		getParentRoute: () => Route$33
	}),
	DocumentsRoute: Route$28.update({
		id: "/documents",
		path: "/documents",
		getParentRoute: () => Route$33
	}),
	EmployeesRoute: Route$27.update({
		id: "/employees",
		path: "/employees",
		getParentRoute: () => Route$33
	}),
	ExpensesRoute: Route$26.update({
		id: "/expenses",
		path: "/expenses",
		getParentRoute: () => Route$33
	}),
	FrontDeskRoute: Route$25.update({
		id: "/front-desk",
		path: "/front-desk",
		getParentRoute: () => Route$33
	}),
	GuestsRoute: Route$24.update({
		id: "/guests",
		path: "/guests",
		getParentRoute: () => Route$33
	}),
	HousekeepingRoute: Route$23.update({
		id: "/housekeeping",
		path: "/housekeeping",
		getParentRoute: () => Route$33
	}),
	InventoryRoute: Route$22.update({
		id: "/inventory",
		path: "/inventory",
		getParentRoute: () => Route$33
	}),
	InvoicesRoute: Route$21.update({
		id: "/invoices",
		path: "/invoices",
		getParentRoute: () => Route$33
	}),
	KitchenRoute: Route$20.update({
		id: "/kitchen",
		path: "/kitchen",
		getParentRoute: () => Route$33
	}),
	LoginRoute: Route$19.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$33
	}),
	LoyaltyRoute: Route$18.update({
		id: "/loyalty",
		path: "/loyalty",
		getParentRoute: () => Route$33
	}),
	MaintenanceRoute: Route$17.update({
		id: "/maintenance",
		path: "/maintenance",
		getParentRoute: () => Route$33
	}),
	MenuRoute: Route$16.update({
		id: "/menu",
		path: "/menu",
		getParentRoute: () => Route$33
	}),
	NotificationsRoute: Route$15.update({
		id: "/notifications",
		path: "/notifications",
		getParentRoute: () => Route$33
	}),
	OrdersRoute: Route$14.update({
		id: "/orders",
		path: "/orders",
		getParentRoute: () => Route$33
	}),
	PaymentsRoute: Route$13.update({
		id: "/payments",
		path: "/payments",
		getParentRoute: () => Route$33
	}),
	PosRoute: Route$12.update({
		id: "/pos",
		path: "/pos",
		getParentRoute: () => Route$33
	}),
	PromotionsRoute: Route$11.update({
		id: "/promotions",
		path: "/promotions",
		getParentRoute: () => Route$33
	}),
	PurchasesRoute: Route$10.update({
		id: "/purchases",
		path: "/purchases",
		getParentRoute: () => Route$33
	}),
	ReportsRoute: Route$9.update({
		id: "/reports",
		path: "/reports",
		getParentRoute: () => Route$33
	}),
	ReservationsRoute: Route$8.update({
		id: "/reservations",
		path: "/reservations",
		getParentRoute: () => Route$33
	}),
	ReviewsRoute: Route$7.update({
		id: "/reviews",
		path: "/reviews",
		getParentRoute: () => Route$33
	}),
	RoomsRoute: Route$6.update({
		id: "/rooms",
		path: "/rooms",
		getParentRoute: () => Route$33
	}),
	ServiceBookingsRoute: Route$5.update({
		id: "/service-bookings",
		path: "/service-bookings",
		getParentRoute: () => Route$33
	}),
	ServicesRoute: Route$4.update({
		id: "/services",
		path: "/services",
		getParentRoute: () => Route$33
	}),
	SuppliersRoute: Route$3.update({
		id: "/suppliers",
		path: "/suppliers",
		getParentRoute: () => Route$33
	}),
	TablesRoute: Route$2.update({
		id: "/tables",
		path: "/tables",
		getParentRoute: () => Route$33
	}),
	TasksRoute: Route$1.update({
		id: "/tasks",
		path: "/tasks",
		getParentRoute: () => Route$33
	}),
	UsersRoute: Route.update({
		id: "/users",
		path: "/users",
		getParentRoute: () => Route$33
	})
};
var routeTree = Route$33._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
var getRouter = () => {
	const queryClient = new QueryClient();
	return createRouter({
		routeTree,
		context: { queryClient },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { useAuth as i, navGroups as n, router_exports as r, getRouter as t };
