import { NextRequest, NextResponse } from "next/server";
import { verifyAdminAuth } from "@/lib/admin";
import { getActivityLogs, getLogStats, LogFilter, LogType } from "@/lib/logging";

export async function GET(request: NextRequest) {
  const adminUser = await verifyAdminAuth(request);
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(request.url);

    // Check if requesting stats
    if (searchParams.get("stats") === "true") {
      const days = parseInt(searchParams.get("days") || "30");
      const stats = await getLogStats(days);
      return NextResponse.json({ stats });
    }

    // Build filter from query params
    const filter: LogFilter = {};

    const logType = searchParams.get("logType");
    if (logType && ["api_call", "user_action", "admin_action", "error", "system"].includes(logType)) {
      filter.logType = logType as LogType;
    }

    const action = searchParams.get("action");
    if (action) {
      filter.action = action;
    }

    const userId = searchParams.get("userId");
    if (userId) {
      filter.userId = userId;
    }

    const adminUserId = searchParams.get("adminUserId");
    if (adminUserId) {
      filter.adminUserId = adminUserId;
    }

    const search = searchParams.get("search");
    if (search) {
      filter.search = search;
    }

    const startDate = searchParams.get("startDate");
    if (startDate) {
      filter.startDate = new Date(startDate);
    }

    const endDate = searchParams.get("endDate");
    if (endDate) {
      filter.endDate = new Date(endDate);
    }

    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    filter.page = page;
    filter.limit = Math.min(limit, 100); // Cap at 100

    const result = await getActivityLogs(filter);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching activity logs:", error);
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }
}
