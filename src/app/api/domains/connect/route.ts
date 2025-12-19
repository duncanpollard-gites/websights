import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

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

    // Update site with custom domain
    await query(
      "UPDATE sites SET custom_domain = ? WHERE user_id = ?",
      [domain, user.id]
    );

    // Return DNS instructions
    return NextResponse.json({
      success: true,
      domain,
      instructions: {
        title: "Connect Your Domain",
        steps: [
          `Log in to your domain registrar (where you bought ${domain})`,
          "Find DNS settings or nameserver settings",
          "Add these DNS records:",
        ],
        records: [
          { type: "A", name: "@", value: "76.76.21.21", note: "Points your domain to our servers" },
          { type: "CNAME", name: "www", value: "cname.vercel-dns.com", note: "Points www to our servers" },
        ],
        note: "Changes can take up to 48 hours to propagate, but usually work within a few minutes.",
      },
    });
  } catch (error) {
    console.error("Domain connect error:", error);
    return NextResponse.json(
      { error: "Failed to connect domain" },
      { status: 500 }
    );
  }
}
