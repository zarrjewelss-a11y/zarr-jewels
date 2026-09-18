"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  Package,
  ShoppingCart,
  Users,
  BarChart3,
  Ticket,
  Settings,
  LogOut,
  Star,
  Warehouse,
} from "lucide-react";


export default function AdminDashboardPage() {
  const router = useRouter();

  const [stats, setStats] = useState({
  products: 0,
  orders: 0,
  customers: 0,
  coupons: 0,
  reviews: 0,
});

  useEffect(() => {
  const unsubProducts = onSnapshot(
    collection(db, "products"),
    (snapshot) => {
      setStats((prev) => ({
        ...prev,
        products: snapshot.size,
      }));
    },
    (error) => {
      console.error("Products error:", error);
    }
  );

  const unsubOrders = onSnapshot(
    collection(db, "orders"),
    (snapshot) => {
      const orders = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const customers = new Set(
        orders
          .map((order: any) => order.customer?.email)
          .filter(Boolean)
      );

      setStats((prev) => ({
        ...prev,
        orders: orders.length,
        customers: customers.size,
      }));
    },
    (error) => {
      console.error("Orders error:", error);
    }
  );

  const unsubCoupons = onSnapshot(
    collection(db, "coupons"),
    (snapshot) => {
      setStats((prev) => ({
        ...prev,
        coupons: snapshot.size,
      }));
    },
    (error) => {
      console.error("Coupons error:", error);
    }
  );

  // --------------------------------
  // REVIEWS FROM FIRESTORE
  // --------------------------------

  const unsubReviews = onSnapshot(
    collection(db, "reviews"),
    (snapshot) => {
      setStats((prev) => ({
        ...prev,
        reviews: snapshot.size,
      }));
    },
    (error) => {
      console.error("Reviews error:", error);

      setStats((prev) => ({
        ...prev,
        reviews: 0,
      }));
    }
  );

  return () => {
    unsubProducts();
    unsubOrders();
    unsubCoupons();
    unsubReviews();
  };
}, []);

  const logout = async () => {
    await signOut(auth);

    localStorage.removeItem("adminLoggedIn");

    router.push("/admin/login");
  };

  const cards = [
    {
      title: "Products",
      value: stats.products,
      icon: Package,
      href: "/admin/products",
      color: "bg-pink-500",
    },
    {
  title: "Inventory",
  value: "",
  icon: Warehouse,
  href: "/admin/inventory",
  color: "bg-indigo-500",
    },
    {
      title: "Orders",
      value: stats.orders,
      icon: ShoppingCart,
      href: "/admin/orders",
      color: "bg-blue-500",
    },
    {
      title: "Customers",
      value: stats.customers,
      icon: Users,
      href: "/admin/customers",
      color: "bg-green-500",
    },
    {
      title: "Reports",
      value: "",
      icon: BarChart3,
      href: "/admin/reports",
      color: "bg-purple-500",
    },
    {
      title: "Coupons",
      value: stats.coupons,
      icon: Ticket,
      href: "/admin/coupons",
      color: "bg-yellow-500",
    },
    {
    title: "Reviews",
    value: stats.reviews,
    icon: Star,
    href: "/admin/reviews",
    color: "bg-orange-500",
    },
    {
      title: "Settings",
      value: "",
      icon: Settings,
      href: "/admin/settings",
      color: "bg-gray-500",
    },
  ];
    return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto p-6">

        <div className="flex items-center justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold text-pink-600">
              Admin Dashboard
            </h1>

            <p className="text-gray-500 mt-2">
              Welcome back to ZARR JEWELSAdmin Panel
            </p>
          </div>

          <button
            onClick={logout}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
          >
            <LogOut size={18} />
            Logout
          </button>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

          {cards.map((card, index) => {
            const Icon = card.icon;

            return (
              <Link
                key={index}
                href={card.href}
                className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition p-6"
              >
                <div
                  className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-4`}
                >
                  <Icon size={28} />
                </div>

                <h2 className="text-2xl font-bold">
                  {card.title}
                </h2>

                {card.value !== "" && (
                  <p className="text-3xl font-bold text-pink-600 mt-3">
                    {card.value}
                  </p>
                )}
              </Link>
            );
          })}

        </div>
                <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-bold text-pink-600 mb-4">
            Quick Summary
          </h2>

          <div className="grid md:grid-cols-4 gap-4">

            <div className="bg-pink-100 rounded-xl p-4">
              <p className="text-gray-500">Products</p>
              <h3 className="text-3xl font-bold">
                {stats.products}
              </h3>
            </div>

            <div className="bg-blue-100 rounded-xl p-4">
              <p className="text-gray-500">Orders</p>
              <h3 className="text-3xl font-bold">
                {stats.orders}
              </h3>
            </div>

            <div className="bg-green-100 rounded-xl p-4">
              <p className="text-gray-500">Customers</p>
              <h3 className="text-3xl font-bold">
                {stats.customers}
              </h3>
            </div>

            <div className="bg-yellow-100 rounded-xl p-4">
              <p className="text-gray-500">Coupons</p>
              <h3 className="text-3xl font-bold">
                {stats.coupons}
              </h3>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}