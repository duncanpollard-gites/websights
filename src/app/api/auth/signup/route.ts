import { NextRequest, NextResponse } from "next/server";
import { createUser, generateToken, getUserByEmail, checkFounderAvailability } from "@/lib/auth";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, trade, businessName, location, phone, services, existingWebsite, competitors } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 400 }
      );
    }

    // Check if founder spots are available
    const founderStatus = await checkFounderAvailability();

    // Create user with founder status if available
    const user = await createUser({
      email,
      password,
      trade,
      businessName,
      location,
      phone,
      services,
      existingWebsite,
      competitors,
      isFounder: founderStatus.available,
      founderNumber: founderStatus.available ? founderStatus.nextNumber : undefined,
    });

    // Generate token and set cookie
    const token = generateToken(user.id);
    const cookieStore = await cookies();
    cookieStore.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        trade: user.trade,
        businessName: user.business_name,
        isFounder: user.is_founder,
        founderNumber: user.founder_signup_number,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
