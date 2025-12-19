import { NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get stats
    const [userCount] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM users"
    );

    const [liveCount] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM sites WHERE status = 'live'"
    );

    const [draftCount] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM sites WHERE status = 'draft'"
    );

    // Recent users
    const recentUsers = await query<Array<{
      id: string;
      email: string;
      business_name: string;
      trade: string;
      created_at: string;
    }>>(
      `SELECT id, email, business_name, trade, created_at
       FROM users
       ORDER BY created_at DESC
       LIMIT 10`
    );

    // Calculate estimated revenue (live sites * £25)
    const revenue = (liveCount?.count || 0) * 2500;

    return NextResponse.json({
      totalUsers: userCount?.count || 0,
      liveSites: liveCount?.count || 0,
      draftSites: draftCount?.count || 0,
      revenue,
      recentUsers,
    });
  } catch (error) {
    console.error("Stats error:", error);
    return NextResponse.json({ error: "Failed to get stats" }, { status: 500 });
  }
}
