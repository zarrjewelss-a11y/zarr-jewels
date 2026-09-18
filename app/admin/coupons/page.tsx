"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  collection,
  addDoc,
  onSnapshot,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";

import { db } from "@/lib/firebase";
import {
  ArrowLeft,
  Trash2,
  Search,
  Copy,
  Plus,
  TicketPercent,
  RefreshCw,
} from "lucide-react";
interface Coupon {
  id: string;
  code: string;
  type: "percentage" | "fixed";
  discount: number;
  minOrder: number;
  maxDiscount: number;
  usageLimit: number;
  usedCount: number;
  expiry: string;
  description: string;
  active: boolean;
  firstOrderOnly: boolean;
  freeShipping: boolean;
}
export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

const [search, setSearch] = useState("");

const [code, setCode] = useState("");
const [type, setType] = useState<"percentage" | "fixed">(
  "percentage"
);

const [discount, setDiscount] = useState("");
const [minOrder, setMinOrder] = useState("");
const [maxDiscount, setMaxDiscount] = useState("");
const [usageLimit, setUsageLimit] = useState("");

const [expiry, setExpiry] = useState("");
const [description, setDescription] = useState("");

const [firstOrderOnly, setFirstOrderOnly] =
  useState(false);

const [freeShipping, setFreeShipping] =
  useState(false);
useEffect(() => {
  const unsubscribe = onSnapshot(
    collection(db, "coupons"),
    (snapshot) => {
      const list = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...docItem.data(),
      }));

      setCoupons(list as Coupon[]);
    }
  );

  return () => unsubscribe();
}, []);
const generateCoupon = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  let generated = "NEXA-";

  for (let i = 0; i < 6; i++) {
    generated += chars.charAt(
      Math.floor(Math.random() * chars.length)
    );
  }

  setCode(generated);
};
const filteredCoupons = useMemo(() => {
  return coupons.filter((coupon) =>
    coupon.code
      .toLowerCase()
      .includes(search.toLowerCase())
  );
}, [coupons, search]);
const addCoupon = async () => {
  if (!code || !discount || !expiry) {
    alert("Please fill all required fields.");
    return;
  }

  const newCoupon = {
    code: code.toUpperCase(),
    type,
    discount: Number(discount),
    minOrder: Number(minOrder || 0),
    maxDiscount: Number(maxDiscount || 0),
    usageLimit: Number(usageLimit || 0),
    usedCount: 0,
    expiry,
    description,
    active: true,
    firstOrderOnly,
    freeShipping,
  };

  await addDoc(collection(db, "coupons"), newCoupon);

  setCode("");
  setDiscount("");
  setMinOrder("");
  setMaxDiscount("");
  setUsageLimit("");
  setExpiry("");
  setDescription("");
  setFirstOrderOnly(false);
  setFreeShipping(false);
};
 const deleteCoupon = async (id: string) => {
  await deleteDoc(doc(db, "coupons", id));
};

 const toggleStatus = async (
  id: string,
  active: boolean
) => {
  await updateDoc(doc(db, "coupons", id), {
    active: !active,
  });
};

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

        <h1 className="text-5xl font-bold text-pink-600 mb-8">
          Coupons
        </h1>

        <div className="bg-white rounded-2xl shadow p-6 mb-8 space-y-5">
<div className="flex justify-between items-center gap-4 mb-6">

  <div className="relative flex-1">

    <Search
      size={18}
      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
    />

    <input
      type="text"
      placeholder="Search Coupon..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full border rounded-xl pl-10 pr-4 py-3"
    />

  </div>

  <button
    onClick={generateCoupon}
    className="bg-pink-600 hover:bg-pink-700 text-white px-5 py-3 rounded-xl flex items-center gap-2"
  >
    <RefreshCw size={18} />
    Generate
  </button>

</div>
<input
  className="w-full border rounded-xl p-4"
  placeholder="Coupon Code"
  value={code}
  onChange={(e) => setCode(e.target.value.toUpperCase())}
/>

          <input
            type="number"
            className="w-full border rounded-xl p-4"
            placeholder="Discount %"
            value={discount}
            onChange={(e) => setDiscount(e.target.value)}
          />
<select
  className="w-full border rounded-xl p-4 mt-4"
  value={type}
  onChange={(e) =>
    setType(
      e.target.value as "percentage" | "fixed"
    )
  }
>

  <option value="percentage">
    Percentage (%)
  </option>

  <option value="fixed">
    Fixed Amount
  </option>

</select>
          <input
            type="date"
            className="w-full border rounded-xl p-4"
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
          />
<input
  type="number"
  placeholder="Minimum Order"
  className="w-full border rounded-xl p-4 mt-4"
  value={minOrder}
  onChange={(e) => setMinOrder(e.target.value)}
/>

<input
  type="number"
  placeholder="Maximum Discount"
  className="w-full border rounded-xl p-4 mt-4"
  value={maxDiscount}
  onChange={(e) => setMaxDiscount(e.target.value)}
/>

<input
  type="number"
  placeholder="Usage Limit"
  className="w-full border rounded-xl p-4 mt-4"
  value={usageLimit}
  onChange={(e) => setUsageLimit(e.target.value)}
/>

<input
  placeholder="Description"
  className="w-full border rounded-xl p-4 mt-4"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
/>
<div className="flex gap-8">

  <label className="flex items-center gap-2">

    <input
      type="checkbox"
      checked={firstOrderOnly}
      onChange={(e) =>
        setFirstOrderOnly(e.target.checked)
      }
    />

    First Order Only

  </label>

  <label className="flex items-center gap-2">

    <input
      type="checkbox"
      checked={freeShipping}
      onChange={(e) =>
        setFreeShipping(e.target.checked)
      }
    />

    Free Shipping

  </label>

</div>
          <button
            onClick={addCoupon}
            className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl"
          >
            Add Coupon
          </button>

        </div>

        <div className="bg-white rounded-2xl shadow overflow-hidden">

          <table className="w-full">

            <thead className="bg-pink-600 text-white">

              <tr>
                <th className="text-left p-4">Code</th>
<th className="text-left p-4">Type</th>
<th className="text-left p-4">Discount</th>
<th className="text-left p-4">Min Order</th>
<th className="text-left p-4">Usage</th>
<th className="text-left p-4">Expiry</th>
<th className="text-left p-4">Status</th>
<th className="text-center p-4">Actions</th>
              </tr>

            </thead>

            <tbody>

              {coupons.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center p-10 text-gray-500"
                  >
                    No coupons added.
                  </td>
                </tr>
              ) : (
                filteredCoupons.map((coupon) => (
                  <tr
                    key={coupon.id}
                    className="border-b"
                  >
                   <td className="p-4">

  <div className="flex items-center gap-2">

    <span className="font-bold">
      {coupon.code}
    </span>

    <button
     onClick={() => {
  navigator.clipboard.writeText(coupon.code);
  alert("Coupon Copied!");
}}
      className="text-pink-600 hover:text-pink-700"
    >
      <Copy size={16} />
    </button>

  </div>

</td>

                   <td className="p-4">

  {coupon.type === "percentage"
    ? `${coupon.discount}%`
    : `Rs. ${coupon.discount}`}

</td>
<td className="p-4 capitalize">
  <span
  className={`px-3 py-1 rounded-full text-xs font-semibold ${
    coupon.type === "percentage"
      ? "bg-blue-100 text-blue-700"
      : "bg-purple-100 text-purple-700"
  }`}
>
  {coupon.type === "percentage"
    ? "Percentage"
    : "Fixed"}
</span>
</td>

<td className="p-4">
  {coupon.minOrder > 0
  ? `Rs. ${coupon.minOrder}`
  : "-"}
</td>

<td className="p-4">
  {coupon.usedCount} /{" "}
{coupon.usageLimit || "Unlimited"}
</td>
                    <td className="p-4">
                      {coupon.expiry}
                    </td>

                    <td className="p-4">
                      <button
                        onClick={() =>
  toggleStatus(coupon.id, coupon.active)
}
                        className={`px-4 py-2 rounded-full text-white ${
                          coupon.active
                            ? "bg-green-500"
                            : "bg-gray-500"
                        }`}
                      >
                        {coupon.active
                          ? "Active"
                          : "Inactive"}
                      </button>
                    </td>

                    <td className="p-4 text-center">

                      <button
                        onClick={() =>
                          deleteCoupon(coupon.id)
                        }
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg"
                      >
                        <Trash2 size={18} />
                      </button>

                    </td>
                  </tr>
                ))
              )}

            </tbody>

          </table>

        </div>

      </div>
    </div>
  );
}