import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import LogoGenerator from "@/components/logo/LogoGenerator";
import Link from "next/link";
import { Sparkles, Zap, Download, Palette, ArrowRight } from "lucide-react";

const examples = [
  {
    name: "Smith Plumbing",
    trade: "Plumber",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#0ea5e9"/><path d="M50 30 L50 50 L30 50 L30 70 L70 70 L70 50 L50 50" stroke="white" stroke-width="4" fill="none"/><circle cx="50" cy="25" r="8" fill="white"/></svg>`,
  },
  {
    name: "Spark Electric",
    trade: "Electrician",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#f59e0b"/><path d="M55 20 L45 45 L55 45 L45 80" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`,
  },
  {
    name: "Green Thumb",
    trade: "Landscaper",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#22c55e"/><circle cx="50" cy="55" r="20" fill="white"/><path d="M50 35 L50 20 M40 25 L50 35 L60 25" stroke="#22c55e" stroke-width="3" fill="none"/></svg>`,
  },
  {
    name: "SecureLock",
    trade: "Locksmith",
    svg: `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><circle cx="50" cy="50" r="45" fill="#1e293b"/><circle cx="50" cy="45" r="18" stroke="white" stroke-width="3" fill="none"/><rect x="46" y="58" width="8" height="20" fill="white" rx="2"/></svg>`,
  },
];

const features = [
  {
    icon: Sparkles,
    title: "AI-Powered Design",
    description: "Describe your business and our AI creates unique, professional logos tailored to your trade.",
  },
  {
    icon: Zap,
    title: "Instant Results",
    description: "Get 4 logo options in seconds, not days. No waiting for designers or expensive agencies.",
  },
  {
    icon: Download,
    title: "Download Ready",
    description: "Download as SVG (vector) or PNG. Perfect for websites, business cards, van signs, and more.",
  },
  {
    icon: Palette,
    title: "Customizable",
    description: "Adjust colors to match your brand. Every logo works in full color or single color.",
  },
];

export default function LogoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-100 text-purple-700 font-medium text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            AI-Powered Logo Generator
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Create your
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent"> professional logo</span>
            <br />in seconds
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            No design skills needed. Just enter your business name and trade - our AI does the rest.
            Free to try, instant download.
          </p>
        </div>
      </section>

      {/* Logo Generator */}
      <section className="pb-20 px-4">
        <div className="max-w-2xl mx-auto">
          <LogoGenerator />
        </div>
      </section>

      {/* Example Logos */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Logos created by our AI
            </h2>
            <p className="text-gray-600">Real examples generated in seconds</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {examples.map((example) => (
              <div key={example.name} className="text-center">
                <div
                  className="w-24 h-24 mx-auto mb-3"
                  dangerouslySetInnerHTML={{ __html: example.svg }}
                />
                <p className="font-medium text-gray-900">{example.name}</p>
                <p className="text-sm text-gray-500">{example.trade}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why use our logo generator?
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-7 h-7 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600 to-pink-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to build your complete online presence?
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            Get a logo, website, booking system, and more - all powered by AI
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Build Your Free Site
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
