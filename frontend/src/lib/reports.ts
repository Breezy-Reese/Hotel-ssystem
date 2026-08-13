import { useQuery } from "@tanstack/react-query";

import { api, type ItemResponse } from "./api";
import type { DashboardStats } from "./types";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["reports", "dashboard"],
    queryFn: () => api.get<ItemResponse<DashboardStats>>("/reports/dashboard"),
    refetchInterval: 60_000,
  });
}
