import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import {
  createSubdomain,
  deleteSubdomain,
  listSubdomains,
  ensureBaseDomain,
} from "@/lib/digitalocean";

// GET - List all subdomains on tradevista.co.uk
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subdomains = await listSubdomains();

    return NextResponse.json({
      subdomains,
      baseDomain: "tradevista.co.uk",
    });
  } catch (error) {
    console.error("List subdomains error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to list subdomains" },
      { status: 500 }
    );
  }
}

// POST - Create a new subdomain or setup base domain
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action, subdomain, targetIp } = body;

    switch (action) {
      case "setup_base": {
        // Ensure tradevista.co.uk is set up in DO DNS
        const result = await ensureBaseDomain();
        return NextResponse.json(result);
      }

      case "create": {
        if (!subdomain) {
          return NextResponse.json(
            { error: "Subdomain name required" },
            { status: 400 }
          );
        }

        // Clean the subdomain name
        const cleanSubdomain = subdomain
          .toLowerCase()
          .replace(/[^a-z0-9-]/g, "")
          .replace(/^-+|-+$/g, "");

        if (!cleanSubdomain) {
          return NextResponse.json(
            { error: "Invalid subdomain name" },
            { status: 400 }
          );
        }

        const result = await createSubdomain(cleanSubdomain, targetIp);
        return NextResponse.json(result);
      }

      default:
        return NextResponse.json(
          { error: "Invalid action. Use 'setup_base' or 'create'" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Subdomain POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Operation failed" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a subdomain
export async function DELETE(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subdomain = searchParams.get("subdomain");

    if (!subdomain) {
      return NextResponse.json(
        { error: "Subdomain name required" },
        { status: 400 }
      );
    }

    const result = await deleteSubdomain(subdomain);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Subdomain DELETE error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete subdomain" },
      { status: 500 }
    );
  }
}
