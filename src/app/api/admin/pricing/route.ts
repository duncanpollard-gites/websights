import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin";
import { getAllPricingPlans, createPricingPlan, updatePricingPlan } from "@/lib/cms";
import { logAdminAction } from "@/lib/logging";

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const plans = await getAllPricingPlans();
    return NextResponse.json({ plans });
  } catch (error) {
    console.error("Error fetching pricing plans:", error);
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { plan_key, name, description, price_monthly, price_yearly, trial_days, features, limits, stripe_price_id } = body;

    if (!plan_key || !name || price_monthly === undefined) {
      return NextResponse.json({ error: "Plan key, name, and monthly price are required" }, { status: 400 });
    }

    await createPricingPlan({
      plan_key,
      name,
      description,
      price_monthly,
      price_yearly,
      trial_days,
      features,
      limits,
      stripe_price_id,
    });

    await logAdminAction("pricing_plan_created", String(adminUser.id), `Created pricing plan: ${name}`, { plan_key, name, price_monthly });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating pricing plan:", error);
    return NextResponse.json({ error: "Failed to create plan" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await updatePricingPlan(id, updates);

    await logAdminAction("pricing_plan_updated", String(adminUser.id), `Updated pricing plan ID: ${id}`, { id, updates: Object.keys(updates) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating pricing plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}
