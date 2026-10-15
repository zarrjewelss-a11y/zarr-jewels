"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/context/CartContext";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";

export default function CartPage() {
  const router = useRouter();
  const {
    cart,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();
const [coupon, setCoupon] = useState("");
const [discount, setDiscount] = useState(0);
const [message, setMessage] = useState("");
  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
const shipping = total > 0 ? 20 : 0;
const grandTotal = total + shipping - discount;
const applyCoupon = () => {
  if (coupon.toUpperCase() === "SAVE10") {
    setDiscount(total * 0.1);
    setMessage("✅ SAVE10 Applied (10% OFF)");
  } else if (coupon.toUpperCase() === "ZARR20" || coupon.toUpperCase() === "NEXA20") {
    setDiscount(total * 0.2);
    setMessage(`✅ ${coupon.toUpperCase()} Applied (20% OFF)`);
  } else {
    setDiscount(0);
    setMessage("❌ Invalid Coupon Code");
  }
};
  return (
    <>
      <Header />

      <section className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-12">
            Shopping Cart
          </h1>

          {cart.length === 0 ? (
            <div className="bg-white rounded-3xl shadow p-16 text-center">
              <ShoppingBag
                size={70}
                className="mx-auto text-pink-600 mb-5"
              />

              <h2 className="text-3xl font-bold">
                Your cart is empty
              </h2>

              <p className="text-gray-500 mt-3">
              <Link href="/shop">
  <button className="mt-8 bg-pink-600 text-white px-8 py-3 rounded-full hover:bg-pink-700 transition">
    Shop Now
  </button>
</Link>  Add some beautiful jewelry to your cart.
              </p>
            </div>
          ) : (
            <div className="grid lg:grid-cols-3 gap-10">

              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-6">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="bg-white rounded-3xl shadow p-5 flex items-center gap-5"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-28 h-28 object-cover rounded-2xl"
                    />

                    <div className="flex-1">
                      <h3 className="text-2xl font-bold">
                        {item.name}
                      </h3>

                      <p className="text-pink-600 font-bold text-xl mt-2">
                        ${item.price}
                      </p>

                      <div className="flex items-center gap-3 mt-4">
                        <button
                          onClick={() => decreaseQuantity(item.id)}
                          className="w-9 h-9 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center"
                        >
                          <Minus size={16} />
                        </button>

                        <span className="font-bold text-lg">
                          {item.quantity}
                        </span>

                        <button
                          onClick={() => increaseQuantity(item.id)}
                          className="w-9 h-9 rounded-full bg-pink-600 text-white hover:bg-pink-700 flex items-center justify-center"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:bg-red-50 p-3 rounded-full"
                    >
                      <Trash2 size={22} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="bg-white rounded-3xl shadow p-8 h-fit">
                <h2 className="text-3xl font-bold mb-8">
                  Order Summary
                </h2>

                <div className="flex justify-between text-lg mb-4">
                  <span>Items</span>
                  <span>{cart.length}</span>
                </div>

                <div className="flex justify-between text-lg mb-4">
                  <span>Total Quantity</span>
                  <span>
                    {cart.reduce(
                      (sum, item) => sum + item.quantity,
                      0
                    )}
                  </span>
                </div>

                <div className="flex justify-between mb-4">
                  <span>Subtotal</span>
                  <span>${total.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-4">
                  <span>Shipping</span>
                  <span>${shipping.toFixed(2)}</span>
                </div>

                <div className="flex justify-between mb-4 text-green-600">
                  <span>Discount</span>
                  <span>- ${discount.toFixed(2)}</span>
                </div>

                <hr className="my-5" />

                <div className="flex justify-between text-2xl font-bold">
                  <span>Grand Total</span>
                  <span className="text-pink-600">
                    ${grandTotal.toFixed(2)}
                  </span>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-semibold mb-2">
                    Coupon Code
                  </label>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon"
                      value={coupon}
                      onChange={(e) => setCoupon(e.target.value)}
                      className="flex-1 border rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-500"
                    />

                    <button
                      onClick={applyCoupon}
                      className="bg-pink-600 hover:bg-pink-700 text-white px-6 rounded-xl"
                    >
                      Apply
                    </button>
                  </div>

                  {message && (
                    <p
                      className={`mt-3 text-sm font-medium ${
                        message.includes("Invalid")
                          ? "text-red-500"
                          : "text-green-600"
                      }`}
                    >
                      {message}
                    </p>
                  )}
                </div>

                <button
  type="button"
  onClick={() => {
    router.push(
      `/checkout?coupon=${encodeURIComponent(
        coupon.toUpperCase()
      )}&discount=${encodeURIComponent(
        discount.toString()
      )}`
    );
  }}
  className="w-full mt-8 bg-[#B08D57] hover:bg-[#96733F] text-white py-4 rounded-full font-semibold transition"
>
  Proceed to Checkout
</button>

                <Link href="/shop">
                  <button className="w-full mt-4 border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white py-4 rounded-full transition">
                    Continue Shopping
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}