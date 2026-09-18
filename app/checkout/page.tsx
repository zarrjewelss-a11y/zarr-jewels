"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/components/context/CartContext";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { onAuthStateChanged, User } from "firebase/auth";
import { db, auth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function CheckoutPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [zip, setZip] = useState("");
  const [loading, setLoading] = useState(false);
  const [shipping, setShipping] = useState(20);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // Coupon States (client-side is just a live preview now — the API
  // route re-validates everything before the order is actually saved)
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);

  // ---- Require login before checkout -------------------------------
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setAuthChecked(true);

      if (!u) {
        toast.error("Please log in to continue checkout.");
        router.push("/login?redirect=/checkout");
        return;
      }

      // Prefill email if available
      if (u.email) setEmail(u.email);
    });

    return () => unsub();
  }, [router]);

  useEffect(() => {
    const loadStoreSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "store");
        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const settings = settingsSnap.data();
          setShipping(Number(settings.shipping ?? 20));
        }
      } catch (error) {
        console.error("Failed to load store settings:", error);
        setShipping(20);
      }
    };

    loadStoreSettings();
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const discountAmount = ((total + shipping) * discount) / 100;
  const grandTotal = total + shipping - discountAmount;

  // ---- Coupon preview (display only, not authoritative) -------------
  const applyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Please enter coupon code.");
      return;
    }

    try {
      const q = query(
        collection(db, "coupons"),
        where("code", "==", couponCode.trim().toUpperCase())
      );

      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        toast.error("Invalid coupon.");
        return;
      }

      const couponDoc = snapshot.docs[0];
      const coupon = { id: couponDoc.id, ...couponDoc.data() } as any;

      if (!coupon.active) {
        toast.error("Coupon is inactive.");
        return;
      }
      if (new Date(coupon.expiry) < new Date()) {
        toast.error("Coupon has expired.");
        return;
      }
      if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
        toast.error("Coupon usage limit reached.");
        return;
      }
      if (coupon.minOrder > 0 && total < coupon.minOrder) {
        toast.error(`Minimum order should be Rs. ${coupon.minOrder}`);
        return;
      }

      setDiscount(Number(coupon.discount));
      setAppliedCoupon(coupon);
      toast.success(`${coupon.discount}% discount applied!`);
    } catch (error) {
      console.error("Coupon error:", error);
      toast.error("Failed to apply coupon.");
    }
  };

  // ---- Place order via the secure API route --------------------------
  const placeOrder = async () => {
    if (!user) {
      toast.error("Please log in to continue checkout.");
      router.push("/login?redirect=/checkout");
      return;
    }

    if (cart.length === 0) {
      toast.error("Your cart is empty!");
      return;
    }

    if (
      !name.trim() ||
      !email.trim() ||
      !phone.trim() ||
      !city.trim() ||
      !address.trim() ||
      !zip.trim()
    ) {
      toast.error("Please fill in all billing details.");
      return;
    }

    setLoading(true);

    try {
      const idToken = await user.getIdToken();

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          items: cart.map((item) => ({
            id: item.id,
            quantity: item.quantity,
          })),
          customer: {
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
          },
          shippingInfo: {
            address: address.trim(),
            city: city.trim(),
            zip: zip.trim(),
          },
          paymentMethod,
          couponCode: appliedCoupon ? couponCode.trim() : "",
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        switch (data.error) {
          case "PRODUCT_NOT_FOUND":
            toast.error(`${data.detail} is no longer available.`);
            break;
          case "INSUFFICIENT_STOCK":
            toast.error(
              `${data.detail.name}: only ${data.detail.stock} available.`
            );
            break;
          case "INVALID_COUPON":
            toast.error("Coupon is no longer valid.");
            break;
          case "COUPON_INACTIVE":
            toast.error("Coupon is inactive.");
            break;
          case "COUPON_EXPIRED":
            toast.error("Coupon has expired.");
            break;
          case "COUPON_LIMIT_REACHED":
            toast.error("Coupon usage limit reached.");
            break;
          case "COUPON_MIN_ORDER":
            toast.error(`Minimum order should be Rs. ${data.detail}`);
            break;
          case "UNAUTHENTICATED":
            toast.error("Please log in to continue checkout.");
            router.push("/login?redirect=/checkout");
            break;
          case "MISSING_BILLING_DETAILS":
            toast.error("Please fill in all billing details.");
            break;
          case "EMPTY_CART":
            toast.error("Your cart is empty!");
            break;
          default:
            toast.error("Something went wrong while placing your order.");
        }
        return;
      }

      toast.success("Order placed successfully! 🎉");
      clearCart();

      setTimeout(() => {
        router.push(`/invoice/${data.orderId}`);
      }, 800);
    } catch (error) {
      console.error("ORDER ERROR:", error);
      toast.error("Something went wrong while placing your order.");
    } finally {
      setLoading(false);
    }
  };

  if (!authChecked) {
    return (
      <>
        <Header />
        <section className="min-h-screen flex items-center justify-center bg-gray-50">
          <p className="text-gray-500">Loading checkout...</p>
        </section>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <section className="min-h-screen bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl font-bold text-center mb-12">Checkout</h1>
          <p className="text-center text-gray-500 mt-4 mb-10">
            Complete your order securely and enjoy our luxury jewelry
            collection.
          </p>

          <div className="grid lg:grid-cols-3 gap-10">
            {/* Billing Details */}
            <div className="lg:col-span-2 bg-white rounded-3xl shadow p-8">
              <h2 className="text-3xl font-bold mb-8">Billing Details</h2>

              <div className="grid md:grid-cols-2 gap-6">
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />

                <input
                  type="text"
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="border rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <textarea
                rows={5}
                placeholder="Full Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full border rounded-xl p-4 mt-6 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <input
                type="text"
                placeholder="ZIP Code"
                value={zip}
                onChange={(e) => setZip(e.target.value)}
                className="w-full border rounded-xl p-4 mt-6 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />

              <div className="mt-8">
                <h3 className="text-xl font-bold mb-4">Payment Method</h3>

                <label className="flex items-center gap-3 mb-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="Cash on Delivery"
                    checked={paymentMethod === "Cash on Delivery"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Cash on Delivery
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    value="Credit / Debit Card"
                    checked={paymentMethod === "Credit / Debit Card"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  Credit / Debit Card
                </label>
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-3xl shadow p-8 h-fit">
              <h2 className="text-3xl font-bold mb-8">Order Summary</h2>

              <div className="bg-pink-50 rounded-2xl p-4 mb-6">
                <h3 className="font-bold mb-3">Apply Coupon</h3>

                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="text"
                    placeholder="Enter coupon code"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 border rounded-xl px-4 py-3"
                  />

                  <button
                    onClick={applyCoupon}
                    className="bg-pink-600 text-white px-6 rounded-xl hover:bg-pink-700"
                  >
                    Apply
                  </button>
                </div>

                {appliedCoupon && (
                  <p className="text-green-600 mt-3 font-semibold">
                    ✅ {appliedCoupon.code} Applied
                  </p>
                )}
              </div>

              <div className="space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>
                      {item.name} × {item.quantity}
                    </span>
                    <span>Rs. {item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              <hr className="my-6" />

              <div className="flex justify-between mb-4">
                <span>Subtotal</span>
                <span>Rs. {total}</span>
              </div>

              <div className="flex justify-between mb-4">
                <span>Shipping</span>
                <span>Rs. {shipping}</span>
              </div>

              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>- Rs. {discountAmount.toFixed(2)}</span>
              </div>

              <p className="text-xs text-gray-400 mt-2">
                Final total is confirmed securely when you place the order.
              </p>

              <hr className="my-6" />

              <div className="flex justify-between text-2xl font-bold">
                <span>Grand Total</span>
                <span className="text-pink-600">
                  Rs. {grandTotal.toFixed(2)}
                </span>
              </div>

              <button
                onClick={placeOrder}
                disabled={loading}
                className="w-full mt-8 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white py-4 rounded-full font-semibold transition"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>

              <button
                onClick={() => router.push("/cart")}
                className="w-full mt-4 border-2 border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white py-4 rounded-full font-semibold transition"
              >
                Back to Cart
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}