import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { api, type ItemResponse } from "./api";

export type MpesaSource = "Reservation" | "Order" | "Service" | "Invoice" | "Sale";

export interface MpesaTransaction {
  _id: string;
  checkoutRequestId: string;
  phone: string;
  amount: number;
  source: MpesaSource;
  sourceId: string;
  status: "Pending" | "Success" | "Failed" | "Cancelled";
  resultDesc?: string;
  mpesaReceiptNumber?: string;
}

interface StkPushResponse {
  status: string;
  message: string;
  data: { checkoutRequestId: string; transactionId: string };
}

export function useInitiateStkPush() {
  return useMutation({
    mutationFn: (payload: {
      phone: string;
      amount: number;
      source: MpesaSource;
      sourceId: string;
      accountReference?: string | undefined;
      transactionDesc?: string | undefined;
    }) => api.post<StkPushResponse>("/mpesa/stk-push", payload),
  });
}

// Polls the transaction status every 3s while a checkout request is in flight.
// Stops polling once the transaction resolves to Success/Failed/Cancelled.
export function useMpesaStatus(checkoutRequestId: string | undefined) {
  return useQuery({
    queryKey: ["mpesa", "status", checkoutRequestId],
    queryFn: () => api.get<ItemResponse<MpesaTransaction>>(`/mpesa/status/${checkoutRequestId}`),
    enabled: !!checkoutRequestId,
    refetchInterval: (query) => {
      const status = query.state.data?.data.status;
      return status && status !== "Pending" ? false : 3000;
    },
  });
}

export function useInvalidateAfterMpesaPayment(source: MpesaSource) {
  const queryClient = useQueryClient();
  const keyMap: Record<MpesaSource, string> = {
    Reservation: "reservations",
    Order: "orders",
    Service: "services",
    Invoice: "invoices",
    Sale: "sales",
  };
  return () => {
    queryClient.invalidateQueries({ queryKey: [keyMap[source]] });
    queryClient.invalidateQueries({ queryKey: ["payments"] });
  };
}