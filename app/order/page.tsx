"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";

import { getAuth } from "firebase/auth";

type Order = {
  id: string;
  date: string;
  total: number;
  status: string;
};

export default function OrdersPage() {
    const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const auth = getAuth();
      const user = auth.currentUser;

      if (!user) {
        router.replace("/login");
        return;
      }

      const q = query(
        collection(db, "orders"),
        where("userId", "==", user.uid)
      );

      const snapshot = await getDocs(q);

      const data: Order[] = snapshot.docs.map((doc) => ({
        ...(doc.data() as Order),
      }));

      data.sort((a: any, b: any) => {
        const dateA = a.createdAt?.toMillis
          ? a.createdAt.toMillis()
          : 0;

        const dateB = b.createdAt?.toMillis
          ? b.createdAt.toMillis()
          : 0;

        return dateB - dateA;
      });

      setOrders(data);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Orders...
      </div>
    );
  }

  return (
    <>
      <Header />

      <section className="min-h-screen bg-pink-50 py-12">
        <div className="max-w-6xl mx-auto px-4">

          <h1 className="text-5xl font-bold text-center text-pink-600">
            My Orders
          </h1>

          <p className="text-center text-gray-500 mt-3 mb-10">
            Track and manage all your jewelry orders.
          </p>

          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl shadow p-10 text-center">

              <h2 className="text-2xl font-bold mb-3">
                No Orders Found
              </h2>

              <p className="text-gray-500 mb-8">
                You haven't placed any orders yet.
              </p>

              <Link
                href="/shop"
                className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl"
              >
                Continue Shopping
              </Link>

            </div>
          ) : (
            <div className="space-y-6">

              {orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col md:flex-row justify-between items-start md:items-center"
                >
                  <div>

                    <h2 className="text-2xl font-bold">
                      {order.id}
                    </h2>

                    <p className="text-gray-500 mt-2">
                      {order.date}
                    </p>

                    <p className="mt-2">
                      <span className="font-semibold">
                        Status:
                      </span>{" "}
                      <span className="text-yellow-600">
                        {order.status}
                      </span>
                    </p>

                  </div>

                  <div className="mt-6 md:mt-0 text-right">

                    <h3 className="text-3xl font-bold text-pink-600">
                      Rs. {order.total}
                    </h3>

                    <div className="flex gap-3 justify-end mt-4">

                      <Link
                        href={`/order/${order.id}`}
                        className="bg-gray-800 hover:bg-black text-white px-5 py-3 rounded-xl"
                      >
                        View Details
                      </Link>

                      <Link
                        href={`/invoice/${order.id}`}
                        className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl"
                      >
                        Invoice
                      </Link>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </section>

      <Footer />
    </>
  );
}