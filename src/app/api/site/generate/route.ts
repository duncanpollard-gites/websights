import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { generateInitialSite } from "@/lib/ai";
import { query } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-anthropic-api-key-here") {
      // Return mock data for development
      const mockConfig = {
        businessName: user.business_name || "My Trade Business",
        trade: user.trade || "plumber",
        location: user.location || "London",
        phone: user.phone || "07700 900000",
        services: user.services?.split(/[,\n]/).map(s => s.trim()).filter(Boolean) || ["General Services"],
        tagline: `Your trusted local ${user.trade || "tradesperson"} in ${user.location || "your area"}`,
        about: `We are a professional ${user.trade || "trade"} service based in ${user.location || "your area"}. With years of experience, we pride ourselves on quality workmanship and excellent customer service.`,
        colors: {
          primary: "#2563eb",
          secondary: "#f8fafc",
          accent: "#10b981"
        },
        sections: [
          {
            id: "hero",
            type: "hero",
            title: user.business_name || "Professional Trade Services",
            content: `Quality ${user.trade || "trade"} services in ${user.location || "your area"}. Call us today for a free quote.`,
            visible: true
          },
          {
            id: "services",
            type: "services",
            title: "Our Services",
            items: (user.services?.split(/[,\n]/).map(s => s.trim()).filter(Boolean) || ["General Services"]).map(s => ({
              title: s,
              description: `Professional ${s.toLowerCase()} services`,
              icon: "wrench"
            })),
            visible: true
          },
          {
            id: "about",
            type: "about",
            title: "About Us",
            content: `We are a professional ${user.trade || "trade"} service based in ${user.location || "your area"}. With years of experience, we pride ourselves on quality workmanship and excellent customer service.`,
            visible: true
          },
          {
            id: "testimonials",
            type: "testimonials",
            title: "What Our Customers Say",
            items: [
              { title: "John D.", description: "Excellent service, very professional and tidy. Would highly recommend!" },
              { title: "Sarah M.", description: "Came out same day for an emergency. Great work at a fair price." },
              { title: "Mike T.", description: "Been using them for years. Always reliable and trustworthy." }
            ],
            visible: true
          },
          {
            id: "contact",
            type: "contact",
            title: "Get In Touch",
            content: `Ready to discuss your project? Call us on ${user.phone || "07700 900000"} or fill out the form below.`,
            visible: true
          },
          {
            id: "cta",
            type: "cta",
            title: "Need a Quote?",
            content: "Contact us today for a free, no-obligation quote.",
            visible: true
          }
        ]
      };

      // Save to database
      const subdomain = user.business_name?.toLowerCase().replace(/[^a-z0-9]/g, "") || `user${user.id.slice(0, 8)}`;

      await query(
        `INSERT INTO sites (user_id, subdomain, site_config, status) VALUES (?, ?, ?, 'draft')
         ON DUPLICATE KEY UPDATE site_config = ?, updated_at = NOW()`,
        [user.id, subdomain, JSON.stringify(mockConfig), JSON.stringify(mockConfig)]
      );

      return NextResponse.json({
        success: true,
        config: mockConfig,
        message: "Site generated (demo mode - add ANTHROPIC_API_KEY for AI generation)"
      });
    }

    // Generate with AI
    const config = await generateInitialSite({
      trade: user.trade || "tradesperson",
      businessName: user.business_name || "My Business",
      location: user.location || "UK",
      phone: user.phone || "",
      services: user.services || "",
    });

    // Save to database
    const subdomain = user.business_name?.toLowerCase().replace(/[^a-z0-9]/g, "") || `user${user.id.slice(0, 8)}`;

    await query(
      `INSERT INTO sites (user_id, subdomain, site_config, status) VALUES (?, ?, ?, 'draft')
       ON DUPLICATE KEY UPDATE site_config = ?, updated_at = NOW()`,
      [user.id, subdomain, JSON.stringify(config), JSON.stringify(config)]
    );

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("Generate site error:", error);
    return NextResponse.json(
      { error: "Failed to generate site" },
      { status: 500 }
    );
  }
}
