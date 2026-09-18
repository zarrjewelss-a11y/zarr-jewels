"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";

import {
  ArrowLeft,
  ShoppingCart,
  CheckCircle,
  Clock,
  Package,
  TrendingUp,
} from "lucide-react";

export default function AdminReportsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ==========================================
  // LOAD ORDERS FROM FIRESTORE
  // ==========================================

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "orders"),
      (snapshot) => {
        const orderList = snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...docItem.data(),
        }));

        setOrders(orderList);
        setLoading(false);
      },
      (error) => {
        console.error("Failed to load reports:", error);
        setOrders([]);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // ==========================================
  // REPORT CALCULATIONS
  // ==========================================

  const totalOrders = orders.length;

  const deliveredOrders = orders.filter(
    (order) => order.status === "Delivered"
  ).length;

  const pendingOrders = orders.filter(
    (order) => order.status === "Pending"
  ).length;

  // Cancelled orders are excluded from revenue
  const validOrders = orders.filter(
    (order) => order.status !== "Cancelled"
  );

  const revenue = validOrders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  // Products sold
  const productsSold = validOrders.reduce(
    (sum, order) => {
      const items = Array.isArray(order.items)
        ? order.items
        : [];

      const quantity = items.reduce(
        (itemSum: number, item: any) =>
          itemSum +
          Number(item.qty || item.quantity || 0),
        0
      );

      return sum + quantity;
    },
    0
  );

  // Average Order Value
  const averageOrderValue =
    validOrders.length > 0
      ? revenue / validOrders.length
      : 0;

  // ==========================================
  // REPORT CARDS
  // ==========================================

  const reportCards = [
    {
      title: "Revenue",
      value: `Rs. ${revenue.toLocaleString()}`,
      icon: TrendingUp,
      color: "bg-green-500",
      text: "text-green-600",
    },
    {
      title: "Total Orders",
      value: totalOrders,
      icon: ShoppingCart,
      color: "bg-blue-500",
      text: "text-blue-600",
    },
    {
      title: "Delivered Orders",
      value: deliveredOrders,
      icon: CheckCircle,
      color: "bg-emerald-500",
      text: "text-emerald-600",
    },
    {
      title: "Pending Orders",
      value: pendingOrders,
      icon: Clock,
      color: "bg-yellow-500",
      text: "text-yellow-600",
    },
    {
      title: "Products Sold",
      value: productsSold,
      icon: Package,
      color: "bg-purple-500",
      text: "text-purple-600",
    },
    {
      title: "Average Order Value",
      value: `Rs. ${averageOrderValue.toLocaleString(
        undefined,
        {
          maximumFractionDigits: 2,
        }
      )}`,
      icon: TrendingUp,
      color: "bg-pink-500",
      text: "text-pink-600",
    },
  ];

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto" />

          <p className="mt-5 text-gray-600 font-medium">
            Loading reports...
          </p>
        </div>
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (
    <div className="min-h-screen bg-pink-50">
      <div className="max-w-7xl mx-auto p-6">

        {/* HEADER */}

        <div className="mb-10">
          <Link
            href="/admin"
            className="inline-flex items-center gap-2 text-pink-600 hover:text-pink-700 mb-4"
          >
            <ArrowLeft size={18} />
            Back Dashboard
          </Link>

          <h1 className="text-4xl font-bold text-pink-600">
            Reports
          </h1>

          <p className="text-gray-500 mt-2">
            ZARR JEWELS business performance overview
          </p>
        </div>

        {/* REPORT CARDS */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {reportCards.map((card) => {
            const Icon = card.icon;

            return (
              <div
                key={card.title}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div
                  className={`${card.color} w-14 h-14 rounded-xl flex items-center justify-center text-white mb-5`}
                >
                  <Icon size={28} />
                </div>

                <p className="text-gray-500 font-medium">
                  {card.title}
                </p>

                <h2
                  className={`text-3xl font-bold mt-2 ${card.text}`}
                >
                  {card.value}
                </h2>
              </div>
            );
          })}

        </div>

        {/* SALES SUMMARY */}

        <div className="mt-10 bg-white rounded-2xl shadow-lg p-6">

          <h2 className="text-2xl font-bold text-pink-600 mb-6">
            Sales Summary
          </h2>

          <div className="space-y-5">

            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-500">
                Total Revenue
              </span>

              <span className="font-bold text-green-600">
                Rs. {revenue.toLocaleString()}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-500">
                Total Orders
              </span>

              <span className="font-bold">
                {totalOrders}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-500">
                Delivered Orders
              </span>

              <span className="font-bold text-green-600">
                {deliveredOrders}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-500">
                Pending Orders
              </span>

              <span className="font-bold text-yellow-600">
                {pendingOrders}
              </span>
            </div>

            <div className="flex justify-between items-center border-b pb-4">
              <span className="text-gray-500">
                Products Sold
              </span>

              <span className="font-bold text-purple-600">
                {productsSold}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-500">
                Average Order Value
              </span>

              <span className="font-bold text-pink-600">
                Rs.{" "}
                {averageOrderValue.toLocaleString(
                  undefined,
                  {
                    maximumFractionDigits: 2,
                  }
                )}
              </span>
            </div>

          </div>
        </div>

        {/* NO ORDERS */}

        {orders.length === 0 && (
          <div className="mt-8 bg-white rounded-2xl shadow p-10 text-center">
            <Package
              size={45}
              className="mx-auto text-gray-300"
            />

            <h2 className="text-2xl font-bold mt-4">
              No Orders Yet
            </h2>

            <p className="text-gray-500 mt-2">
              Reports will automatically appear here
              when customers place orders.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}