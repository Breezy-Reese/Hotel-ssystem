import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { r as Slot, s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { r as router_exports } from "./router-DChNDNRD2.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-ZbSbuw8R.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground shadow hover:bg-primary/90",
			destructive: "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
			outline: "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
			secondary: "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
			ghost: "hover:bg-accent hover:text-accent-foreground",
			link: "text-primary underline-offset-4 hover:underline"
		},
		size: {
			default: "h-9 px-4 py-2",
			sm: "h-8 rounded-md px-3 text-xs",
			lg: "h-10 rounded-md px-8",
			icon: "h-9 w-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
var Input = import_react.forwardRef(({ className, type, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type,
		className: cn("flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm", className),
		ref,
		...props
	});
});
Input.displayName = "Input";
var API_URL = {
	"BASE_URL": "/",
	"DEV": false,
	"MODE": "production",
	"PROD": true,
	"SSR": true,
	"TSS_DEV_SERVER": "false",
	"TSS_DEV_SSR_STYLES_BASEPATH": "/",
	"TSS_DEV_SSR_STYLES_ENABLED": "true",
	"TSS_DISABLE_CSRF_MIDDLEWARE_WARNING": "false",
	"TSS_INLINE_CSS_ENABLED": "false",
	"TSS_ROUTER_BASEPATH": "",
	"TSS_SERVER_FN_BASE": "/_serverFn/",
	"VITE_API_URL": "http://localhost:5000/api/v1"
}["VITE_API_URL"] ?? "http://localhost:5000/api/v1";
var TOKEN_KEY = "aurelia_token";
var USER_KEY = "aurelia_user";
var ApiError = class extends Error {
	status;
	constructor(message, status) {
		super(message);
		this.name = "ApiError";
		this.status = status;
	}
};
function getToken() {
	if (typeof window === "undefined") return null;
	return localStorage.getItem(TOKEN_KEY);
}
function setSession(token, user) {
	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(USER_KEY, JSON.stringify(user));
}
function clearSession() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(USER_KEY);
}
function getStoredUser() {
	if (typeof window === "undefined") return null;
	const raw = localStorage.getItem(USER_KEY);
	return raw ? JSON.parse(raw) : null;
}
var UNAUTHORIZED_EVENT = "auth:unauthorized";
function onUnauthorized(handler) {
	if (typeof window === "undefined") return () => {};
	window.addEventListener(UNAUTHORIZED_EVENT, handler);
	return () => window.removeEventListener(UNAUTHORIZED_EVENT, handler);
}
async function request(path, options = {}) {
	const token = getToken();
	const res = await fetch(`${API_URL}${path}`, {
		...options,
		headers: {
			"Content-Type": "application/json",
			...token ? { Authorization: `Bearer ${token}` } : {},
			...options.headers
		}
	});
	const body = (res.headers.get("content-type") ?? "").includes("application/json") ? await res.json() : null;
	if (!res.ok) {
		if (res.status === 401 && typeof window !== "undefined") {
			clearSession();
			window.dispatchEvent(new Event(UNAUTHORIZED_EVENT));
		}
		throw new ApiError(body?.message ?? res.statusText, res.status);
	}
	return body;
}
function withBody(method, data) {
	return data !== void 0 ? {
		method,
		body: JSON.stringify(data)
	} : { method };
}
var api = {
	get: (path) => request(path),
	post: (path, data) => request(path, withBody("POST", data)),
	patch: (path, data) => request(path, withBody("PATCH", data)),
	delete: (path) => request(path, { method: "DELETE" })
};
//#endregion
export { api as a, getStoredUser as c, setSession as d, Input as i, getToken as l, ApiError as n, clearSession as o, Button as r, cn as s, router_exports as t, onUnauthorized as u };
