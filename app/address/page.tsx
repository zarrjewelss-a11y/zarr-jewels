"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { MapPin, Plus, X } from "lucide-react";
import { auth, db } from "@/lib/firebase";
import toast from "react-hot-toast";

type Address = {
  id: string;
  name: string;
  person: string;
  phone: string;
  address: string;
  default: boolean;
};

export default function AddressPage() {
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [person, setPerson] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isDefault, setIsDefault] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        router.replace("/login");
        return;
      }

      try {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          if (Array.isArray(data.addresses)) {
            setAddresses(data.addresses);
          }
        }
      } catch (error) {
        console.error("Address loading error:", error);
        toast.error("Failed to load addresses.");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [router]);

  const resetForm = () => {
    setName("");
    setPerson("");
    setPhone("");
    setAddress("");
    setIsDefault(false);
    setEditingId(null);
    setShowForm(false);
  };

  const openAddForm = () => {
    resetForm();
    setShowForm(true);
  };

  const openEditForm = (item: Address) => {
    setEditingId(item.id);
    setName(item.name);
    setPerson(item.person);
    setPhone(item.phone);
    setAddress(item.address);
    setIsDefault(item.default);
    setShowForm(true);
  };

  const saveAddresses = async (updatedAddresses: Address[]) => {
    const user = auth.currentUser;

    if (!user) {
      router.replace("/login");
      return false;
    }

    const userRef = doc(db, "users", user.uid);

    await setDoc(
      userRef,
      {
        addresses: updatedAddresses,
      },
      { merge: true }
    );

    setAddresses(updatedAddresses);
    return true;
  };

  const handleSave = async () => {
    if (!name.trim() || !person.trim() || !phone.trim() || !address.trim()) {
      toast.error("Please fill in all address fields.");
      return;
    }

    try {
      setSaving(true);

      let updatedAddresses: Address[];

      if (editingId) {
        updatedAddresses = addresses.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: name.trim(),
                person: person.trim(),
                phone: phone.trim(),
                address: address.trim(),
                default: isDefault,
              }
            : isDefault
              ? { ...item, default: false }
              : item
        );
      } else {
        const newAddress: Address = {
          id: Date.now().toString(),
          name: name.trim(),
          person: person.trim(),
          phone: phone.trim(),
          address: address.trim(),
          default: addresses.length === 0 ? true : isDefault,
        };

        updatedAddresses = isDefault
          ? [
              ...addresses.map((item) => ({
                ...item,
                default: false,
              })),
              newAddress,
            ]
          : [...addresses, newAddress];
      }

      const success = await saveAddresses(updatedAddresses);

      if (success) {
        toast.success(
          editingId
            ? "Address updated successfully!"
            : "Address saved successfully!"
        );

        resetForm();
      }
    } catch (error) {
      console.error("Address save error:", error);
      toast.error("Failed to save address.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    const itemToDelete = addresses.find((item) => item.id === id);

    if (!itemToDelete) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${itemToDelete.name}" address?`
    );

    if (!confirmed) return;

    try {
      setSaving(true);

      let updatedAddresses = addresses.filter((item) => item.id !== id);

      if (
        itemToDelete.default &&
        updatedAddresses.length > 0
      ) {
        updatedAddresses = updatedAddresses.map((item, index) => ({
          ...item,
          default: index === 0,
        }));
      }

      const success = await saveAddresses(updatedAddresses);

      if (success) {
        toast.success("Address deleted successfully!");
      }
    } catch (error) {
      console.error("Address delete error:", error);
      toast.error("Failed to delete address.");
    } finally {
      setSaving(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      setSaving(true);

      const updatedAddresses = addresses.map((item) => ({
        ...item,
        default: item.id === id,
      }));

      const success = await saveAddresses(updatedAddresses);

      if (success) {
        toast.success("Default address updated!");
      }
    } catch (error) {
      console.error("Default address error:", error);
      toast.error("Failed to update default address.");
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
            Loading addresses...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">

        <button
          type="button"
          onClick={() => router.push("/profile")}
          className="mb-6 text-pink-600 font-semibold hover:underline inline-flex items-center gap-1"
        >
          ← Back to My Account
        </button>

        <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
          <div>
            <h1 className="text-4xl font-bold text-pink-600">
              Saved Addresses
            </h1>

            <p className="text-gray-500 mt-2">
              Manage your delivery addresses.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddForm}
            disabled={saving}
            className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white px-5 py-3 rounded-xl flex items-center gap-2 transition"
          >
            <Plus size={18} />
            Add New Address
          </button>
        </div>

        {showForm && (
          <div className="bg-white rounded-2xl shadow p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-pink-600">
                {editingId ? "Edit Address" : "Add New Address"}
              </h2>

              <button
                type="button"
                onClick={resetForm}
                className="text-gray-500 hover:text-pink-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Address Name
                </label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Home / Office"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={person}
                  onChange={(e) => setPerson(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Phone
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+92 300 1234567"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block font-semibold text-gray-700 mb-2">
                  Complete Address
                </label>

                <textarea
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="House, Street, Area, City, Pakistan"
                  rows={3}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>

              <label className="md:col-span-2 flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDefault}
                  onChange={(e) => setIsDefault(e.target.checked)}
                  className="w-5 h-5 accent-pink-600"
                />

                <span className="font-semibold text-gray-700">
                  Set as default address
                </span>
              </label>

            </div>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="bg-pink-600 hover:bg-pink-700 disabled:bg-gray-400 text-white px-7 py-3 rounded-xl font-semibold transition"
              >
                {saving
                  ? "Saving..."
                  : editingId
                    ? "Update Address"
                    : "Save Address"}
              </button>

              <button
                type="button"
                onClick={resetForm}
                disabled={saving}
                className="border border-gray-300 text-gray-600 px-7 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center">
            <MapPin className="mx-auto text-pink-600" size={42} />

            <h2 className="text-xl font-bold mt-4">
              No Saved Addresses
            </h2>

            <p className="text-gray-500 mt-2">
              Add an address to make checkout faster.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {addresses.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow p-6"
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-bold">
                    {item.name}
                  </h2>

                  {item.default && (
                    <span className="bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm">
                      Default
                    </span>
                  )}
                </div>

                <div className="mt-5 flex gap-3">
                  <MapPin className="text-pink-600 mt-1" />

                  <div>
                    <p className="font-semibold">
                      {item.person}
                    </p>

                    <p>{item.phone}</p>

                    <p className="text-gray-600 mt-2">
                      {item.address}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => openEditForm(item)}
                    disabled={saving}
                    className="flex-1 border border-pink-600 text-pink-600 rounded-xl py-2 hover:bg-pink-50 transition disabled:opacity-50"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDelete(item.id)}
                    disabled={saving}
                    className="flex-1 bg-pink-600 text-white rounded-xl py-2 hover:bg-pink-700 transition disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>

                {!item.default && (
                  <button
                    type="button"
                    onClick={() => handleSetDefault(item.id)}
                    disabled={saving}
                    className="w-full mt-3 border border-gray-300 text-gray-700 rounded-xl py-2 hover:bg-gray-50 transition disabled:opacity-50"
                  >
                    Set as Default
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}