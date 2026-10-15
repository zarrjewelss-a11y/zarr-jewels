import { NextRequest, NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "UNAUTHENTICATED" },
        { status: 401 }
      );
    }

    const idToken = authHeader.split("Bearer ")[1];

    const decodedToken = await adminAuth.verifyIdToken(idToken);

    if (decodedToken.admin !== true) {
      return NextResponse.json(
        { error: "FORBIDDEN" },
        { status: 403 }
      );
    }

    const body = await req.json();
    const orderId = body.orderId;

    if (!orderId || typeof orderId !== "string") {
      return NextResponse.json(
        { error: "INVALID_ORDER_ID" },
        { status: 400 }
      );
    }

    const orderRef = adminDb.collection("orders").doc(orderId);
    const orderSnap = await orderRef.get();

    if (!orderSnap.exists) {
      return NextResponse.json(
        { error: "ORDER_NOT_FOUND" },
        { status: 404 }
      );
    }

    await orderRef.delete();

    return NextResponse.json({
      success: true,
      message: "Order deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN ORDER DELETE ERROR:", error);

    return NextResponse.json(
      { error: "DELETE_FAILED" },
      { status: 500 }
    );
  }
}