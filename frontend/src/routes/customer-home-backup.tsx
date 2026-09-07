import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  BedDouble,
  UtensilsCrossed,
  CalendarDays,
  Receipt,
} from "lucide-react";

import { api } from "../lib/api";

export const Route = createFileRoute("/customer-home-backup")({
  head: () => ({
    meta: [
      { title: "Hotel System — Book Rooms & Restaurant" },
      {
        name: "description",
        content:
          "Book hotel rooms, explore our restaurant, manage bookings and track orders.",
      },
    ],
  }),
  component: CustomerHome,
});

interface Room {
  _id: string;
  roomNumber: string;
  type: string;
  capacity: number;
  rate: number;
  amenities?: string[];
  images?: string[];
  status: string;
}

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  description?: string;
  image?: string;
  availability: boolean;
}

function CustomerHome() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [roomsResponse, menuResponse] = await Promise.all([
          api.get<{ data: Room[] }>("/rooms?status=Available"),
          api.get<{ data: MenuItem[] }>("/menu-items?availability=true"),
        ]);

        setRooms(roomsResponse.data || []);
        setMenuItems(menuResponse.data || []);
      } catch (error) {
        console.error("Failed to load customer home:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const availableRooms = rooms
    .filter((room) => room.status === "Available")
    .slice(0, 4);

  const availableMenu = menuItems
    .filter((item) => item.availability)
    .slice(0, 6);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-slate-900">
            Hotel System
          </Link>

          <nav className="flex items-center gap-5 text-sm">
            <Link to="/" className="font-semibold text-blue-600">
              Home
            </Link>

            <Link
              to="/customer/rooms"
              className="text-slate-600 hover:text-blue-600"
            >
              Rooms
            </Link>

            <Link
              to="/customer/restaurant"
              className="text-slate-600 hover:text-blue-600"
            >
              Restaurant
            </Link>

            <Link
              to="/customer/bookings"
              className="text-slate-600 hover:text-blue-600"
            >
              My Bookings
            </Link>

            <Link
              to="/customer/orders"
              className="text-slate-600 hover:text-blue-600"
            >
              My Orders
            </Link>

            <Link
              to="/customer/login"
              className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
            >
              Login
            </Link>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Hero */}
        <section className="mb-10">
          <h1 className="text-3xl font-bold text-slate-900">
            Welcome to our hotel
          </h1>

          <p className="mt-2 text-slate-600">
            Book a room, explore our restaurant, and manage your reservations
            and orders.
          </p>
        </section>

        {/* Quick actions */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-12">
          <Link
            to="/customer/rooms"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
          >
            <BedDouble className="w-8 h-8 text-blue-600 mb-4" />

            <h2 className="font-bold text-slate-900">
              Book a Room
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Find and reserve an available room.
            </p>
          </Link>

          <Link
            to="/customer/restaurant"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
          >
            <UtensilsCrossed className="w-8 h-8 text-orange-600 mb-4" />

            <h2 className="font-bold text-slate-900">
              Restaurant
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Browse the menu and place an order.
            </p>
          </Link>

          <Link
            to="/customer/bookings"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
          >
            <CalendarDays className="w-8 h-8 text-green-600 mb-4" />

            <h2 className="font-bold text-slate-900">
              My Bookings
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              View and manage your reservations.
            </p>
          </Link>

          <Link
            to="/customer/orders"
            className="bg-white border border-slate-200 rounded-xl p-6 hover:shadow-md transition"
          >
            <Receipt className="w-8 h-8 text-purple-600 mb-4" />

            <h2 className="font-bold text-slate-900">
              My Orders
            </h2>

            <p className="text-sm text-slate-500 mt-1">
              Track your restaurant orders.
            </p>
          </Link>
        </section>

        {/* Available rooms */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Available Rooms
              </h2>

              <p className="text-slate-500">
                Choose a room and start your booking.
              </p>
            </div>

            <Link
              to="/customer/rooms"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View all rooms →
            </Link>
          </div>

          {availableRooms.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <p className="text-slate-500">
                No rooms are currently available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {availableRooms.map((room) => (
                <div
                  key={room._id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden"
                >
                  {room.images?.[0] ? (
                    <img
                      src={room.images[0]}
                      alt={`Room ${room.roomNumber}`}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-slate-100 flex items-center justify-center">
                      <BedDouble className="w-12 h-12 text-slate-400" />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h3 className="font-bold text-slate-900">
                          Room {room.roomNumber}
                        </h3>

                        <p className="text-sm text-slate-500">
                          {room.type}
                        </p>
                      </div>

                      <span className="text-sm font-semibold text-green-600">
                        Available
                      </span>
                    </div>

                    <p className="mt-3 text-lg font-bold text-slate-900">
                      KSh {room.rate.toLocaleString()}
                      <span className="text-sm font-normal text-slate-500">
                        {" "}
                        / night
                      </span>
                    </p>

                    <p className="text-sm text-slate-500 mt-1">
                      Up to {room.capacity} guest
                      {room.capacity !== 1 ? "s" : ""}
                    </p>

                    <Link
                      to="/customer/book/$roomId"
                      params={{ roomId: room._id }}
                      className="block text-center mt-5 bg-blue-600 text-white rounded-lg px-4 py-2.5 font-semibold hover:bg-blue-700"
                    >
                      Book This Room
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Restaurant */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">
                Restaurant
              </h2>

              <p className="text-slate-500">
                Enjoy meals and drinks from our menu.
              </p>
            </div>

            <Link
              to="/customer/restaurant"
              className="text-sm font-semibold text-blue-600 hover:underline"
            >
              View full menu →
            </Link>
          </div>

          {availableMenu.length === 0 ? (
            <div className="bg-white border border-slate-200 rounded-xl p-8 text-center">
              <p className="text-slate-500">
                No menu items are currently available.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableMenu.map((item) => (
                <div
                  key={item._id}
                  className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-orange-50 flex items-center justify-center">
                      <UtensilsCrossed className="w-12 h-12 text-orange-300" />
                    </div>
                  )}

                  <div className="p-5">
                    <p className="text-xs font-semibold uppercase text-orange-600">
                      {item.category}
                    </p>

                    <h3 className="mt-1 font-bold text-slate-900">
                      {item.name}
                    </h3>

                    {item.description && (
                      <p className="text-sm text-slate-500 mt-2 line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-5">
                      <span className="font-bold text-slate-900">
                        KSh {item.price.toLocaleString()}
                      </span>

                      <Link
                        to="/customer/restaurant"
                        className="bg-orange-600 text-white rounded-lg px-4 py-2 text-sm font-semibold hover:bg-orange-700"
                      >
                        Add to Order
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}