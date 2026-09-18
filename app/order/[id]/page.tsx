"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { getAuth } from "firebase/auth";

import {
  ArrowLeft,
  PackageCheck,
  Truck,
  MapPin,
  CreditCard,
} from "lucide-react";
import TrackingTimeline from "@/components/TrackingTimeline";
import { Star, X } from "lucide-react";
import {
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function OrderDetailsPage() {
  const params = useParams();
const id = params.id as string;

const [order, setOrder] = useState<any>(null);
const [loading, setLoading] = useState(true);
const [showReviewModal, setShowReviewModal] = useState(false);
const [rating, setRating] = useState(5);
const [review, setReview] = useState("");
const [submitting, setSubmitting] = useState(false);

useEffect(() => {
  if (!id) return;

  const unsubscribe = onSnapshot(
    doc(db, "orders", id),
    (docSnap) => {
      if (docSnap.exists()) {
        setOrder({
          id: docSnap.id,
          ...docSnap.data(),
        });
      } else {
        setOrder(null);
      }

      setLoading(false);
    },
    (error) => {
      console.error(error);
      setLoading(false);
    }
  );

  return () => unsubscribe();
}, [id]);

if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
      Loading...
    </div>
  );
}

if (!order) {
  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
      Order Not Found
    </div>
  );
}

const subtotal = order.items.reduce(
  (sum: number, item: any) => sum + item.price * item.qty,
  0
);

const shipping = Number(order.shippingCost ?? 0);
const total = Number(order.total ?? subtotal + shipping);

const estimatedDelivery = order.estimatedDelivery ?? "Not available";
const submitReview = async () => {
  if (!review.trim()) {
    alert("Please write your review.");
    return;
  }

  if (!order?.items?.[0]?.id) {
    alert("Product information is missing.");
    return;
  }

  try {
    setSubmitting(true);

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Please login to submit a review.");
      return;
    }

    const idToken = await user.getIdToken();

    const response = await fetch("/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${idToken}`,
      },
      body: JSON.stringify({
        orderId: order.id,
        productId: String(order.items[0].id),
        rating,
        review: review.trim(),
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      if (data.error === "REVIEW_ALREADY_EXISTS") {
        alert("You have already reviewed this product for this order.");
      } else if (data.error === "ORDER_NOT_DELIVERED") {
        alert("You can only review a delivered order.");
      } else if (data.error === "PRODUCT_NOT_PURCHASED") {
        alert("You can only review a product you purchased.");
      } else {
  alert(data.error || "Failed to submit review.");
}
      return;
    }

    alert("Review submitted successfully!");

    setReview("");
    setRating(5);
    setShowReviewModal(false);
  } catch (error) {
    console.error("Review submission error:", error);
    alert("Failed to submit review.");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <Link
         href="/order"
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>

        <div className="bg-white rounded-2xl shadow p-6 mb-8 flex flex-col md:flex-row justify-between">
          <div>
            <h1 className="text-3xl font-bold text-pink-600">
              Order {order.id}
            </h1>

            <p className="text-gray-500 mt-2">
              Placed on {order.date}
            </p>
          </div>

          <div className="mt-5 md:mt-0">
  <span
    className={`px-4 py-2 rounded-full font-semibold
      ${
        order.status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : order.status === "Processing"
          ? "bg-blue-100 text-blue-700"
          : order.status === "Shipped"
          ? "bg-purple-100 text-purple-700"
          : order.status === "Delivered"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
  >
    {order.status}
  </span>
</div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className="lg:col-span-2 space-y-6">

            <div className="bg-white rounded-2xl shadow p-6">

              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <PackageCheck className="text-pink-600" />
                Ordered Products
              </h2>

 <div className="space-y-6">
  {order.items.map((item: any) => (
    <div
      key={item.id}
      className="flex gap-5 border-b pb-5"
    >
      <img
        src={item.image}
        alt={item.name}
        className="w-24 h-24 object-cover rounded-xl"
      />

      <div className="flex-1">
        <h3 className="font-bold">
          {item.name}
        </h3>

        <p className="text-gray-500">
          Quantity: {item.qty}
        </p>

        <p className="text-pink-600 font-semibold mt-2">
          Rs. {item.price}
        </p>
      </div>
    </div>
  ))}
  {showReviewModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
    <div className="bg-white rounded-2xl w-full max-w-lg p-6 relative">

      <button
        onClick={() => setShowReviewModal(false)}
        className="absolute right-4 top-4 text-gray-500 hover:text-red-500"
      >
        <X size={22} />
      </button>

      <h2 className="text-2xl font-bold mb-6 text-center">
        ⭐ Write a Review
      </h2>

      <p className="text-gray-500 mb-3">
        Rate your experience
      </p>

      <div className="flex gap-2 mb-6">
        {[1,2,3,4,5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
          >
            <Star
              size={32}
              className={
                star <= rating
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }
            />
          </button>
        ))}
      </div>

      <textarea
        value={review}
        onChange={(e) => setReview(e.target.value)}
        rows={5}
        placeholder="Share your experience..."
        className="w-full border rounded-xl p-3 mb-6"
      />

      <button
  onClick={submitReview}
  disabled={submitting}
  className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
>
  {submitting ? "Submitting..." : "Submit Review"}
</button>

    </div>
  </div>
)}
</div>

</div>

<div className="bg-white rounded-2xl shadow p-6">

  <h2 className="font-bold text-xl flex items-center gap-2 mb-5">
    <MapPin className="text-pink-600" />
    Shipping Address
  </h2>

  <p>{order.customer?.name}</p>
  <p>{order.shipping?.address}</p>
  <p>
    {order.shipping?.city}, {order.shipping?.country}
  </p>
  <p>{order.customer?.phone}</p>

</div>

<div className="bg-white rounded-2xl shadow p-6">

  <h2 className="font-bold text-xl flex items-center gap-2 mb-4">
    <CreditCard className="text-pink-600" />
    Payment
  </h2>

  <p>{order.payment}</p>

</div>

          </div>

          <div>

            <div className="bg-white rounded-2xl shadow p-6 sticky top-24">
              <div className="mb-8">
  <h2 className="text-2xl font-bold mb-6">
    Tracking Timeline
  </h2>

  <TrackingTimeline
  status={order.status}
  order={order}
/>
</div>
<div className="mb-8">

  <div className="bg-pink-50 border border-pink-200 rounded-xl p-4 mb-6">
    <p className="text-sm text-gray-500">
      Estimated Delivery
    </p>

    <h3 className="text-lg font-bold text-pink-600">
      {estimatedDelivery}
    </h3>
  </div>

  <div className="bg-white border rounded-xl p-4 mb-6">
    <div className="flex justify-between mb-3">
      <span className="text-gray-500">Courier</span>
      <span className="font-semibold text-blue-600">
        TCS Express
      </span>
    </div>

    <div className="flex justify-between">
      <span className="text-gray-500">Tracking ID</span>
      <span className="font-semibold text-pink-600">
        {order.id}
      </span>
    </div>
  </div>

</div>
<hr className="mb-8" />

              <h2 className="font-bold text-2xl mb-6">
                Order Summary
              </h2>

              <div className="flex justify-between mb-3">
                <span>Subtotal</span>
                <span>Rs. {subtotal}</span>
              </div>

              <div className="flex justify-between mb-3">
                <span>Shipping</span>
                <span>Rs. {shipping}</span>
              </div>

              <hr className="my-5" />

              <div className="flex justify-between font-bold text-xl">
                <span>Total</span>
                <span className="text-pink-600">
                  Rs. {total}
                </span>
              </div>

              <Link
                href={`/order/${id}/tracking`}
                className="mt-8 flex justify-center items-center gap-2 w-full bg-pink-600 hover:bg-pink-700 transition text-white py-3 rounded-xl"
              >
                <Truck size={18} />
                Track Order
              </Link>
              <Link
  href={`/invoice/${id}`}
  className="mt-4 block text-center border border-gray-300 text-gray-700 py-3 rounded-xl hover:bg-gray-50"
>
  View Invoice
</Link>

              <Link
                href="/shop"
                className="mt-4 block text-center border border-pink-600 text-pink-600 py-3 rounded-xl hover:bg-pink-50"
              >
                Continue Shopping
              </Link>
             {order.status === "Delivered" && (
  <button
    onClick={() => setShowReviewModal(true)}
    className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl"
  >
    ⭐ Write a Review
  </button>
)}

</div>

            </div>

          </div>

        </div>

      </div>
  );
}