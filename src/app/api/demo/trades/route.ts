import { NextResponse } from "next/server";
import { query } from "@/lib/db";

interface TradeWithDemo {
  slug: string;
  name: string;
  demo_business_name: string;
  demo_location: string;
}

export async function GET() {
  try {
    const trades = await query<TradeWithDemo[]>(
      `SELECT slug, name, demo_business_name, demo_location
       FROM trade_categories
       WHERE is_active = 1 AND demo_site_config IS NOT NULL
       ORDER BY name`
    );

    return NextResponse.json({ trades });
  } catch (error) {
    console.error("Demo trades error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trades", trades: [] },
      { status: 500 }
    );
  }
}
