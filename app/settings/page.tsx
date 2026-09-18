"use client";

import { Save, User, Mail, Phone, Lock } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

export default function SettingsPage() {
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
      <div className="max-w-4xl mx-auto">

        <div className="bg-white rounded-2xl shadow p-8">
          <h1 className="text-4xl font-bold text-pink-600 mb-2">
            Account Settings
          </h1>

          <p className="text-gray-500 mb-8">
            Update your account information.
          </p>

          <div className="space-y-6">

            <div>
              <label className="font-semibold flex items-center gap-2 mb-2">
                <User size={18} />
                Full Name
              </label>

              <input
                type="text"
                defaultValue="Sarah Khan"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="font-semibold flex items-center gap-2 mb-2">
                <Mail size={18} />
                Email
              </label>

              <input
                type="email"
                defaultValue="sarah@example.com"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="font-semibold flex items-center gap-2 mb-2">
                <Phone size={18} />
                Phone
              </label>

              <input
                type="text"
                defaultValue="+92 300 1234567"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <div>
              <label className="font-semibold flex items-center gap-2 mb-2">
                <Lock size={18} />
                New Password
              </label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button className="mt-6 bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2 transition">
              <Save size={18} />
              Save Changes
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}