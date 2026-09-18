"use client";

import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle } from "lucide-react";

export default function SuccessPage() {
  const orderId = "#" + Math.floor(100000 + Math.random() * 900000);

  return (
    <>
      <Header />

      <section className="min-h-screen bg-gray-50 flex items-center justify-center py-16 px-6">
        <div className="bg-white rounded-3xl shadow-xl p-10 max-w-2xl w-full text-center">

          <CheckCircle
            size={90}
            className="mx-auto text-green-500 mb-6"
          />

          <h1 className="text-5xl font-bold">
            Order Successful!
          </h1>

 <p className="text-gray-600 mt-5 text-lg leading-8">
  Thank you for choosing <strong>NEXA Jewelry</strong>.
  Your order has been placed successfully and is now being processed.
  We'll notify you by email once your order has been shipped.
</p>

          <div className="mt-8 bg-pink-50 rounded-2xl p-6">
            <p className="text-gray-500">Order ID</p>

            <h2 className="text-3xl font-bold text-pink-600 mt-2">
              {orderId}
            </h2>
          </div>
<div className="mt-6 grid grid-cols-2 gap-4">

  <div className="bg-gray-50 rounded-2xl p-5">
    <p className="text-gray-500 text-sm">
      Payment
    </p>

    <h3 className="font-bold text-green-600 mt-2">
      Confirmed
    </h3>
  </div>

  <div className="bg-gray-50 rounded-2xl p-5">
    <p className="text-gray-500 text-sm">
      Delivery
    </p>

    <h3 className="font-bold text-pink-600 mt-2">
      3 - 5 Business Days
    </h3>
  </div>

</div>
          <Link href="/">
            <button className="mt-10 bg-pink-600 hover:bg-pink-700 text-white px-10 py-4 rounded-full font-semibold transition">
              Continue Shopping
            </button>
          </Link>

        </div>
      </section>

      <Footer />
    </>
  );
}