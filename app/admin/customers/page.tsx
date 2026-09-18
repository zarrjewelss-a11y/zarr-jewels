"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, Search, Eye } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "orders"),
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const map = new Map();

      orders.forEach((order: any) => {
          const key = order.customer?.email || "No Email";

          if (map.has(key)) {
            const customer = map.get(key);

            customer.orders += 1;
            customer.totalSpent += Number(order.total || 0);

            map.set(key, customer);
          } else {
            map.set(key, {
              name: order.customer?.name || "Unknown Customer",
              email: order.customer?.email || "No Email",
              phone: order.customer?.phone || "-",
              orders: 1,
              totalSpent: Number(order.total || 0),
            });
          }
        });

      setCustomers(Array.from(map.values()));
    }
  );

  return () => unsubscribe();
}, []);
const filteredCustomers = customers.filter((customer) =>
  (customer.name || "")
    .toLowerCase()
    .includes(search.toLowerCase())
);

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto p-6">

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-pink-600 mb-4"
        >
          <ArrowLeft size={18} />
          Back Dashboard
        </Link>

        <h1 className="text-4xl font-bold text-pink-600 mb-8">
          Customers
        </h1>

        <div className="bg-white rounded-2xl shadow p-5 mb-6">
          <div className="flex items-center border rounded-xl px-4">
            <Search size={18} className="text-gray-400" />

            <input
              type="text"
              placeholder="Search customer..."
              className="w-full p-3 outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">
          <div className="overflow-x-auto">

            <table className="w-full">

              <thead className="bg-pink-600 text-white">
                <tr>
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Phone</th>
                  <th className="text-left p-4">Orders</th>
                  <th className="text-left p-4">Spent</th>
                  <th className="text-center p-4">Action</th>
                </tr>
              </thead>

              <tbody>

                {filteredCustomers.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-10 text-gray-500"
                    >
                      No Customers Found
                    </td>
                  </tr>
                ) : (
                  filteredCustomers.map((customer, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-pink-50"
                    >
                      <td className="p-4 font-semibold">
                        {customer.name}
                      </td>

                      <td className="p-4">
                        {customer.email}
                      </td>

                      <td className="p-4">
                        {customer.phone}
                      </td>

                      <td className="p-4">
                        {customer.orders}
                      </td>

                      <td className="p-4 text-pink-600 font-bold">
                        Rs. {customer.totalSpent}
                      </td>

                      <td className="p-4">
                        <div className="flex justify-center">
                          <Link
  href={`/admin/customers/${encodeURIComponent(customer.email)}`}
  className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg"
>
  <Eye size={18} />
</Link>
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
    </div>
  );
}