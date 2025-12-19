import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { checkDomainAvailability } from "@/lib/cloudflare";

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

    // Check if Cloudflare is configured
    if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
      return NextResponse.json({
        domain,
        available: null,
        error: "Domain checking not configured",
      });
    }

    const available = await checkDomainAvailability(domain);

    return NextResponse.json({
      domain,
      available,
    });
  } catch (error) {
    console.error("Domain check error:", error);
    return NextResponse.json(
      { error: "Failed to check domain" },
      { status: 500 }
    );
  }
}
