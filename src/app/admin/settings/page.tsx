"use client";

import { useState, useEffect } from "react";
import {
  Key,
  Save,
  Loader2,
  Check,
  X,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

interface Setting {
  id: number;
  setting_key: string;
  setting_value: string | null;
  is_encrypted: boolean;
  description: string | null;
  has_value: boolean;
}

interface TestResult {
  success: boolean;
  message: string;
}

const settingGroups = [
  {
    title: "AI Generation",
    description: "Claude API for site generation",
    keys: ["anthropic_api_key"],
    docsUrl: "https://console.anthropic.com/",
  },
  {
    title: "Payments",
    description: "Stripe for subscriptions",
    keys: ["stripe_secret_key", "stripe_publishable_key", "stripe_webhook_secret", "stripe_price_id"],
    docsUrl: "https://dashboard.stripe.com/apikeys",
  },
  {
    title: "Namecheap",
    description: "Domain registration and management",
    keys: ["namecheap_api_user", "namecheap_api_key", "namecheap_username", "namecheap_client_ip", "namecheap_sandbox"],
    docsUrl: "https://www.namecheap.com/support/api/intro/",
  },
  {
    title: "Digital Ocean",
    description: "Hosting and server management",
    keys: ["digitalocean_api_token"],
    docsUrl: "https://cloud.digitalocean.com/account/api/tokens",
  },
  {
    title: "Printful",
    description: "T-shirts, mugs and mockups",
    keys: ["printful_api_key", "printful_store_id"],
    docsUrl: "https://www.printful.com/dashboard/developer/api-keys",
  },
  {
    title: "Print Products",
    description: "Gelato and Prodigi for merchandise",
    keys: ["gelato_api_key", "prodigi_api_key"],
    docsUrl: "https://dashboard.gelato.com/",
  },
];

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Record<string, string>>({});
  const [testing, setTesting] = useState(false);
  const [testResults, setTestResults] = useState<Record<string, TestResult>>({});
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch("/api/admin/settings");
      const data = await response.json();
      setSettings(data.settings || []);
    } catch (error) {
      console.error("Failed to fetch settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSetting = async (key: string) => {
    setSaving(key);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: editValues[key] }),
      });

      if (response.ok) {
        setMessage({ type: "success", text: `${key} saved successfully` });
        setEditValues((prev) => ({ ...prev, [key]: "" }));
        fetchSettings();
      } else {
        setMessage({ type: "error", text: "Failed to save setting" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setSaving(null);
    }
  };

  const testConnections = async () => {
    setTesting(true);
    setTestResults({});

    try {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await response.json();
      setTestResults(data.results || {});
    } catch {
      setMessage({ type: "error", text: "Test failed" });
    } finally {
      setTesting(false);
    }
  };

  const getSetting = (key: string): Setting | undefined => {
    return settings.find((s) => s.setting_key === key);
  };

  const formatKeyName = (key: string): string => {
    return key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
      .replace("Api", "API")
      .replace("Id", "ID");
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
          <h1 className="text-2xl font-bold text-white">API Settings</h1>
          <p className="text-gray-400">Configure your third-party integrations</p>
        </div>
        <button
          onClick={testConnections}
          disabled={testing}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${testing ? "animate-spin" : ""}`} />
          Test Connections
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

      <div className="space-y-6">
        {settingGroups.map((group) => (
          <div key={group.title} className="bg-gray-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{group.title}</h2>
                <p className="text-gray-400 text-sm">{group.description}</p>
              </div>
              <a
                href={group.docsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-blue-400 hover:text-blue-300 text-sm"
              >
                Get Keys
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-4">
              {group.keys.map((key) => {
                const setting = getSetting(key);
                const testResult = testResults[key.split("_")[0]];

                return (
                  <div key={key} className="flex items-center gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-300 mb-1">
                        {formatKeyName(key)}
                      </label>
                      <div className="flex gap-2">
                        <div className="flex-1 relative">
                          <Key className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                          <input
                            type="password"
                            value={editValues[key] || ""}
                            onChange={(e) =>
                              setEditValues((prev) => ({
                                ...prev,
                                [key]: e.target.value,
                              }))
                            }
                            placeholder={
                              setting?.has_value
                                ? "••••••••(saved - enter new value to update)"
                                : "Enter API key..."
                            }
                            className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                          />
                        </div>
                        <button
                          onClick={() => saveSetting(key)}
                          disabled={saving === key || !editValues[key]}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {saving === key ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Save className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>
                    {/* Status indicator */}
                    <div className="flex items-center gap-2">
                      {setting?.has_value ? (
                        <span className="flex items-center gap-1 text-green-400 text-sm">
                          <Check className="w-4 h-4" />
                          Set
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500 text-sm">
                          <X className="w-4 h-4" />
                          Not set
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Test result for this group */}
            {Object.keys(testResults).some((k) =>
              group.keys.some((gk) => gk.toLowerCase().includes(k))
            ) && (
              <div className="mt-4 pt-4 border-t border-gray-700">
                <p className="text-sm text-gray-400 mb-2">Connection Test:</p>
                {Object.entries(testResults)
                  .filter(([k]) => group.keys.some((gk) => gk.toLowerCase().includes(k)))
                  .map(([service, result]) => (
                    <div
                      key={service}
                      className={`flex items-center gap-2 text-sm ${
                        result.success ? "text-green-400" : "text-red-400"
                      }`}
                    >
                      {result.success ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <X className="w-4 h-4" />
                      )}
                      <span className="capitalize">{service}:</span> {result.message}
                    </div>
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
