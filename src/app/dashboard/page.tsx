"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Globe,
  Mail,
  CreditCard,
  Settings,
  MessageSquare,
  Sparkles,
  Loader2,
  RefreshCw,
  ExternalLink,
  LogOut,
} from "lucide-react";
import SitePreview from "@/components/dashboard/SitePreview";
import { SiteConfig } from "@/lib/ai";

interface Site {
  id: string;
  subdomain: string;
  customDomain: string | null;
  config: SiteConfig;
  status: "draft" | "live";
}

export default function DashboardPage() {
  const router = useRouter();
  const [site, setSite] = useState<Site | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [modifying, setModifying] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [message, setMessage] = useState("");

  // Load site on mount
  useEffect(() => {
    loadSite();
  }, []);

  const loadSite = async () => {
    try {
      const response = await fetch("/api/site/load");
      const data = await response.json();

      if (response.ok && data.site) {
        setSite(data.site);
      }
    } catch (error) {
      console.error("Failed to load site:", error);
    } finally {
      setLoading(false);
    }
  };

  const generateSite = async () => {
    setGenerating(true);
    setMessage("");

    try {
      const response = await fetch("/api/site/generate", {
        method: "POST",
      });
      const data = await response.json();

      if (response.ok) {
        setSite({
          id: "new",
          subdomain: "preview",
          customDomain: null,
          config: data.config,
          status: "draft",
        });
        setMessage(data.message || "Site generated successfully!");
      } else {
        setMessage(data.error || "Failed to generate site");
      }
    } catch (error) {
      console.error("Failed to generate site:", error);
      setMessage("Network error. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const modifySite = async () => {
    if (!prompt.trim()) return;

    setModifying(true);
    setMessage("");

    try {
      const response = await fetch("/api/site/modify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();

      if (response.ok) {
        setSite((prev) => prev ? { ...prev, config: data.config } : null);
        setMessage(data.explanation || "Site updated!");
        setPrompt("");
      } else {
        setMessage(data.error || "Failed to modify site");
      }
    } catch (error) {
      console.error("Failed to modify site:", error);
      setMessage("Network error. Please try again.");
    } finally {
      setModifying(false);
    }
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WebSights</span>
          </Link>
        </div>

        <nav className="flex-1 p-4">
          <ul className="space-y-1">
            <li>
              <Link
                href="/dashboard"
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-blue-50 text-blue-700 font-medium"
              >
                <Sparkles className="w-5 h-5" />
                Site Editor
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/domains"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Globe className="w-5 h-5" />
                Domain
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/email"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <Mail className="w-5 h-5" />
                Email
              </Link>
            </li>
            <li>
              <Link
                href="/dashboard/billing"
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50"
              >
                <CreditCard className="w-5 h-5" />
                Billing
              </Link>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-600 hover:bg-gray-50 w-full"
          >
            <LogOut className="w-5 h-5" />
            Log out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">Site Editor</h1>
              {site && (
                <p className="text-sm text-gray-500">
                  {site.subdomain}.websights.co.uk
                  <span className={`ml-2 px-2 py-0.5 rounded text-xs font-medium ${
                    site.status === "live"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {site.status}
                  </span>
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {site && (
                <>
                  <button
                    onClick={generateSite}
                    disabled={generating}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <RefreshCw className={`w-4 h-4 ${generating ? "animate-spin" : ""}`} />
                    Regenerate
                  </button>
                  <Link
                    href={`/preview/${site.subdomain}`}
                    target="_blank"
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Preview
                  </Link>
                </>
              )}
              <Link
                href="/dashboard/billing"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Go Live
              </Link>
            </div>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 flex">
          {/* Preview Panel */}
          <div className="flex-1 overflow-auto bg-gray-200 p-4">
            {site ? (
              <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
                {/* Browser Chrome */}
                <div className="bg-gray-100 px-4 py-2 flex items-center gap-2 border-b">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="bg-white rounded px-3 py-1 text-sm text-gray-500 text-center">
                      {site.customDomain || `${site.subdomain}.websights.co.uk`}
                    </div>
                  </div>
                </div>
                {/* Site Preview */}
                <div className="max-h-[600px] overflow-auto">
                  <SitePreview config={site.config} />
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h2 className="text-xl font-semibold text-gray-600 mb-2">
                    No site yet
                  </h2>
                  <p className="text-gray-500 mb-6">
                    Generate your first site with AI
                  </p>
                  <button
                    onClick={generateSite}
                    disabled={generating}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 disabled:opacity-50"
                  >
                    {generating ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Generate My Site
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Chat Panel */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="font-semibold text-gray-900">AI Assistant</h2>
              <p className="text-sm text-gray-500">
                Tell me what to change
              </p>
            </div>

            <div className="flex-1 p-4 overflow-auto">
              {message && (
                <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">
                  {message}
                </div>
              )}

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Quick actions:</p>
                {[
                  "Make the header green",
                  "Add a gallery section",
                  "Update the tagline",
                  "Remove testimonials",
                  "Make it more professional",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setPrompt(suggestion)}
                    className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg text-gray-600"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && !modifying && modifySite()}
                    placeholder="Change the colors..."
                    disabled={!site || modifying}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none disabled:bg-gray-50"
                  />
                </div>
                <button
                  onClick={modifySite}
                  disabled={!site || !prompt.trim() || modifying}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {modifying ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
