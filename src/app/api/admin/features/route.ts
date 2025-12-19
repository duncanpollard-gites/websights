import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin";
import { getAllFeatureFlags, toggleFeatureFlag, createFeatureFlag } from "@/lib/cms";
import { logAdminAction } from "@/lib/logging";

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const flags = await getAllFeatureFlags();
    return NextResponse.json({ flags });
  } catch (error) {
    console.error("Error fetching feature flags:", error);
    return NextResponse.json({ error: "Failed to fetch flags" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { flag_key, name, description } = body;

    if (!flag_key || !name) {
      return NextResponse.json({ error: "Flag key and name are required" }, { status: 400 });
    }

    await createFeatureFlag(flag_key, name, description || null);

    await logAdminAction("feature_flag_created", String(adminUser.id), `Created feature flag: ${flag_key}`, { flag_key, name });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating feature flag:", error);
    return NextResponse.json({ error: "Failed to create flag" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { id, is_enabled } = body;

    if (!id || is_enabled === undefined) {
      return NextResponse.json({ error: "ID and is_enabled are required" }, { status: 400 });
    }

    await toggleFeatureFlag(id, is_enabled);

    await logAdminAction("feature_flag_toggled", String(adminUser.id), `Toggled feature flag ID: ${id} to ${is_enabled}`, { id, is_enabled });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error toggling feature flag:", error);
    return NextResponse.json({ error: "Failed to toggle flag" }, { status: 500 });
  }
}
