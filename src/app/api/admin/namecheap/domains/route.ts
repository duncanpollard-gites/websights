import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import {
  checkDomainAvailability,
  registerDomain,
  listDomains,
  getDomainInfo,
  setNameservers,
  testConnection,
  suggestDomains,
  ContactInfo,
} from "@/lib/namecheap";
import { createSubdomain, ensureBaseDomain } from "@/lib/digitalocean";

// GET - List registered domains or test connection
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get("action");

    // Test connection
    if (action === "test") {
      const result = await testConnection();
      return NextResponse.json(result);
    }

    // Get domain info
    if (action === "info") {
      const domain = searchParams.get("domain");
      if (!domain) {
        return NextResponse.json({ error: "Domain required" }, { status: 400 });
      }
      const info = await getDomainInfo(domain);
      return NextResponse.json({ domain: info });
    }

    // List all domains
    const page = parseInt(searchParams.get("page") || "1", 10);
    const pageSize = parseInt(searchParams.get("pageSize") || "100", 10);

    const { domains, totalItems } = await listDomains(page, pageSize);

    return NextResponse.json({
      domains,
      totalItems,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("Namecheap domains GET error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch domains" },
      { status: 500 }
    );
  }
}

// POST - Domain actions (check, register, etc.)
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      // Check domain availability
      case "check": {
        const { domains } = body;
        if (!domains) {
          return NextResponse.json(
            { error: "Domain(s) required" },
            { status: 400 }
          );
        }

        const results = await checkDomainAvailability(domains);
        return NextResponse.json({ results });
      }

      // Get domain suggestions
      case "suggest": {
        const { businessName } = body;
        if (!businessName) {
          return NextResponse.json(
            { error: "Business name required" },
            { status: 400 }
          );
        }

        const suggestions = suggestDomains(businessName);

        // Check availability of suggestions
        const results = await checkDomainAvailability(suggestions);

        return NextResponse.json({ suggestions: results });
      }

      // Register a domain
      case "register": {
        const { domain, years, contact, nameservers, whoisGuard } = body;

        if (!domain) {
          return NextResponse.json(
            { error: "Domain name required" },
            { status: 400 }
          );
        }

        if (!contact) {
          return NextResponse.json(
            { error: "Contact information required" },
            { status: 400 }
          );
        }

        // Validate required contact fields
        const requiredFields: (keyof ContactInfo)[] = [
          "firstName",
          "lastName",
          "address1",
          "city",
          "stateProvince",
          "postalCode",
          "country",
          "phone",
          "emailAddress",
        ];

        for (const field of requiredFields) {
          if (!contact[field]) {
            return NextResponse.json(
              { error: `Contact ${field} is required` },
              { status: 400 }
            );
          }
        }

        const result = await registerDomain(
          domain,
          years || 1,
          contact as ContactInfo,
          nameservers,
          whoisGuard !== false
        );

        // If registration successful, create a subdomain on tradevista.co.uk for testing
        let subdomainResult = null;
        if (result.registered) {
          try {
            // Extract subdomain from domain name (e.g., mybeverleyplumber from mybeverleyplumber.co.uk)
            const subdomain = domain.split(".")[0];

            // Ensure base domain exists in DO DNS
            await ensureBaseDomain();

            // Create the subdomain
            subdomainResult = await createSubdomain(subdomain);
          } catch (subdomainError) {
            console.error("Failed to create subdomain:", subdomainError);
            // Don't fail the whole request if subdomain creation fails
          }
        }

        return NextResponse.json({
          success: result.registered,
          domain: result,
          subdomain: subdomainResult,
          message: result.registered
            ? `Domain ${domain} registered successfully!${subdomainResult?.success ? ` Test site available at ${subdomainResult.fullDomain}` : ""}`
            : "Registration pending",
        });
      }

      // Set nameservers
      case "set_nameservers": {
        const { domain, nameservers } = body;

        if (!domain || !nameservers || !Array.isArray(nameservers)) {
          return NextResponse.json(
            { error: "Domain and nameservers array required" },
            { status: 400 }
          );
        }

        await setNameservers(domain, nameservers);

        return NextResponse.json({
          success: true,
          message: `Nameservers updated for ${domain}`,
        });
      }

      default:
        return NextResponse.json(
          { error: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Namecheap domains POST error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Operation failed" },
      { status: 500 }
    );
  }
}
