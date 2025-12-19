import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin";
import { getAllTradeCategories, createTradeCategory, updateTradeCategory, deleteTradeCategory } from "@/lib/cms";
import { logAdminAction } from "@/lib/logging";

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const trades = await getAllTradeCategories();
    return NextResponse.json({ trades });
  } catch (error) {
    console.error("Error fetching trades:", error);
    return NextResponse.json({ error: "Failed to fetch trades" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, name, description, icon } = body;

    if (!slug || !name) {
      return NextResponse.json({ error: "Slug and name are required" }, { status: 400 });
    }

    await createTradeCategory(slug, name, description || null, icon || null);

    await logAdminAction("trade_category_created", String(adminUser.id), `Created trade category: ${name}`, { slug, name });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating trade:", error);
    return NextResponse.json({ error: "Failed to create trade" }, { status: 500 });
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

    await updateTradeCategory(id, updates);

    await logAdminAction("trade_category_updated", String(adminUser.id), `Updated trade category ID: ${id}`, { id, updates });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating trade:", error);
    return NextResponse.json({ error: "Failed to update trade" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await deleteTradeCategory(parseInt(id));

    await logAdminAction("trade_category_deleted", String(adminUser.id), `Deleted trade category ID: ${id}`, { id });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting trade:", error);
    return NextResponse.json({ error: "Failed to delete trade" }, { status: 500 });
  }
}
