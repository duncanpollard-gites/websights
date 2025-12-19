import { getSetting } from "./admin";
import { XMLParser } from "fast-xml-parser";

// Namecheap API endpoints
const API_PRODUCTION = "https://api.namecheap.com/xml.response";
const API_SANDBOX = "https://api.sandbox.namecheap.com/xml.response";

// ============ TYPES ============

export interface NamecheapConfig {
  apiUser: string;
  apiKey: string;
  username: string;
  clientIp: string;
  useSandbox: boolean;
}

export interface DomainCheckResult {
  domain: string;
  available: boolean;
  isPremium: boolean;
  premiumRegistrationPrice?: number;
  premiumRenewalPrice?: number;
  icannFee?: number;
  errorNo?: number;
  description?: string;
}

export interface DomainPricing {
  tld: string;
  registerPrice: number;
  renewPrice: number;
  transferPrice: number;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string; // 2-letter code
  phone: string; // Format: +44.1onal234567
  emailAddress: string;
  organizationName?: string;
}

export interface DomainRegistrationResult {
  domain: string;
  registered: boolean;
  chargedAmount: number;
  domainId: number;
  orderId: number;
  transactionId: number;
  whoisGuardEnabled: boolean;
  expireDate?: string;
}

export interface RegisteredDomain {
  id: number;
  name: string;
  user: string;
  created: string;
  expires: string;
  isExpired: boolean;
  isLocked: boolean;
  autoRenew: boolean;
  whoisGuard: string;
  isPremium: boolean;
  isOurDNS: boolean;
}

// ============ API HELPER ============

async function getConfig(): Promise<NamecheapConfig> {
  const [apiUser, apiKey, username, clientIp, useSandbox] = await Promise.all([
    getSetting("namecheap_api_user"),
    getSetting("namecheap_api_key"),
    getSetting("namecheap_username"),
    getSetting("namecheap_client_ip"),
    getSetting("namecheap_sandbox"),
  ]);


  if (!apiUser || !apiKey || !username) {
    throw new Error("Namecheap API credentials not configured");
  }

  return {
    apiUser,
    apiKey,
    username,
    clientIp: clientIp || "127.0.0.1",
    useSandbox: useSandbox === "true",
  };
}

async function namecheapRequest<T>(
  command: string,
  params: Record<string, string> = {}
): Promise<T> {
  const config = await getConfig();
  const baseUrl = config.useSandbox ? API_SANDBOX : API_PRODUCTION;

  // Build query parameters
  const queryParams = new URLSearchParams({
    ApiUser: config.apiUser,
    ApiKey: config.apiKey,
    UserName: config.username,
    ClientIp: config.clientIp,
    Command: command,
    ...params,
  });

  const url = `${baseUrl}?${queryParams.toString()}`;


  const response = await fetch(url);
  const xmlText = await response.text();


  // Parse XML response
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
  });
  const result = parser.parse(xmlText);

  // Check for API errors
  const apiResponse = result.ApiResponse;
  if (!apiResponse) {
    throw new Error("Invalid Namecheap API response");
  }

  if (apiResponse["@_Status"] === "ERROR") {
    const errors = apiResponse.Errors?.Error;
    const errorMsg = Array.isArray(errors)
      ? errors.map((e: { "#text": string }) => e["#text"]).join(", ")
      : errors?.["#text"] || "Unknown Namecheap API error";
    throw new Error(errorMsg);
  }

  return apiResponse.CommandResponse as T;
}

// ============ DOMAIN AVAILABILITY ============

// Raw XML response interface (before transformation)
interface RawDomainCheckResult {
  "@_Domain"?: string;
  "@_Available"?: string;
  "@_IsPremiumName"?: string;
  "@_PremiumRegistrationPrice"?: string;
  "@_PremiumRenewalPrice"?: string;
  "@_IcannFee"?: string;
  "@_ErrorNo"?: string;
  "@_Description"?: string;
}

export async function checkDomainAvailability(
  domains: string | string[]
): Promise<DomainCheckResult[]> {
  const domainList = Array.isArray(domains) ? domains.join(",") : domains;

  const response = await namecheapRequest<{
    DomainCheckResult: RawDomainCheckResult | RawDomainCheckResult[];
  }>("namecheap.domains.check", {
    DomainList: domainList,
  });

  const results = Array.isArray(response.DomainCheckResult)
    ? response.DomainCheckResult
    : [response.DomainCheckResult];

  return results.map((r) => ({
    domain: r["@_Domain"] || "",
    available: r["@_Available"] === "true",
    isPremium: r["@_IsPremiumName"] === "true",
    premiumRegistrationPrice: r["@_PremiumRegistrationPrice"]
      ? parseFloat(r["@_PremiumRegistrationPrice"])
      : undefined,
    premiumRenewalPrice: r["@_PremiumRenewalPrice"]
      ? parseFloat(r["@_PremiumRenewalPrice"])
      : undefined,
    icannFee: r["@_IcannFee"]
      ? parseFloat(r["@_IcannFee"])
      : undefined,
    errorNo: r["@_ErrorNo"] ? parseInt(r["@_ErrorNo"], 10) : undefined,
    description: r["@_Description"],
  }));
}

// ============ DOMAIN REGISTRATION ============

export async function registerDomain(
  domainName: string,
  years: number = 1,
  contact: ContactInfo,
  nameservers?: string[],
  addWhoisGuard: boolean = true
): Promise<DomainRegistrationResult> {
  // Format phone number for Namecheap (e.g., +44.7123456789)
  const formatPhone = (phone: string): string => {
    // Remove all non-digits except +
    const cleaned = phone.replace(/[^\d+]/g, "");
    // If starts with +, format as +XX.XXXXXXXXXX
    if (cleaned.startsWith("+")) {
      const countryCode = cleaned.slice(1, 3);
      const number = cleaned.slice(3);
      return `+${countryCode}.${number}`;
    }
    // If starts with 0, assume UK and format
    if (cleaned.startsWith("0")) {
      return `+44.${cleaned.slice(1)}`;
    }
    return cleaned;
  };

  const params: Record<string, string> = {
    DomainName: domainName,
    Years: years.toString(),
    // Registrant contact
    RegistrantFirstName: contact.firstName,
    RegistrantLastName: contact.lastName,
    RegistrantAddress1: contact.address1,
    RegistrantCity: contact.city,
    RegistrantStateProvince: contact.stateProvince,
    RegistrantPostalCode: contact.postalCode,
    RegistrantCountry: contact.country,
    RegistrantPhone: formatPhone(contact.phone),
    RegistrantEmailAddress: contact.emailAddress,
    // Tech contact (same as registrant)
    TechFirstName: contact.firstName,
    TechLastName: contact.lastName,
    TechAddress1: contact.address1,
    TechCity: contact.city,
    TechStateProvince: contact.stateProvince,
    TechPostalCode: contact.postalCode,
    TechCountry: contact.country,
    TechPhone: formatPhone(contact.phone),
    TechEmailAddress: contact.emailAddress,
    // Admin contact (same as registrant)
    AdminFirstName: contact.firstName,
    AdminLastName: contact.lastName,
    AdminAddress1: contact.address1,
    AdminCity: contact.city,
    AdminStateProvince: contact.stateProvince,
    AdminPostalCode: contact.postalCode,
    AdminCountry: contact.country,
    AdminPhone: formatPhone(contact.phone),
    AdminEmailAddress: contact.emailAddress,
    // Billing contact (same as registrant)
    AuxBillingFirstName: contact.firstName,
    AuxBillingLastName: contact.lastName,
    AuxBillingAddress1: contact.address1,
    AuxBillingCity: contact.city,
    AuxBillingStateProvince: contact.stateProvince,
    AuxBillingPostalCode: contact.postalCode,
    AuxBillingCountry: contact.country,
    AuxBillingPhone: formatPhone(contact.phone),
    AuxBillingEmailAddress: contact.emailAddress,
  };

  // Add optional fields
  if (contact.address2) {
    params.RegistrantAddress2 = contact.address2;
    params.TechAddress2 = contact.address2;
    params.AdminAddress2 = contact.address2;
    params.AuxBillingAddress2 = contact.address2;
  }

  if (contact.organizationName) {
    params.RegistrantOrganizationName = contact.organizationName;
    params.TechOrganizationName = contact.organizationName;
    params.AdminOrganizationName = contact.organizationName;
    params.AuxBillingOrganizationName = contact.organizationName;
  }

  // Custom nameservers
  if (nameservers && nameservers.length > 0) {
    params.Nameservers = nameservers.join(",");
  }

  // WhoisGuard (privacy protection)
  if (addWhoisGuard) {
    params.AddFreeWhoisguard = "yes";
    params.WGEnabled = "yes";
  }

  const response = await namecheapRequest<{
    DomainCreateResult: Record<string, unknown>;
  }>("namecheap.domains.create", params);

  const result = response.DomainCreateResult;

  return {
    domain: result["@_Domain"] as string,
    registered: result["@_Registered"] === "true",
    chargedAmount: parseFloat(result["@_ChargedAmount"] as string),
    domainId: parseInt(result["@_DomainID"] as string, 10),
    orderId: parseInt(result["@_OrderID"] as string, 10),
    transactionId: parseInt(result["@_TransactionID"] as string, 10),
    whoisGuardEnabled: result["@_WhoisguardEnable"] === "true",
    expireDate: result["@_NonRealTimeDomain"]
      ? undefined
      : (result["@_ExpireDate"] as string),
  };
}

// ============ DOMAIN LISTING ============

export async function listDomains(
  page: number = 1,
  pageSize: number = 100
): Promise<{ domains: RegisteredDomain[]; totalItems: number }> {
  const response = await namecheapRequest<{
    DomainGetListResult: {
      Domain?: Record<string, unknown> | Record<string, unknown>[];
    };
    Paging: {
      TotalItems: string;
      CurrentPage: string;
      PageSize: string;
    };
  }>("namecheap.domains.getList", {
    Page: page.toString(),
    PageSize: pageSize.toString(),
  });

  const domainData = response.DomainGetListResult?.Domain;
  const domains: RegisteredDomain[] = [];

  if (domainData) {
    const domainArray = Array.isArray(domainData) ? domainData : [domainData];

    for (const d of domainArray) {
      domains.push({
        id: parseInt(d["@_ID"] as string, 10),
        name: d["@_Name"] as string,
        user: d["@_User"] as string,
        created: d["@_Created"] as string,
        expires: d["@_Expires"] as string,
        isExpired: d["@_IsExpired"] === "true",
        isLocked: d["@_IsLocked"] === "true",
        autoRenew: d["@_AutoRenew"] === "true",
        whoisGuard: d["@_WhoisGuard"] as string,
        isPremium: d["@_IsPremium"] === "true",
        isOurDNS: d["@_IsOurDNS"] === "true",
      });
    }
  }

  return {
    domains,
    totalItems: parseInt(response.Paging?.TotalItems || "0", 10),
  };
}

// ============ DOMAIN INFO ============

export async function getDomainInfo(domainName: string): Promise<{
  domainId: number;
  domainName: string;
  owner: string;
  status: string;
  createdDate: string;
  expiredDate: string;
  isLocked: boolean;
  autoRenew: boolean;
  whoisGuard: {
    enabled: boolean;
    id?: number;
    expireDate?: string;
  };
  dnsProvider: string;
  nameservers: string[];
}> {
  const response = await namecheapRequest<{
    DomainGetInfoResult: Record<string, unknown>;
  }>("namecheap.domains.getInfo", {
    DomainName: domainName,
  });

  const info = response.DomainGetInfoResult;
  const dnsDetails = info.DnsDetails as Record<string, unknown>;
  const whoisguard = info.Whoisguard as Record<string, unknown>;
  const modificationRights = info.Modificationrights as Record<string, unknown>;

  // Get nameservers
  const nsArray: string[] = [];
  if (dnsDetails?.Nameserver) {
    const ns = dnsDetails.Nameserver;
    if (Array.isArray(ns)) {
      nsArray.push(...ns);
    } else {
      nsArray.push(ns as string);
    }
  }

  return {
    domainId: parseInt(info["@_ID"] as string, 10),
    domainName: info["@_DomainName"] as string,
    owner: info["@_OwnerName"] as string,
    status: info["@_Status"] as string,
    createdDate: (info.DomainDetails as Record<string, unknown>)?.CreatedDate as string,
    expiredDate: (info.DomainDetails as Record<string, unknown>)?.ExpiredDate as string,
    isLocked: modificationRights?.["@_All"] === "false",
    autoRenew: (info.DomainDetails as Record<string, unknown>)?.AutoRenew === "True",
    whoisGuard: {
      enabled: whoisguard?.["@_Enabled"] === "True",
      id: whoisguard?.ID ? parseInt(whoisguard.ID as string, 10) : undefined,
      expireDate: whoisguard?.ExpiredDate as string | undefined,
    },
    dnsProvider: dnsDetails?.["@_ProviderType"] as string,
    nameservers: nsArray,
  };
}

// ============ DNS MANAGEMENT ============

export async function setNameservers(
  domainName: string,
  nameservers: string[]
): Promise<boolean> {
  // Split domain into SLD and TLD
  const parts = domainName.split(".");
  const sld = parts[0];
  const tld = parts.slice(1).join(".");

  await namecheapRequest("namecheap.domains.dns.setCustom", {
    SLD: sld,
    TLD: tld,
    Nameservers: nameservers.join(","),
  });

  return true;
}

export async function setDefaultNameservers(domainName: string): Promise<boolean> {
  const parts = domainName.split(".");
  const sld = parts[0];
  const tld = parts.slice(1).join(".");

  await namecheapRequest("namecheap.domains.dns.setDefault", {
    SLD: sld,
    TLD: tld,
  });

  return true;
}

// ============ PRICING ============

export async function getTldPricing(tld: string = "co.uk"): Promise<DomainPricing | null> {
  try {
    const response = await namecheapRequest<{
      UserGetPricingResult: {
        ProductType: {
          ProductCategory: {
            Product: Record<string, unknown> | Record<string, unknown>[];
          };
        };
      };
    }>("namecheap.users.getPricing", {
      ProductType: "DOMAIN",
      ProductCategory: "REGISTER",
      ActionName: "REGISTER",
    });

    // This is simplified - the actual response is complex
    // For now, return null and we'll show pricing from availability check
    return null;
  } catch {
    return null;
  }
}

// ============ CONNECTION TEST ============

export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  accountBalance?: number;
}> {
  try {
    const config = await getConfig();

    const response = await namecheapRequest<{
      UserGetBalancesResult: {
        "@_Currency": string;
        "@_AvailableBalance": string;
        "@_AccountBalance": string;
      };
    }>("namecheap.users.getBalances");

    return {
      success: true,
      message: `Connected to Namecheap${config.useSandbox ? " (Sandbox)" : ""}`,
      accountBalance: parseFloat(response.UserGetBalancesResult["@_AvailableBalance"]),
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

// ============ HELPER FUNCTIONS ============

export function suggestDomains(businessName: string): string[] {
  // Clean business name for domain use
  const cleaned = businessName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  const suggestions: string[] = [];
  const tlds = [".co.uk", ".uk", ".com"];

  for (const tld of tlds) {
    suggestions.push(`${cleaned}${tld}`);
  }

  // Add variations
  if (!cleaned.includes("-")) {
    for (const tld of tlds) {
      suggestions.push(`${cleaned}-uk${tld}`);
    }
  }

  return suggestions.slice(0, 6);
}
