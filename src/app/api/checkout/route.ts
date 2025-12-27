import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { doc, getDoc } from "firebase/firestore";

export async function POST(req: NextRequest) {
  try {
    const secret = process.env.STRIPE_SECRET_KEY;

    if (!secret) {
      console.error("❌ STRIPE_SECRET_KEY missing");
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    const stripe = new Stripe(secret, {
      apiVersion: "2024-06-20",
    });

    const body = await req.json();
    console.log("📦 Checkout request body:", body);

    const { itemId, days, renterId, renterEmail } = body;

    if (!itemId || !renterId || !days || days < 1) {
      return NextResponse.json(
        { error: "Invalid request payload" },
        { status: 400 }
      );
    }

    const ref = doc(db, "items", itemId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    const item = snap.data();
    const pricePerDay = Number(item.pricePerDay);

    if (!pricePerDay || pricePerDay <= 0) {
      return NextResponse.json(
        { error: "Invalid item price" },
        { status: 400 }
      );
    }

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: renterEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: `${item.title} rental`,
            },
            unit_amount: Math.round(pricePerDay * 100),
          },
          quantity: Math.max(1, days),
        },
      ],
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
      metadata: {
        itemId,
        renterId,
        ownerId: item.ownerId,
        days: String(days),
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("🔥 Checkout API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
