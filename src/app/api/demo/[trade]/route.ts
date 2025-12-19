import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/db";

interface TradeCategory {
  id: number;
  slug: string;
  name: string;
  demo_business_name: string | null;
  demo_location: string | null;
  demo_phone: string | null;
  demo_services: string | null;
  demo_site_config: string | object | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trade: string }> }
) {
  try {
    const { trade } = await params;

    // Fetch trade category with demo config
    const trades = await query<TradeCategory[]>(
      `SELECT id, slug, name, demo_business_name, demo_location, demo_phone, demo_services, demo_site_config
       FROM trade_categories
       WHERE slug = ? AND is_active = 1`,
      [trade]
    );

    if (!trades.length) {
      return NextResponse.json({ error: "Trade not found" }, { status: 404 });
    }

    const tradeData = trades[0];

    if (!tradeData.demo_site_config) {
      return NextResponse.json(
        { error: "Demo site not configured for this trade" },
        { status: 404 }
      );
    }

    // Parse the site config (may already be an object from MySQL JSON column)
    const siteConfig = typeof tradeData.demo_site_config === 'string'
      ? JSON.parse(tradeData.demo_site_config)
      : tradeData.demo_site_config;

    return NextResponse.json({
      trade: tradeData.name,
      slug: tradeData.slug,
      config: siteConfig,
    });
  } catch (error) {
    console.error("Demo API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch demo site" },
      { status: 500 }
    );
  }
}

// Get all demo trades
export async function OPTIONS() {
  try {
    const trades = await query<{ slug: string; name: string }[]>(
      `SELECT slug, name FROM trade_categories WHERE is_active = 1 AND demo_site_config IS NOT NULL ORDER BY name`
    );

    return NextResponse.json({ trades });
  } catch (error) {
    console.error("Demo trades error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trades" },
      { status: 500 }
    );
  }
}
