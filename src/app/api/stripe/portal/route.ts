import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { createPortalSession } from "@/lib/stripe";
import { query } from "@/lib/db";

interface UserWithStripe {
  stripe_customer_id: string | null;
}

export async function POST() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Get Stripe customer ID
    const users = await query<UserWithStripe[]>(
      "SELECT stripe_customer_id FROM users WHERE id = ?",
      [user.id]
    );

    if (!users[0]?.stripe_customer_id) {
      return NextResponse.json(
        { error: "No subscription found" },
        { status: 400 }
      );
    }

    const session = await createPortalSession(users[0].stripe_customer_id);

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Portal error:", error);
    return NextResponse.json(
      { error: "Failed to create portal session" },
      { status: 500 }
    );
  }
}
