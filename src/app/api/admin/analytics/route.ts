import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin";
import { query } from "@/lib/db";

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "30"; // days

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(period));

    // Get signups over time
    const signups = await query<{ date: string; count: number }[]>(
      `SELECT DATE(created_at) as date, COUNT(*) as count
       FROM users
       WHERE created_at >= ?
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [startDate]
    );

    // Get total users
    const [totalUsers] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM users"
    );

    // Get new users in period
    const [newUsers] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM users WHERE created_at >= ?",
      [startDate]
    );

    // Get trade distribution
    const tradeDistribution = await query<{ trade: string; count: number }[]>(
      `SELECT COALESCE(trade, 'Other') as trade, COUNT(*) as count
       FROM users
       GROUP BY trade
       ORDER BY count DESC
       LIMIT 10`
    );

    // Get site status distribution
    const siteStatus = await query<{ status: string; count: number }[]>(
      `SELECT status, COUNT(*) as count
       FROM sites
       GROUP BY status`
    );

    // Get total sites
    const [totalSites] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM sites"
    );

    // Get live sites
    const [liveSites] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM sites WHERE status = 'live'"
    );

    // Get subscribed users (MRR calculation)
    const [subscribedUsers] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM users WHERE stripe_subscription_id IS NOT NULL"
    );

    // Monthly revenue (assuming £25/month per subscriber)
    const mrr = (subscribedUsers?.count || 0) * 25;

    // Get signups by month for the chart (last 12 months)
    const monthlySignups = await query<{ month: string; count: number }[]>(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') as month, COUNT(*) as count
       FROM users
       WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 12 MONTH)
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY month`
    );

    // Get MRR trend (last 6 months) - estimate based on subscription count at end of each month
    const mrrTrend = await query<{ month: string; subscribers: number }[]>(
      `SELECT
         DATE_FORMAT(u.created_at, '%Y-%m') as month,
         (SELECT COUNT(*) FROM users WHERE stripe_subscription_id IS NOT NULL AND created_at <= LAST_DAY(u.created_at)) as subscribers
       FROM users u
       WHERE u.created_at >= DATE_SUB(CURDATE(), INTERVAL 6 MONTH)
       GROUP BY DATE_FORMAT(u.created_at, '%Y-%m')
       ORDER BY month`
    );

    // Recent activity summary
    const [todaySignups] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM users WHERE DATE(created_at) = CURDATE()"
    );

    const [weekSignups] = await query<{ count: number }[]>(
      "SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)"
    );

    return NextResponse.json({
      overview: {
        totalUsers: totalUsers?.count || 0,
        newUsers: newUsers?.count || 0,
        totalSites: totalSites?.count || 0,
        liveSites: liveSites?.count || 0,
        subscribedUsers: subscribedUsers?.count || 0,
        mrr,
        todaySignups: todaySignups?.count || 0,
        weekSignups: weekSignups?.count || 0,
      },
      charts: {
        signups: signups.map(s => ({
          date: s.date,
          count: s.count
        })),
        monthlySignups: monthlySignups.map(s => ({
          month: s.month,
          count: s.count
        })),
        mrrTrend: mrrTrend.map(s => ({
          month: s.month,
          mrr: s.subscribers * 25
        })),
        tradeDistribution: tradeDistribution.map(t => ({
          name: t.trade || "Other",
          value: t.count
        })),
        siteStatus: siteStatus.map(s => ({
          name: s.status.charAt(0).toUpperCase() + s.status.slice(1),
          value: s.count
        })),
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
