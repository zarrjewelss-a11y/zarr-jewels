"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
export default function CustomerDetailsPage() {
  const { email } = useParams();

  const [orders, setOrders] = useState<any[]>([]);
  const [customer, setCustomer] = useState<any>(null);

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "orders"),
    (snapshot) => {
      const allOrders: any[] = snapshot.docs.map((doc) => ({
  id: doc.id,
  ...(doc.data() as any),
}));
      const customerOrders = allOrders.filter(
        (order: any) =>
          order.customer?.email === decodeURIComponent(email as string)
      );

      setOrders(customerOrders);

      if (customerOrders.length > 0) {
        const first = customerOrders[0];

        setCustomer({
          name: first.customer?.name,
          email: first.customer?.email,
          phone: first.customer?.phone,
        });
      } else {
        setCustomer(null);
      }
    }
  );

  return () => unsubscribe();
}, [email]);
  if (!customer) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl">
        Customer not found
      </div>
    );
  }

  const totalSpent = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  return (
    <div className="min-h-screen bg-pink-50 p-6">
      <div className="max-w-6xl mx-auto">

        <Link
          href="/admin/customers"
          className="inline-flex items-center gap-2 text-pink-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back to Customers
        </Link>

        <div className="bg-white rounded-2xl shadow p-8 mb-8">

          <h1 className="text-4xl font-bold text-pink-600 mb-8">
            Customer Details
          </h1>

          <div className="grid md:grid-cols-2 gap-6">

            <div>
              <p className="text-gray-500">Name</p>
              <p className="font-bold">{customer.name}</p>
            </div>

            <div>
              <p className="text-gray-500">Email</p>
              <p className="font-bold">{customer.email}</p>
            </div>

            <div>
              <p className="text-gray-500">Phone</p>
              <p>{customer.phone}</p>
            </div>

            <div>
              <p className="text-gray-500">Orders</p>
              <p>{orders.length}</p>
            </div>

            <div>
              <p className="text-gray-500">Total Spent</p>
              <p className="text-pink-600 font-bold text-xl">
                Rs. {totalSpent}
              </p>
            </div>

          </div>

        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-pink-600 text-white">
              <tr>
                <th className="text-left p-4">Order ID</th>
                <th className="text-left p-4">Date</th>
                <th className="text-left p-4">Status</th>
                <th className="text-left p-4">Total</th>
                <th className="text-center p-4">Action</th>
              </tr>
            </thead>

            <tbody>

              {orders.map((order) => (

                <tr
                  key={order.id}
                  className="border-b hover:bg-pink-50"
                >
                  <td className="p-4 font-semibold">
                    {order.id}
                  </td>

                  <td className="p-4">
                    {order.date}
                  </td>

                  <td className="p-4">
                    {order.status}
                  </td>

                  <td className="p-4 text-pink-600 font-bold">
                    Rs. {order.total}
                  </td>

                  <td className="p-4">

                    <div className="flex justify-center">

                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
                      >
                        <Eye size={18} />
                      </Link>

                    </div>

                  </td>
                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}