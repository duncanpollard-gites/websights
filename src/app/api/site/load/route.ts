import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { query } from "@/lib/db";

interface Site {
  id: string;
  subdomain: string;
  custom_domain: string | null;
  site_config: string;
  status: "draft" | "live";
  created_at: Date;
  updated_at: Date;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const sites = await query<Site[]>(
      "SELECT * FROM sites WHERE user_id = ? LIMIT 1",
      [user.id]
    );

    if (!sites.length) {
      return NextResponse.json({ site: null });
    }

    const site = sites[0];
    return NextResponse.json({
      site: {
        id: site.id,
        subdomain: site.subdomain,
        customDomain: site.custom_domain,
        config: JSON.parse(site.site_config),
        status: site.status,
        createdAt: site.created_at,
        updatedAt: site.updated_at,
      },
    });
  } catch (error) {
    console.error("Load site error:", error);
    return NextResponse.json(
      { error: "Failed to load site" },
      { status: 500 }
    );
  }
}
