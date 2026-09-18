"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { Heart, Trash2 } from "lucide-react";
import { useWishlist } from "@/components/context/WishlistContext";

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-12 min-h-screen">
        <h1 className="text-4xl font-bold mb-10 text-center">
          My Wishlist
        </h1>

        {wishlist.length === 0 ? (
          <div className="text-center py-20">
            <Heart
              size={70}
              className="mx-auto text-pink-500 mb-5"
            />

            <h2 className="text-2xl font-semibold">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Save your favorite jewelry here.
            </p>

            <Link
              href="/shop"
              className="inline-block mt-8 bg-black text-white px-8 py-3 rounded-xl hover:bg-gray-800 transition"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((item) => (
              <div
                key={item.id}
                className="border rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-72 object-cover"
                />

                <div className="p-5">
                  <h3 className="text-xl font-semibold">
                    {item.name}
                  </h3>

                  <p className="text-pink-600 font-bold mt-2">
                    Rs. {item.price}
                  </p>

                  <button
                    onClick={() => removeFromWishlist(item.id)}
                    className="mt-5 w-full flex items-center justify-center gap-2 bg-red-500 text-white py-3 rounded-xl hover:bg-red-600 transition"
                  >
                    <Trash2 size={18} />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}