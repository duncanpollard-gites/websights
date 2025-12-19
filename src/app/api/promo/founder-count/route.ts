import { NextResponse } from "next/server";
import { query } from "@/lib/db";

const MAX_FOUNDERS = 100;

export async function GET() {
  try {
    // Get current founder count from users table
    const [result] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM users WHERE is_founder = 1"
    );

    const currentCount = result?.count || 0;
    const remaining = Math.max(0, MAX_FOUNDERS - currentCount);
    const isFull = remaining === 0;

    return NextResponse.json({
      total: MAX_FOUNDERS,
      claimed: currentCount,
      remaining,
      isFull,
      percentClaimed: Math.round((currentCount / MAX_FOUNDERS) * 100),
    });
  } catch (error) {
    console.error("Founder count error:", error);
    return NextResponse.json(
      { error: "Failed to fetch founder count" },
      { status: 500 }
    );
  }
}
