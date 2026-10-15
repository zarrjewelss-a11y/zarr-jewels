// app/api/checkout/route.ts
//
// Server-side checkout: verifies the logged-in user, re-fetches product
// prices/stock from Firestore, re-validates the coupon, and writes the
// order + stock update + stock history via the Admin SDK (bypasses
// client Firestore rules — this is the only place orders get created now).

import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";
import { FieldValue } from "firebase-admin/firestore";

export const dynamic = "force-dynamic";

interface CartItemInput {
  id: string;
  quantity: number;
}

export async function POST(req: NextRequest) {
  try {
    // 1. Verify the user is logged in ---------------------------------
    const authHeader = req.headers.get("authorization") || "";
    const idToken = authHeader.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!idToken) {
      return NextResponse.json(
        { error: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = await adminAuth.verifyIdToken(idToken);
    } catch {
      return NextResponse.json(
        { error: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const uid = decoded.uid;

    // 2. Parse + validate the request body -----------------------------
    const body = await req.json();

    const {
      items,
      customer,
      shippingInfo,
      paymentMethod,
      couponCode,
    }: {
      items: CartItemInput[];
      customer: { name: string; email: string; phone: string };
      shippingInfo: {
        address: string;
        city: string;
        zip: string;
      };
      paymentMethod: string;
      couponCode?: string;
    } = body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "EMPTY_CART" }, { status: 400 });
    }

    if (
      !customer?.name?.trim() ||
      !customer?.email?.trim() ||
      !customer?.phone?.trim() ||
      !shippingInfo?.address?.trim() ||
      !shippingInfo?.city?.trim() ||
      !shippingInfo?.zip?.trim()
    ) {
      return NextResponse.json(
        { error: "MISSING_BILLING_DETAILS" },
        { status: 400 }
      );
    }

    // 3. Load shipping cost from settings -------------------------------
    const settingsSnap = await adminDb.doc("settings/store").get();
    const shippingCost = Number(settingsSnap.data()?.shipping ?? 20);

    const orderId = `ZARR-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2, 8)
      .toUpperCase()}`;

    // 4. Run everything in a transaction ---------------------------------
    const result = await adminDb.runTransaction(async (transaction) => {
      // ---- Read products ----
      const productRefs = items.map((item) =>
        adminDb.doc(`products/${item.id}`)
      );
      const productSnaps = await Promise.all(
        productRefs.map((ref) => transaction.get(ref))
      );

      const orderItems: any[] = [];
      let subtotal = 0;

      for (let i = 0; i < items.length; i++) {
        const snap = productSnaps[i];
        const requested = Number(items[i].quantity || 0);

        if (!snap.exists) {
          throw new Error(`PRODUCT_NOT_FOUND:${items[i].id}`);
        }
        const data = snap.data()!;
        const currentStock = Number(data.stock || 0);

        if (requested <= 0) {
          throw new Error(`INVALID_QUANTITY:${data.name}`);
        }
        if (currentStock < requested) {
          throw new Error(
            `INSUFFICIENT_STOCK:${data.name}:${currentStock}`
          );
        }

        const price = Number(data.price); // <-- trusted from Firestore, not client
        subtotal += price * requested;

        orderItems.push({
          id: items[i].id,
          name: data.name,
          price,
          quantity: requested,
          qty: requested,
          image: data.image ?? null,
        });
      }

      // ---- Validate coupon (server-side) ----
      let discountPercent = 0;
      let couponRef: FirebaseFirestore.DocumentReference | null = null;
      let couponData: any = null;

      if (couponCode?.trim()) {
        const couponQuery = await adminDb
          .collection("coupons")
          .where("code", "==", couponCode.trim().toUpperCase())
          .limit(1)
          .get();

        if (couponQuery.empty) {
          throw new Error("INVALID_COUPON");
        }

        const couponDoc = couponQuery.docs[0];
        couponRef = couponDoc.ref;
        couponData = couponDoc.data();

        if (!couponData.active) throw new Error("COUPON_INACTIVE");
        if (new Date(couponData.expiry) < new Date())
          throw new Error("COUPON_EXPIRED");
        if (
          couponData.usageLimit > 0 &&
          couponData.usedCount >= couponData.usageLimit
        )
          throw new Error("COUPON_LIMIT_REACHED");
        if (couponData.minOrder > 0 && subtotal < couponData.minOrder)
          throw new Error(`COUPON_MIN_ORDER:${couponData.minOrder}`);

        discountPercent = Number(couponData.discount);
      }

      const discountAmount = ((subtotal + shippingCost) * discountPercent) / 100;
      const grandTotal = subtotal + shippingCost - discountAmount;

      // ---- Decrease stock + write stock history ----
      for (let i = 0; i < items.length; i++) {
        const snap = productSnaps[i];
        const data = snap.data()!;
        const requested = Number(items[i].quantity || 0);
        const newStock = Number(data.stock || 0) - requested;

        transaction.update(productRefs[i], { stock: newStock });

        const historyRef = adminDb.collection("stockHistory").doc();
        transaction.set(historyRef, {
          product: data.name,
          productId: items[i].id,
          action: "Decrease",
          quantity: requested,
          reason: "Order",
          orderId,
          createdAt: FieldValue.serverTimestamp(),
        });
      }

      // ---- Write the order ----
      const estimatedDelivery = (() => {
        const d = new Date();
        d.setDate(d.getDate() + 5);
        return d.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        });
      })();

      const orderRef = adminDb.doc(`orders/${orderId}`);
      transaction.set(orderRef, {
        id: orderId,
        orderId,
        userId: uid, // <-- now every order is tied to the logged-in user
        date: new Date().toLocaleDateString(),
        customer: {
          name: customer.name.trim(),
          email: customer.email.trim(),
          phone: customer.phone.trim(),
        },
        shipping: {
          address: shippingInfo.address.trim(),
          city: shippingInfo.city.trim(),
          country: "Pakistan",
          zip: shippingInfo.zip.trim(),
        },
        payment: paymentMethod,
        items: orderItems,
        subtotal,
        shippingCost,
        discount: discountPercent,
        discountAmount,
        coupon: couponData
          ? { code: couponData.code, discount: discountPercent }
          : null,
        total: grandTotal,
        status: "Pending",
        courier: "TCS Express",
        trackingNumber: `TCS-${Date.now()}`,
        estimatedDelivery,
        createdAt: FieldValue.serverTimestamp(),
      });

      // ---- Update coupon usage ----
      if (couponRef) {
        transaction.update(couponRef, { usedCount: FieldValue.increment(1) });
      }

      return { orderId, grandTotal };
    });

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    const message: string = error?.message || "UNKNOWN_ERROR";

    if (message.startsWith("PRODUCT_NOT_FOUND:")) {
      return NextResponse.json(
        { error: "PRODUCT_NOT_FOUND", detail: message.split(":")[1] },
        { status: 400 }
      );
    }
    if (message.startsWith("INSUFFICIENT_STOCK:")) {
      const [, name, stock] = message.split(":");
      return NextResponse.json(
        { error: "INSUFFICIENT_STOCK", detail: { name, stock } },
        { status: 400 }
      );
    }
    if (message.startsWith("COUPON_MIN_ORDER:")) {
      return NextResponse.json(
        { error: "COUPON_MIN_ORDER", detail: message.split(":")[1] },
        { status: 400 }
      );
    }
    if (
      [
        "INVALID_COUPON",
        "COUPON_INACTIVE",
        "COUPON_EXPIRED",
        "COUPON_LIMIT_REACHED",
      ].includes(message)
    ) {
      return NextResponse.json({ error: message }, { status: 400 });
    }

    console.error("CHECKOUT_ERROR:", error);
    return NextResponse.json({ error: "SERVER_ERROR" }, { status: 500 });
  }
}