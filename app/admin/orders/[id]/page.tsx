"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
} from "lucide-react";

export default function AdminOrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

useEffect(() => {
  const loadOrder = async () => {
  try {
    const docRef = doc(db, "orders", String(id));
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      setOrder({
        id: docSnap.id,
        ...docSnap.data(),
      });
    } else {
      alert("Order not found.");
      router.push("/admin/orders");
    }
  } catch (error) {
    console.error(error);
    alert("Failed to load order.");
  } finally {
    setLoading(false);
  }
};
  if (id) {
  loadOrder().finally(() => {
    setLoading(false);
  });
}
}, [id, router]);

const updateStatus = async (status: string) => {
  try {
    await updateDoc(doc(db, "orders", String(id)), {
      status,
      updatedAt: new Date().toISOString(),

      history: arrayUnion({
        status,
        time: new Date().toLocaleString(),
      }),
    });

    setOrder((prev: any) => ({
      ...prev,
      status,
    }));

    alert("Order status updated.");
  } catch (error) {
    console.error(error);
    alert("Failed to update order status.");
  }
};

  if (loading) {
  return (
    <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
      Loading...
    </div>
  );
}

if (!order) {
  return (
    <div className="min-h-screen flex items-center justify-center text-2xl">
      Order not found
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#F8F5ED] p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow p-8">
        <div className="bg-gradient-to-r from-[#B08D57] to-[#D4AF6A] text-white rounded-2xl p-8 mb-8">

  <div className="flex justify-between items-center">

    <div>
      <h1 className="text-4xl font-bold">
        ZARR JEWELS
      </h1>

      <p className="opacity-90 mt-2">
        Luxury Jewelry For Every Girl
      </p>
    </div>

    <div className="text-right">

      <h2 className="text-2xl font-bold">
        INVOICE
      </h2>

      <p className="mt-2">
        Order ID: {order.id}
      </p>

      <p>
        Date: {order.date}
      </p>

      <p>
        Status: {order.status}
      </p>

    </div>

  </div>

</div>

        <Link
          href="/admin/orders"
          className="inline-flex items-center gap-2 text-[#B08D57] mb-6"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </Link>

        <h1 className="text-4xl font-bold text-[#B08D57] mb-8">
          Order Details
          <div className="flex justify-end mb-6">

  <button
    onClick={() => window.print()}
    className="flex items-center gap-2 bg-[#B08D57] hover:bg-[#96733F] text-white px-5 py-3 rounded-xl"
  >
    <Printer size={18} />
    Print Invoice
  </button>

</div>
        </h1>

        <div className="grid md:grid-cols-2 gap-6 mb-8">

          <div>
            <p className="text-gray-500">Order ID</p>
            <p className="font-bold">{order.id}</p>
          </div>

          <div>
            <p className="text-gray-500">Customer</p>
            <p className="font-bold">
  {order.customer?.name}
</p>
          </div>

          <div>
            <p className="text-gray-500">Phone</p>
            <p>{order.customer?.phone}</p>
          </div>

          <div>
            <p className="text-gray-500">Payment</p>
            <p>{order.payment}</p>
          </div>

          <div className="md:col-span-2">
            <p className="text-gray-500">Address</p>
            <p>
              {order.shipping?.address},{" "}
              {order.shipping?.city},{" "}
              {order.shipping?.zip}
            </p>
          </div>

        </div>

        <h2 className="text-2xl font-bold mb-4">
          Products
        </h2>

        <div className="space-y-4 mb-8">

          {order.items?.map((item: any, index: number) => (
            <div
              key={index}
              className="flex justify-between border rounded-xl p-4"
            >
<div className="flex gap-4 items-center">
  <img
    src={item.image}
    alt={item.name}
    className="w-20 h-20 object-cover rounded-xl border"
  />

  <div>
    <h3 className="font-semibold">
      {item.name}
    </h3>

    <p>
      Qty: {item.qty}
    </p>

    <p className="text-sm text-gray-500">
      Rs. {item.price} × {item.qty}
    </p>
  </div>
</div>

<div className="font-bold text-[#B08D57]">
  Rs. {item.price * item.qty}
</div>
            </div>
          ))}

        </div>
{order.coupon && (
  <div className="mb-6 rounded-xl border border-green-200 bg-green-50 p-4">
    <h3 className="font-semibold text-green-700 mb-2">
      Coupon Applied
    </h3>

    <div className="flex justify-between">
      <span>Coupon Code</span>
      <span>{order.coupon.code}</span>
    </div>

    <div className="flex justify-between">
      <span>Discount</span>
      <span className="text-green-600">
        - Rs. {order.discountAmount}
      </span>
    </div>
  </div>
)}
        <div className="border-t pt-6">

  <div className="space-y-3 mb-6">

    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>Rs. {order.subtotal || order.total}</span>
    </div>

    <div className="flex justify-between">
      <span>Shipping</span>
      <span>Rs. {order.shippingCost || 0}</span>
    </div>

    {order.discountAmount > 0 && (
      <div className="flex justify-between text-green-600">
        <span>Discount</span>
        <span>- Rs. {order.discountAmount}</span>
      </div>
    )}

    <div className="flex justify-between border-t pt-3 text-2xl font-bold text-[#B08D57]">
      <span>Grand Total</span>
      <span>Rs. {order.total}</span>
    </div>

  </div>

  <div className="flex justify-end">
    <select
      value={order.status}
      onChange={(e) => updateStatus(e.target.value)}
      className="border rounded-xl p-3"
    >
      <option>Pending</option>
<option>Processing</option>
<option>Shipped</option>
<option>Out for Delivery</option>
<option>Delivered</option>
<option>Cancelled</option>
    </select>
  </div>

</div>

    </div> {/* print-area end */}
    </div>
  );
}