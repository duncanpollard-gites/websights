import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin";
import { getAllEmailTemplates, updateEmailTemplate } from "@/lib/cms";
import { logAdminAction } from "@/lib/logging";

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const templates = await getAllEmailTemplates();
    return NextResponse.json({ templates });
  } catch (error) {
    console.error("Error fetching email templates:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
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

    await updateEmailTemplate(id, updates, String(adminUser.id));

    await logAdminAction("email_template_updated", String(adminUser.id), `Updated email template ID: ${id}`, { id, updates: Object.keys(updates) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating email template:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}
