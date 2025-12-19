import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// Generate domain suggestions from business name
function suggestDomains(businessName: string): string[] {
  const cleanName = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "");

  const suggestions: string[] = [];
  const tlds = [".co.uk", ".uk", ".com"];

  // Basic suggestions
  tlds.forEach((tld) => {
    suggestions.push(`${cleanName}${tld}`);
  });

  // With common suffixes for trades
  const suffixes = ["services", "pro", "uk"];
  suffixes.forEach((suffix) => {
    suggestions.push(`${cleanName}${suffix}.co.uk`);
  });

  return suggestions.slice(0, 6); // Return top 6 suggestions
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const businessName = user.business_name || "mybusiness";
    const suggestions = suggestDomains(businessName);

    // Return suggestions without availability check for now
    // Domain availability checking would require a registrar API
    return NextResponse.json({
      suggestions: suggestions.map((domain) => ({
        domain,
        available: null, // Unknown - checking coming soon
      })),
      configured: false,
    });
  } catch (error) {
    console.error("Domain suggest error:", error);
    return NextResponse.json(
      { error: "Failed to get domain suggestions" },
      { status: 500 }
    );
  }
}
