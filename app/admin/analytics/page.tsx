"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ShoppingBag,
  Users,
  Package,
  DollarSign,
  Clock3,
  Truck,
  XCircle,
  Star,
  TrendingUp,
  TicketPercent,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminAnalyticsPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
const [coupons, setCoupons] = useState<any[]>([]);
  useEffect(() => {
    const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]");
    const savedProducts = JSON.parse(localStorage.getItem("adminProducts") || "[]");
const savedCoupons = JSON.parse(
  localStorage.getItem("coupons") || "[]"
);
    setOrders(savedOrders);
    setProducts(savedProducts);

    const map = new Map();

    savedOrders.forEach((order: any) => {
      const key = order.customer?.email || "No Email";

      if (!map.has(key)) {
        map.set(key, {
          name: order.customer?.name || "Unknown Customer",
        });
      }
    });

    setCustomers(Array.from(map.values()));
  }, []);

  const totalRevenue = orders.reduce(
    (sum, order) => sum + Number(order.total || 0),
    0
  );

  const totalOrders = orders.length;
  const totalCustomers = customers.length;
  const totalProducts = products.length;
  const totalCoupons = coupons.length;

const activeCoupons = coupons.filter(
  (coupon) => coupon.active
).length;

const revenueGrowth =
  totalRevenue > 0
    ? Math.min(
        100,
        Math.round(totalRevenue / 100)
      )
    : 0;
const pendingOrders = orders.filter(
  (order) => order.status === "Pending"
).length;
const processingOrders = orders.filter(
  (order) => order.status === "Processing"
).length;

const shippedOrders = orders.filter(
  (order) => order.status === "Shipped"
).length;
const deliveredOrders = orders.filter(
  (order) => order.status === "Delivered"
).length;

const cancelledOrders = orders.filter(
  (order) => order.status === "Cancelled"
).length;

const averageOrderValue =

  totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;
const chartData = [
  
  { month: "Jan", sales: 35 },
  { month: "Feb", sales: 60 },
  { month: "Mar", sales: 45 },
  { month: "Apr", sales: 80 },
  { month: "May", sales: 55 },
  { month: "Jun", sales: 90 },
  { month: "Jul", sales: 70 },
];

const pieData = [
  { name: "Pending", value: pendingOrders },
  { name: "Processing", value: processingOrders },
  { name: "Shipped", value: shippedOrders },
  { name: "Delivered", value: deliveredOrders },
  { name: "Cancelled", value: cancelledOrders },
];

const COLORS = [
  "#f59e0b",
  "#3b82f6",
  "#8b5cf6",
  "#22c55e",
  "#ef4444",
];
const productSales: Record<string, number> = {};

orders.forEach((order) => {
  order.items?.forEach((item: any) => {
    productSales[item.name] =
      (productSales[item.name] || 0) + (item.quantity || 1);
  });
});

const bestSellingProduct =
  Object.entries(productSales).sort((a, b) => b[1] - a[1])[0]?.[0] ||
  "No Sales Yet";
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

        <h1 className="text-4xl font-bold text-pink-600 mb-10">
          Analytics
        </h1>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-2xl shadow p-6">
            <DollarSign className="text-green-600 mb-4" size={36} />
            <p className="text-gray-500">Revenue</p>
            <h2 className="text-3xl font-bold text-green-600">
              Rs. {totalRevenue}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <ShoppingBag className="text-pink-600 mb-4" size={36} />
            <p className="text-gray-500">Orders</p>
            <h2 className="text-3xl font-bold">
              {totalOrders}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <Users className="text-blue-600 mb-4" size={36} />
            <p className="text-gray-500">Customers</p>
            <h2 className="text-3xl font-bold">
              {totalCustomers}
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow p-6">
            <Package className="text-orange-600 mb-4" size={36} />
            <p className="text-gray-500">Products</p>
            <h2 className="text-3xl font-bold">
              {totalProducts}
            </h2>
          </div>
<div className="bg-white rounded-2xl shadow p-6">
  <TicketPercent
    className="text-purple-600 mb-4"
    size={36}
  />
  <p className="text-gray-500">Coupons</p>
  <h2 className="text-3xl font-bold">
    {totalCoupons}
  </h2>
</div>

<div className="bg-white rounded-2xl shadow p-6">
  <TrendingUp
    className="text-green-600 mb-4"
    size={36}
  />
  <p className="text-gray-500">
    Revenue Growth
  </p>
  <h2 className="text-3xl font-bold text-green-600">
    {revenueGrowth}%
  </h2>
</div>

<div className="bg-white rounded-2xl shadow p-6">
  <TicketPercent
    className="text-pink-600 mb-4"
    size={36}
  />
  <p className="text-gray-500">
    Active Coupons
  </p>
  <h2 className="text-3xl font-bold">
    {activeCoupons}
  </h2>
</div>
        </div>

       <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">

  <div className="bg-white rounded-2xl shadow p-6">
    <Clock3 className="text-yellow-500 mb-3" size={32} />
    <p className="text-gray-500">Pending Orders</p>
    <h2 className="text-3xl font-bold">{pendingOrders}</h2>
  </div>

  <div className="bg-white rounded-2xl shadow p-6">
    <Truck className="text-green-600 mb-3" size={32} />
    <p className="text-gray-500">Delivered Orders</p>
    <h2 className="text-3xl font-bold">{deliveredOrders}</h2>
  </div>

  <div className="bg-white rounded-2xl shadow p-6">
    <XCircle className="text-red-500 mb-3" size={32} />
    <p className="text-gray-500">Cancelled Orders</p>
    <h2 className="text-3xl font-bold">{cancelledOrders}</h2>
  </div>

  <div className="bg-white rounded-2xl shadow p-6">
    <Star className="text-pink-600 mb-3" size={32} />
    <p className="text-gray-500">Average Order Value</p>
    <h2 className="text-3xl font-bold">
      Rs. {averageOrderValue}
    </h2>
  </div>

</div>
<div className="bg-white rounded-2xl shadow p-6 mt-8">
  <h2 className="text-2xl font-bold mb-6">
    📈 Monthly Sales
  </h2>

  <div style={{ width: "100%", height: 320 }}>
  <ResponsiveContainer>
    <BarChart data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />

      <XAxis dataKey="month" />

      <YAxis />

      <Tooltip />

      <Bar
        dataKey="sales"
        fill="#ec4899"
        radius={[8, 8, 0, 0]}
      />
    </BarChart>
  </ResponsiveContainer>
</div>
</div>

<div className="bg-white rounded-2xl shadow p-6 mt-8">
  <h2 className="text-2xl font-bold mb-3">
    ⭐ Best Selling Product
  </h2>

  <p className="text-xl font-semibold text-pink-600">
    {bestSellingProduct}
  </p>
</div>
<div className="bg-white rounded-2xl shadow p-6 mt-8">
  <h2 className="text-2xl font-bold mb-6">
    🥧 Order Status
  </h2>

  <div style={{ width: "100%", height: 350 }}>
    <ResponsiveContainer>
      <PieChart>
        <Pie
          data={pieData}
          dataKey="value"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={120}
          label
        >
          {pieData.map((_, index) => (
            <Cell
              key={index}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>

        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  </div>
</div>
<div className="bg-white rounded-2xl shadow p-6 mt-8">
  <div className="flex items-center gap-2 mb-6">
    <BarChart3 className="text-pink-600" size={28} />
    <h2 className="text-2xl font-bold">Revenue Overview</h2>
  </div>

  <div className="space-y-5">
    <div>
      <div className="flex justify-between mb-2">
        <span>Total Revenue</span>
        <span>Rs. {totalRevenue}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-pink-600 h-4 rounded-full"
          style={{
            width: `${Math.min((Number(totalRevenue) / 100000) * 100, 100)}%`,
          }}
        />
      </div>
    </div>

    <div>
      <div className="flex justify-between mb-2">
        <span>Total Orders</span>
        <span>{totalOrders}</span>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-4">
        <div
          className="bg-blue-600 h-4 rounded-full"
          style={{
            width: `${Math.min(totalOrders * 10, 100)}%`,
          }}
        />
      </div>
    </div>
  </div>
</div>
<div className="bg-white rounded-2xl shadow mt-10 p-6">
  <div className="bg-white rounded-2xl shadow p-6 mt-8">
  <h2 className="text-2xl font-bold mb-6">
    👑 Top Customers
  </h2>

  {customers.length === 0 ? (
    <p className="text-gray-500">
      No customers found.
    </p>
  ) : (
    <div className="space-y-4">
      {customers.slice(0, 5).map((customer: any, index) => (
        <div
          key={index}
          className="flex items-center justify-between border-b pb-3"
        >
          <div>
            <p className="font-semibold">
              {customer.name}
            </p>

            <p className="text-gray-500 text-sm">
              Customer #{index + 1}
            </p>
          </div>

          <div className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-semibold">
            VIP
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  <h2 className="text-2xl font-bold mb-6">
    Recent Orders
  </h2>

          {orders.length === 0 ? (
            <p className="text-gray-500">
              No orders found.
            </p>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order: any) => (
                <div
                  key={order.id}
                  className="flex justify-between border-b pb-3"
                >
                  <div>
                    <p className="font-semibold">
                      {order.customer?.name}
                    </p>

                    <p className="text-gray-500 text-sm">
                      {order.id}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold text-pink-600">
                      Rs. {order.total}
                    </p>

                    <p className="text-sm text-gray-500">
                      {order.status}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}