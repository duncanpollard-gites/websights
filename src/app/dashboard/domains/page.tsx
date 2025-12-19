"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Globe,
  ArrowLeft,
  Search,
  Check,
  X,
  Loader2,
  ExternalLink,
  Copy,
  AlertCircle,
} from "lucide-react";

interface DomainSuggestion {
  domain: string;
  available: boolean | null;
}

interface DNSRecord {
  type: string;
  name: string;
  value: string;
  note: string;
}

interface ConnectInstructions {
  title: string;
  steps: string[];
  records: DNSRecord[];
  note: string;
}

export default function DomainsPage() {
  const [suggestions, setSuggestions] = useState<DomainSuggestion[]>([]);
  const [configured, setConfigured] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchDomain, setSearchDomain] = useState("");
  const [searchResult, setSearchResult] = useState<DomainSuggestion | null>(null);
  const [searching, setSearching] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [instructions, setInstructions] = useState<ConnectInstructions | null>(null);
  const [copiedRecord, setCopiedRecord] = useState<string | null>(null);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    try {
      const response = await fetch("/api/domains/suggest");
      const data = await response.json();
      setSuggestions(data.suggestions || []);
      setConfigured(data.configured);
    } catch (error) {
      console.error("Failed to fetch suggestions:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkDomain = async () => {
    if (!searchDomain.trim()) return;

    setSearching(true);
    setSearchResult(null);

    try {
      const response = await fetch("/api/domains/check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: searchDomain.trim().toLowerCase() }),
      });
      const data = await response.json();
      setSearchResult(data);
    } catch (error) {
      console.error("Failed to check domain:", error);
    } finally {
      setSearching(false);
    }
  };

  const connectDomain = async (domain: string) => {
    setConnecting(true);

    try {
      const response = await fetch("/api/domains/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain }),
      });
      const data = await response.json();

      if (data.success) {
        setInstructions(data.instructions);
      }
    } catch (error) {
      console.error("Failed to connect domain:", error);
    } finally {
      setConnecting(false);
    }
  };

  const copyToClipboard = (text: string, recordId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRecord(recordId);
    setTimeout(() => setCopiedRecord(null), 2000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-12">
        {/* Page Title */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Domain Settings</h1>
          </div>
          <p className="text-gray-600">
            Connect your own domain or use our free subdomain
          </p>
        </div>

        {/* Current Domain */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Your Current Domain</h2>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Globe className="w-5 h-5 text-gray-400" />
            <span className="text-gray-700 font-mono">yourbusiness.tradevista.co.uk</span>
            <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded">
              Active
            </span>
          </div>
        </div>

        {/* DNS Instructions (if connecting) */}
        {instructions && (
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-8">
            <h2 className="font-semibold text-blue-900 mb-4">{instructions.title}</h2>
            <ol className="list-decimal list-inside space-y-2 mb-6 text-blue-800">
              {instructions.steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
            <div className="space-y-3">
              {instructions.records.map((record, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-mono rounded">
                        {record.type}
                      </span>
                      <span className="font-mono text-gray-900">{record.name}</span>
                      <span className="text-gray-400">→</span>
                      <span className="font-mono text-gray-900">{record.value}</span>
                    </div>
                    <p className="text-sm text-gray-500">{record.note}</p>
                  </div>
                  <button
                    onClick={() => copyToClipboard(record.value, `${i}`)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {copiedRecord === `${i}` ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-blue-700">
              <AlertCircle className="w-4 h-4 inline mr-1" />
              {instructions.note}
            </p>
          </div>
        )}

        {/* Connect Custom Domain */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-8">
          <h2 className="font-semibold text-gray-900 mb-4">Connect Your Domain</h2>
          <p className="text-gray-600 text-sm mb-4">
            Already own a domain? Enter it below and we'll show you how to connect it.
          </p>
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchDomain}
                onChange={(e) => setSearchDomain(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && checkDomain()}
                placeholder="yourdomain.co.uk"
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
            <button
              onClick={checkDomain}
              disabled={searching || !searchDomain.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {searching ? <Loader2 className="w-5 h-5 animate-spin" /> : "Check"}
            </button>
          </div>

          {searchResult && (
            <div className="mt-4 p-4 rounded-lg bg-gray-50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono">{searchResult.domain}</span>
                {searchResult.available === true && (
                  <span className="flex items-center gap-1 text-green-600 text-sm">
                    <Check className="w-4 h-4" /> Available
                  </span>
                )}
                {searchResult.available === false && (
                  <span className="flex items-center gap-1 text-red-600 text-sm">
                    <X className="w-4 h-4" /> Taken
                  </span>
                )}
              </div>
              <button
                onClick={() => connectDomain(searchResult.domain)}
                disabled={connecting}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
              >
                {connecting ? "Connecting..." : "Connect This Domain"}
              </button>
            </div>
          )}
        </div>

        {/* Domain Suggestions */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold text-gray-900 mb-4">Suggested Domains</h2>
          <p className="text-gray-600 text-sm mb-4">
            Based on your business name. Click to connect.
          </p>

          {!configured && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800 text-sm">
              Domain availability checking not configured. Contact support to enable.
            </div>
          )}

          <div className="space-y-2">
            {suggestions.map((suggestion) => (
              <div
                key={suggestion.domain}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="font-mono text-gray-900">{suggestion.domain}</span>
                  {suggestion.available === true && (
                    <span className="flex items-center gap-1 text-green-600 text-xs">
                      <Check className="w-3 h-3" /> Available
                    </span>
                  )}
                  {suggestion.available === false && (
                    <span className="flex items-center gap-1 text-red-600 text-xs">
                      <X className="w-3 h-3" /> Taken
                    </span>
                  )}
                </div>
                <button
                  onClick={() => connectDomain(suggestion.domain)}
                  className="px-3 py-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-sm font-medium transition-colors"
                >
                  Connect
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Need to buy a domain?{" "}
              <a
                href="https://www.namecheap.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline inline-flex items-center gap-1"
              >
                We recommend Namecheap
                <ExternalLink className="w-3 h-3" />
              </a>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
