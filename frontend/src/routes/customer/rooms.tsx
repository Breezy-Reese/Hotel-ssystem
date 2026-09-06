import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  createFileRoute,
} from "@tanstack/react-router";

import { api, ApiError } from "../../lib/api";
import { useAuth } from "../../lib/auth";
import { formatCurrency } from "../../lib/currency";

interface Room {
  _id: string;
  roomNumber: string;
  type: "Single" | "Double" | "Deluxe" | "Executive" | "Suite";
  capacity: number;
  rate: number;
  amenities?: string[];
  images?: string[];
  status: string;
}

interface RoomsResponse {
  status: string;
  results: number;
  total: number;
  page: number;
  limit: number;
  pages: number;
  data: Room[];
}

export const Route = createFileRoute("/customer/rooms")({
  head: () => ({
    meta: [
      {
        title: "Available Rooms — Aurelia Suites",
      },
    ],
  }),
  component: CustomerRoomsPage,
});

function CustomerRoomsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRooms() {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get<RoomsResponse>(
        "/rooms",
      );

      setRooms(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to load rooms.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRooms();
  }, []);

  function handleLogout() {
    logout();

    navigate({
      to: "/customer/login",
    });
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
              className="text-sm font-medium text-slate-900"
            >
              Rooms
            </Link>

            <Link
              to="/customer/bookings"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
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

      {/* Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Find Your Room
          </h2>

          <p className="mt-2 text-slate-500">
            Choose from our available rooms and suites.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-red-700">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="py-20 text-center text-slate-500">
            Loading rooms...
          </div>
        ) : rooms.length === 0 ? (
          <div className="rounded-xl border border-slate-200 bg-white p-10 text-center">
            <h3 className="text-lg font-semibold text-slate-900">
              No rooms found
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              Please check again later.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => (
              <div
                key={room._id}
                className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
              >
                {/* Room Image */}
                <div className="h-52 bg-slate-200">
                  {room.images?.[0] ? (
                    <img
                      src={room.images[0]}
                      alt={`Room ${room.roomNumber}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-slate-400">
                      No room image
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900">
                        {room.type}
                      </h3>

                      <p className="text-sm text-slate-500">
                        Room {room.roomNumber}
                      </p>
                    </div>

                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      Available
                    </span>
                  </div>

                  <div className="mt-4">
                    <p className="text-2xl font-bold text-slate-900">
                      {formatCurrency(room.rate)}
                    </p>

                    <p className="text-xs text-slate-500">
                      per night
                    </p>
                  </div>

                  <p className="mt-3 text-sm text-slate-600">
                    Up to {room.capacity} guest
                    {room.capacity !== 1 ? "s" : ""}
                  </p>

                  {room.amenities &&
                    room.amenities.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {room.amenities
                          .slice(0, 4)
                          .map((amenity) => (
                            <span
                              key={amenity}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600"
                            >
                              {amenity}
                            </span>
                          ))}
                      </div>
                    )}

                  <Link
                    to="/customer/book/$roomId"
                    params={{
                      roomId: room._id,
                    }}
                    className="mt-6 block w-full rounded-lg bg-slate-900 px-4 py-3 text-center font-semibold text-white hover:bg-slate-800"
                  >
                    Book This Room
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}