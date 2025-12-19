"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { Loader2, X, Sparkles, ArrowRight, Phone } from "lucide-react";
import { SiteConfig } from "@/lib/ai";

interface DemoData {
  trade: string;
  slug: string;
  config: SiteConfig;
}

export default function DemoPage({
  params,
}: {
  params: Promise<{ trade: string }>;
}) {
  const { trade } = use(params);
  const [data, setData] = useState<DemoData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    fetchDemoSite();
  }, [trade]);

  const fetchDemoSite = async () => {
    try {
      const response = await fetch(`/api/demo/${trade}`);
      if (!response.ok) {
        const err = await response.json();
        setError(err.error || "Failed to load demo site");
        return;
      }
      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error("Failed to fetch demo:", err);
      setError("Failed to load demo site");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-400">Loading demo site...</p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center px-4">
          <h1 className="text-2xl font-bold text-white mb-4">Demo Not Found</h1>
          <p className="text-gray-400 mb-6">{error}</p>
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            View All Demos
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  const { config } = data;
  const { colors, sections } = config;

  return (
    <div className="min-h-screen">
      {/* Demo Banner */}
      {!bannerDismissed && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Sparkles className="w-5 h-5" />
              <span className="font-medium">
                This is a demo site for a fictional {data.trade.toLowerCase()} business
              </span>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/signup"
                className="px-4 py-1.5 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm"
              >
                Build Your Free Site
              </Link>
              <button
                onClick={() => setBannerDismissed(true)}
                className="p-1 hover:bg-white/20 rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Site Header */}
      <header
        className={`sticky ${bannerDismissed ? "top-0" : "top-12"} z-40 bg-white shadow-sm transition-all`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
              style={{ backgroundColor: colors.primary }}
            >
              {config.businessName.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold" style={{ color: colors.primary }}>
                {config.businessName}
              </h1>
              <p className="text-sm text-gray-500">{config.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${config.phone}`}
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <Phone className="w-4 h-4" />
              {config.phone}
            </a>
            <button
              className="px-4 py-2 rounded-lg font-medium text-white"
              style={{ backgroundColor: colors.primary }}
            >
              Get a Quote
            </button>
          </div>
        </div>
      </header>

      {/* Site Content */}
      <main className={bannerDismissed ? "" : "mt-12"}>
        {sections
          .filter((s) => s.visible)
          .map((section) => {
            switch (section.type) {
              case "hero":
                return (
                  <section
                    key={section.id}
                    className="py-24 px-6 text-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <div className="max-w-4xl mx-auto">
                      <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        {section.title || config.businessName}
                      </h1>
                      <p className="text-xl text-white/90 mb-4">
                        {config.tagline}
                      </p>
                      <p className="text-white/80 max-w-2xl mx-auto mb-10">
                        {section.content}
                      </p>
                      <div className="flex flex-wrap gap-4 justify-center">
                        <button
                          className="px-8 py-4 rounded-full font-semibold text-lg"
                          style={{ backgroundColor: colors.accent, color: "white" }}
                        >
                          Get a Free Quote
                        </button>
                        <a
                          href={`tel:${config.phone}`}
                          className="px-8 py-4 bg-white rounded-full font-semibold text-lg"
                          style={{ color: colors.primary }}
                        >
                          Call {config.phone}
                        </a>
                      </div>
                    </div>
                  </section>
                );

              case "services":
                return (
                  <section
                    key={section.id}
                    className="py-20 px-6"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    <div className="max-w-6xl mx-auto">
                      <h2
                        className="text-3xl md:text-4xl font-bold text-center mb-4"
                        style={{ color: colors.primary }}
                      >
                        {section.title}
                      </h2>
                      <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                        Professional services delivered with care and expertise
                      </p>
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {section.items?.map((item, i) => (
                          <div
                            key={i}
                            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                          >
                            <div
                              className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl"
                              style={{
                                backgroundColor: `${colors.primary}15`,
                                color: colors.primary,
                              }}
                            >
                              {getServiceIcon(item.icon)}
                            </div>
                            <h3 className="text-xl font-semibold mb-2">
                              {item.title}
                            </h3>
                            <p className="text-gray-600">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );

              case "about":
                return (
                  <section key={section.id} className="py-20 px-6 bg-white">
                    <div className="max-w-4xl mx-auto">
                      <h2
                        className="text-3xl md:text-4xl font-bold text-center mb-8"
                        style={{ color: colors.primary }}
                      >
                        {section.title}
                      </h2>
                      <p className="text-lg text-gray-600 text-center leading-relaxed">
                        {section.content || config.about}
                      </p>
                      <div className="mt-12 grid grid-cols-3 gap-8 text-center">
                        <div>
                          <p
                            className="text-4xl font-bold mb-2"
                            style={{ color: colors.primary }}
                          >
                            15+
                          </p>
                          <p className="text-gray-500">Years Experience</p>
                        </div>
                        <div>
                          <p
                            className="text-4xl font-bold mb-2"
                            style={{ color: colors.primary }}
                          >
                            500+
                          </p>
                          <p className="text-gray-500">Happy Customers</p>
                        </div>
                        <div>
                          <p
                            className="text-4xl font-bold mb-2"
                            style={{ color: colors.primary }}
                          >
                            100%
                          </p>
                          <p className="text-gray-500">Satisfaction</p>
                        </div>
                      </div>
                    </div>
                  </section>
                );

              case "testimonials":
                return (
                  <section
                    key={section.id}
                    className="py-20 px-6"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    <div className="max-w-6xl mx-auto">
                      <h2
                        className="text-3xl md:text-4xl font-bold text-center mb-12"
                        style={{ color: colors.primary }}
                      >
                        {section.title}
                      </h2>
                      <div className="grid md:grid-cols-3 gap-6">
                        {section.items?.map((item, i) => (
                          <div
                            key={i}
                            className="bg-white p-6 rounded-xl shadow-sm"
                          >
                            <div className="flex mb-4">
                              {[...Array(5)].map((_, j) => (
                                <span key={j} className="text-yellow-400 text-xl">
                                  *
                                </span>
                              ))}
                            </div>
                            <p className="text-gray-600 mb-4 italic">
                              "{item.description}"
                            </p>
                            <p
                              className="font-semibold"
                              style={{ color: colors.primary }}
                            >
                              - {item.title}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </section>
                );

              case "contact":
                return (
                  <section key={section.id} className="py-20 px-6 bg-white">
                    <div className="max-w-2xl mx-auto">
                      <h2
                        className="text-3xl md:text-4xl font-bold text-center mb-4"
                        style={{ color: colors.primary }}
                      >
                        {section.title}
                      </h2>
                      <p className="text-center text-gray-600 mb-10">
                        {section.content}
                      </p>
                      <div className="bg-gray-50 p-8 rounded-2xl">
                        <form className="space-y-5">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Your name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone
                            </label>
                            <input
                              type="tel"
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              placeholder="Your phone number"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Message
                            </label>
                            <textarea
                              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              rows={4}
                              placeholder="How can we help?"
                            />
                          </div>
                          <button
                            type="button"
                            className="w-full py-4 rounded-lg font-semibold text-white text-lg"
                            style={{ backgroundColor: colors.primary }}
                          >
                            Send Message
                          </button>
                        </form>
                      </div>
                    </div>
                  </section>
                );

              case "cta":
                return (
                  <section
                    key={section.id}
                    className="py-20 px-6 text-center"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <div className="max-w-3xl mx-auto">
                      <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        {section.title}
                      </h2>
                      <p className="text-white/90 text-lg mb-10">
                        {section.content}
                      </p>
                      <a
                        href={`tel:${config.phone}`}
                        className="inline-block px-10 py-5 bg-white rounded-full font-semibold text-xl"
                        style={{ color: colors.primary }}
                      >
                        Call {config.phone}
                      </a>
                    </div>
                  </section>
                );

              default:
                return null;
            }
          })}
      </main>

      {/* Footer */}
      <footer className="py-10 px-6 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <p className="text-gray-400">
                &copy; {new Date().getFullYear()} {config.businessName}. {config.location}.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">Demo site powered by</span>
              <Link
                href="/"
                className="flex items-center gap-2 text-white hover:text-blue-400"
              >
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                TradeVista
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating CTA */}
      <div className="fixed bottom-6 right-6 z-50">
        <Link
          href="/signup"
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-shadow"
        >
          <Sparkles className="w-5 h-5" />
          Build Your Site Free
        </Link>
      </div>
    </div>
  );
}

// Helper function to get service icons
function getServiceIcon(iconName?: string): string {
  const icons: Record<string, string> = {
    "alert-circle": "🚨",
    flame: "🔥",
    bath: "🛁",
    droplet: "💧",
    thermometer: "🌡️",
    pipe: "🔧",
    zap: "⚡",
    cable: "🔌",
    shield: "🛡️",
    "battery-charging": "🔋",
    "clipboard-check": "📋",
    "home-plus": "🏠",
    "arrow-up": "⬆️",
    building: "🏗️",
    hammer: "🔨",
    columns: "🏛️",
    clipboard: "📋",
    utensils: "🍳",
    cabinet: "🗄️",
    stairs: "🪜",
    "door-open": "🚪",
    tree: "🌳",
    history: "📜",
    "paint-bucket": "🎨",
    home: "🏠",
    layers: "📚",
    "building-2": "🏢",
    "spray-can": "🎨",
    palette: "🎨",
    tool: "🔧",
    rectangle: "⬜",
    grid: "▦",
    droplets: "💧",
    "alert-triangle": "⚠️",
    "pencil-ruler": "📐",
    trees: "🌲",
    "grid-3x3": "⊞",
    fence: "🏚️",
    waves: "🌊",
    scissors: "✂️",
    brush: "🖌️",
    "corner-right-up": "↗️",
    eraser: "🧹",
    layout: "📐",
    "chef-hat": "👨‍🍳",
    "grid-2x2": "⊞",
    mountain: "⛰️",
    key: "🔑",
    lock: "🔒",
    box: "📦",
    wrench: "🔧",
    package: "📦",
    monitor: "📺",
    lightbulb: "💡",
    sparkles: "✨",
    trash: "🗑️",
    "tree-pine": "🌲",
    calendar: "📅",
    bug: "🐛",
    "bug-off": "🚫",
    bird: "🐦",
    "paw-print": "🐾",
    wind: "💨",
    leaf: "🍃",
    fan: "🌀",
    "calendar-check": "✅",
    grass: "🌿",
    flower: "🌸",
    eye: "👁️",
  };
  return icons[iconName || ""] || "🔧";
}
