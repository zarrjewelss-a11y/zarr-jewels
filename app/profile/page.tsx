"use client";

import Link from "next/link";
import {
  User,
  Package,
  Heart,
  MapPin,
  CreditCard,
  Settings,
  ChevronRight,
  LogOut,
  Home,
  ShoppingBag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "@/lib/firebase";
import toast from "react-hot-toast";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const cards = [
  {
    title: "My Profile",
    description: "Manage your personal information",
    icon: User,
    href: "/profile/details",
  },
  {
    title: "My Orders",
    description: "View all your recent orders",
    icon: Package,
    href: "/order",
  },
  {
    title: "Wishlist",
    description: "Products you saved",
    icon: Heart,
    href: "/wishlist",
  },
  {
    title: "Saved Addresses",
    description: "Manage delivery addresses",
    icon: MapPin,
    href: "/address",
  },
  {
    title: "Payment Methods",
    description: "Manage payment options",
    icon: CreditCard,
    href: "/payment",
  },
  {
    title: "Settings",
    description: "Update your account settings",
    icon: Settings,
    href: "/settings",
  },
];

export default function ProfilePage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      setCheckingAuth(false);
    });

    return () => unsubscribe();
  }, [router]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);

      await signOut(auth);

      toast.success("Logged out successfully!");

      router.replace("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
      setLoggingOut(false);
    }
  };

  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-pink-600 font-semibold">
            Checking account...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-pink-50 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header Card */}
          <div className="bg-white rounded-2xl shadow p-8 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">

              <div>
                <h1 className="text-4xl font-bold text-pink-600">
                  My Account
                </h1>

                <p className="text-gray-500 mt-2">
                  Welcome back to ZARR JEWELS 💖
                </p>
              </div>

              {/* Action Buttons: Home, Shop, Logout */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/"
                  className="inline-flex items-center justify-center gap-2 bg-pink-50 hover:bg-pink-100 text-pink-700 border border-pink-200 px-5 py-3 rounded-full font-semibold transition"
                >
                  <Home size={18} />
                  Home
                </Link>

                <Link
                  href="/shop"
                  className="inline-flex items-center justify-center gap-2 bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-full font-semibold transition shadow-sm"
                >
                  <ShoppingBag size={18} />
                  Shop
                </Link>

                <button
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-5 py-3 rounded-full font-semibold transition"
                >
                  <LogOut size={19} />
                  {loggingOut ? "Logging out..." : "Logout"}
                </button>
              </div>

            </div>
          </div>

          {/* Account Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {cards.map((card) => {
              const Icon = card.icon;

              return (
                <Link
                  key={card.title}
                  href={card.href}
                  className="bg-white rounded-2xl shadow hover:shadow-xl transition p-6 group"
                >
                  <div className="flex justify-between items-center mb-6">

                    <div className="w-14 h-14 rounded-full bg-pink-100 flex items-center justify-center">
                      <Icon
                        className="text-pink-600"
                        size={28}
                      />
                    </div>

                    <ChevronRight
                      className="text-gray-400 group-hover:text-pink-600 transition"
                    />

                  </div>

                  <h2 className="text-xl font-bold">
                    {card.title}
                  </h2>

                  <p className="text-gray-500 mt-2">
                    {card.description}
                  </p>
                </Link>
              );
            })}

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}