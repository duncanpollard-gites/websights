import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, getAllSettings, setSetting, getDecryptedSettings } from "@/lib/admin";

// Get all settings
export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const settings = await getAllSettings();

    // Mask encrypted values for display
    const maskedSettings = settings.map((s) => ({
      ...s,
      setting_value: s.is_encrypted && s.setting_value
        ? "••••••••" + (s.setting_value.length > 20 ? s.setting_value.slice(-4) : "")
        : s.setting_value,
      has_value: !!s.setting_value,
    }));

    return NextResponse.json({ settings: maskedSettings });
  } catch (error) {
    console.error("Get settings error:", error);
    return NextResponse.json({ error: "Failed to get settings" }, { status: 500 });
  }
}

// Update a setting
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { key, value } = await request.json();
    if (!key) {
      return NextResponse.json({ error: "Key is required" }, { status: 400 });
    }

    // Determine if this setting should be encrypted (API keys, secrets)
    const sensitiveKeys = [
      "anthropic_api_key",
      "stripe_secret_key",
      "stripe_webhook_secret",
      "digitalocean_api_token",
      "gelato_api_key",
      "prodigi_api_key",
      "printful_api_key",
      "namecheap_api_key",
    ];
    const shouldEncrypt = sensitiveKeys.includes(key);

    await setSetting(key, value || "", shouldEncrypt);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Update setting error:", error);
    return NextResponse.json({ error: "Failed to update setting" }, { status: 500 });
  }
}

// Test API connections
export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { service } = await request.json();
    const settings = await getDecryptedSettings();
    const results: Record<string, { success: boolean; message: string }> = {};

    // Test each service
    if (!service || service === "anthropic") {
      const key = settings.anthropic_api_key;
      if (key) {
        try {
          const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
              "x-api-key": key,
              "anthropic-version": "2023-06-01",
              "content-type": "application/json",
            },
            body: JSON.stringify({
              model: "claude-sonnet-4-20250514",
              max_tokens: 10,
              messages: [{ role: "user", content: "Hi" }],
            }),
          });
          results.anthropic = {
            success: response.ok,
            message: response.ok ? "Connected" : `Error: ${response.status}`,
          };
        } catch (e) {
          results.anthropic = { success: false, message: "Connection failed" };
        }
      } else {
        results.anthropic = { success: false, message: "No API key set" };
      }
    }

    if (!service || service === "stripe") {
      const key = settings.stripe_secret_key;
      if (key) {
        try {
          const response = await fetch("https://api.stripe.com/v1/balance", {
            headers: { Authorization: `Bearer ${key}` },
          });
          results.stripe = {
            success: response.ok,
            message: response.ok ? "Connected" : `Error: ${response.status}`,
          };
        } catch {
          results.stripe = { success: false, message: "Connection failed" };
        }
      } else {
        results.stripe = { success: false, message: "No API key set" };
      }
    }

    if (!service || service === "digitalocean") {
      const key = settings.digitalocean_api_token;
      if (key) {
        try {
          const response = await fetch("https://api.digitalocean.com/v2/account", {
            headers: { Authorization: `Bearer ${key}` },
          });
          results.digitalocean = {
            success: response.ok,
            message: response.ok ? "Connected" : `Error: ${response.status}`,
          };
        } catch {
          results.digitalocean = { success: false, message: "Connection failed" };
        }
      } else {
        results.digitalocean = { success: false, message: "No API key set" };
      }
    }

    if (!service || service === "gelato") {
      const key = settings.gelato_api_key;
      if (key) {
        try {
          const response = await fetch("https://product.gelatoapis.com/v3/products?limit=1", {
            headers: { "X-API-KEY": key },
          });
          results.gelato = {
            success: response.ok,
            message: response.ok ? "Connected" : `Status: ${response.status}`,
          };
        } catch {
          results.gelato = { success: false, message: "Connection failed" };
        }
      } else {
        results.gelato = { success: false, message: "No API key set" };
      }
    }

    if (!service || service === "prodigi") {
      const key = settings.prodigi_api_key;
      if (key) {
        try {
          const response = await fetch("https://api.prodigi.com/v4.0/products/GLOBAL-MUG-11OZ", {
            headers: { "X-API-Key": key },
          });
          results.prodigi = {
            success: response.ok,
            message: response.ok ? "Connected" : `Status: ${response.status}`,
          };
        } catch {
          results.prodigi = { success: false, message: "Connection failed" };
        }
      } else {
        results.prodigi = { success: false, message: "No API key set" };
      }
    }

    if (!service || service === "printful") {
      const key = settings.printful_api_key;
      const storeId = settings.printful_store_id;
      if (key && storeId) {
        try {
          const response = await fetch("https://api.printful.com/store", {
            headers: {
              "Authorization": `Bearer ${key}`,
              "X-PF-Store-Id": storeId,
            },
          });
          const data = await response.json();
          results.printful = {
            success: data.code === 200,
            message: data.code === 200 ? `Connected to ${data.result?.name || "store"}` : `Error: ${data.code}`,
          };
        } catch {
          results.printful = { success: false, message: "Connection failed" };
        }
      } else {
        results.printful = {
          success: false,
          message: !key ? "No API key set" : "No Store ID set",
        };
      }
    }

    if (!service || service === "namecheap") {
      const apiKey = settings.namecheap_api_key;
      const apiUser = settings.namecheap_api_user;
      if (apiKey && apiUser) {
        try {
          const { testConnection } = await import("@/lib/namecheap");
          const testResult = await testConnection();
          results.namecheap = {
            success: testResult.success,
            message: testResult.success
              ? `${testResult.message} (Balance: $${testResult.accountBalance?.toFixed(2) || "N/A"})`
              : testResult.message,
          };
        } catch (error) {
          results.namecheap = {
            success: false,
            message: error instanceof Error ? error.message : "Connection failed"
          };
        }
      } else {
        results.namecheap = {
          success: false,
          message: !apiUser ? "No API User set" : "No API Key set"
        };
      }
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Test connections error:", error);
    return NextResponse.json({ error: "Test failed" }, { status: 500 });
  }
}
