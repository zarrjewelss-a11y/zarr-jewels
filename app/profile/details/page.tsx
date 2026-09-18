"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";
import {
  onAuthStateChanged,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";

export default function ProfileDetailsPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        setEmail(user.email || "");

        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          setName(data.name || "");

          if (data.createdAt) {
            const date = new Date(data.createdAt);

            if (!isNaN(date.getTime())) {
              setCreatedAt(
                date.toLocaleDateString("en-PK", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })
              );
            }
          }
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        toast.error("Failed to load profile.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleSave = async () => {
    const user = auth.currentUser;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (!name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    try {
      setSaving(true);

      const userRef = doc(db, "users", user.uid);

      await setDoc(
        userRef,
        {
          name: name.trim(),
          email: user.email || email,
        },
        { merge: true }
      );

      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Profile save error:", error);
      toast.error("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-pink-600 border-t-transparent rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-pink-600 font-semibold">
            Loading profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-3xl mx-auto">

        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="mb-6 text-pink-600 font-semibold hover:underline"
        >
          ← Back to My Account
        </button>

        <div className="bg-white rounded-2xl shadow p-8">

          <h1 className="text-3xl font-bold text-pink-600">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2 mb-8">
            Manage your personal information.
          </p>

          <div className="space-y-6">

            {/* NAME */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
              />
            </div>

            {/* EMAIL */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                value={email}
                readOnly
                className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed"
              />
            </div>

            {/* CREATED */}
            <div>
              <label className="block font-semibold text-gray-700 mb-2">
                Account Created
              </label>

              <input
                type="text"
                value={createdAt || "Not available"}
                readOnly
                className="w-full border border-gray-200 bg-gray-100 text-gray-500 rounded-xl px-4 py-3 cursor-not-allowed"
              />
            </div>

            {/* SAVE */}
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white px-7 py-3 rounded-xl font-semibold transition"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>

          </div>

        </div>
      </div>
    </div>
  );
}