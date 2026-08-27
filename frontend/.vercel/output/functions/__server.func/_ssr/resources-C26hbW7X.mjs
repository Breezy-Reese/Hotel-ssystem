import { o as keepPreviousData } from "../_libs/tanstack__query-core.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { a as api } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/resources-C26hbW7X.js
function toQueryString(params) {
	if (!params) return "";
	const entries = Object.entries(params).filter(([, v]) => v !== void 0 && v !== "");
	if (!entries.length) return "";
	return "?" + new URLSearchParams(entries.map(([k, v]) => [k, String(v)])).toString();
}
/**
* Wires up list/detail/create/update/remove TanStack Query hooks for a single
* backend resource in one call. Usage:
*
*   export const roomsApi = createResource<Room>("/rooms", "rooms");
*
*   const { data, isLoading } = roomsApi.useList({ search, status: "Available" });
*   const createRoom = roomsApi.useCreate();
*   createRoom.mutate({ roomNumber: "204", ... });
*/
function createResource(basePath, queryKey) {
	function useList(params) {
		return useQuery({
			queryKey: [
				queryKey,
				"list",
				params
			],
			queryFn: () => api.get(`${basePath}${toQueryString(params)}`),
			placeholderData: keepPreviousData
		});
	}
	function useOne(id) {
		return useQuery({
			queryKey: [
				queryKey,
				"detail",
				id
			],
			queryFn: () => api.get(`${basePath}/${id}`),
			enabled: !!id
		});
	}
	function useCreate() {
		const qc = useQueryClient();
		return useMutation({
			mutationFn: (payload) => api.post(basePath, payload),
			onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] })
		});
	}
	function useUpdate() {
		const qc = useQueryClient();
		return useMutation({
			mutationFn: ({ id, payload }) => api.patch(`${basePath}/${id}`, payload),
			onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] })
		});
	}
	function useRemove() {
		const qc = useQueryClient();
		return useMutation({
			mutationFn: (id) => api.delete(`${basePath}/${id}`),
			onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] })
		});
	}
	function useAction(method, pathFor) {
		const qc = useQueryClient();
		return useMutation({
			mutationFn: ({ id, payload }) => api[method](pathFor(id), payload),
			onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] })
		});
	}
	return {
		useList,
		useOne,
		useCreate,
		useUpdate,
		useRemove,
		useAction
	};
}
var branchesApi = createResource("/branches", "branches");
var roomsApi = createResource("/rooms", "rooms");
var guestsApi = createResource("/guests", "guests");
var reservationsApi = createResource("/reservations", "reservations");
var menuItemsApi = createResource("/menu-items", "menu-items");
var ordersApi = createResource("/orders", "orders");
var tablesApi = createResource("/tables", "tables");
var salesApi = createResource("/sales", "sales");
var invoicesApi = createResource("/invoices", "invoices");
var paymentsApi = createResource("/payments", "payments");
var expensesApi = createResource("/expenses", "expenses");
var employeesApi = createResource("/employees", "employees");
var housekeepingApi = createResource("/housekeeping", "housekeeping");
var maintenanceApi = createResource("/maintenance", "maintenance");
var inventoryApi = createResource("/inventory", "inventory");
var suppliersApi = createResource("/suppliers", "suppliers");
var purchasesApi = createResource("/purchases", "purchases");
var servicesApi = createResource("/services", "services");
var serviceBookingsApi = createResource("/service-bookings", "service-bookings");
var reviewsApi = createResource("/reviews", "reviews");
var notificationsApi = createResource("/notifications", "notifications");
var attendanceApi = createResource("/attendance", "attendance");
var tasksApi = createResource("/tasks", "tasks");
var promotionsApi = createResource("/promotions", "promotions");
var loyaltyApi = createResource("/loyalty", "loyalty");
var usersApi = createResource("/users", "users");
var auditLogsApi = createResource("/audit-logs", "audit-logs");
var documentsApi = createResource("/documents", "documents");
//#endregion
export { serviceBookingsApi as C, tasksApi as D, tablesApi as E, usersApi as O, salesApi as S, suppliersApi as T, promotionsApi as _, employeesApi as a, reviewsApi as b, housekeepingApi as c, loyaltyApi as d, maintenanceApi as f, paymentsApi as g, ordersApi as h, documentsApi as i, inventoryApi as l, notificationsApi as m, auditLogsApi as n, expensesApi as o, menuItemsApi as p, branchesApi as r, guestsApi as s, attendanceApi as t, invoicesApi as u, purchasesApi as v, servicesApi as w, roomsApi as x, reservationsApi as y };
