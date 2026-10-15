import { NextRequest, NextResponse } from "next/server";
import { getAuth } from "firebase-admin/auth";
import { FieldValue } from "firebase-admin/firestore";
import { adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    // -----------------------------------------
    // VERIFY LOGIN
    // -----------------------------------------
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "UNAUTHORIZED" },
        { status: 401 }
      );
    }

    const idToken = authHeader.substring(7);

    const decodedToken = await getAuth().verifyIdToken(idToken);
    const uid = decodedToken.uid;

    // -----------------------------------------
    // READ REQUEST
    // -----------------------------------------
    const body = await req.json();

    const orderId = String(body.orderId || "").trim();
    const productId = String(body.productId || "").trim();
    const rating = Number(body.rating);
    const review = String(body.review || "").trim();

    if (!orderId || !productId || !review) {
      return NextResponse.json(
        { error: "MISSING_FIELDS" },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { error: "INVALID_RATING" },
        { status: 400 }
      );
    }

    // -----------------------------------------
    // GET ORDER
    // -----------------------------------------
    const orderRef = adminDb.doc(`orders/${orderId}`);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "ORDER_NOT_FOUND" },
        { status: 404 }
      );
    }

    const order = orderSnap.data()!;

    // -----------------------------------------
    // VERIFY ORDER OWNER
    // -----------------------------------------
    if (order.userId !== uid) {
      return NextResponse.json(
        { error: "FORBIDDEN" },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // ONLY DELIVERED ORDERS
    // -----------------------------------------
    if (order.status !== "Delivered") {
      return NextResponse.json(
        { error: "ORDER_NOT_DELIVERED" },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // VERIFY PRODUCT WAS PURCHASED
    // -----------------------------------------
    const orderItems = Array.isArray(order.items)
      ? order.items
      : [];

    const purchasedItem = orderItems.find(
      (item: any) => String(item?.id || "") === productId
    );

    if (!purchasedItem) {
      return NextResponse.json(
        { error: "PRODUCT_NOT_PURCHASED" },
        { status: 403 }
      );
    }

    // -----------------------------------------
    // PREVENT DUPLICATE REVIEW
    // -----------------------------------------
    const existingReview = await adminDb
      .collection("reviews")
      .where("orderId", "==", orderId)
      .where("productId", "==", productId)
      .where("userId", "==", uid)
      .limit(1)
      .get();

    if (!existingReview.empty) {
      return NextResponse.json(
        { error: "REVIEW_ALREADY_EXISTS" },
        { status: 409 }
      );
    }

    // -----------------------------------------
    // SAVE REVIEW
    // -----------------------------------------
    const reviewRef = adminDb.collection("reviews").doc();

    await reviewRef.set({
      orderId,
      productId,
      productName: purchasedItem.name || "",
      userId: uid,

      customerName: order.customer?.name || "",
      customerEmail: order.customer?.email || "",

      rating,
      review,

      createdAt: FieldValue.serverTimestamp(),
    });

    return NextResponse.json({
      success: true,
      reviewId: reviewRef.id,
    });
  } catch (error) {
    console.error("REVIEW_API_ERROR:", error);

    return NextResponse.json(
      { error: "SERVER_ERROR" },
      { status: 500 }
    );
  }
}