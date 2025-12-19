import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import {
  listDomains,
  getDomainRecords,
  createDomain,
  deleteDomain,
  createDomainRecord,
  deleteDomainRecord,
  listDroplets,
  testConnection,
} from "@/lib/digitalocean";

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Test connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        connected: false,
        message: connectionTest.message,
        domains: [],
        droplets: [],
      });
    }

    // Get domains and droplets
    const [domains, droplets] = await Promise.all([
      listDomains().catch(() => []),
      listDroplets().catch(() => []),
    ]);

    // Get records for each domain
    const domainsWithRecords = await Promise.all(
      domains.map(async (domain) => {
        const records = await getDomainRecords(domain.name).catch(() => []);
        return {
          ...domain,
          records,
        };
      })
    );

    return NextResponse.json({
      connected: true,
      email: connectionTest.email,
      domains: domainsWithRecords,
      droplets: droplets.map((d) => ({
        id: d.id,
        name: d.name,
        status: d.status,
        ip: d.networks.v4.find((n) => n.type === "public")?.ip_address,
        region: d.region.name,
        size: d.size.slug,
        priceMonthly: d.size.price_monthly,
      })),
    });
  } catch (error) {
    console.error("Domains error:", error);
    return NextResponse.json(
      { error: "Failed to get domain data" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action, domain, record } = await request.json();

    switch (action) {
      case "add_domain": {
        if (!domain) {
          return NextResponse.json(
            { error: "Domain name required" },
            { status: 400 }
          );
        }
        const newDomain = await createDomain(domain);
        return NextResponse.json({
          success: true,
          domain: newDomain,
          message: `Domain ${domain} added to Digital Ocean`,
        });
      }

      case "delete_domain": {
        if (!domain) {
          return NextResponse.json(
            { error: "Domain name required" },
            { status: 400 }
          );
        }
        await deleteDomain(domain);
        return NextResponse.json({
          success: true,
          message: `Domain ${domain} removed from Digital Ocean`,
        });
      }

      case "add_record": {
        if (!domain || !record) {
          return NextResponse.json(
            { error: "Domain and record required" },
            { status: 400 }
          );
        }
        const newRecord = await createDomainRecord(domain, record);
        return NextResponse.json({
          success: true,
          record: newRecord,
          message: `DNS record added to ${domain}`,
        });
      }

      case "delete_record": {
        if (!domain || !record?.id) {
          return NextResponse.json(
            { error: "Domain and record ID required" },
            { status: 400 }
          );
        }
        await deleteDomainRecord(domain, record.id);
        return NextResponse.json({
          success: true,
          message: `DNS record deleted from ${domain}`,
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Domain action error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to perform action",
      },
      { status: 500 }
    );
  }
}
