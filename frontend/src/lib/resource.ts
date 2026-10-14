import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";

import {
  api,
  type ItemResponse,
  type ListResponse,
} from "./api";

type Params = Record<
  string,
  string | number | boolean | undefined
>;

function toQueryString(params?: Params): string {
  if (!params) return "";

  const entries = Object.entries(params).filter(
    ([, value]) => value !== undefined && value !== "",
  );

  if (entries.length === 0) return "";

  return (
    "?" +
    new URLSearchParams(
      entries.map(([key, value]) => [
        key,
        String(value),
      ]),
    ).toString()
  );
}

export function createResource<T>(
  basePath: string,
  queryKey: string,
) {
  function useList(params?: Params) {
    return useQuery({
      queryKey: [queryKey, "list", params],
      queryFn: () =>
        api.get<ListResponse<T>>(
          `${basePath}${toQueryString(params)}`,
        ),
      placeholderData: keepPreviousData,
    });
  }

  function useOne(id: string | undefined) {
    return useQuery({
      queryKey: [queryKey, "detail", id],
      queryFn: () =>
        api.get<ItemResponse<T>>(`${basePath}/${id}`),
      enabled: Boolean(id),
    });
  }

  function useCreate() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (payload: Partial<T>) =>
        api.post<ItemResponse<T>>(basePath, payload),

      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        }),
    });
  }

  function useUpdate() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload: Partial<T>;
      }) =>
        api.patch<ItemResponse<T>>(
          `${basePath}/${id}`,
          payload,
        ),

      onSuccess: (_, variables) => {
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });

        queryClient.invalidateQueries({
          queryKey: [
            queryKey,
            "detail",
            variables.id,
          ],
        });
      },
    });
  }

  function useRemove() {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (id: string) =>
        api.delete<void>(`${basePath}/${id}`),

      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        }),
    });
  }

  /**
   * Upload files using multipart/form-data.
   *
   * api.upload() must be implemented in api.ts.
   * The backend must accept multipart form data.
   */
  function useUpload<TResult = ItemResponse<T>>(
    uploadPath: string,
  ) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: (formData: FormData) =>
        api.upload<TResult>(
          uploadPath,
          formData,
        ),

      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        }),
    });
  }

  /**
   * Support custom POST and PATCH actions.
   */
  function useAction<
    TPayload = void,
    TResult = ItemResponse<T>,
  >(
    method: "post" | "patch",
    pathFor: (id: string) => string,
  ) {
    const queryClient = useQueryClient();

    return useMutation({
      mutationFn: ({
        id,
        payload,
      }: {
        id: string;
        payload?: TPayload;
      }) =>
        api[method]<TResult>(
          pathFor(id),
          payload,
        ),

      onSuccess: () =>
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        }),
    });
  }

  return {
    useList,
    useOne,
    useCreate,
    useUpdate,
    useRemove,
    useUpload,
    useAction,
  };
}