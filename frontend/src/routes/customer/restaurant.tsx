import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
  UtensilsCrossed,
} from "lucide-react";
import { api } from "../../lib/api";

export const Route = createFileRoute("/customer/restaurant")({
  component: CustomerRestaurant,
});

interface MenuItem {
  _id: string;
  name: string;
  category: string;
  price: number;
  branch?: string | { _id: string; name?: string };
  availability: boolean;
  description?: string;
  image?: string;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Branch {
  _id: string;
  name: string;
  location: string;
  status: string;
}

function CustomerRestaurant() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadData() {
      try {
        const [menuResponse, branchResponse] = await Promise.all([
          api.get<{ data: MenuItem[] }>("/menu-items"),
          api.get<{ data: Branch[] }>("/branches"),
        ]);

        setMenuItems(menuResponse.data || []);
        setBranches(branchResponse.data || []);
      } catch (err) {
        console.error(err);
        setError("Unable to load the restaurant menu.");
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const categories = useMemo(() => {
    const values = menuItems
      .filter((item) => item.availability)
      .map((item) => item.category);

    return ["All", ...Array.from(new Set(values))];
  }, [menuItems]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(
      (item) =>
        item.availability &&
        (selectedCategory === "All" ||
          item.category === selectedCategory),
    );
  }, [menuItems, selectedCategory]);

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  function addToCart(item: MenuItem) {
    setCart((current) => {
      const existing = current.find((cartItem) => cartItem._id === item._id);

      if (existing) {
        return current.map((cartItem) =>
          cartItem._id === item._id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });

    setMessage(`${item.name} added to your order.`);
    setTimeout(() => setMessage(""), 2500);
  }

  function increaseQuantity(id: string) {
    setCart((current) =>
      current.map((item) =>
        item._id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item,
      ),
    );
  }

  function decreaseQuantity(id: string) {
    setCart((current) =>
      current
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }

  function removeFromCart(id: string) {
    setCart((current) => current.filter((item) => item._id !== id));
  }

  async function placeOrder() {
    if (cart.length === 0) {
      setError("Your cart is empty.");
      return;
    }

    setOrdering(true);
    setError("");
    setMessage("");

    try {
      /*
       * Menu items may belong to a branch.
       * We use the branch from the first selected menu item.
       */
      const firstBranch = cart[0].branch;

      const branchId =
        typeof firstBranch === "string"
          ? firstBranch
          : firstBranch?._id;

      /*
       * If no menu item has a branch, fall back to the first
       * active branch returned by the backend.
       */
      const fallbackBranch = branches.find(
        (branch) => branch.status === "Active",
      );

      const finalBranchId = branchId || fallbackBranch?._id;

      if (!finalBranchId) {
        throw new Error(
          "No hotel branch is available for this order.",
        );
      }

      await api.post("/orders", {
        branch: finalBranchId,
        type: "Takeaway",
        items: cart.map((item) => ({
          menuItem: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
      });

      setCart([]);
      setMessage(
        "Order placed successfully! You can track it in My Orders.",
      );
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to place your order.",
      );
    } finally {
      setOrdering(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600">Loading restaurant...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-5">
            <Link
              to="/customer"
              className="flex items-center gap-2 text-slate-600 hover:text-blue-600"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </Link>

            <h1 className="text-xl font-bold text-slate-900">
              Restaurant
            </h1>
          </div>

          <div className="flex items-center gap-5">
            <Link
              to="/customer/bookings"
              className="text-sm text-slate-600 hover:text-blue-600"
            >
              My Bookings
            </Link>

            <Link
              to="/customer/orders"
              className="relative flex items-center gap-2 text-sm font-semibold text-slate-700"
            >
              <ShoppingCart className="w-5 h-5" />
              My Orders
            </Link>

            {cartCount > 0 && (
              <span className="bg-orange-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                {cartCount} item{cartCount !== 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900">
            Our Menu
          </h2>

          <p className="mt-2 text-slate-500">
            Choose your favorite meals and add them to your order.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                selectedCategory === category
                  ? "bg-orange-600 text-white"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-orange-400"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu */}
          <section className="lg:col-span-2">
            {filteredItems.length === 0 ? (
              <div className="bg-white border border-slate-200 rounded-xl p-10 text-center">
                <UtensilsCrossed className="w-12 h-12 mx-auto text-slate-300" />

                <p className="mt-4 text-slate-500">
                  No menu items are available in this category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {filteredItems.map((item) => (
                  <div
                    key={item._id}
                    className="bg-white border border-slate-200 rounded-xl overflow-hidden"
                  >
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-44 object-cover"
                      />
                    ) : (
                      <div className="w-full h-44 bg-orange-50 flex items-center justify-center">
                        <UtensilsCrossed className="w-14 h-14 text-orange-300" />
                      </div>
                    )}

                    <div className="p-5">
                      <span className="text-xs font-semibold uppercase text-orange-600">
                        {item.category}
                      </span>

                      <h3 className="mt-1 text-lg font-bold text-slate-900">
                        {item.name}
                      </h3>

                      {item.description && (
                        <p className="mt-2 text-sm text-slate-500">
                          {item.description}
                        </p>
                      )}

                      <div className="mt-5 flex items-center justify-between">
                        <span className="text-lg font-bold text-slate-900">
                          KSh {item.price.toLocaleString()}
                        </span>

                        <button
                          type="button"
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-orange-700"
                        >
                          <Plus className="w-4 h-4" />
                          Add to Order
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Cart */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <div className="bg-white border border-slate-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-slate-900">
                  Your Order
                </h2>

                <ShoppingCart className="w-5 h-5 text-orange-600" />
              </div>

              {cart.length === 0 ? (
                <div className="py-8 text-center">
                  <ShoppingCart className="w-10 h-10 mx-auto text-slate-300" />

                  <p className="mt-3 text-sm text-slate-500">
                    Your order is empty.
                  </p>

                  <p className="text-xs text-slate-400 mt-1">
                    Add meals from the menu.
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div
                        key={item._id}
                        className="border-b border-slate-100 pb-4"
                      >
                        <div className="flex justify-between gap-3">
                          <div>
                            <h3 className="font-semibold text-slate-900">
                              {item.name}
                            </h3>

                            <p className="text-sm text-slate-500">
                              KSh {item.price.toLocaleString()} each
                            </p>
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeFromCart(item._id)
                            }
                            className="text-slate-400 hover:text-red-600"
                            aria-label={`Remove ${item.name}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <div className="flex items-center border border-slate-200 rounded-lg">
                            <button
                              type="button"
                              onClick={() =>
                                decreaseQuantity(item._id)
                              }
                              className="p-2 hover:bg-slate-50"
                            >
                              <Minus className="w-4 h-4" />
                            </button>

                            <span className="px-3 text-sm font-semibold">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              onClick={() =>
                                increaseQuantity(item._id)
                              }
                              className="p-2 hover:bg-slate-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>

                          <span className="font-bold text-slate-900">
                            KSh{" "}
                            {(
                              item.price * item.quantity
                            ).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-slate-200 mt-5 pt-5">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span>
                        KSh {cartTotal.toLocaleString()}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={placeOrder}
                      disabled={ordering}
                      className="w-full mt-5 rounded-lg bg-green-600 px-4 py-3 font-semibold text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      {ordering
                        ? "Placing Order..."
                        : "Place Order"}
                    </button>
                  </div>
                </>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}