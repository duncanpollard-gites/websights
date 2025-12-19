import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { suggestDomains, checkDomainAvailability } from "@/lib/cloudflare";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const businessName = user.business_name || "mybusiness";
    const suggestions = suggestDomains(businessName);

    // Check if Cloudflare is configured
    if (!process.env.CLOUDFLARE_API_TOKEN || !process.env.CLOUDFLARE_ACCOUNT_ID) {
      // Return suggestions without availability check
      return NextResponse.json({
        suggestions: suggestions.map((domain) => ({
          domain,
          available: null, // Unknown
        })),
        configured: false,
      });
    }

    // Check availability for each suggestion (in parallel)
    const results = await Promise.all(
      suggestions.map(async (domain) => {
        try {
          const available = await checkDomainAvailability(domain);
          return { domain, available };
        } catch {
          return { domain, available: null };
        }
      })
    );

    return NextResponse.json({
      suggestions: results,
      configured: true,
    });
  } catch (error) {
    console.error("Domain suggest error:", error);
    return NextResponse.json(
      { error: "Failed to get domain suggestions" },
      { status: 500 }
    );
  }
}
