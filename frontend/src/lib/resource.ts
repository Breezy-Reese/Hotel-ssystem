import { useMutation, useQuery, useQueryClient, keepPreviousData } from "@tanstack/react-query";

import { api, type ItemResponse, type ListResponse } from "./api";

type Params = Record<string, string | number | boolean | undefined>;

function toQueryString(params?: Params) {
  if (!params) return "";
  const entries = Object.entries(params).filter(([, v]) => v !== undefined && v !== "");
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
export function createResource<T>(basePath: string, queryKey: string) {
  function useList(params?: Params) {
    return useQuery({
      queryKey: [queryKey, "list", params],
      queryFn: () => api.get<ListResponse<T>>(`${basePath}${toQueryString(params)}`),
      placeholderData: keepPreviousData,
    });
  }

  function useOne(id: string | undefined) {
    return useQuery({
      queryKey: [queryKey, "detail", id],
      queryFn: () => api.get<ItemResponse<T>>(`${basePath}/${id}`),
      enabled: !!id,
    });
  }

  function useCreate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (payload: Partial<T>) => api.post<ItemResponse<T>>(basePath, payload),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  function useUpdate() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload: Partial<T> }) =>
        api.patch<ItemResponse<T>>(`${basePath}/${id}`, payload),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  function useRemove() {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: (id: string) => api.delete<void>(`${basePath}/${id}`),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  // For custom action endpoints, e.g. POST /reservations/:id/check-in
  function useAction<TPayload = void, TResult = ItemResponse<T>>(
    method: "post" | "patch",
    pathFor: (id: string) => string,
  ) {
    const qc = useQueryClient();
    return useMutation({
      mutationFn: ({ id, payload }: { id: string; payload?: TPayload }) =>
        api[method]<TResult>(pathFor(id), payload),
      onSuccess: () => qc.invalidateQueries({ queryKey: [queryKey] }),
    });
  }

  return { useList, useOne, useCreate, useUpdate, useRemove, useAction };
}
