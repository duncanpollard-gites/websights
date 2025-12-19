import { getSetting } from "./admin";

const DO_API_BASE = "https://api.digitalocean.com/v2";

interface DOApiOptions {
  method?: string;
  body?: Record<string, unknown>;
}

interface DODroplet {
  id: number;
  name: string;
  status: string;
  networks: {
    v4: Array<{
      ip_address: string;
      type: string;
    }>;
  };
  created_at: string;
  region: { slug: string; name: string };
  size: { slug: string; price_monthly: number };
  tags?: string[];
}

interface DODomain {
  name: string;
  ttl: number;
}

interface DODomainRecord {
  id: number;
  type: string;
  name: string;
  data: string;
  ttl: number;
}

interface DomainAvailability {
  available: boolean;
  domain: string;
  price?: number;
}

async function doApiRequest<T>(
  endpoint: string,
  options: DOApiOptions = {}
): Promise<T> {
  const token = await getSetting("digitalocean_api_token");
  if (!token) {
    throw new Error("Digital Ocean API token not configured");
  }

  const response = await fetch(`${DO_API_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || `Digital Ocean API error: ${response.status}`
    );
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// ============ DROPLETS (Hosting) ============

export async function listDroplets(): Promise<DODroplet[]> {
  const data = await doApiRequest<{ droplets: DODroplet[] }>("/droplets");
  return data.droplets;
}

export async function getDroplet(dropletId: number): Promise<DODroplet> {
  const data = await doApiRequest<{ droplet: DODroplet }>(
    `/droplets/${dropletId}`
  );
  return data.droplet;
}

export async function createDroplet(options: {
  name: string;
  region?: string;
  size?: string;
  image?: string;
  sshKeys?: string[];
  userData?: string;
  tags?: string[];
}): Promise<DODroplet> {
  const {
    name,
    region = "lon1", // London by default
    size = "s-1vcpu-1gb", // Basic droplet
    image = "ubuntu-22-04-x64",
    sshKeys = [],
    userData,
    tags = ["tradevista"],
  } = options;

  // User data script to set up the droplet for hosting static sites
  const defaultUserData = `#!/bin/bash
apt-get update
apt-get install -y nginx certbot python3-certbot-nginx

# Create web directory
mkdir -p /var/www/sites

# Basic nginx config
cat > /etc/nginx/sites-available/default << 'NGINX'
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    root /var/www/html;
    index index.html;

    server_name _;

    location / {
        try_files $uri $uri/ =404;
    }
}
NGINX

systemctl restart nginx
`;

  const data = await doApiRequest<{ droplet: DODroplet }>("/droplets", {
    method: "POST",
    body: {
      name,
      region,
      size,
      image,
      ssh_keys: sshKeys,
      user_data: userData || defaultUserData,
      tags,
      monitoring: true,
      backups: false,
    },
  });

  return data.droplet;
}

export async function deleteDroplet(dropletId: number): Promise<void> {
  await doApiRequest(`/droplets/${dropletId}`, { method: "DELETE" });
}

export async function getDropletAction(
  dropletId: number,
  actionId: number
): Promise<{ status: string; type: string }> {
  const data = await doApiRequest<{
    action: { status: string; type: string };
  }>(`/droplets/${dropletId}/actions/${actionId}`);
  return data.action;
}

// ============ DOMAINS ============

export async function listDomains(): Promise<DODomain[]> {
  const data = await doApiRequest<{ domains: DODomain[] }>("/domains");
  return data.domains;
}

export async function createDomain(name: string): Promise<DODomain> {
  const data = await doApiRequest<{ domain: DODomain }>("/domains", {
    method: "POST",
    body: { name },
  });
  return data.domain;
}

export async function deleteDomain(name: string): Promise<void> {
  await doApiRequest(`/domains/${name}`, { method: "DELETE" });
}

export async function getDomainRecords(
  domain: string
): Promise<DODomainRecord[]> {
  const data = await doApiRequest<{ domain_records: DODomainRecord[] }>(
    `/domains/${domain}/records`
  );
  return data.domain_records;
}

export async function createDomainRecord(
  domain: string,
  record: {
    type: string;
    name: string;
    data: string;
    ttl?: number;
    priority?: number;
    port?: number;
    weight?: number;
  }
): Promise<DODomainRecord> {
  const data = await doApiRequest<{ domain_record: DODomainRecord }>(
    `/domains/${domain}/records`,
    {
      method: "POST",
      body: {
        type: record.type,
        name: record.name,
        data: record.data,
        ttl: record.ttl || 3600,
        priority: record.priority,
        port: record.port,
        weight: record.weight,
      },
    }
  );
  return data.domain_record;
}

export async function updateDomainRecord(
  domain: string,
  recordId: number,
  record: {
    type?: string;
    name?: string;
    data?: string;
    ttl?: number;
  }
): Promise<DODomainRecord> {
  const data = await doApiRequest<{ domain_record: DODomainRecord }>(
    `/domains/${domain}/records/${recordId}`,
    {
      method: "PUT",
      body: record,
    }
  );
  return data.domain_record;
}

export async function deleteDomainRecord(
  domain: string,
  recordId: number
): Promise<void> {
  await doApiRequest(`/domains/${domain}/records/${recordId}`, {
    method: "DELETE",
  });
}

// ============ APPS (App Platform) ============

interface DOApp {
  id: string;
  default_ingress: string;
  live_url: string;
  active_deployment: {
    id: string;
    phase: string;
    created_at: string;
  };
  spec: {
    name: string;
    region: string;
    static_sites?: Array<{
      name: string;
      source_dir: string;
      github?: {
        repo: string;
        branch: string;
      };
    }>;
  };
}

export async function listApps(): Promise<DOApp[]> {
  const data = await doApiRequest<{ apps: DOApp[] }>("/apps");
  return data.apps;
}

export async function getApp(appId: string): Promise<DOApp> {
  const data = await doApiRequest<{ app: DOApp }>(`/apps/${appId}`);
  return data.app;
}

export async function createStaticSiteApp(options: {
  name: string;
  githubRepo: string;
  branch?: string;
  sourceDir?: string;
  domain?: string;
}): Promise<DOApp> {
  const {
    name,
    githubRepo,
    branch = "main",
    sourceDir = "/",
    domain,
  } = options;

  const spec: Record<string, unknown> = {
    name,
    region: "lon",
    static_sites: [
      {
        name: `${name}-site`,
        source_dir: sourceDir,
        github: {
          repo: githubRepo,
          branch,
          deploy_on_push: true,
        },
        build_command: "npm run build",
        output_dir: "out",
      },
    ],
  };

  if (domain) {
    spec.domains = [{ domain, type: "PRIMARY" }];
  }

  const data = await doApiRequest<{ app: DOApp }>("/apps", {
    method: "POST",
    body: { spec },
  });

  return data.app;
}

export async function deleteApp(appId: string): Promise<void> {
  await doApiRequest(`/apps/${appId}`, { method: "DELETE" });
}

// ============ SPACES (Object Storage for static assets) ============

// Note: Spaces uses S3-compatible API, would need aws-sdk
// For now, keeping this as a reference for future implementation

// ============ ACCOUNT & BILLING ============

export async function getAccount(): Promise<{
  email: string;
  status: string;
  droplet_limit: number;
}> {
  const data = await doApiRequest<{
    account: {
      email: string;
      status: string;
      droplet_limit: number;
    };
  }>("/account");
  return data.account;
}

export async function getBalance(): Promise<{
  month_to_date_balance: string;
  account_balance: string;
  month_to_date_usage: string;
}> {
  return doApiRequest("/customers/my/balance");
}

// ============ SSH KEYS ============

export async function listSSHKeys(): Promise<
  Array<{ id: number; fingerprint: string; name: string }>
> {
  const data = await doApiRequest<{
    ssh_keys: Array<{ id: number; fingerprint: string; name: string }>;
  }>("/account/keys");
  return data.ssh_keys;
}

export async function createSSHKey(
  name: string,
  publicKey: string
): Promise<{ id: number; fingerprint: string; name: string }> {
  const data = await doApiRequest<{
    ssh_key: { id: number; fingerprint: string; name: string };
  }>("/account/keys", {
    method: "POST",
    body: { name, public_key: publicKey },
  });
  return data.ssh_key;
}

// ============ REGIONS & SIZES ============

export async function listRegions(): Promise<
  Array<{ slug: string; name: string; available: boolean }>
> {
  const data = await doApiRequest<{
    regions: Array<{ slug: string; name: string; available: boolean }>;
  }>("/regions");
  return data.regions;
}

export async function listSizes(): Promise<
  Array<{
    slug: string;
    description: string;
    price_monthly: number;
    vcpus: number;
    memory: number;
    disk: number;
  }>
> {
  const data = await doApiRequest<{
    sizes: Array<{
      slug: string;
      description: string;
      price_monthly: number;
      vcpus: number;
      memory: number;
      disk: number;
    }>;
  }>("/sizes");
  return data.sizes;
}

// ============ HELPER: Test Connection ============

export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  email?: string;
}> {
  try {
    const account = await getAccount();
    return {
      success: true,
      message: `Connected as ${account.email}`,
      email: account.email,
    };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to connect to Digital Ocean",
    };
  }
}

// ============ HELPER: Check Domain Availability ============
// Note: Digital Ocean doesn't provide domain availability checking
// You would need to use a separate registrar API (like Namecheap, GoDaddy, etc.)
// This is a placeholder for future implementation

export async function checkDomainAvailability(
  domain: string
): Promise<DomainAvailability> {
  // This would need a domain registrar API
  // For now, return a placeholder response
  return {
    available: false,
    domain,
    price: undefined,
  };
}

// ============ HELPER: Setup Site Hosting ============

export interface SiteHostingConfig {
  siteId: string;
  subdomain: string;
  customDomain?: string;
  html: string;
}

export async function setupSiteHosting(config: SiteHostingConfig): Promise<{
  success: boolean;
  url: string;
  message: string;
}> {
  // This would deploy the site HTML to a droplet or App Platform
  // For static sites, App Platform or Spaces would be ideal
  // Implementation depends on chosen hosting strategy

  // Placeholder for now
  return {
    success: true,
    url: `https://${config.subdomain}.tradevista.co.uk`,
    message: "Site deployed successfully",
  };
}

// ============ SUBDOMAIN MANAGEMENT ============

const BASE_DOMAIN = "tradevista.co.uk";

/**
 * Create a subdomain on tradevista.co.uk
 * e.g., mybeverleyplumber.tradevista.co.uk
 */
export async function createSubdomain(
  subdomain: string,
  targetIp?: string
): Promise<{
  success: boolean;
  subdomain: string;
  fullDomain: string;
  message: string;
}> {
  try {
    // Get the target IP - either provided, from settings, or from tradevista droplet
    let ip = targetIp;
    if (!ip) {
      // First try to get from settings
      ip = await getSetting("tradevista_droplet_ip") || undefined;
    }
    if (!ip) {
      // Fallback: find tradevista droplet
      const droplets = await listDroplets();
      const tradevistDroplet = droplets.find(d => d.tags?.includes("tradevista") || d.name.includes("tradevista"));
      if (tradevistDroplet) {
        ip = tradevistDroplet.networks.v4.find(n => n.type === "public")?.ip_address;
      }
    }

    if (!ip) {
      throw new Error("No target IP configured. Set tradevista_droplet_ip in settings.");
    }

    // Create A record for the subdomain
    await createDomainRecord(BASE_DOMAIN, {
      type: "A",
      name: subdomain,
      data: ip,
      ttl: 300, // 5 minutes for testing
    });

    return {
      success: true,
      subdomain,
      fullDomain: `${subdomain}.${BASE_DOMAIN}`,
      message: `Subdomain ${subdomain}.${BASE_DOMAIN} created pointing to ${ip}`,
    };
  } catch (error) {
    return {
      success: false,
      subdomain,
      fullDomain: `${subdomain}.${BASE_DOMAIN}`,
      message: error instanceof Error ? error.message : "Failed to create subdomain",
    };
  }
}

/**
 * Delete a subdomain from tradevista.co.uk
 */
export async function deleteSubdomain(subdomain: string): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const records = await getDomainRecords(BASE_DOMAIN);
    const record = records.find(r => r.name === subdomain && r.type === "A");

    if (record) {
      await deleteDomainRecord(BASE_DOMAIN, record.id);
      return {
        success: true,
        message: `Subdomain ${subdomain}.${BASE_DOMAIN} deleted`,
      };
    }

    return {
      success: false,
      message: `Subdomain ${subdomain} not found`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to delete subdomain",
    };
  }
}

/**
 * List all subdomains on tradevista.co.uk
 */
export async function listSubdomains(): Promise<Array<{
  name: string;
  fullDomain: string;
  ip: string;
  ttl: number;
}>> {
  try {
    const records = await getDomainRecords(BASE_DOMAIN);
    return records
      .filter(r => r.type === "A" && r.name !== "@")
      .map(r => ({
        name: r.name,
        fullDomain: `${r.name}.${BASE_DOMAIN}`,
        ip: r.data,
        ttl: r.ttl,
      }));
  } catch {
    return [];
  }
}

/**
 * Ensure tradevista.co.uk is set up in Digital Ocean DNS
 */
export async function ensureBaseDomain(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const domains = await listDomains();
    const exists = domains.some(d => d.name === BASE_DOMAIN);

    if (!exists) {
      await createDomain(BASE_DOMAIN);
      return {
        success: true,
        message: `Domain ${BASE_DOMAIN} added to Digital Ocean DNS`,
      };
    }

    return {
      success: true,
      message: `Domain ${BASE_DOMAIN} already exists in Digital Ocean DNS`,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to setup base domain",
    };
  }
}
