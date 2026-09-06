import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Receipt, RefreshCw } from "lucide-react";
import { api } from "../../lib/api";

export const Route = createFileRoute("/customer/orders")({
  component: CustomerOrders,
});

interface OrderItem {
  menuItem: string | { _id: string; name?: string };
  name?: string;
  quantity: number;
  price: number;
}

interface Order {
  _id: string;
  orderNumber: string;
  type: "DineIn" | "RoomService" | "Takeaway";
  items: OrderItem[];
  status:
    | "Pending"
    | "Preparing"
    | "Ready"
    | "Served"
    | "Completed"
    | "Cancelled";
  total?: number;
  placedAt: string;
}

function CustomerOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadOrders() {
    setLoading(true);
    setError("");

    try {
      const response = await api.get<{ data: Order[] }>("/orders");

      setOrders(response.data || []);
    } catch (err) {
      console.error(err);
      setError("Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  function statusClass(status: Order["status"]) {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-700";

      case "Preparing":
        return "bg-blue-100 text-blue-700";

      case "Ready":
        return "bg-green-100 text-green-700";

      case "Served":
        return "bg-purple-100 text-purple-700";

      case "Completed":
        return "bg-green-100 text-green-700";

      case "Cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-slate-100 text-slate-700";
    }
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link
              to="/customer"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-5 h-5" />
              Home
            </Link>

            <h1 className="text-xl font-bold text-slate-900">
              My Orders
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <Link
              to="/customer/restaurant"
              className="text-sm font-semibold text-orange-600 hover:underline"
            >
              Order Food
            </Link>

            <button
              type="button"
              onClick={loadOrders}
              disabled={loading}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Your Orders
          </h2>

          <p className="mt-2 text-slate-500">
            Track the restaurant orders you have placed.
          </p>
        </div>

        {loading ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <p className="text-slate-500">Loading your orders...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-red-700">
            {error}

            <button
              type="button"
              onClick={loadOrders}
              className="block mt-4 font-semibold underline"
            >
              Try again
            </button>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Receipt className="w-14 h-14 mx-auto text-slate-300" />

            <h3 className="mt-5 text-xl font-bold text-slate-900">
              No orders yet
            </h3>

            <p className="mt-2 text-slate-500">
              Browse our restaurant menu and place your first order.
            </p>

            <Link
              to="/customer/restaurant"
              className="inline-block mt-6 rounded-lg bg-orange-600 px-5 py-3 font-semibold text-white hover:bg-orange-700"
            >
              Browse Restaurant
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white border border-slate-200 rounded-xl p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {order.orderNumber}
                    </h3>

                    <p className="text-sm text-slate-500 mt-1">
                      {formatDate(order.placedAt)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                      {order.type}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClass(
                        order.status,
                      )}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-100 pt-5">
                  <div className="space-y-3">
                    {order.items.map((item, index) => (
                      <div
                        key={`${order._id}-${index}`}
                        className="flex justify-between gap-4 text-sm"
                      >
                        <div>
                          <span className="font-semibold text-slate-900">
                            {item.name ||
                              (typeof item.menuItem === "object"
                                ? item.menuItem.name
                                : "Menu item")}
                          </span>

                          <span className="text-slate-500">
                            {" "}
                            × {item.quantity}
                          </span>
                        </div>

                        <span className="font-semibold text-slate-700">
                          KSh{" "}
                          {(
                            item.price * item.quantity
                          ).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 border-t border-slate-200 pt-5 flex justify-between items-center">
                  <span className="font-semibold text-slate-600">
                    Total
                  </span>

                  <span className="text-xl font-bold text-slate-900">
                    KSh{" "}
                    {(
                      order.total ??
                      order.items.reduce(
                        (sum, item) =>
                          sum + item.price * item.quantity,
                        0,
                      )
                    ).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}