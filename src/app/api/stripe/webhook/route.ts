import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { query } from "@/lib/db";
import Stripe from "stripe";

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;

        if (userId) {
          // Update user with Stripe customer ID
          await query(
            "UPDATE users SET stripe_customer_id = ?, stripe_subscription_id = ? WHERE id = ?",
            [customerId, subscriptionId, userId]
          );

          // Set site to live
          await query(
            "UPDATE sites SET status = 'live' WHERE user_id = ?",
            [userId]
          );
        }
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Update subscription status
        const status = subscription.status === "active" ? "live" : "draft";
        await query(
          `UPDATE sites s
           JOIN users u ON s.user_id = u.id
           SET s.status = ?
           WHERE u.stripe_customer_id = ?`,
          [status, customerId]
        );
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Set site back to draft
        await query(
          `UPDATE sites s
           JOIN users u ON s.user_id = u.id
           SET s.status = 'draft'
           WHERE u.stripe_customer_id = ?`,
          [customerId]
        );
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
