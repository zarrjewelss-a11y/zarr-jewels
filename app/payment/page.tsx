"use client";

import { CreditCard, Plus } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

const cards = [
  {
    id: 1,
    type: "Visa",
    number: "**** **** **** 4589",
    holder: "Sarah Khan",
    expiry: "08/29",
    default: true,
  },
  {
    id: 2,
    type: "MasterCard",
    number: "**** **** **** 7721",
    holder: "Sarah Khan",
    expiry: "12/28",
    default: false,
  },
];

export default function PaymentPage() {
    const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.replace("/login");
      }
    });

    return () => unsubscribe();
  }, [router]);
  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-pink-600">
              Payment Methods
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your saved payment methods.
            </p>
          </div>

          <button className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition">
            <Plus size={18} />
            Add Card
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.id}
              className="bg-white rounded-2xl shadow p-6"
            >
              <div className="flex justify-between items-center">
                <CreditCard className="text-pink-600" size={32} />

                {card.default && (
                  <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
                    Default
                  </span>
                )}
              </div>

              <h2 className="text-2xl font-bold mt-6">
                {card.number}
              </h2>

              <p className="mt-3">
                <strong>Card:</strong> {card.type}
              </p>

              <p>
                <strong>Holder:</strong> {card.holder}
              </p>

              <p>
                <strong>Expiry:</strong> {card.expiry}
              </p>

              <div className="flex gap-3 mt-6">
                <button className="flex-1 border border-pink-600 text-pink-600 rounded-xl py-2 hover:bg-pink-50 transition">
                  Edit
                </button>

                <button className="flex-1 bg-pink-600 text-white rounded-xl py-2 hover:bg-pink-700 transition">
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}