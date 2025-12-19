import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getCurrentAdmin } from "@/lib/admin";
import { generateToken, getUserById } from "@/lib/auth";
import { query } from "@/lib/db";
import { logAdminAction } from "@/lib/logging";

// Start impersonation
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only super_admin can impersonate
    if (admin.role !== "super_admin") {
      return NextResponse.json({ error: "Only super admins can impersonate users" }, { status: 403 });
    }

    const { userId, reason } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "User ID required" }, { status: 400 });
    }

    // Verify user exists
    const user = await getUserById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const cookieStore = await cookies();
    const adminToken = cookieStore.get("admin_token")?.value;

    if (!adminToken) {
      return NextResponse.json({ error: "Admin token not found" }, { status: 400 });
    }

    // Get client IP
    const forwardedFor = request.headers.get("x-forwarded-for");
    const ipAddress = forwardedFor?.split(",")[0]?.trim() ||
                      request.headers.get("x-real-ip") ||
                      "unknown";

    // Create impersonation session
    await query(
      `INSERT INTO admin_impersonation_sessions (admin_user_id, impersonated_user_id, original_admin_token, ip_address, reason)
       VALUES (?, ?, ?, ?, ?)`,
      [admin.id, userId, adminToken, ipAddress, reason || null]
    );

    // Generate user token
    const userToken = generateToken(userId);

    // Log the action
    await logAdminAction(
      "impersonation_started",
      String(admin.id),
      `Started impersonating user ${user.email}`,
      { userId, userEmail: user.email, reason }
    );

    // Set cookies for impersonation
    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        business_name: user.business_name
      }
    });

    // Set user auth token
    response.cookies.set("auth_token", userToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 4, // 4 hours max for impersonation
      path: "/",
    });

    // Set impersonation indicator (not httpOnly so client can read)
    response.cookies.set("impersonating", "true", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 4,
      path: "/",
    });

    // Store admin ID for ending impersonation
    response.cookies.set("impersonator_admin_id", String(admin.id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 4,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Impersonation error:", error);
    return NextResponse.json({ error: "Failed to start impersonation" }, { status: 500 });
  }
}

// Check impersonation status
export async function GET(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const impersonating = cookieStore.get("impersonating")?.value === "true";
    const adminId = cookieStore.get("impersonator_admin_id")?.value;

    if (!impersonating || !adminId) {
      return NextResponse.json({ impersonating: false });
    }

    // Get impersonating user info
    const authToken = cookieStore.get("auth_token")?.value;
    if (!authToken) {
      return NextResponse.json({ impersonating: false });
    }

    // Get admin info
    const admins = await query<{ email: string; name: string | null }[]>(
      "SELECT email, name FROM admin_users WHERE id = ?",
      [adminId]
    );

    return NextResponse.json({
      impersonating: true,
      admin: admins[0] || null,
    });
  } catch (error) {
    console.error("Impersonation check error:", error);
    return NextResponse.json({ impersonating: false });
  }
}

// End impersonation
export async function DELETE(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const adminId = cookieStore.get("impersonator_admin_id")?.value;
    const authToken = cookieStore.get("auth_token")?.value;

    if (!adminId) {
      return NextResponse.json({ error: "Not impersonating" }, { status: 400 });
    }

    // Get the impersonation session to restore admin token
    const sessions = await query<{ id: number; original_admin_token: string; impersonated_user_id: string }[]>(
      `SELECT id, original_admin_token, impersonated_user_id
       FROM admin_impersonation_sessions
       WHERE admin_user_id = ? AND ended_at IS NULL
       ORDER BY started_at DESC LIMIT 1`,
      [adminId]
    );

    if (!sessions[0]) {
      // No active session, just clear cookies
      const response = NextResponse.json({ success: true });
      response.cookies.delete("auth_token");
      response.cookies.delete("impersonating");
      response.cookies.delete("impersonator_admin_id");
      return response;
    }

    const session = sessions[0];

    // End the session
    await query(
      "UPDATE admin_impersonation_sessions SET ended_at = NOW() WHERE id = ?",
      [session.id]
    );

    // Log the action
    await logAdminAction(
      "impersonation_ended",
      adminId,
      `Ended impersonation of user ${session.impersonated_user_id}`,
      { userId: session.impersonated_user_id }
    );

    // Restore admin token
    const response = NextResponse.json({ success: true });

    response.cookies.set("admin_token", session.original_admin_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 24 hours
      path: "/",
    });

    // Clear impersonation cookies
    response.cookies.delete("auth_token");
    response.cookies.delete("impersonating");
    response.cookies.delete("impersonator_admin_id");

    return response;
  } catch (error) {
    console.error("End impersonation error:", error);
    return NextResponse.json({ error: "Failed to end impersonation" }, { status: 500 });
  }
}
