import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin";
import { getAllContent, createContent, updateContent, deleteContent, CMSContent } from "@/lib/cms";
import { logAdminAction } from "@/lib/logging";

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category") || undefined;

    const content = await getAllContent(category);
    return NextResponse.json({ content });
  } catch (error) {
    console.error("Error fetching CMS content:", error);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, value, content_type, description, category } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    await createContent(
      key,
      value,
      content_type || "text",
      description || null,
      category || null,
      String(adminUser.id)
    );

    await logAdminAction("cms_content_created", String(adminUser.id), `Created CMS content: ${key}`, { key, category });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error creating CMS content:", error);
    return NextResponse.json({ error: "Failed to create content" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { key, value } = body;

    if (!key || value === undefined) {
      return NextResponse.json({ error: "Key and value are required" }, { status: 400 });
    }

    await updateContent(key, value, String(adminUser.id));

    await logAdminAction("cms_content_updated", String(adminUser.id), `Updated CMS content: ${key}`, { key });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating CMS content:", error);
    return NextResponse.json({ error: "Failed to update content" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get("key");

    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    await deleteContent(key);

    await logAdminAction("cms_content_deleted", String(adminUser.id), `Deleted CMS content: ${key}`, { key });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting CMS content:", error);
    return NextResponse.json({ error: "Failed to delete content" }, { status: 500 });
  }
}
