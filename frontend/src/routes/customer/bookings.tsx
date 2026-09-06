import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  createFileRoute,
} from "@tanstack/react-router";

import { api, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { formatCurrency } from "../../lib/currency";

interface Reservation {
  _id: string;
  ref: string;
  checkIn: string;
  checkOut: string;
  adults: number;
  children: number;
  rateAtBooking: number;
  status:
    | "Pending"
    | "Confirmed"
    | "CheckedIn"
    | "CheckedOut"
    | "Cancelled"
    | "NoShow";
  room?: {
    _id: string;
    roomNumber: string;
    type: string;
  };
  branch?: {
    _id: string;
    name?: string;
  };
}

interface BookingsResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: Reservation[];
}

export const Route = createFileRoute("/customer/bookings")({
  head: () => ({
    meta: [
      {
        title: "My Bookings — Aurelia Suites",
      },
    ],
  }),
  component: CustomerBookingsPage,
});

function CustomerBookingsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [bookings, setBookings] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState<string | null>(
    null,
  );

  async function loadBookings() {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get<BookingsResponse>(
        "/customer/bookings",
      );

      setBookings(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to load your bookings.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadBookings();
  }, []);

  async function cancelBooking(id: string) {
    if (cancelling) return;

    const confirmed = window.confirm(
      "Are you sure you want to cancel this booking?",
    );

    if (!confirmed) return;

    try {
      setCancelling(id);
      setError("");

      await api.patch(`/customer/bookings/${id}/cancel`);

      await loadBookings();
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to cancel this booking.");
      }
    } finally {
      setCancelling(null);
    }
  }

  function handleLogout() {
    logout();

    navigate({
      to: "/customer/login",
    });
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString(
      "en-KE",
      {
        year: "numeric",
        month: "short",
        day: "numeric",
      },
    );
  }

  function getStatusClass(status: Reservation["status"]) {
    switch (status) {
      case "Confirmed":
        return "bg-green-100 text-green-700";

      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "CheckedIn":
        return "bg-blue-100 text-blue-700";

      case "CheckedOut":
        return "bg-slate-100 text-slate-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      case "NoShow":
        return "bg-orange-100 text-orange-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Aurelia Suites
            </h1>

            <p className="text-xs text-slate-500">
              Customer Portal
            </p>
          </div>

          <nav className="flex items-center gap-4">
            <Link
              to="/customer/rooms"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Rooms
            </Link>

            <Link
              to="/customer/bookings"
              className="text-sm font-medium text-slate-900"
            >
              My Bookings
            </Link>

            <span className="hidden text-sm text-slate-500 md:block">
              {user?.name}
            </span>

            <button
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            My Bookings
          </h2>

          <p className="mt-2 text-slate-500">
            View and manage your Aurelia Suites reservations.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            Loading your bookings...
          </div>
        ) : bookings.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center">
            <h3 className="text-xl font-semibold text-slate-900">
              You don't have any bookings yet
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Browse our rooms and make your first reservation.
            </p>

            <Link
              to="/customer/rooms"
              className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
            >
              Browse Rooms
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex flex-col justify-between gap-4 md:flex-row">
                  <div>
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-xl font-bold text-slate-900">
                        {booking.room?.type || "Room"}
                      </h3>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${getStatusClass(
                          booking.status,
                        )}`}
                      >
                        {booking.status}
                      </span>
                    </div>

                    <p className="mt-1 text-sm text-slate-500">
                      Booking reference: {booking.ref}
                    </p>

                    {booking.room?.roomNumber && (
                      <p className="mt-2 text-sm text-slate-600">
                        Room {booking.room.roomNumber}
                      </p>
                    )}
                  </div>

                  <div className="text-left md:text-right">
                    <p className="text-sm text-slate-500">
                      Rate per night
                    </p>

                    <p className="text-xl font-bold text-slate-900">
                      {formatCurrency(
                        booking.rateAtBooking,
                      )}
                    </p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-3">
                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      Check-in
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {formatDate(booking.checkIn)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      Check-out
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {formatDate(booking.checkOut)}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase text-slate-400">
                      Guests
                    </p>

                    <p className="mt-1 font-medium text-slate-800">
                      {booking.adults} adult
                      {booking.adults !== 1 ? "s" : ""}
                      {booking.children > 0
                        ? `, ${booking.children} child${
                            booking.children !== 1
                              ? "ren"
                              : ""
                          }`
                        : ""}
                    </p>
                  </div>
                </div>

                {["Pending", "Confirmed"].includes(
                  booking.status,
                ) && (
                  <div className="mt-5 border-t border-slate-100 pt-5">
                    <button
                      onClick={() =>
                        cancelBooking(booking._id)
                      }
                      disabled={cancelling === booking._id}
                      className="rounded-lg border border-red-300 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      {cancelling === booking._id
                        ? "Cancelling..."
                        : "Cancel Booking"}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}