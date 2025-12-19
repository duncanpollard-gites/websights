"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  Download,
  RefreshCw,
  Check,
  Palette,
} from "lucide-react";

interface GeneratedLogo {
  id: string;
  svg: string;
  name: string;
  description: string;
}

interface LogoGeneratorProps {
  initialBusinessName?: string;
  initialTrade?: string;
  primaryColor?: string;
  onLogoSelect?: (svg: string) => void;
}

const styleOptions = [
  { value: "modern", label: "Modern", description: "Clean & minimal" },
  { value: "classic", label: "Classic", description: "Traditional & timeless" },
  { value: "bold", label: "Bold", description: "Strong & impactful" },
  { value: "minimal", label: "Minimal", description: "Simple & elegant" },
  { value: "playful", label: "Playful", description: "Friendly & approachable" },
];

const tradeOptions = [
  { value: "plumber", label: "Plumber" },
  { value: "electrician", label: "Electrician" },
  { value: "builder", label: "Builder" },
  { value: "carpenter", label: "Carpenter" },
  { value: "painter", label: "Painter" },
  { value: "roofer", label: "Roofer" },
  { value: "landscaper", label: "Landscaper" },
  { value: "plasterer", label: "Plasterer" },
  { value: "tiler", label: "Tiler" },
  { value: "locksmith", label: "Locksmith" },
  { value: "handyman", label: "Handyman" },
  { value: "cleaner", label: "Cleaner" },
  { value: "gardener", label: "Gardener" },
  { value: "pest-control", label: "Pest Control" },
  { value: "hvac", label: "HVAC" },
];

export default function LogoGenerator({
  initialBusinessName = "",
  initialTrade = "",
  primaryColor = "#2563eb",
  onLogoSelect,
}: LogoGeneratorProps) {
  const [businessName, setBusinessName] = useState(initialBusinessName);
  const [trade, setTrade] = useState(initialTrade);
  const [style, setStyle] = useState("modern");
  const [loading, setLoading] = useState(false);
  const [logos, setLogos] = useState<GeneratedLogo[]>([]);
  const [selectedLogo, setSelectedLogo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateLogos = async () => {
    if (!businessName.trim() || !trade) return;

    setLoading(true);
    setError(null);
    setLogos([]);
    setSelectedLogo(null);

    try {
      const response = await fetch("/api/logo/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName,
          trade,
          style,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate logos");
      }

      setLogos(data.logos);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const downloadLogo = (svg: string, format: "svg" | "png" = "svg") => {
    if (format === "svg") {
      const blob = new Blob([svg], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${businessName.replace(/\s+/g, "-").toLowerCase()}-logo.svg`;
      a.click();
      URL.revokeObjectURL(url);
    } else {
      // Convert SVG to PNG
      const img = new Image();
      const svgBlob = new Blob([svg], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(svgBlob);

      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = 800;
        canvas.height = 800;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, 800, 800);
          ctx.drawImage(img, 0, 0, 800, 800);
          const pngUrl = canvas.toDataURL("image/png");
          const a = document.createElement("a");
          a.href = pngUrl;
          a.download = `${businessName.replace(/\s+/g, "-").toLowerCase()}-logo.png`;
          a.click();
        }
        URL.revokeObjectURL(url);
      };

      img.src = url;
    }
  };

  const handleSelect = (logo: GeneratedLogo) => {
    setSelectedLogo(logo.id);
    onLogoSelect?.(logo.svg);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">AI Logo Generator</h2>
          <p className="text-gray-500">Create a professional logo in seconds</p>
        </div>
      </div>

      {/* Input Form */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Business Name
          </label>
          <input
            type="text"
            value={businessName}
            onChange={(e) => setBusinessName(e.target.value)}
            placeholder="e.g., Smith Plumbing"
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Trade
          </label>
          <select
            value={trade}
            onChange={(e) => setTrade(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select your trade...</option>
            {tradeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Style
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {styleOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setStyle(opt.value)}
                className={`px-4 py-3 rounded-xl text-left transition-all ${
                  style === opt.value
                    ? "bg-blue-100 border-2 border-blue-500"
                    : "bg-gray-50 border-2 border-transparent hover:bg-gray-100"
                }`}
              >
                <p className="font-medium text-gray-900">{opt.label}</p>
                <p className="text-xs text-gray-500">{opt.description}</p>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateLogos}
          disabled={loading || !businessName.trim() || !trade}
          className="w-full py-4 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {loading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Logos...
            </>
          ) : logos.length > 0 ? (
            <>
              <RefreshCw className="w-5 h-5" />
              Generate New Logos
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Logos
            </>
          )}
        </button>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-600">
            {error}
          </div>
        )}
      </div>

      {/* Generated Logos */}
      {logos.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Choose Your Logo
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {logos.map((logo) => (
              <div
                key={logo.id}
                onClick={() => handleSelect(logo)}
                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all ${
                  selectedLogo === logo.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
              >
                {selectedLogo === logo.id && (
                  <div className="absolute top-2 right-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className="aspect-square bg-white rounded-lg flex items-center justify-center p-4 mb-3"
                  dangerouslySetInnerHTML={{ __html: logo.svg }}
                />
                <p className="font-medium text-gray-900 text-sm">{logo.name}</p>
                <p className="text-xs text-gray-500">{logo.description}</p>
              </div>
            ))}
          </div>

          {selectedLogo && (
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  const logo = logos.find((l) => l.id === selectedLogo);
                  if (logo) downloadLogo(logo.svg, "svg");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download SVG
              </button>
              <button
                onClick={() => {
                  const logo = logos.find((l) => l.id === selectedLogo);
                  if (logo) downloadLogo(logo.svg, "png");
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4" />
                Download PNG
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Palette className="w-4 h-4" />
                Customize Colors
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
