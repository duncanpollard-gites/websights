import Stripe from "stripe";

// Only initialize Stripe if the key is configured
const stripeKey = process.env.STRIPE_SECRET_KEY;
export const stripe = stripeKey
  ? new Stripe(stripeKey, { apiVersion: "2025-12-15.clover" })
  : null;

function getStripe(): Stripe {
  if (!stripe) {
    throw new Error("Stripe is not configured. Please add STRIPE_SECRET_KEY to environment variables.");
  }
  return stripe;
}

export const PLANS = {
  live: {
    name: "Live",
    price: 2500, // £25.00 in pence
    priceId: process.env.STRIPE_PRICE_ID || "",
    features: [
      "Custom domain (yourname.co.uk)",
      "Professional email address",
      "AI website builder",
      "Online booking system",
      "SSL security included",
      "Unlimited edits",
      "UK-based support",
    ],
  },
};

export async function createCheckoutSession(userId: string, userEmail: string) {
  const session = await getStripe().checkout.sessions.create({
    customer_email: userEmail,
    payment_method_types: ["card"],
    line_items: [
      {
        price: PLANS.live.priceId,
        quantity: 1,
      },
    ],
    mode: "subscription",
    success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?success=true`,
    cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing?canceled=true`,
    metadata: {
      userId,
    },
  });

  return session;
}

export async function createPortalSession(customerId: string) {
  const session = await getStripe().billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard/billing`,
  });

  return session;
}
