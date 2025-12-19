import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import { query } from "@/lib/db";
import { logAdminAction } from "@/lib/logging";

interface Customer {
  id: string;
  email: string;
  business_name: string | null;
  trade: string | null;
  location: string | null;
  phone: string | null;
  created_at: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  site_count: number;
  live_site_count: number;
}

export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const search = searchParams.get("search") || "";
    const trade = searchParams.get("trade") || "";
    const status = searchParams.get("status") || "";

    const offset = (page - 1) * limit;

    // Build WHERE clause
    const conditions: string[] = [];
    const params: (string | number)[] = [];

    if (search) {
      conditions.push("(u.email LIKE ? OR u.business_name LIKE ? OR u.location LIKE ?)");
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    if (trade) {
      conditions.push("u.trade = ?");
      params.push(trade);
    }

    if (status === "subscribed") {
      conditions.push("u.stripe_subscription_id IS NOT NULL");
    } else if (status === "free") {
      conditions.push("u.stripe_subscription_id IS NULL");
    }

    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

    // Get total count
    const [countResult] = await query<{ count: number }[]>(
      `SELECT COUNT(*) as count FROM users u ${whereClause}`,
      params.length > 0 ? params : undefined
    );
    const totalCount = countResult?.count || 0;

    // Get customers with site counts
    const customers = await query<Customer[]>(
      `SELECT
        u.id, u.email, u.business_name, u.trade, u.location, u.phone,
        u.created_at, u.stripe_customer_id, u.stripe_subscription_id,
        COUNT(s.id) as site_count,
        SUM(CASE WHEN s.status = 'live' THEN 1 ELSE 0 END) as live_site_count
       FROM users u
       LEFT JOIN sites s ON u.id = s.user_id
       ${whereClause}
       GROUP BY u.id
       ORDER BY u.created_at DESC
       LIMIT ${limit} OFFSET ${offset}`,
      params.length > 0 ? params : undefined
    );

    // Get trade options for filter
    const trades = await query<{ trade: string; count: number }[]>(
      `SELECT trade, COUNT(*) as count
       FROM users
       WHERE trade IS NOT NULL AND trade != ''
       GROUP BY trade
       ORDER BY count DESC`
    );

    return NextResponse.json({
      customers,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
      filters: {
        trades: trades || [],
      },
    });
  } catch (error) {
    console.error("Customers error:", error);
    return NextResponse.json({ error: "Failed to get customers" }, { status: 500 });
  }
}

// Get single customer details
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { customerId } = await request.json();

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
    }

    // Get customer details
    const [customer] = await query<Array<{
      id: string;
      email: string;
      business_name: string | null;
      trade: string | null;
      location: string | null;
      phone: string | null;
      services: string | null;
      created_at: string;
      stripe_customer_id: string | null;
      stripe_subscription_id: string | null;
    }>>(
      `SELECT id, email, business_name, trade, location, phone, services,
              created_at, stripe_customer_id, stripe_subscription_id
       FROM users WHERE id = ?`,
      [customerId]
    );

    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // Get customer's sites
    const sites = await query<Array<{
      id: string;
      subdomain: string;
      custom_domain: string | null;
      status: string;
      created_at: string;
      updated_at: string;
    }>>(
      `SELECT id, subdomain, custom_domain, status, created_at, updated_at
       FROM sites WHERE user_id = ? ORDER BY created_at DESC`,
      [customerId]
    );

    return NextResponse.json({
      customer,
      sites,
    });
  } catch (error) {
    console.error("Customer details error:", error);
    return NextResponse.json({ error: "Failed to get customer details" }, { status: 500 });
  }
}

// Update customer details
export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { customerId, ...updates } = body;

    if (!customerId) {
      return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
    }

    // Build update query
    const allowedFields = ["email", "business_name", "trade", "location", "phone", "services"];
    const fields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    values.push(customerId);
    await query(`UPDATE users SET ${fields.join(", ")} WHERE id = ?`, values);

    await logAdminAction(
      "customer_updated",
      String(admin.id),
      `Updated customer ${customerId}`,
      { customerId, updatedFields: Object.keys(updates).filter(k => allowedFields.includes(k)) }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update customer error:", error);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}

// Update site status or details
export async function PATCH(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { siteId, ...updates } = body;

    if (!siteId) {
      return NextResponse.json({ error: "Site ID required" }, { status: 400 });
    }

    // Build update query
    const allowedFields = ["status", "subdomain", "custom_domain"];
    const fields: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        fields.push(`${key} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    values.push(siteId);
    await query(`UPDATE sites SET ${fields.join(", ")} WHERE id = ?`, values);

    await logAdminAction(
      "site_updated",
      String(admin.id),
      `Updated site ${siteId}`,
      { siteId, updatedFields: Object.keys(updates).filter(k => allowedFields.includes(k)) }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update site error:", error);
    return NextResponse.json({ error: "Failed to update site" }, { status: 500 });
  }
}
