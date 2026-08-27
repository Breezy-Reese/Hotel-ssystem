import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as api } from "./router-DChNDNRD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/reports-CsK-QB5O.js
function useDashboardStats() {
	return useQuery({
		queryKey: ["reports", "dashboard"],
		queryFn: () => api.get("/reports/dashboard"),
		refetchInterval: 6e4
	});
}
//#endregion
export { useDashboardStats as t };
