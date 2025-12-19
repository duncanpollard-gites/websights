const CF_API_URL = "https://api.cloudflare.com/client/v4";

interface CloudflareResponse<T> {
  success: boolean;
  errors: Array<{ message: string }>;
  result: T;
}

async function cfFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const response = await fetch(`${CF_API_URL}${endpoint}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${process.env.CLOUDFLARE_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const data: CloudflareResponse<T> = await response.json();

  if (!data.success) {
    throw new Error(data.errors[0]?.message || "Cloudflare API error");
  }

  return data.result;
}

// Check domain availability (via WHOIS)
export async function checkDomainAvailability(domain: string): Promise<boolean> {
  // Cloudflare Registrar API - check availability
  try {
    const result = await cfFetch<{ available: boolean }>(
      `/accounts/${process.env.CLOUDFLARE_ACCOUNT_ID}/registrar/domains/${domain}/available`
    );
    return result.available;
  } catch {
    // If API fails, assume unavailable
    return false;
  }
}

// Get suggested domains based on business name
export function suggestDomains(businessName: string): string[] {
  const slug = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, "")
    .slice(0, 20);

  return [
    `${slug}.co.uk`,
    `${slug}.uk`,
    `${slug}.com`,
    `${slug}services.co.uk`,
    `${slug}pro.co.uk`,
    `the${slug}.co.uk`,
  ];
}

// Add a domain to Cloudflare (after registration elsewhere or transfer)
export async function addDomainToCloudflare(domain: string) {
  return cfFetch<{ id: string; name: string }>(
    `/zones`,
    {
      method: "POST",
      body: JSON.stringify({
        name: domain,
        account: { id: process.env.CLOUDFLARE_ACCOUNT_ID },
        type: "full",
      }),
    }
  );
}

// Create DNS records for a customer site
export async function setupDNSRecords(
  zoneId: string,
  subdomain: string,
  targetIP: string
) {
  // A record for the domain
  await cfFetch(
    `/zones/${zoneId}/dns_records`,
    {
      method: "POST",
      body: JSON.stringify({
        type: "A",
        name: "@",
        content: targetIP,
        ttl: 1, // Auto
        proxied: true,
      }),
    }
  );

  // A record for www
  await cfFetch(
    `/zones/${zoneId}/dns_records`,
    {
      method: "POST",
      body: JSON.stringify({
        type: "A",
        name: "www",
        content: targetIP,
        ttl: 1,
        proxied: true,
      }),
    }
  );
}

// Get zone ID for a domain
export async function getZoneId(domain: string): Promise<string | null> {
  const zones = await cfFetch<Array<{ id: string; name: string }>>(
    `/zones?name=${domain}`
  );
  return zones[0]?.id || null;
}

// Create subdomain pointing to our hosting
export async function createSubdomainRecord(
  subdomain: string,
  targetCNAME: string = "sites.websights.co.uk"
) {
  const mainZoneId = process.env.CLOUDFLARE_ZONE_ID;
  if (!mainZoneId) throw new Error("CLOUDFLARE_ZONE_ID not configured");

  return cfFetch(
    `/zones/${mainZoneId}/dns_records`,
    {
      method: "POST",
      body: JSON.stringify({
        type: "CNAME",
        name: subdomain,
        content: targetCNAME,
        ttl: 1,
        proxied: true,
      }),
    }
  );
}

// List DNS records for a zone
export async function listDNSRecords(zoneId: string) {
  return cfFetch<Array<{ id: string; type: string; name: string; content: string }>>(
    `/zones/${zoneId}/dns_records`
  );
}
