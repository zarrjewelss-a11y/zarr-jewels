"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { db } from "@/lib/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { ArrowLeft, Printer, Receipt } from "lucide-react";

export default function InvoicePage() {
  const params = useParams();
  const id = params.id as string;

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const loadInvoice = async () => {
    try {
      setLoading(true);

      // --------------------------------
      // FIRST: FIND BY DOCUMENT ID
      // --------------------------------

      const docRef = doc(db, "orders", id);
      const snap = await getDoc(docRef);

      if (snap.exists()) {
        setOrder({
          id: snap.id,
          ...snap.data(),
        });

        return;
      }

      // --------------------------------
      // SECOND: FIND BY orderId FIELD
      // --------------------------------

      const q = query(
        collection(db, "orders"),
        where("orderId", "==", id)
      );

      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const orderDoc = querySnapshot.docs[0];

        setOrder({
          id: orderDoc.id,
          ...orderDoc.data(),
        });

        return;
      }

      console.error(
        "Invoice not found for order ID:",
        id
      );

      setOrder(null);

    } catch (error) {
      console.error(
        "Failed to load invoice:",
        error
      );

      setOrder(null);

    } finally {
      setLoading(false);
    }
  };

  if (id) {
    loadInvoice();
  }
}, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Loading Invoice...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl font-bold">
        Invoice Not Found
      </div>
    );
  }

  return (
    <>
      <Header />

      <section className="min-h-screen bg-pink-50 py-10">
        <div className="max-w-6xl mx-auto px-5">

          <div className="flex justify-between items-center mb-8">

            <Link
              href="/order"
              className="flex items-center gap-2 text-pink-600 hover:text-pink-700"
            >
              <ArrowLeft size={18} />
              Back to Orders
            </Link>

            <button
              onClick={() => window.print()}
              className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-3 rounded-xl flex items-center gap-2"
            >
              <Printer size={18} />
              Print Invoice
            </button>

          </div>

          <div className="bg-white rounded-3xl shadow-xl p-10">

            <div className="flex justify-between items-start border-b pb-8">

              <div>
                <h1 className="text-5xl font-bold text-pink-600">
  ZARR
</h1>

<p className="text-sm tracking-[0.35em] text-pink-500 mt-1">
  JEWELS
</p>

                <p className="text-gray-500 mt-2">
                  Luxury Jewelry Store
                </p>
              </div>

              <div className="text-right">

                <div className="flex items-center justify-end gap-2 text-pink-600">
                  <Receipt size={28} />
                  <span className="text-2xl font-bold">
                    INVOICE
                  </span>
                </div>

                <p className="mt-4">
                  <strong>Invoice No:</strong>{" "}
                  {order.id}
                </p>

                <p className="mt-2">
  <strong>Date:</strong>{" "}
  {order.date ||
    order.createdAt?.toDate?.().toLocaleDateString() ||
    "N/A"}
</p>

              </div>

            </div>

            <div className="grid md:grid-cols-2 gap-10 mt-10 border-b pb-8">

              <div>
                <h2 className="text-xl font-bold text-pink-600 mb-4">
                  Bill To
                </h2>

                <p className="font-semibold">
                  {order.customer?.name}
                </p>

                <p>{order.customer?.email}</p>

                <p>{order.customer?.phone}</p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-pink-600 mb-4">
                  Shipping Address
                </h2>

                <p>{order.shipping?.address}</p>

                <p>
                  {order.shipping?.city},{" "}
                  {order.shipping?.country}
                </p>

                <p>{order.shipping?.zip}</p>
              </div>

            </div>

            <div className="mt-10">

              <table className="w-full border-collapse">

                <thead>

                  <tr className="bg-pink-600 text-white">

                    <th className="text-left p-4">
                      Product
                    </th>

                    <th className="p-4">
                      Qty
                    </th>

                    <th className="p-4">
                      Price
                    </th>

                    <th className="p-4">
                      Total
                    </th>

                  </tr>

                </thead>

                <tbody>

      {order.items?.map((item: any, index: number) => (

        <tr
          key={`${item.id}-${index}`}
          className="border-b"
        >

          <td className="p-4">
            <div className="flex items-center gap-4">

              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-xl object-cover"
              />

              <span>{item.name}</span>

            </div>
          </td>

          <td className="text-center">
            {item.qty}
          </td>

          <td className="text-center">
            Rs. {item.price}
          </td>

          <td className="text-center font-semibold">
            Rs. {item.price * item.qty}
          </td>

        </tr>

      ))}

    </tbody>

  </table>

</div>


{/* Totals */}

<div className="flex justify-end mt-10">

  <div className="w-full md:w-96 space-y-4">

    <div className="flex justify-between">
      <span>Subtotal</span>
      <span>Rs. {order.subtotal}</span>
    </div>

    <div className="flex justify-between">
      <span>Shipping</span>
      <span>Rs. {order.shippingCost}</span>
    </div>

    <div className="flex justify-between text-green-600">
      <span>Discount</span>
      <span>- Rs. {order.discountAmount}</span>
    </div>

    <hr />

    <div className="flex justify-between text-2xl font-bold">
      <span>Grand Total</span>
      <span className="text-pink-600">
        Rs. {order.total}
      </span>
    </div>

  </div>

</div>
            <div className="mt-12 border-t pt-8 text-center">

              <h2 className="text-2xl font-bold text-pink-600">
                Thank You For Shopping With ZARR JEWELS ❤️
              </h2>

              <p className="text-gray-500 mt-3">
                We appreciate your trust in us. Keep this invoice for your records.
              </p>

              <div className="flex justify-center gap-4 mt-8">

                <button
                  onClick={() => window.print()}
                  className="bg-pink-600 hover:bg-pink-700 text-white px-8 py-3 rounded-xl"
                >
                  Print Invoice
                </button>

                <Link
                  href="/order"
                  className="border border-pink-600 text-pink-600 hover:bg-pink-600 hover:text-white px-8 py-3 rounded-xl"
                >
                  Back to Orders
                </Link>

              </div>

            </div>

          </div>

        </div>

      </section>

      <Footer />
    </>
  );
}