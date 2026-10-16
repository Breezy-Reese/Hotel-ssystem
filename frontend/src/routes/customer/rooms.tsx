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
      { title: "Available Rooms — Aurelia Suites" },
      {
        name: "description",
        content:
          "Explore rooms and suites at Aurelia Suites, view photos, and book your stay.",
      },
    ],
  }),
  component: CustomerRoomsPage,
});

function getStatusStyle(status: string) {
  switch (status) {
    case "Available":
      return "bg-emerald-100 text-emerald-700";
    case "Reserved":
      return "bg-amber-100 text-amber-700";
    case "Occupied":
      return "bg-blue-100 text-blue-700";
    case "Cleaning":
      return "bg-slate-100 text-slate-700";
    case "Maintenance":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

function CustomerRoomsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImages, setSelectedImages] = useState<
    Record<string, number>
  >({});

  useEffect(() => {
    let cancelled = false;

    async function loadRooms() {
      try {
        setIsLoading(true);
        setError("");

        const response = await api.get<RoomsResponse>("/rooms");

        if (!cancelled) {
          setRooms(response.data ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof ApiError
              ? err.message
              : "Unable to load rooms. Please try again.",
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadRooms();

    return () => {
      cancelled = true;
    };
  }, []);

  function handleLogout() {
    logout();
    navigate({ to: "/customer/login" });
  }

  function selectImage(roomId: string, imageIndex: number) {
    setSelectedImages((current) => ({
      ...current,
      [roomId]: imageIndex,
    }));
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link to="/customer/rooms" className="shrink-0">
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Aurelia Suites
            </h1>
            <p className="text-xs text-slate-500">Customer Portal</p>
          </Link>

          <nav className="flex items-center gap-2.5 sm:gap-5">
            <Link
              to="/customer/rooms"
              className="text-sm font-semibold text-slate-900"
            >
              Rooms
            </Link>

            <Link
              to="/customer/restaurant"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Restaurant
            </Link>

            <Link
              to="/customer/bookings"
              className="text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              <span className="hidden sm:inline">My Bookings</span>
              <span className="sm:hidden">Bookings</span>
            </Link>

            <span className="hidden max-w-32 truncate text-sm text-slate-500 md:block">
              {user?.name}
            </span>

            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 sm:px-4"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:py-14">
        <section className="mb-10 overflow-hidden rounded-3xl bg-slate-900 px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-amber-300">
            Your stay, your way
          </p>

          <h2 className="mt-4 max-w-2xl text-3xl font-bold tracking-tight sm:text-5xl">
            Find your perfect room.
          </h2>

          <p className="mt-4 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
            Explore our rooms and suites, view their photos, and choose
            the space that suits your stay.
          </p>
        </section>

        <div className="mb-7 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              Our Rooms
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose from our available accommodations.
            </p>
          </div>

          {!isLoading && !error && (
            <span className="rounded-full bg-white px-4 py-2 text-sm text-slate-600 ring-1 ring-slate-200">
              {rooms.length} {rooms.length === 1 ? "room" : "rooms"}
            </span>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-2 font-semibold underline"
            >
              Reload page
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse overflow-hidden rounded-2xl border border-slate-200 bg-white"
              >
                <div className="h-56 bg-slate-200" />
                <div className="space-y-3 p-6">
                  <div className="h-5 w-2/3 rounded bg-slate-200" />
                  <div className="h-4 w-1/3 rounded bg-slate-100" />
                  <div className="h-8 w-1/2 rounded bg-slate-200" />
                </div>
              </div>
            ))}
          </div>
        ) : !error && rooms.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl">
              🏨
            </div>
            <h3 className="mt-5 text-lg font-semibold text-slate-900">
              No rooms available to display
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              Please check again later or contact our reception team.
            </p>
          </div>
        ) : (
          <div className="grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rooms.map((room) => {
              const images = (room.images ?? []).filter(Boolean);
              const selectedIndex = selectedImages[room._id] ?? 0;
              const activeIndex =
                images.length > 0
                  ? Math.min(selectedIndex, images.length - 1)
                  : 0;
              const activeImage = images[activeIndex];
              const isAvailable = room.status === "Available";

              return (
                <article
                  key={room._id}
                  className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className="relative h-56 overflow-hidden bg-slate-200">
                    {activeImage ? (
                      <img
                        key={activeImage}
                        src={activeImage}
                        alt={`${room.type} room ${room.roomNumber}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-500">
                        <svg
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          className="h-10 w-10"
                          aria-hidden="true"
                        >
                          <rect
                            x="3"
                            y="4"
                            width="18"
                            height="16"
                            rx="2"
                          />
                          <circle cx="8.5" cy="9" r="1.5" />
                          <path d="m21 15-5-5L5 20" />
                        </svg>
                        <span className="text-sm">Photos coming soon</span>
                      </div>
                    )}

                    <span
                      className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-xs font-semibold ${getStatusStyle(room.status)}`}
                    >
                      {room.status}
                    </span>

                    {images.length > 1 && (
                      <span className="absolute bottom-3 right-3 rounded-full bg-black/70 px-3 py-1.5 text-xs font-medium text-white">
                        {activeIndex + 1} / {images.length} photos
                      </span>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div
                      className="flex gap-2 overflow-x-auto border-b border-slate-100 px-4 py-3"
                      aria-label={`Photos of room ${room.roomNumber}`}
                    >
                      {images.map((image, index) => (
                        <button
                          key={`${image}-${index}`}
                          type="button"
                          onClick={() => selectImage(room._id, index)}
                          aria-label={`View photo ${index + 1} of room ${room.roomNumber}`}
                          aria-pressed={activeIndex === index}
                          className={`h-14 w-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                            activeIndex === index
                              ? "border-slate-900"
                              : "border-transparent opacity-70 hover:opacity-100"
                          }`}
                        >
                          <img
                            src={image}
                            alt=""
                            loading="lazy"
                            className="h-full w-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  <div className="p-5 sm:p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-amber-700">
                          {room.type}
                        </p>
                        <h3 className="mt-1 text-xl font-bold text-slate-900">
                          Room {room.roomNumber}
                        </h3>
                      </div>
                    </div>

                    <div className="mt-5 flex items-baseline gap-2">
                      <p className="text-2xl font-bold text-slate-900">
                        {formatCurrency(room.rate)}
                      </p>
                      <span className="text-sm text-slate-500">
                        / night
                      </span>
                    </div>

                    <p className="mt-3 text-sm text-slate-600">
                      Accommodates up to {room.capacity}{" "}
                      {room.capacity === 1 ? "guest" : "guests"}
                    </p>

                    {room.amenities && room.amenities.length > 0 && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {room.amenities.slice(0, 4).map((amenity) => (
                          <span
                            key={amenity}
                            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600"
                          >
                            {amenity}
                          </span>
                        ))}
                        {room.amenities.length > 4 && (
                          <span className="rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500">
                            +{room.amenities.length - 4} more
                          </span>
                        )}
                      </div>
                    )}

                    {isAvailable ? (
                      <Link
                        to="/customer/book/$roomId"
                        params={{ roomId: room._id }}
                        className="mt-6 block w-full rounded-xl bg-slate-900 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2"
                      >
                        Book This Room
                      </Link>
                    ) : (
                      <button
                        type="button"
                        disabled
                        className="mt-6 block w-full cursor-not-allowed rounded-xl bg-slate-100 px-4 py-3 text-center text-sm font-semibold text-slate-400"
                      >
                        Currently Unavailable
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <footer className="mt-12 border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <span>© {new Date().getFullYear()} Aurelia Suites</span>
          <span>We look forward to welcoming you.</span>
        </div>
      </footer>
    </div>
  );
}