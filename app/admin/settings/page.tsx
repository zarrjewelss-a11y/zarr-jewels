"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Store } from "lucide-react";

import {
  doc,
  getDoc,
  setDoc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("ZARR JEWELS");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [currency, setCurrency] = useState("PKR");
  const [shipping, setShipping] = useState("20");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ==========================================
  // LOAD SETTINGS FROM FIRESTORE
  // ==========================================

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settingsRef = doc(db, "settings", "store");

        const settingsSnap = await getDoc(settingsRef);

        if (settingsSnap.exists()) {
          const settings = settingsSnap.data();

          setStoreName(settings.storeName || "ZARR JEWELS");
          setEmail(settings.email || "");
          setPhone(settings.phone || "");
          setAddress(settings.address || "");
          setCurrency(settings.currency || "PKR");

          setShipping(
            settings.shipping !== undefined
              ? String(settings.shipping)
              : "20"
          );
        }
      } catch (error) {
        console.error("Failed to load settings:", error);
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  // ==========================================
  // SAVE SETTINGS TO FIRESTORE
  // ==========================================

  const saveSettings = async () => {
    setSaving(true);

    try {
      const settings = {
        storeName: storeName.trim(),
        email: email.trim(),
        phone: phone.trim(),
        address: address.trim(),
        currency,
        shipping: Number(shipping),
      };

      await setDoc(
        doc(db, "settings", "store"),
        settings,
        { merge: true }
      );

      // Backup for local use
      localStorage.setItem(
        "storeSettings",
        JSON.stringify(settings)
      );

      alert("Settings Saved Successfully!");
    } catch (error) {
      console.error("Failed to save settings:", error);

      alert("Failed to save settings.");
    } finally {
      setSaving(false);
    }
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="min-h-screen bg-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-600 rounded-full animate-spin mx-auto" />

          <p className="mt-4 text-gray-600">
            Loading settings...
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
      <div className="max-w-5xl mx-auto p-6">

        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-pink-600 mb-6"
        >
          <ArrowLeft size={18} />
          Back Dashboard
        </Link>

        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="flex items-center gap-3 mb-8">
            <Store
              className="text-pink-600"
              size={34}
            />

            <h1 className="text-4xl font-bold text-pink-600">
              Store Settings
            </h1>
          </div>

          <div className="grid md:grid-cols-2 gap-6">

            {/* Store Name */}

            <div>
              <label className="font-semibold">
                Store Name
              </label>

              <input
                type="text"
                value={storeName}
                onChange={(e) =>
                  setStoreName(e.target.value)
                }
                className="w-full mt-2 border rounded-xl p-3"
              />
            </div>

            {/* Store Email */}

            <div>
              <label className="font-semibold">
                Store Email
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="w-full mt-2 border rounded-xl p-3"
              />
            </div>

            {/* Store Phone */}

            <div>
              <label className="font-semibold">
                Store Phone
              </label>

              <input
                type="text"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                className="w-full mt-2 border rounded-xl p-3"
              />
            </div>

            {/* Currency */}

            <div>
              <label className="font-semibold">
                Currency
              </label>

              <select
                value={currency}
                onChange={(e) =>
                  setCurrency(e.target.value)
                }
                className="w-full mt-2 border rounded-xl p-3"
              >
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
              </select>
            </div>

          </div>

          {/* Address */}

          <div className="mt-6">
            <label className="font-semibold">
              Store Address
            </label>

            <textarea
              rows={4}
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              className="w-full mt-2 border rounded-xl p-3"
            />
          </div>

          {/* Shipping */}

          <div className="mt-6">
            <label className="font-semibold">
              Shipping Charges
            </label>

            <input
              type="number"
              min="0"
              value={shipping}
              onChange={(e) =>
                setShipping(e.target.value)
              }
              className="w-full mt-2 border rounded-xl p-3"
            />

            <p className="text-sm text-gray-500 mt-2">
              These charges will be used automatically on Checkout.
            </p>
          </div>

          {/* Save */}

          <button
            onClick={saveSettings}
            disabled={saving}
            className="mt-8 flex items-center gap-2 bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-xl transition"
          >
            <Save size={20} />

            {saving
              ? "Saving..."
              : "Save Settings"}
          </button>

        </div>
      </div>
    </div>
  );
}