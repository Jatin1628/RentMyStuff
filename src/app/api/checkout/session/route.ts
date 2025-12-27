import Stripe from "stripe";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY;

  if (!secret) {
    return NextResponse.json(
      { error: "Missing STRIPE_SECRET_KEY" },
      { status: 500 }
    );
  }

  // ✅ USE STABLE STRIPE API VERSION
  const stripe = new Stripe(secret, {
    apiVersion: "2024-06-20",
  });

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("session_id");

    if (!id) {
      return NextResponse.json(
        { error: "Missing session_id" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(id, {
      expand: ["line_items"],
    });

    return NextResponse.json({
      id: session.id,
      status: session.status,
      amount_total: session.amount_total,
      currency: session.currency,
      metadata: session.metadata,
      customer_email: session.customer_details?.email ?? null,
    });
  } catch (error) {
    console.error("Stripe retrieve session error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve session" },
      { status: 500 }
    );
  }
}
