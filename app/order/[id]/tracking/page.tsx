"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle,
  Circle,
  Truck,
} from "lucide-react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";

export default function TrackingPage() {
  const { id } = useParams();
  const [order, setOrder] = useState<any>(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  const unsubscribe = onSnapshot(
    doc(db, "orders", id as string),
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

  const trackingNumber = order?.trackingNumber || `TRK-${id}`;
  const estimatedDelivery = (() => {
  if (!order?.date) return "Not Available";

  const date = new Date(order.date);

  if (isNaN(date.getTime())) {
    return order.estimatedDelivery || "Not Available";
  }

  date.setDate(date.getDate() + 5);

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
})();

  const history = order.history || [];
  const currentStatus = order.status;
  const allSteps = [
  "Order Placed",
  "Payment Confirmed",
  "Packed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
];
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
  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <Link
          href={`/order/${id}`}
          className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-8"
        >
          <ArrowLeft size={18} />
          Back to Order
        </Link>

        <div className="bg-white rounded-2xl shadow p-8">

          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold text-pink-600">
                Track Order
              </h1>

              <p className="text-gray-500 mt-2">
                Order ID: #{id}
              </p>

              <p className="text-gray-500">
                Tracking Number: {trackingNumber}
              </p>
            </div>

            <Truck className="text-pink-600" size={48} />
          </div>

          <div className="mt-10 border-t pt-8">

            <h2 className="text-2xl font-bold mb-8">
              Order Progress
            </h2>

            <div className="space-y-8">
              {allSteps.map((title, index) => {
  const completedStep = history.find(
    (item: any) => item.status === title
  );

  return (
    <div
      key={index}
      className="relative flex items-start gap-4 pb-8"
    >
      {/* Vertical Line */}
      {index !== allSteps.length - 1 && (
        <div className="absolute left-[13px] top-8 h-full w-[2px] bg-gray-300"></div>
      )}

      {/* Icon */}
      <div className="relative z-10 bg-white">
        {title === currentStatus ? (
  <CheckCircle
    size={28}
    className="text-pink-600"
  />
) : completedStep ? (
  <CheckCircle
    size={28}
    className="text-green-600"
  />
) : (
  <Circle
    size={28}
    className="text-gray-300"
  />
)}
      </div>

      {/* Text */}
      <div>
        <h3
          className={`font-semibold text-lg ${
  title === currentStatus
    ? "text-pink-600"
    : completedStep
    ? "text-green-700"
    : "text-gray-500"
}`}
        >
          {title}
        </h3>

        <p className="text-sm text-gray-500">
          {completedStep
            ? completedStep.time
            : "Pending"}
        </p>
      </div>
    </div>
  );
})}
            </div>

          </div>

          <div className="mt-10 border-t pt-6">

            <div className="flex justify-between flex-wrap gap-3">
              <span className="font-semibold">
                Estimated Delivery
              </span>

              <span className="text-pink-600 font-bold">
                {order.status === "Delivered"
  ? "Delivered Successfully"
  : estimatedDelivery}
              </span>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}