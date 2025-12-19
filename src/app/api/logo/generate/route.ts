import { NextRequest, NextResponse } from "next/server";
import { generateLogos, generateDemoLogo, tradeColors, LogoRequest, GeneratedLogo } from "@/lib/logo";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { businessName, trade, style = "modern", primaryColor, secondaryColor } = body;

    if (!businessName || !trade) {
      return NextResponse.json(
        { error: "Business name and trade are required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const hasApiKey = process.env.ANTHROPIC_API_KEY &&
                      !process.env.ANTHROPIC_API_KEY.includes("your-");

    let logos: GeneratedLogo[];

    if (hasApiKey) {
      // Use real AI generation
      const logoRequest: LogoRequest = {
        businessName,
        trade,
        style,
        primaryColor: primaryColor || tradeColors[trade]?.primary || "#2563eb",
        secondaryColor: secondaryColor || tradeColors[trade]?.secondary || "#1e40af",
      };

      logos = await generateLogos(logoRequest);
    } else {
      // Use demo fallback - generate simple template logos
      const colors = tradeColors[trade] || { primary: "#2563eb", secondary: "#1e40af" };

      logos = [
        {
          id: "logo1",
          name: "Icon Badge",
          description: "Circular icon with trade symbol",
          svg: generateDemoLogo(businessName, trade, "icon"),
        },
        {
          id: "logo2",
          name: "Monogram",
          description: "Initial letter in rounded square",
          svg: generateDemoLogo(businessName, trade, "monogram"),
        },
        {
          id: "logo3",
          name: "Text Logo",
          description: "Clean text-based logo",
          svg: generateDemoLogo(businessName, trade, "text"),
        },
        {
          id: "logo4",
          name: "Icon Variant",
          description: "Alternative icon style",
          svg: `<svg viewBox="0 0 200 100" xmlns="http://www.w3.org/2000/svg">
            <rect x="5" y="25" width="50" height="50" rx="10" fill="${colors.primary}"/>
            <text x="30" y="60" font-family="Arial, sans-serif" font-size="28" font-weight="bold" fill="white" text-anchor="middle">${businessName.charAt(0)}</text>
            <text x="130" y="55" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="${colors.primary}" text-anchor="middle">${businessName.length > 12 ? businessName.substring(0, 12) : businessName}</text>
            <text x="130" y="75" font-family="Arial, sans-serif" font-size="12" fill="${colors.secondary}" text-anchor="middle">${trade.charAt(0).toUpperCase() + trade.slice(1)}</text>
          </svg>`,
        },
      ];
    }

    return NextResponse.json({
      success: true,
      logos,
      isDemo: !hasApiKey,
    });
  } catch (error) {
    console.error("Logo generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate logos" },
      { status: 500 }
    );
  }
}
