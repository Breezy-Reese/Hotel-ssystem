import { useEffect, useRef, useState, type FormEvent } from "react";

import { api, ApiError } from "@/lib/api";
import { useAuth } from "@/lib/auth";

export interface PayableOrder {
  _id: string;
  orderNumber: string;
  total: number;
  status: string;
  paymentStatus?: "Unpaid" | "Paid";
}

interface OrderPaymentProps {
  order: PayableOrder;
  /** Called after M-Pesa confirms payment, so the page can reload its orders. */
  onPaid?: () => void;
}

interface StkResponse {
  status: string;
  message?: string;
  data?: { checkoutRequestId?: string };
}

interface StatusResponse {
  status: string;
  data?: { status?: "Pending" | "Success" | "Failed" | "Cancelled" };
}

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20; // about 60 seconds

// Accepts 07XXXXXXXX, 01XXXXXXXX, +2547XXXXXXXX, 2547XXXXXXXX
// (same formats the server accepts).
function isValidKenyanPhone(value: string): boolean {
  const cleaned = value.trim().replace(/\s+/g, "").replace(/^\+/, "");
  return /^(0|254)[17]\d{8}$/.test(cleaned);
}

export function OrderPayment({ order, onPaid }: OrderPaymentProps) {
  const { user } = useAuth();

  const savedPhone =
    (user as { phone?: string } | null | undefined)?.phone ?? "";

  const [showForm, setShowForm] = useState(false);
  const [phone, setPhone] = useState(savedPhone);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cancelled = useRef(false);

  useEffect(() => {
    cancelled.current = false;

    return () => {
      cancelled.current = true;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  if (order.paymentStatus === "Paid") {
    return (
      <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
        Paid
      </span>
    );
  }

  if (order.status === "Cancelled") {
    return null;
  }

  const phoneValid = isValidKenyanPhone(phone);

  function pollStatus(checkoutRequestId: string, attempt = 0) {
    timer.current = setTimeout(async () => {
      if (cancelled.current) return;

      try {
        const response = await api.get<StatusResponse>(
          `/mpesa/status/${checkoutRequestId}`,
        );

        const state = response.data?.status;

        if (cancelled.current) return;

        if (state === "Success") {
          setBusy(false);
          setShowForm(false);
          setError("");
          setMessage("Payment received. Thank you!");
          onPaid?.();
          return;
        }

        if (state === "Cancelled") {
          setBusy(false);
          setMessage("");
          setError("You cancelled the payment prompt.");
          return;
        }

        if (state === "Failed") {
          setBusy(false);
          setMessage("");
          setError("The payment failed. Please try again.");
          return;
        }
      } catch {
        // Ignore a single failed poll and keep trying until the limit.
      }

      if (attempt + 1 >= MAX_POLLS) {
        setBusy(false);
        setMessage(
          "Still waiting for confirmation. If you completed the payment, tap Refresh in a moment.",
        );
        return;
      }

      pollStatus(checkoutRequestId, attempt + 1);
    }, POLL_INTERVAL_MS);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (busy) return;

    if (!phoneValid) {
      setError("Enter a valid M-Pesa number, e.g. 0712345678.");
      return;
    }

    try {
      setBusy(true);
      setError("");
      setMessage("");

      const response = await api.post<StkResponse>("/mpesa/stk-push", {
        phone: phone.trim(),
        // The server uses the order's real total; this value is only
        // sent because the endpoint requires an amount.
        amount: Math.round(order.total),
        source: "Order",
        sourceId: order._id,
        accountReference: order.orderNumber,
        transactionDesc: "Restaurant",
      });

      setMessage(
        response.message ||
          "Check your phone and enter your M-Pesa PIN to complete payment.",
      );

      const checkoutRequestId = response.data?.checkoutRequestId;

      if (checkoutRequestId) {
        pollStatus(checkoutRequestId);
      } else {
        setBusy(false);
      }
    } catch (err) {
      setBusy(false);
      setError(
        err instanceof ApiError
          ? err.message
          : "Unable to start payment. Please try again.",
      );
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {!showForm ? (
        <button
          type="button"
          onClick={() => {
            setShowForm(true);
            setError("");
            setMessage("");
          }}
          className="w-fit rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700"
        >
          Pay with M-Pesa
        </button>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50 p-3 sm:max-w-sm"
        >
          <label
            htmlFor={`mpesa-phone-${order._id}`}
            className="text-sm font-medium text-slate-700"
          >
            M-Pesa phone number
          </label>

          <input
            id={`mpesa-phone-${order._id}`}
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            placeholder="0712345678"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            disabled={busy}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:opacity-60"
          />

          <p className="text-xs text-slate-500">
            You will receive a payment prompt on this number.
          </p>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy || !phoneValid}
              className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {busy ? "Waiting for payment..." : "Send prompt"}
            </button>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              disabled={busy}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-white disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {message && (
        <p role="status" className="text-sm text-emerald-700">
          {message}
        </p>
      )}

      {error && (
        <p role="alert" className="text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
