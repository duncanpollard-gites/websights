import { NextRequest, NextResponse } from "next/server";
import {
  getAdminByEmail,
  verifyPassword,
  generateAdminToken,
  createAdminUser,
  getCurrentAdmin
} from "@/lib/admin";
import { query } from "@/lib/db";
import { cookies } from "next/headers";

// Login
export async function POST(request: NextRequest) {
  try {
    const { email, password, action } = await request.json();

    // Setup first admin
    if (action === "setup") {
      // Check if any admin exists
      const admins = await query<{ count: number }[]>("SELECT COUNT(*) as count FROM admin_users");
      if (admins[0].count > 0) {
        return NextResponse.json({ error: "Admin already exists" }, { status: 400 });
      }

      const admin = await createAdminUser(email, password, "Admin");
      const token = generateAdminToken(admin.id);

      const cookieStore = await cookies();
      cookieStore.set("admin_token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24 hours
        path: "/",
      });

      return NextResponse.json({ success: true, admin: { email: admin.email, role: admin.role } });
    }

    // Regular login
    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const admin = await getAdminByEmail(email);
    if (!admin) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await verifyPassword(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = generateAdminToken(admin.id);
    const cookieStore = await cookies();
    cookieStore.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({
      success: true,
      admin: { email: admin.email, role: admin.role, name: admin.name },
    });
  } catch (error) {
    console.error("Admin auth error:", error);
    return NextResponse.json({ error: "Authentication failed" }, { status: 500 });
  }
}

// Get current admin
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      // Check if any admin exists (for setup flow)
      const admins = await query<{ count: number }[]>("SELECT COUNT(*) as count FROM admin_users");
      return NextResponse.json({
        authenticated: false,
        needsSetup: admins[0].count === 0
      });
    }

    return NextResponse.json({
      authenticated: true,
      admin: { email: admin.email, role: admin.role, name: admin.name },
    });
  } catch (error) {
    console.error("Admin check error:", error);
    return NextResponse.json({ error: "Check failed" }, { status: 500 });
  }
}

// Logout
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("admin_token");
  return NextResponse.json({ success: true });
}
