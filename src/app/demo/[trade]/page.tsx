"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import {
  Loader2,
  X,
  Sparkles,
  ArrowRight,
  Phone,
  Star,
  CheckCircle,
  MapPin,
  Clock,
  Shield,
  Award,
} from "lucide-react";
import { SiteConfig, SiteSection } from "@/lib/ai";
import QuoteGenerator from "@/components/demo/QuoteGenerator";

interface DemoData {
  trade: string;
  slug: string;
  config: SiteConfig & {
    images?: {
      hero?: string;
      about?: string;
      gallery?: string[];
    };
  };
}

// Layout assignments for each trade
type LayoutType = "classic" | "split" | "dark" | "minimal" | "bold";

const tradeLayouts: Record<string, LayoutType> = {
  plumber: "classic",
  builder: "split",
  hvac: "dark",
  electrician: "bold",
  locksmith: "minimal",
  handyman: "split",
  carpenter: "dark",
  roofer: "bold",
  plasterer: "classic",
  painter: "minimal",
  landscaper: "split",
  gardener: "dark",
  tiler: "bold",
  cleaner: "minimal",
  "pest-control": "classic",
};

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
  const layout = tradeLayouts[data.slug] || "classic";

  return (
    <div className="min-h-screen">
      {/* Demo Banner */}
      <DemoBanner
        trade={data.trade}
        dismissed={bannerDismissed}
        onDismiss={() => setBannerDismissed(true)}
      />

      {/* Render layout-specific content */}
      {layout === "classic" && (
        <ClassicLayout
          data={data}
          config={config}
          bannerDismissed={bannerDismissed}
        />
      )}
      {layout === "split" && (
        <SplitLayout
          data={data}
          config={config}
          bannerDismissed={bannerDismissed}
        />
      )}
      {layout === "dark" && (
        <DarkLayout
          data={data}
          config={config}
          bannerDismissed={bannerDismissed}
        />
      )}
      {layout === "minimal" && (
        <MinimalLayout
          data={data}
          config={config}
          bannerDismissed={bannerDismissed}
        />
      )}
      {layout === "bold" && (
        <BoldLayout
          data={data}
          config={config}
          bannerDismissed={bannerDismissed}
        />
      )}

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

// Demo Banner Component
function DemoBanner({
  trade,
  dismissed,
  onDismiss,
}: {
  trade: string;
  dismissed: boolean;
  onDismiss: () => void;
}) {
  if (dismissed) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Sparkles className="w-5 h-5" />
          <span className="font-medium">
            This is a demo site for a fictional {trade.toLowerCase()} business
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href="/signup"
            className="px-4 py-1.5 bg-white text-blue-600 rounded-full font-semibold hover:bg-gray-100 transition-colors text-sm"
          >
            Build Your Free Site
          </Link>
          <button onClick={onDismiss} className="p-1 hover:bg-white/20 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ===========================================
// LAYOUT 1: CLASSIC - Traditional centered hero
// ===========================================
function ClassicLayout({
  data,
  config,
  bannerDismissed,
}: {
  data: DemoData;
  config: DemoData["config"];
  bannerDismissed: boolean;
}) {
  const { colors, sections } = config;
  const heroSection = sections.find((s) => s.type === "hero" && s.visible);
  const servicesSection = sections.find((s) => s.type === "services" && s.visible);
  const aboutSection = sections.find((s) => s.type === "about" && s.visible);
  const testimonialsSection = sections.find((s) => s.type === "testimonials" && s.visible);
  const contactSection = sections.find((s) => s.type === "contact" && s.visible);

  return (
    <>
      {/* Header */}
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

      <main className={bannerDismissed ? "" : "mt-12"}>
        {/* Hero */}
        {heroSection && (
          <section className="relative py-32 md:py-40 px-6 text-center overflow-hidden">
            {config.images?.hero && (
              <div
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: `url(${config.images.hero})` }}
              />
            )}
            <div
              className="absolute inset-0"
              style={{
                backgroundColor: colors.primary,
                opacity: config.images?.hero ? 0.85 : 1,
              }}
            />
            <div className="relative max-w-4xl mx-auto z-10">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 drop-shadow-lg">
                {heroSection.title || config.businessName}
              </h1>
              <p className="text-xl md:text-2xl text-white/95 mb-4 drop-shadow">
                {config.tagline}
              </p>
              <p className="text-white/85 max-w-2xl mx-auto mb-10 text-lg drop-shadow">
                {heroSection.content}
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  className="px-8 py-4 rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                  style={{ backgroundColor: colors.accent, color: "white" }}
                >
                  Get a Free Quote
                </button>
                <a
                  href={`tel:${config.phone}`}
                  className="px-8 py-4 bg-white rounded-full font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
                  style={{ color: colors.primary }}
                >
                  Call {config.phone}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Trust Badges */}
        <div className="bg-white py-8 border-b">
          <div className="max-w-6xl mx-auto px-6 flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="flex items-center gap-2 text-gray-600">
              <Shield className="w-5 h-5" style={{ color: colors.primary }} />
              <span>Fully Insured</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-5 h-5" style={{ color: colors.primary }} />
              <span>Same Day Service</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Award className="w-5 h-5" style={{ color: colors.primary }} />
              <span>15+ Years Experience</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
              <span>5-Star Rated</span>
            </div>
          </div>
        </div>

        {/* Services */}
        {servicesSection && (
          <section className="py-20 px-6" style={{ backgroundColor: colors.secondary }}>
            <div className="max-w-6xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold text-center mb-4"
                style={{ color: colors.primary }}
              >
                {servicesSection.title}
              </h2>
              <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                Professional services delivered with care and expertise
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesSection.items?.map((item, i) => (
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
                    <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About */}
        {aboutSection && (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className={`grid ${config.images?.about ? "lg:grid-cols-2" : ""} gap-12 items-center`}>
                {config.images?.about && (
                  <div className="relative">
                    <div
                      className="aspect-[4/3] rounded-2xl bg-cover bg-center shadow-xl"
                      style={{ backgroundImage: `url(${config.images.about})` }}
                    />
                    <div
                      className="absolute -bottom-4 -right-4 w-24 h-24 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg"
                      style={{ backgroundColor: colors.primary }}
                    >
                      15+
                      <br />
                      Years
                    </div>
                  </div>
                )}
                <div className={config.images?.about ? "" : "max-w-4xl mx-auto text-center"}>
                  <h2
                    className={`text-3xl md:text-4xl font-bold mb-6 ${config.images?.about ? "" : "text-center"}`}
                    style={{ color: colors.primary }}
                  >
                    {aboutSection.title}
                  </h2>
                  <p
                    className={`text-lg text-gray-600 leading-relaxed mb-8 ${config.images?.about ? "" : "text-center"}`}
                  >
                    {aboutSection.content || config.about}
                  </p>
                  <div className={`grid grid-cols-3 gap-6 ${config.images?.about ? "" : "max-w-md mx-auto"}`}>
                    {[
                      { num: "15+", label: "Years Experience" },
                      { num: "500+", label: "Happy Customers" },
                      { num: "100%", label: "Satisfaction" },
                    ].map((stat, i) => (
                      <div key={i} className={config.images?.about ? "" : "text-center"}>
                        <p className="text-3xl md:text-4xl font-bold mb-1" style={{ color: colors.primary }}>
                          {stat.num}
                        </p>
                        <p className="text-gray-500 text-sm">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonialsSection && (
          <section className="py-20 px-6" style={{ backgroundColor: colors.secondary }}>
            <div className="max-w-6xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold text-center mb-12"
                style={{ color: colors.primary }}
              >
                {testimonialsSection.title}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonialsSection.items?.map((item, i) => (
                  <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                    <div className="flex mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-4 italic">&ldquo;{item.description}&rdquo;</p>
                    <p className="font-semibold" style={{ color: colors.primary }}>
                      - {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quote Generator */}
        <QuoteGenerator
          trade={data.slug}
          businessName={config.businessName}
          location={config.location}
          phone={config.phone}
          primaryColor={colors.primary}
          accentColor={colors.accent}
        />

        {/* Contact */}
        {contactSection && (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-2xl mx-auto">
              <h2
                className="text-3xl md:text-4xl font-bold text-center mb-4"
                style={{ color: colors.primary }}
              >
                {contactSection.title}
              </h2>
              <p className="text-center text-gray-600 mb-10">{contactSection.content}</p>
              <div className="bg-gray-50 p-8 rounded-2xl">
                <form className="space-y-5">
                  <div className="grid md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent"
                      placeholder="Your name"
                      style={{ "--tw-ring-color": colors.primary } as React.CSSProperties}
                    />
                    <input
                      type="tel"
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent"
                      placeholder="Your phone"
                    />
                  </div>
                  <textarea
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:border-transparent"
                    rows={4}
                    placeholder="How can we help?"
                  />
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
        )}

        {/* CTA */}
        <section className="py-20 px-6 text-center" style={{ backgroundColor: colors.primary }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get Started?</h2>
            <p className="text-white/90 text-lg mb-10">
              Call now for a free, no-obligation quote
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
      </main>

      <Footer config={config} />
    </>
  );
}

// ===========================================
// LAYOUT 2: SPLIT - Hero with side image
// ===========================================
function SplitLayout({
  data,
  config,
  bannerDismissed,
}: {
  data: DemoData;
  config: DemoData["config"];
  bannerDismissed: boolean;
}) {
  const { colors, sections } = config;
  const heroSection = sections.find((s) => s.type === "hero" && s.visible);
  const servicesSection = sections.find((s) => s.type === "services" && s.visible);
  const aboutSection = sections.find((s) => s.type === "about" && s.visible);
  const testimonialsSection = sections.find((s) => s.type === "testimonials" && s.visible);

  return (
    <>
      {/* Transparent Header */}
      <header
        className={`sticky ${bannerDismissed ? "top-0" : "top-12"} z-40 bg-white/95 backdrop-blur-sm border-b transition-all`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: colors.primary }}
            >
              {config.businessName.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-lg" style={{ color: colors.primary }}>
                {config.businessName}
              </h1>
              <div className="flex items-center gap-1 text-sm text-gray-500">
                <MapPin className="w-3 h-3" />
                {config.location}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <a
              href={`tel:${config.phone}`}
              className="hidden lg:flex items-center gap-2 font-semibold"
              style={{ color: colors.primary }}
            >
              <Phone className="w-5 h-5" />
              {config.phone}
            </a>
            <button
              className="px-6 py-2.5 rounded-full font-semibold text-white shadow-lg hover:shadow-xl transition-shadow"
              style={{ backgroundColor: colors.primary }}
            >
              Free Quote
            </button>
          </div>
        </div>
      </header>

      <main className={bannerDismissed ? "" : "mt-12"}>
        {/* Split Hero */}
        {heroSection && (
          <section className="min-h-[80vh] grid lg:grid-cols-2">
            <div className="flex items-center px-8 lg:px-16 py-20" style={{ backgroundColor: colors.secondary }}>
              <div className="max-w-xl">
                <div
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                  style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                >
                  <Award className="w-4 h-4" />
                  Trusted Local Experts
                </div>
                <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold mb-6" style={{ color: colors.primary }}>
                  {heroSection.title || config.businessName}
                </h1>
                <p className="text-xl text-gray-600 mb-4">{config.tagline}</p>
                <p className="text-gray-500 mb-8">{heroSection.content}</p>
                <div className="flex flex-wrap gap-4">
                  <button
                    className="px-8 py-4 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all"
                    style={{ backgroundColor: colors.primary }}
                  >
                    Get Free Quote
                  </button>
                  <a
                    href={`tel:${config.phone}`}
                    className="px-8 py-4 rounded-xl font-semibold border-2 hover:bg-gray-50 transition-colors"
                    style={{ borderColor: colors.primary, color: colors.primary }}
                  >
                    Call Now
                  </a>
                </div>
                <div className="flex gap-8 mt-10">
                  <div>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>15+</p>
                    <p className="text-sm text-gray-500">Years</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>500+</p>
                    <p className="text-sm text-gray-500">Projects</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold" style={{ color: colors.primary }}>5.0</p>
                    <p className="text-sm text-gray-500">Rating</p>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="hidden lg:block bg-cover bg-center"
              style={{
                backgroundImage: config.images?.hero
                  ? `url(${config.images.hero})`
                  : `linear-gradient(135deg, ${colors.primary}, ${colors.accent})`,
              }}
            />
          </section>
        )}

        {/* Horizontal Services */}
        {servicesSection && (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: colors.primary }}>
                  {servicesSection.title}
                </h2>
                <div className="w-20 h-1 mx-auto rounded-full" style={{ backgroundColor: colors.accent }} />
              </div>
              <div className="space-y-6">
                {servicesSection.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col md:flex-row items-start md:items-center gap-6 p-6 rounded-2xl hover:shadow-lg transition-shadow"
                    style={{ backgroundColor: colors.secondary }}
                  >
                    <div
                      className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
                      style={{ backgroundColor: `${colors.primary}20` }}
                    >
                      {getServiceIcon(item.icon)}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                      <p className="text-gray-600">{item.description}</p>
                    </div>
                    <button
                      className="px-6 py-2 rounded-full text-sm font-medium text-white flex-shrink-0"
                      style={{ backgroundColor: colors.primary }}
                    >
                      Learn More
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About with checklist */}
        {aboutSection && (
          <section className="py-20 px-6" style={{ backgroundColor: colors.secondary }}>
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-6" style={{ color: colors.primary }}>
                  {aboutSection.title}
                </h2>
                <p className="text-lg text-gray-600 mb-8">{aboutSection.content || config.about}</p>
                <ul className="space-y-4">
                  {["Fully insured and certified", "Transparent pricing", "Same day service available", "100% satisfaction guarantee"].map(
                    (item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle className="w-6 h-6" style={{ color: colors.primary }} />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    )
                  )}
                </ul>
              </div>
              {config.images?.about && (
                <div className="relative">
                  <div
                    className="aspect-square rounded-3xl bg-cover bg-center shadow-2xl"
                    style={{ backgroundImage: `url(${config.images.about})` }}
                  />
                </div>
              )}
            </div>
          </section>
        )}

        {/* Testimonials Carousel Style */}
        {testimonialsSection && (
          <section className="py-20 px-6 bg-white overflow-hidden">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-12" style={{ color: colors.primary }}>
                What Our Customers Say
              </h2>
              <div className="flex gap-6 overflow-x-auto pb-4 snap-x">
                {testimonialsSection.items?.map((item, i) => (
                  <div
                    key={i}
                    className="min-w-[320px] md:min-w-[400px] p-8 rounded-2xl border-2 snap-center"
                    style={{ borderColor: `${colors.primary}30` }}
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-600 mb-6 text-lg">&ldquo;{item.description}&rdquo;</p>
                    <div className="flex items-center gap-3">
                      <div
                        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: colors.primary }}
                      >
                        {item.title.charAt(0)}
                      </div>
                      <p className="font-semibold">{item.title}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quote Generator */}
        <QuoteGenerator
          trade={data.slug}
          businessName={config.businessName}
          location={config.location}
          phone={config.phone}
          primaryColor={colors.primary}
          accentColor={colors.accent}
        />

        {/* CTA Banner */}
        <section
          className="py-16 px-6"
          style={{ background: `linear-gradient(135deg, ${colors.primary}, ${colors.accent})` }}
        >
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-white text-center md:text-left">
              <h2 className="text-3xl font-bold mb-2">Ready to Get Started?</h2>
              <p className="text-white/80">Get a free quote today - no obligation</p>
            </div>
            <a
              href={`tel:${config.phone}`}
              className="px-10 py-4 bg-white rounded-full font-bold text-lg shadow-lg hover:shadow-xl transition-shadow whitespace-nowrap"
              style={{ color: colors.primary }}
            >
              Call {config.phone}
            </a>
          </div>
        </section>
      </main>

      <Footer config={config} />
    </>
  );
}

// ===========================================
// LAYOUT 3: DARK - Dark theme throughout
// ===========================================
function DarkLayout({
  data,
  config,
  bannerDismissed,
}: {
  data: DemoData;
  config: DemoData["config"];
  bannerDismissed: boolean;
}) {
  const { colors, sections } = config;
  const heroSection = sections.find((s) => s.type === "hero" && s.visible);
  const servicesSection = sections.find((s) => s.type === "services" && s.visible);
  const aboutSection = sections.find((s) => s.type === "about" && s.visible);
  const testimonialsSection = sections.find((s) => s.type === "testimonials" && s.visible);

  return (
    <>
      {/* Dark Header */}
      <header
        className={`sticky ${bannerDismissed ? "top-0" : "top-12"} z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800 transition-all`}
      >
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg"
              style={{ backgroundColor: colors.primary, color: "white" }}
            >
              {config.businessName.charAt(0)}
            </div>
            <div>
              <h1 className="font-bold text-white">{config.businessName}</h1>
              <p className="text-sm text-gray-400">{config.location}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <a
              href={`tel:${config.phone}`}
              className="hidden md:flex items-center gap-2 text-gray-300 hover:text-white"
            >
              <Phone className="w-4 h-4" />
              {config.phone}
            </a>
            <button
              className="px-4 py-2 rounded-lg font-medium"
              style={{ backgroundColor: colors.primary, color: "white" }}
            >
              Get a Quote
            </button>
          </div>
        </div>
      </header>

      <main className={`bg-gray-900 ${bannerDismissed ? "" : "mt-12"}`}>
        {/* Dark Hero */}
        {heroSection && (
          <section className="relative py-32 md:py-44 px-6 text-center overflow-hidden">
            {config.images?.hero && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-30"
                style={{ backgroundImage: `url(${config.images.hero})` }}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 to-gray-900" />
            <div className="relative max-w-4xl mx-auto z-10">
              <div
                className="inline-block px-4 py-1 rounded-full text-sm font-medium mb-6"
                style={{ backgroundColor: `${colors.primary}30`, color: colors.primary }}
              >
                Premium Quality Service
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
                {heroSection.title || config.businessName}
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-4">{config.tagline}</p>
              <p className="text-gray-400 max-w-2xl mx-auto mb-10">{heroSection.content}</p>
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  className="px-8 py-4 rounded-lg font-semibold text-lg"
                  style={{ backgroundColor: colors.primary, color: "white" }}
                >
                  Get a Free Quote
                </button>
                <a
                  href={`tel:${config.phone}`}
                  className="px-8 py-4 rounded-lg font-semibold text-lg border border-gray-600 text-white hover:bg-gray-800 transition-colors"
                >
                  Call {config.phone}
                </a>
              </div>
            </div>
          </section>
        )}

        {/* Stats Bar */}
        <div className="border-y border-gray-800 py-10">
          <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "15+", label: "Years Experience" },
              { num: "500+", label: "Projects Completed" },
              { num: "100%", label: "Customer Satisfaction" },
              { num: "24/7", label: "Emergency Service" },
            ].map((stat, i) => (
              <div key={i}>
                <p className="text-4xl font-bold mb-2" style={{ color: colors.primary }}>
                  {stat.num}
                </p>
                <p className="text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Dark Services Grid */}
        {servicesSection && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-4">
                {servicesSection.title}
              </h2>
              <p className="text-gray-400 text-center mb-12 max-w-2xl mx-auto">
                Expert services tailored to your needs
              </p>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesSection.items?.map((item, i) => (
                  <div
                    key={i}
                    className="bg-gray-800 p-6 rounded-2xl border border-gray-700 hover:border-gray-600 transition-colors group"
                  >
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-2xl transition-transform group-hover:scale-110"
                      style={{ backgroundColor: `${colors.primary}30` }}
                    >
                      {getServiceIcon(item.icon)}
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-gray-400">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* About */}
        {aboutSection && (
          <section className="py-20 px-6 border-t border-gray-800">
            <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              {config.images?.about && (
                <div className="relative">
                  <div
                    className="aspect-[4/3] rounded-2xl bg-cover bg-center"
                    style={{ backgroundImage: `url(${config.images.about})` }}
                  />
                  <div
                    className="absolute -bottom-6 -right-6 px-6 py-4 rounded-xl"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <p className="text-3xl font-bold text-white">15+</p>
                    <p className="text-white/80 text-sm">Years of Excellence</p>
                  </div>
                </div>
              )}
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">{aboutSection.title}</h2>
                <p className="text-lg text-gray-300 mb-8">{aboutSection.content || config.about}</p>
                <div className="grid grid-cols-2 gap-4">
                  {["Fully Licensed", "Insured", "24/7 Support", "Free Quotes"].map((item, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" style={{ color: colors.primary }} />
                      <span className="text-gray-300">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Dark Testimonials */}
        {testimonialsSection && (
          <section className="py-20 px-6">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                {testimonialsSection.title}
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonialsSection.items?.map((item, i) => (
                  <div key={i} className="bg-gray-800 p-6 rounded-2xl border border-gray-700">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4">&ldquo;{item.description}&rdquo;</p>
                    <p className="font-semibold" style={{ color: colors.primary }}>
                      {item.title}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quote Generator */}
        <QuoteGenerator
          trade={data.slug}
          businessName={config.businessName}
          location={config.location}
          phone={config.phone}
          primaryColor={colors.primary}
          accentColor={colors.accent}
        />

        {/* CTA */}
        <section className="py-20 px-6 border-t border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Let&apos;s Work Together</h2>
            <p className="text-gray-400 mb-10">Get a free quote for your project today</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <a
                href={`tel:${config.phone}`}
                className="px-10 py-4 rounded-lg font-semibold text-lg"
                style={{ backgroundColor: colors.primary, color: "white" }}
              >
                Call {config.phone}
              </a>
              <button className="px-10 py-4 rounded-lg font-semibold text-lg border border-gray-600 text-white hover:bg-gray-800 transition-colors">
                Request Quote
              </button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-10 px-6 bg-gray-950 text-white border-t border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} {config.businessName}. {config.location}.
            </p>
            <div className="flex items-center gap-4">
              <span className="text-gray-500">Demo site powered by</span>
              <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400">
                <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                  <span className="text-white font-bold text-sm">T</span>
                </div>
                TradeVista
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}

// ===========================================
// LAYOUT 4: MINIMAL - Clean, lots of whitespace
// ===========================================
function MinimalLayout({
  data,
  config,
  bannerDismissed,
}: {
  data: DemoData;
  config: DemoData["config"];
  bannerDismissed: boolean;
}) {
  const { colors, sections } = config;
  const heroSection = sections.find((s) => s.type === "hero" && s.visible);
  const servicesSection = sections.find((s) => s.type === "services" && s.visible);
  const aboutSection = sections.find((s) => s.type === "about" && s.visible);
  const testimonialsSection = sections.find((s) => s.type === "testimonials" && s.visible);

  return (
    <>
      {/* Minimal Header */}
      <header
        className={`sticky ${bannerDismissed ? "top-0" : "top-12"} z-40 bg-white transition-all`}
      >
        <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-tight" style={{ color: colors.primary }}>
            {config.businessName}
          </h1>
          <a
            href={`tel:${config.phone}`}
            className="text-sm font-medium underline underline-offset-4 hover:opacity-70 transition-opacity"
            style={{ color: colors.primary }}
          >
            {config.phone}
          </a>
        </div>
      </header>

      <main className={bannerDismissed ? "" : "mt-12"}>
        {/* Minimal Hero */}
        {heroSection && (
          <section className="py-24 md:py-32 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-sm uppercase tracking-widest mb-6" style={{ color: colors.primary }}>
                {config.location}
              </p>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 leading-tight">
                {config.tagline}
              </h1>
              <p className="text-xl text-gray-500 mb-12 max-w-xl mx-auto">{heroSection.content}</p>
              <button
                className="px-10 py-4 rounded-full font-medium text-white"
                style={{ backgroundColor: colors.primary }}
              >
                Get in Touch
              </button>
            </div>
          </section>
        )}

        {/* Large Image */}
        {config.images?.hero && (
          <div className="max-w-6xl mx-auto px-6 mb-24">
            <div
              className="aspect-[21/9] rounded-xl bg-cover bg-center"
              style={{ backgroundImage: `url(${config.images.hero})` }}
            />
          </div>
        )}

        {/* Simple Services List */}
        {servicesSection && (
          <section className="py-20 px-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-sm uppercase tracking-widest mb-12 text-center" style={{ color: colors.primary }}>
                Services
              </h2>
              <div className="space-y-0 divide-y divide-gray-200">
                {servicesSection.items?.map((item, i) => (
                  <div key={i} className="py-8 flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                      <p className="text-gray-500">{item.description}</p>
                    </div>
                    <span className="text-2xl">{getServiceIcon(item.icon)}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Minimal About */}
        {aboutSection && (
          <section className="py-20 px-6 bg-gray-50">
            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
              {config.images?.about && (
                <div
                  className="aspect-[4/5] rounded-lg bg-cover bg-center"
                  style={{ backgroundImage: `url(${config.images.about})` }}
                />
              )}
              <div>
                <h2 className="text-3xl font-light mb-6">{aboutSection.title}</h2>
                <p className="text-gray-600 leading-relaxed mb-8">{aboutSection.content || config.about}</p>
                <div className="flex gap-12">
                  <div>
                    <p className="text-4xl font-light" style={{ color: colors.primary }}>
                      15+
                    </p>
                    <p className="text-sm text-gray-500">Years</p>
                  </div>
                  <div>
                    <p className="text-4xl font-light" style={{ color: colors.primary }}>
                      500+
                    </p>
                    <p className="text-sm text-gray-500">Clients</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Testimonials */}
        {testimonialsSection && (
          <section className="py-24 px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-sm uppercase tracking-widest mb-16 text-center" style={{ color: colors.primary }}>
                Testimonials
              </h2>
              <div className="grid md:grid-cols-2 gap-12">
                {testimonialsSection.items?.slice(0, 2).map((item, i) => (
                  <div key={i}>
                    <p className="text-2xl font-light mb-6 leading-relaxed">&ldquo;{item.description}&rdquo;</p>
                    <p className="text-sm font-medium">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quote Generator */}
        <QuoteGenerator
          trade={data.slug}
          businessName={config.businessName}
          location={config.location}
          phone={config.phone}
          primaryColor={colors.primary}
          accentColor={colors.accent}
        />

        {/* Minimal CTA */}
        <section className="py-24 px-6 text-center" style={{ backgroundColor: colors.primary }}>
          <div className="max-w-xl mx-auto">
            <h2 className="text-3xl font-light text-white mb-6">Ready to start your project?</h2>
            <a
              href={`tel:${config.phone}`}
              className="text-xl text-white underline underline-offset-8 hover:opacity-70 transition-opacity"
            >
              {config.phone}
            </a>
          </div>
        </section>
      </main>

      <Footer config={config} />
    </>
  );
}

// ===========================================
// LAYOUT 5: BOLD - Large typography, vibrant
// ===========================================
function BoldLayout({
  data,
  config,
  bannerDismissed,
}: {
  data: DemoData;
  config: DemoData["config"];
  bannerDismissed: boolean;
}) {
  const { colors, sections } = config;
  const heroSection = sections.find((s) => s.type === "hero" && s.visible);
  const servicesSection = sections.find((s) => s.type === "services" && s.visible);
  const aboutSection = sections.find((s) => s.type === "about" && s.visible);
  const testimonialsSection = sections.find((s) => s.type === "testimonials" && s.visible);

  return (
    <>
      {/* Bold Header */}
      <header
        className={`sticky ${bannerDismissed ? "top-0" : "top-12"} z-40 bg-white shadow-lg transition-all`}
      >
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-black text-xl transform -rotate-3"
              style={{ backgroundColor: colors.primary }}
            >
              {config.businessName.charAt(0)}
            </div>
            <div>
              <h1 className="font-black text-lg">{config.businessName}</h1>
              <p className="text-xs text-gray-500 uppercase tracking-wide">{config.location}</p>
            </div>
          </div>
          <a
            href={`tel:${config.phone}`}
            className="px-6 py-3 rounded-xl font-bold text-white transform hover:-rotate-1 transition-transform"
            style={{ backgroundColor: colors.primary }}
          >
            CALL NOW
          </a>
        </div>
      </header>

      <main className={bannerDismissed ? "" : "mt-12"}>
        {/* Bold Hero */}
        {heroSection && (
          <section
            className="relative py-20 md:py-32 px-6 overflow-hidden"
            style={{ backgroundColor: colors.primary }}
          >
            {config.images?.hero && (
              <div
                className="absolute inset-0 bg-cover bg-center opacity-20"
                style={{ backgroundImage: `url(${config.images.hero})` }}
              />
            )}
            <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-white leading-none mb-6">
                  {heroSection.title?.split(" ").map((word, i) => (
                    <span key={i} className={i % 2 === 1 ? "block" : ""}>
                      {word}{" "}
                    </span>
                  ))}
                </h1>
                <p className="text-xl text-white/90 mb-8">{config.tagline}</p>
                <div className="flex flex-wrap gap-4">
                  <button className="px-8 py-4 bg-white rounded-xl font-bold text-lg transform hover:-rotate-1 transition-transform"
                    style={{ color: colors.primary }}>
                    GET FREE QUOTE
                  </button>
                  <a
                    href={`tel:${config.phone}`}
                    className="px-8 py-4 border-2 border-white text-white rounded-xl font-bold text-lg transform hover:rotate-1 transition-transform"
                  >
                    {config.phone}
                  </a>
                </div>
              </div>
              <div className="hidden lg:block">
                <div className="grid grid-cols-2 gap-4 transform rotate-3">
                  {[
                    { num: "15+", label: "YEARS" },
                    { num: "500+", label: "JOBS" },
                    { num: "5★", label: "RATED" },
                    { num: "24/7", label: "SERVICE" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="bg-white p-6 rounded-xl text-center transform hover:-rotate-2 transition-transform"
                    >
                      <p className="text-4xl font-black" style={{ color: colors.primary }}>
                        {stat.num}
                      </p>
                      <p className="text-xs font-bold uppercase tracking-wide text-gray-500">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bold Services */}
        {servicesSection && (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-4" style={{ color: colors.primary }}>
                WHAT WE DO
              </h2>
              <div className="w-24 h-2 mx-auto mb-16 rounded-full" style={{ backgroundColor: colors.accent }} />
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {servicesSection.items?.map((item, i) => (
                  <div
                    key={i}
                    className="p-8 rounded-2xl border-4 transform hover:-rotate-1 transition-transform"
                    style={{ borderColor: colors.primary }}
                  >
                    <div className="text-5xl mb-4">{getServiceIcon(item.icon)}</div>
                    <h3 className="text-2xl font-black mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Bold About */}
        {aboutSection && (
          <section className="py-20 px-6" style={{ backgroundColor: colors.secondary }}>
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="order-2 lg:order-1">
                  <h2 className="text-4xl md:text-5xl font-black mb-6" style={{ color: colors.primary }}>
                    WHY CHOOSE US?
                  </h2>
                  <p className="text-xl text-gray-600 mb-8">{aboutSection.content || config.about}</p>
                  <div className="space-y-4">
                    {["Expert Craftsmen", "Fair Pricing", "Fast Service", "Guaranteed Work"].map((item, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 bg-white p-4 rounded-xl transform hover:translate-x-2 transition-transform"
                      >
                        <CheckCircle className="w-8 h-8" style={{ color: colors.primary }} />
                        <span className="text-xl font-bold">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                {config.images?.about && (
                  <div className="order-1 lg:order-2">
                    <div
                      className="aspect-square rounded-3xl bg-cover bg-center transform rotate-3 hover:rotate-0 transition-transform shadow-2xl"
                      style={{ backgroundImage: `url(${config.images.about})` }}
                    />
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Bold Testimonials */}
        {testimonialsSection && (
          <section className="py-20 px-6 bg-white">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-4xl md:text-5xl font-black text-center mb-16" style={{ color: colors.primary }}>
                HAPPY CUSTOMERS
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {testimonialsSection.items?.map((item, i) => (
                  <div
                    key={i}
                    className="p-8 rounded-2xl transform hover:-rotate-2 transition-transform"
                    style={{ backgroundColor: colors.primary }}
                  >
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white text-lg mb-4">&ldquo;{item.description}&rdquo;</p>
                    <p className="font-black text-white/80">— {item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quote Generator */}
        <QuoteGenerator
          trade={data.slug}
          businessName={config.businessName}
          location={config.location}
          phone={config.phone}
          primaryColor={colors.primary}
          accentColor={colors.accent}
        />

        {/* Bold CTA */}
        <section className="py-20 px-6 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-black mb-6">READY?</h2>
            <p className="text-2xl text-gray-400 mb-10">Let&apos;s get your project started today</p>
            <a
              href={`tel:${config.phone}`}
              className="inline-block px-12 py-6 rounded-2xl font-black text-2xl transform hover:-rotate-2 transition-transform"
              style={{ backgroundColor: colors.primary }}
            >
              CALL {config.phone}
            </a>
          </div>
        </section>
      </main>

      <footer className="py-10 px-6 bg-black text-white">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-gray-400">
              &copy; {new Date().getFullYear()} {config.businessName}
            </p>
            <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              TradeVista
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

// ===========================================
// SHARED COMPONENTS
// ===========================================

function Footer({ config }: { config: DemoData["config"] }) {
  return (
    <footer className="py-10 px-6 bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-gray-400">
            &copy; {new Date().getFullYear()} {config.businessName}. {config.location}.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-gray-500">Demo site powered by</span>
            <Link href="/" className="flex items-center gap-2 text-white hover:text-blue-400">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-sm">T</span>
              </div>
              TradeVista
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

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
