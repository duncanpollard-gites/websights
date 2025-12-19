import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createCheckoutSession, PLANS } from "@/lib/stripe";

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if Stripe is configured
    if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
      return NextResponse.json(
        { error: "Stripe not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID to .env.local" },
        { status: 500 }
      );
    }

    const session = await createCheckoutSession(user.id, user.email);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}

// Return plan info for the billing page
export async function GET() {
  return NextResponse.json({
    plan: PLANS.live,
    configured: !!(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
  });
}
