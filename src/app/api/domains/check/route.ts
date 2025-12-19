import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { domain } = await request.json();
    if (!domain) {
      return NextResponse.json({ error: "Domain is required" }, { status: 400 });
    }

    // Domain availability checking would require a domain registrar API
    // For now, return null to indicate checking isn't configured
    return NextResponse.json({
      domain,
      available: null,
      message: "Domain availability checking coming soon",
    });
  } catch (error) {
    console.error("Domain check error:", error);
    return NextResponse.json(
      { error: "Failed to check domain" },
      { status: 500 }
    );
  }
}
