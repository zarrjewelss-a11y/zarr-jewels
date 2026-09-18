"use client";

import { useEffect, useState } from "react";
import {
  collection,
  onSnapshot,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import Link from "next/link";
import { ArrowLeft, Eye, Search, Trash2 } from "lucide-react";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [search, setSearch] = useState("");
const [statusFilter, setStatusFilter] = useState("All");

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "orders"),
    (snapshot) => {
      const list = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setOrders(list);
    }
  );

  return () => unsubscribe();
}, []);

  const filteredOrders = orders.filter((order) => {
  const matchesSearch =
    order.customer?.name
      ?.toLowerCase()
      .includes(search.toLowerCase()) ||
    order.id
      ?.toLowerCase()
      .includes(search.toLowerCase());

  const matchesStatus =
    statusFilter === "All" ||
    order.status === statusFilter;

  return matchesSearch && matchesStatus;
});
const updateStatus = async (id: string, status: string) => {
  try {
    const updateData: any = { status };

    if (status === "Out for Delivery") {
      updateData.outForDeliveryDate = new Date().toLocaleDateString("en-GB");
    }

    if (status === "Delivered") {
      updateData.deliveredDate = new Date().toLocaleDateString("en-GB");
    }

    await updateDoc(doc(db, "orders", id), updateData);
  } catch (error) {
    console.error(error);
    alert("Failed to update status.");
  }
};
const deleteOrder = async (id: string) => {
  const confirmDelete = window.confirm(
    "Are you sure you want to delete this order?"
  );

  if (!confirmDelete) return;

  try {
    await deleteDoc(doc(db, "orders", id));
    alert("Order deleted successfully!");
  } catch (error) {
    console.error(error);
    alert("Failed to delete order.");
  }
};
const pendingCount = orders.filter(
  (o) => o.status === "Pending"
).length;

const processingCount = orders.filter(
  (o) => o.status === "Processing"
).length;

const shippedCount = orders.filter(
  (o) => o.status === "Shipped"
).length;
const outForDeliveryCount = orders.filter(
  (o) => o.status === "Out for Delivery"
).length;
const deliveredCount = orders.filter(
  (o) => o.status === "Delivered"
).length;

const cancelledCount = orders.filter(
  (o) => o.status === "Cancelled"
).length;
const totalOrders = orders.length;

const totalRevenue = orders.reduce(
  (sum, order) => sum + Number(order.total || 0),
  0
);

const averageOrderValue =
  totalOrders > 0
    ? (totalRevenue / totalOrders).toFixed(2)
    : "0";
  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto p-6">
<div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
  <select
    value={statusFilter}
    onChange={(e) => setStatusFilter(e.target.value)}
    className="border rounded-xl px-4 py-3 outline-none"
  >
   <option value="Pending">Pending</option>
<option value="Processing">Processing</option>
<option value="Shipped">Shipped</option>
<option value="Out for Delivery">Out for Delivery</option>
<option value="Delivered">Delivered</option>
<option value="Cancelled">Cancelled</option>
  </select>
  <div className="bg-white rounded-2xl shadow p-4 text-center">
    <p className="text-gray-500 text-sm">Revenue</p>
    <h2 className="text-3xl font-bold text-green-600">
      Rs. {orders.reduce((sum, order) => sum + Number(order.total || 0), 0)}
    </h2>
  </div>

  <div className="bg-yellow-100 rounded-2xl shadow p-4 text-center">
    <p className="text-yellow-700">Pending</p>
    <h2 className="text-3xl font-bold">{pendingCount}</h2>
  </div>

  <div className="bg-blue-100 rounded-2xl shadow p-4 text-center">
    <p className="text-blue-700">Processing</p>
    <h2 className="text-3xl font-bold">{processingCount}</h2>
  </div>

  <div className="bg-purple-100 rounded-2xl shadow p-4 text-center">
    <p className="text-purple-700">Shipped</p>
    <h2 className="text-3xl font-bold">{shippedCount}</h2>
  </div>
<div className="bg-indigo-100 rounded-2xl shadow p-4 text-center">
  <p className="text-indigo-700">Out for Delivery</p>
  <h2 className="text-3xl font-bold">
    {outForDeliveryCount}
  </h2>
</div>
  <div className="bg-green-100 rounded-2xl shadow p-4 text-center">
    <p className="text-green-700">Delivered</p>
    <h2 className="text-3xl font-bold">{deliveredCount}</h2>
  </div>

  <div className="bg-red-100 rounded-2xl shadow p-4 text-center">
    <p className="text-red-700">Cancelled</p>
    <h2 className="text-3xl font-bold">{cancelledCount}</h2>
  </div>

</div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-3"
            >
              <ArrowLeft size={18} />
              Back Dashboard
            </Link>

            <h1 className="text-4xl font-bold text-pink-600">
              Orders
            </h1>
          </div>

        </div>

        <div className="bg-white rounded-2xl shadow p-5 mb-6">

          <div className="flex items-center border rounded-xl px-4">

            <Search className="text-gray-400" size={18} />

            <input
              type="text"
              placeholder="Search customer..."
              className="w-full p-3 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

          </div>

        </div>

<div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-8">
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">

</div>

</div>
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-pink-600 text-white">

                <tr>
                  <th className="text-left p-4">Order ID</th>
                  <th className="text-left p-4">Customer</th>
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Total</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-center p-4">Action</th>
                </tr>

              </thead>

              <tbody>

                {filteredOrders.length === 0 ? (

                  <tr>

                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      No orders found.
                    </td>

                  </tr>

                ) : (

                  filteredOrders.map((order) => (

                    <tr
                      key={order.id}
                      className="border-b hover:bg-pink-50"
                    >

                      <td className="p-4 font-semibold">
                        {order.id}
                      </td>

                      <td className="p-4">
                        {order.customer?.name}
                      </td>

                      <td className="p-4">
                        {order.date}
                      </td>

                      <td className="p-4 font-bold text-pink-600">
                        Rs. {order.total}
                      </td>

                     <td className="p-4">
  <select
    value={order.status}
    onChange={(e) =>
      updateStatus(order.id, e.target.value)
    }
    className={`px-3 py-2 rounded-lg font-semibold border outline-none
      ${
        order.status === "Pending"
          ? "bg-yellow-100 text-yellow-700"
          : order.status === "Processing"
          ? "bg-blue-100 text-blue-700"
          : order.status === "Shipped"
          ? "bg-purple-100 text-purple-700"
          : order.status === "Out for Delivery"
? "bg-indigo-100 text-indigo-700"
          : order.status === "Delivered"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
  >
    <option>Pending</option>
<option>Processing</option>
<option>Shipped</option>
<option>Out for Delivery</option>
<option>Delivered</option>
<option>Cancelled</option>
  </select>
</td>

                      <td className="p-4">

                        <div className="flex justify-center gap-2">

  <Link
    href={`/admin/orders/${order.id}`}
    className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
  >
    <Eye size={18} />
  </Link>

  <button
    onClick={() => deleteOrder(order.id)}
    className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
  >
    <Trash2 size={18} />
  </button>

</div>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

        </div>
  );
}