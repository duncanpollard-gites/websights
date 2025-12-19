"use client";

import { useState, useEffect } from "react";
import {
  Globe,
  Server,
  Loader2,
  RefreshCw,
  AlertCircle,
  Check,
  X,
  Copy,
  ShoppingCart,
  Search,
} from "lucide-react";

// Namecheap types
interface NamecheapDomain {
  id: number;
  name: string;
  created: string;
  expires: string;
  isExpired: boolean;
  autoRenew: boolean;
}

interface DomainCheckResult {
  domain: string;
  available: boolean;
  isPremium: boolean;
  premiumRegistrationPrice?: number;
}

interface Droplet {
  id: number;
  name: string;
  status: string;
  ip: string | undefined;
  region: string;
  size: string;
  priceMonthly: number;
}

export default function AdminDomainsPage() {
  // Provider selection
  const [activeTab, setActiveTab] = useState<"namecheap" | "digitalocean">("namecheap");

  // Namecheap state
  const [ncConnected, setNcConnected] = useState(false);
  const [ncDomains, setNcDomains] = useState<NamecheapDomain[]>([]);
  const [ncBalance, setNcBalance] = useState<number | null>(null);

  // Domain search
  const [searchDomain, setSearchDomain] = useState("");
  const [searchResults, setSearchResults] = useState<DomainCheckResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  // Registration form
  const [showRegisterForm, setShowRegisterForm] = useState<string | null>(null);
  const [contactInfo, setContactInfo] = useState({
    firstName: "",
    lastName: "",
    organizationName: "",
    address1: "",
    city: "",
    stateProvince: "",
    postalCode: "",
    country: "GB",
    phone: "",
    emailAddress: "",
  });

  // Digital Ocean state
  const [doConnected, setDoConnected] = useState(false);
  const [doEmail, setDoEmail] = useState<string | null>(null);
  const [droplets, setDroplets] = useState<Droplet[]>([]);

  // Common state
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Namecheap and Digital Ocean data
      const [ncResponse, doResponse] = await Promise.all([
        fetch("/api/admin/namecheap/domains?action=test").catch(() => null),
        fetch("/api/admin/domains").catch(() => null),
      ]);

      // Namecheap
      if (ncResponse && ncResponse.ok) {
        const ncData = await ncResponse.json();
        setNcConnected(ncData.success || false);
        setNcBalance(ncData.accountBalance || null);

        // Fetch domain list if connected
        if (ncData.success) {
          const domainsResponse = await fetch("/api/admin/namecheap/domains");
          if (domainsResponse.ok) {
            const domainsData = await domainsResponse.json();
            setNcDomains(domainsData.domains || []);
          }
        }
      }

      // Digital Ocean
      if (doResponse) {
        const doData = await doResponse.json();
        setDoConnected(doData.connected || false);
        setDoEmail(doData.email || null);
        setDroplets(doData.droplets || []);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
      setMessage({ type: "error", text: "Failed to load domain data" });
    } finally {
      setLoading(false);
    }
  };

  // Check domain availability
  const checkDomainAvailability = async () => {
    if (!searchDomain.trim()) return;

    setSearchLoading(true);
    setSearchResults([]);
    setMessage(null);

    try {
      // Clean domain and add TLDs if needed
      let domains = searchDomain.toLowerCase().trim();
      if (!domains.includes(".")) {
        // Add common TLDs
        domains = [`${domains}.co.uk`, `${domains}.uk`, `${domains}.com`].join(",");
      }

      const response = await fetch("/api/admin/namecheap/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "check", domains }),
      });

      const data = await response.json();

      if (data.error) {
        setMessage({ type: "error", text: data.error });
      } else {
        setSearchResults(data.results || []);
      }
    } catch {
      setMessage({ type: "error", text: "Failed to check domain availability" });
    } finally {
      setSearchLoading(false);
    }
  };

  // Register domain
  const handleRegisterDomain = async (domain: string) => {
    setActionLoading(`register-${domain}`);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/namecheap/domains", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "register",
          domain,
          years: 1,
          contact: contactInfo,
          whoisGuard: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        setShowRegisterForm(null);
        setSearchResults([]);
        setSearchDomain("");
        fetchData();
      } else {
        setMessage({ type: "error", text: data.error || "Registration failed" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setActionLoading(null);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setMessage({ type: "success", text: "Copied to clipboard" });
    setTimeout(() => setMessage(null), 2000);
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Domains & Hosting</h1>
          <p className="text-gray-400">Register domains with Namecheap and manage hosting</p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-900/50 border border-green-700 text-green-300"
              : "bg-red-900/50 border border-red-700 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Provider Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab("namecheap")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "namecheap"
              ? "bg-red-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <ShoppingCart className="w-5 h-5" />
          Namecheap
          {ncConnected && <Check className="w-4 h-4 text-green-300" />}
        </button>
        <button
          onClick={() => setActiveTab("digitalocean")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
            activeTab === "digitalocean"
              ? "bg-blue-600 text-white"
              : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          <Server className="w-5 h-5" />
          Digital Ocean
          {doConnected && <Check className="w-4 h-4 text-green-300" />}
        </button>
      </div>

      {/* Namecheap Tab */}
      {activeTab === "namecheap" && (
        <>
          {!ncConnected ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Namecheap Not Connected
              </h2>
              <p className="text-gray-400 mb-4">
                Add your Namecheap API credentials in Settings to register and manage domains.
              </p>
              <a
                href="/admin/settings"
                className="inline-flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Go to Settings
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Account Balance */}
              {ncBalance !== null && (
                <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                  <Check className="w-4 h-4" />
                  Connected to Namecheap (Balance: ${ncBalance.toFixed(2)})
                </div>
              )}

              {/* Domain Search & Registration */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <ShoppingCart className="w-5 h-5 text-green-400" />
                  <h2 className="text-lg font-semibold text-white">Register New Domain</h2>
                </div>

                <div className="flex gap-2 mb-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      value={searchDomain}
                      onChange={(e) => setSearchDomain(e.target.value.toLowerCase())}
                      onKeyDown={(e) => e.key === "Enter" && checkDomainAvailability()}
                      placeholder="Search for a domain (e.g., mybusiness or mybusiness.co.uk)"
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-red-500 outline-none"
                    />
                  </div>
                  <button
                    onClick={checkDomainAvailability}
                    disabled={!searchDomain || searchLoading}
                    className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
                  >
                    {searchLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="w-5 h-5" />
                    )}
                    Check
                  </button>
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="space-y-2">
                    {searchResults.map((result) => (
                      <div
                        key={result.domain}
                        className={`p-4 rounded-lg ${
                          result.available
                            ? "bg-green-900/30 border border-green-700"
                            : "bg-gray-700"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {result.available ? (
                              <Check className="w-5 h-5 text-green-400" />
                            ) : (
                              <X className="w-5 h-5 text-red-400" />
                            )}
                            <div>
                              <p className="font-medium text-white">{result.domain}</p>
                              <p className={`text-sm ${result.available ? "text-green-400" : "text-red-400"}`}>
                                {result.available ? "Available" : "Not available"}
                                {result.isPremium && " (Premium)"}
                              </p>
                            </div>
                          </div>
                          {result.available && (
                            <button
                              onClick={() => setShowRegisterForm(result.domain)}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                            >
                              <ShoppingCart className="w-4 h-4" />
                              Register
                              {result.premiumRegistrationPrice ? (
                                <span className="text-sm opacity-80">
                                  (${result.premiumRegistrationPrice})
                                </span>
                              ) : null}
                            </button>
                          )}
                        </div>

                        {/* Registration Form */}
                        {showRegisterForm === result.domain && (
                          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                            <h3 className="font-medium text-white mb-4">Contact Information (WHOIS)</h3>
                            <div className="grid grid-cols-2 gap-4">
                              <input
                                type="text"
                                placeholder="First Name *"
                                value={contactInfo.firstName}
                                onChange={(e) => setContactInfo({ ...contactInfo, firstName: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400"
                              />
                              <input
                                type="text"
                                placeholder="Last Name *"
                                value={contactInfo.lastName}
                                onChange={(e) => setContactInfo({ ...contactInfo, lastName: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400"
                              />
                              <input
                                type="text"
                                placeholder="Organisation (optional)"
                                value={contactInfo.organizationName}
                                onChange={(e) => setContactInfo({ ...contactInfo, organizationName: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 col-span-2"
                              />
                              <input
                                type="text"
                                placeholder="Address *"
                                value={contactInfo.address1}
                                onChange={(e) => setContactInfo({ ...contactInfo, address1: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400 col-span-2"
                              />
                              <input
                                type="text"
                                placeholder="City *"
                                value={contactInfo.city}
                                onChange={(e) => setContactInfo({ ...contactInfo, city: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400"
                              />
                              <input
                                type="text"
                                placeholder="County/State *"
                                value={contactInfo.stateProvince}
                                onChange={(e) => setContactInfo({ ...contactInfo, stateProvince: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400"
                              />
                              <input
                                type="text"
                                placeholder="Postcode *"
                                value={contactInfo.postalCode}
                                onChange={(e) => setContactInfo({ ...contactInfo, postalCode: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400"
                              />
                              <select
                                value={contactInfo.country}
                                onChange={(e) => setContactInfo({ ...contactInfo, country: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white"
                              >
                                <option value="GB">United Kingdom</option>
                                <option value="US">United States</option>
                                <option value="DE">Germany</option>
                                <option value="FR">France</option>
                                <option value="IE">Ireland</option>
                                <option value="AU">Australia</option>
                                <option value="CA">Canada</option>
                              </select>
                              <input
                                type="tel"
                                placeholder="Phone * (e.g., 07123456789)"
                                value={contactInfo.phone}
                                onChange={(e) => setContactInfo({ ...contactInfo, phone: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400"
                              />
                              <input
                                type="email"
                                placeholder="Email *"
                                value={contactInfo.emailAddress}
                                onChange={(e) => setContactInfo({ ...contactInfo, emailAddress: e.target.value })}
                                className="px-3 py-2 bg-gray-600 border border-gray-500 rounded text-white placeholder-gray-400"
                              />
                            </div>
                            <div className="flex items-center gap-2 mt-4 text-sm text-gray-400">
                              <Check className="w-4 h-4 text-green-400" />
                              Free WhoisGuard privacy protection included
                            </div>
                            <div className="flex gap-2 mt-4">
                              <button
                                onClick={() => handleRegisterDomain(result.domain)}
                                disabled={
                                  actionLoading === `register-${result.domain}` ||
                                  !contactInfo.firstName ||
                                  !contactInfo.lastName ||
                                  !contactInfo.address1 ||
                                  !contactInfo.city ||
                                  !contactInfo.postalCode ||
                                  !contactInfo.phone ||
                                  !contactInfo.emailAddress
                                }
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                              >
                                {actionLoading === `register-${result.domain}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Check className="w-4 h-4" />
                                )}
                                Complete Registration
                              </button>
                              <button
                                onClick={() => setShowRegisterForm(null)}
                                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-500"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Registered Domains */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Globe className="w-5 h-5 text-red-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Your Domains ({ncDomains.length})
                  </h2>
                </div>

                {ncDomains.length === 0 ? (
                  <p className="text-gray-500">No domains registered yet. Search above to register your first domain.</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {ncDomains.map((domain) => (
                      <div key={domain.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white">{domain.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            domain.isExpired
                              ? "bg-red-900/50 text-red-400"
                              : "bg-green-900/50 text-green-400"
                          }`}>
                            {domain.isExpired ? "Expired" : "Active"}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>Expires: {new Date(domain.expires).toLocaleDateString()}</p>
                          <p>Auto-renew: {domain.autoRenew ? "Yes" : "No"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Digital Ocean Tab */}
      {activeTab === "digitalocean" && (
        <>
          {!doConnected ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center">
              <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Digital Ocean Not Connected
              </h2>
              <p className="text-gray-400 mb-4">
                Add your Digital Ocean API token in Settings to manage servers.
              </p>
              <a
                href="/admin/settings"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Go to Settings
              </a>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Connection Status */}
              <div className="flex items-center gap-2 text-green-400 text-sm mb-4">
                <Check className="w-4 h-4" />
                Connected as {doEmail}
              </div>

              {/* Droplets */}
              <div className="bg-gray-800 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Server className="w-5 h-5 text-blue-400" />
                  <h2 className="text-lg font-semibold text-white">
                    Droplets ({droplets.length})
                  </h2>
                </div>

                {droplets.length === 0 ? (
                  <p className="text-gray-500">No droplets configured</p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {droplets.map((droplet) => (
                      <div key={droplet.id} className="bg-gray-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-white">{droplet.name}</h3>
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            droplet.status === "active"
                              ? "bg-green-900/50 text-green-400"
                              : "bg-yellow-900/50 text-yellow-400"
                          }`}>
                            {droplet.status}
                          </span>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          {droplet.ip && (
                            <p className="flex items-center gap-2">
                              IP: {droplet.ip}
                              <button
                                onClick={() => copyToClipboard(droplet.ip!)}
                                className="text-gray-500 hover:text-white"
                              >
                                <Copy className="w-3 h-3" />
                              </button>
                            </p>
                          )}
                          <p>Region: {droplet.region}</p>
                          <p>Size: {droplet.size}</p>
                          <p>${droplet.priceMonthly}/mo</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
