import { useEffect, useState } from "react";
import {
  Link,
  useNavigate,
  useParams,
  createFileRoute,
} from "@tanstack/react-router";

import { api, ApiError } from "../../../lib/api";
import { useAuth } from "../../../lib/auth";
import { formatCurrency } from "../../../lib/currency";
import { useInitiateStkPush } from "../../../lib/mpesa";

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  capacity: number;
  rate: number;
  amenities?: string[];
  images?: string[];
  status: string;
  branch:
    | string
    | {
        _id: string;
        name?: string;
      };
}

interface RoomResponse {
  status: string;
  data: Room;
}

interface BookingResponse {
  status: string;
  data: {
    _id: string;
    ref: string;
    status: string;
  };
}

export const Route = createFileRoute("/customer/book/$roomId")({
  head: () => ({
    meta: [
      {
        title: "Book Room — Aurelia Suites",
      },
    ],
  }),
  component: BookRoomPage,
});

function BookRoomPage() {
  const navigate = useNavigate();

  const { roomId } = useParams({
    from: "/customer/book/$roomId",
  });

  const { user, logout } = useAuth();

  const initiateStkPush = useInitiateStkPush();

  const [room, setRoom] = useState<Room | null>(null);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");

  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);

  // Customer's M-Pesa phone number
  const [phone, setPhone] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState("");

  async function loadRoom() {
    try {
      setIsLoading(true);
      setError("");

      const response = await api.get<RoomResponse>(
        `/rooms/${roomId}`,
      );

      setRoom(response.data);
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Unable to load room information.");
      }
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadRoom();
  }, [roomId]);

  function getNights() {
    if (!checkIn || !checkOut) return 0;

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    const difference = end.getTime() - start.getTime();

    return Math.max(
      Math.round(
        difference / (1000 * 60 * 60 * 24),
      ),
      0,
    );
  }

  const nights = getNights();

  const total = room
    ? room.rate * nights
    : 0;

  function normalizePhoneForDisplay(value: string) {
    return value.replace(/\s+/g, "").trim();
  }

  function isValidKenyanPhone(value: string) {
    const cleaned = normalizePhoneForDisplay(value);

    return /^(?:07|01)\d{8}$/.test(cleaned) ||
      /^254(?:7|1)\d{8}$/.test(cleaned) ||
      /^\+254(?:7|1)\d{8}$/.test(cleaned);
  }

  async function handleBooking(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!room) {
      setError("Room information is unavailable.");
      return;
    }

    if (!checkIn || !checkOut) {
      setError(
        "Please select your check-in and check-out dates.",
      );
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setError(
        "Check-out date must be after check-in date.",
      );
      return;
    }

    if (adults < 1) {
      setError("At least one adult is required.");
      return;
    }

    const totalGuests = adults + children;

    if (totalGuests > room.capacity) {
      setError(
        `This room can accommodate a maximum of ${room.capacity} guest${
          room.capacity !== 1 ? "s" : ""
        }.`,
      );
      return;
    }

    if (!phone.trim()) {
      setError(
        "Please enter the customer's M-Pesa phone number.",
      );
      return;
    }

    if (!isValidKenyanPhone(phone)) {
      setError(
        "Please enter a valid Kenyan M-Pesa phone number, e.g. 0712345678.",
      );
      return;
    }

    if (total <= 0) {
      setError(
        "The booking total must be greater than zero.",
      );
      return;
    }

    try {
      setIsBooking(true);

      /*
       * STEP 1:
       * Create the reservation.
       */
      const response = await api.post<BookingResponse>(
        "/reservations",
        {
          room: room._id,
          checkIn,
          checkOut,
          adults,
          children,
          phone: normalizePhoneForDisplay(phone),
        },
      );

      const reservationId = response.data._id;
      const reservationRef = response.data.ref;

      /*
       * STEP 2:
       * Send M-Pesa STK Push to the customer's phone.
       */
      await initiateStkPush.mutateAsync({
        phone: normalizePhoneForDisplay(phone),
        amount: total,
        source: "Reservation",
        sourceId: reservationId,
        accountReference: reservationRef,
        transactionDesc: "Room booking",
      });

      /*
       * STEP 3:
       * STK request was successfully accepted.
       * The customer should now receive the M-Pesa prompt.
       */
      console.log(
        "Reservation created:",
        reservationRef,
      );

      console.log(
        "M-Pesa STK Push sent to:",
        normalizePhoneForDisplay(phone),
      );

      /*
       * STEP 4:
       * Take customer to their bookings page.
       */
      await navigate({
        to: "/customer/bookings",
      });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError(
          "Unable to complete the booking and payment request.",
        );
      }
    } finally {
      setIsBooking(false);
    }
  }

  function handleLogout() {
    logout();

    navigate({
      to: "/customer/login",
    });
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">
          Loading room...
        </p>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-slate-50">
        <header className="border-b bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <Link
              to="/customer/rooms"
              className="font-semibold text-slate-900"
            >
              ← Back to Rooms
            </Link>
          </div>
        </header>

        <main className="mx-auto max-w-2xl px-6 py-20 text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Room not found
          </h1>

          <p className="mt-2 text-slate-500">
            {error ||
              "This room is no longer available."}
          </p>

          <Link
            to="/customer/rooms"
            className="mt-6 inline-block rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white"
          >
            Browse Rooms
          </Link>
        </main>
      </div>
    );
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
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Rooms
            </Link>

            <Link
              to="/customer/bookings"
              className="text-sm text-slate-600 hover:text-slate-900"
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

      <main className="mx-auto max-w-6xl px-6 py-10">
        <Link
          to="/customer/rooms"
          className="text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          ← Back to Rooms
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-2">
          {/* Room Details */}
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="h-72 bg-slate-200">
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
              <p className="text-sm text-slate-500">
                Room {room.roomNumber}
              </p>

              <h2 className="mt-1 text-3xl font-bold text-slate-900">
                {room.type}
              </h2>

              <div className="mt-4">
                <span className="text-2xl font-bold text-slate-900">
                  {formatCurrency(room.rate)}
                </span>

                <span className="text-sm text-slate-500">
                  {" "}
                  / night
                </span>
              </div>

              <p className="mt-4 text-slate-600">
                Maximum capacity: {room.capacity} guest
                {room.capacity !== 1 ? "s" : ""}
              </p>

              {room.amenities &&
                room.amenities.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-slate-900">
                      Amenities
                    </h3>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {room.amenities.map((amenity) => (
                        <span
                          key={amenity}
                          className="rounded-full bg-slate-100 px-3 py-2 text-sm text-slate-600"
                        >
                          {amenity}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
            </div>
          </div>

          {/* Booking Form */}
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-slate-900">
              Make a Reservation
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Enter your booking details and M-Pesa number.
            </p>

            {error && (
              <div className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            <form
              onSubmit={handleBooking}
              className="mt-6 space-y-5"
            >
              {/* M-Pesa Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  M-Pesa Phone Number
                </label>

                <input
                  id="phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="0712345678"
                  required
                  disabled={isBooking}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />

                <p className="mt-1 text-xs text-slate-500">
                  The M-Pesa payment prompt will be sent to
                  this number.
                </p>
              </div>

              {/* Check In */}
              <div>
                <label
                  htmlFor="checkIn"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Check-in
                </label>

                <input
                  id="checkIn"
                  type="date"
                  value={checkIn}
                  min={
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(event) =>
                    setCheckIn(event.target.value)
                  }
                  required
                  disabled={isBooking}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              {/* Check Out */}
              <div>
                <label
                  htmlFor="checkOut"
                  className="mb-1 block text-sm font-medium text-slate-700"
                >
                  Check-out
                </label>

                <input
                  id="checkOut"
                  type="date"
                  value={checkOut}
                  min={
                    checkIn ||
                    new Date()
                      .toISOString()
                      .split("T")[0]
                  }
                  onChange={(event) =>
                    setCheckOut(event.target.value)
                  }
                  required
                  disabled={isBooking}
                  className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                />
              </div>

              {/* Adults / Children */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="adults"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Adults
                  </label>

                  <input
                    id="adults"
                    type="number"
                    min={1}
                    max={room.capacity}
                    value={adults}
                    onChange={(event) =>
                      setAdults(
                        Math.max(
                          1,
                          Number(event.target.value),
                        ),
                      )
                    }
                    required
                    disabled={isBooking}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="children"
                    className="mb-1 block text-sm font-medium text-slate-700"
                  >
                    Children
                  </label>

                  <input
                    id="children"
                    type="number"
                    min={0}
                    max={Math.max(
                      room.capacity - adults,
                      0,
                    )}
                    value={children}
                    onChange={(event) =>
                      setChildren(
                        Math.max(
                          0,
                          Number(event.target.value),
                        ),
                      )
                    }
                    disabled={isBooking}
                    className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-slate-500 focus:ring-2 focus:ring-slate-200 disabled:bg-slate-100"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="rounded-xl bg-slate-50 p-5">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">
                    Rate
                  </span>

                  <span className="font-medium text-slate-900">
                    {formatCurrency(room.rate)}
                  </span>
                </div>

                <div className="mt-2 flex justify-between text-sm">
                  <span className="text-slate-600">
                    Nights
                  </span>

                  <span className="font-medium text-slate-900">
                    {nights}
                  </span>
                </div>

                <div className="mt-4 flex justify-between border-t border-slate-200 pt-4">
                  <span className="font-semibold text-slate-900">
                    Estimated Total
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    {formatCurrency(total)}
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={
                  isBooking ||
                  initiateStkPush.isPending ||
                  !checkIn ||
                  !checkOut ||
                  !phone ||
                  nights <= 0
                }
                className="w-full rounded-lg bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isBooking ||
                initiateStkPush.isPending
                  ? "Sending M-Pesa Prompt..."
                  : "Confirm Booking & Pay"}
              </button>

              <p className="text-center text-xs text-slate-500">
                After confirming, the M-Pesa payment prompt
                will be sent to the phone number entered above.
              </p>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}