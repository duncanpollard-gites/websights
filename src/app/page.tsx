import Link from "next/link";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import FounderBanner from "@/components/marketing/FounderBanner";

const trades = [
  { name: "Plumbers", slug: "plumber", icon: "🔧" },
  { name: "Electricians", slug: "electrician", icon: "⚡" },
  { name: "Builders", slug: "builder", icon: "🏗️" },
  { name: "Roofers", slug: "roofer", icon: "🏠" },
  { name: "Painters", slug: "painter", icon: "🎨" },
  { name: "Landscapers", slug: "landscaper", icon: "🌳" },
];

const features = [
  {
    title: "AI-Powered Builder",
    description: "Just tell us what you want in plain English. \"Add a gallery of my bathroom installations\" - done.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
  },
  {
    title: "Online Booking",
    description: "Let customers book appointments directly. No more phone tag - they pick a slot, you get notified.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Custom Domain",
    description: "Get yourname.co.uk or transfer your existing domain. We handle all the technical stuff.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
  {
    title: "Professional Email",
    description: "Get info@yourbusiness.co.uk - look professional and keep work separate from personal.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    title: "Quote System",
    description: "Create and send professional quotes in seconds. Track which ones convert to jobs.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Review Collection",
    description: "Automatically ask happy customers for Google reviews. Build your reputation on autopilot.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
  },
];

const steps = [
  {
    number: "1",
    title: "Tell us about your business",
    description: "Answer a few quick questions - your trade, location, services. Takes 2 minutes.",
  },
  {
    number: "2",
    title: "AI builds your site",
    description: "Our AI creates a professional website tailored to your trade, complete with content and images.",
  },
  {
    number: "3",
    title: "Customise with plain English",
    description: "\"Make the header blue\" or \"Add a testimonials section\" - just type what you want.",
  },
  {
    number: "4",
    title: "Go live",
    description: "When you're happy, connect your domain and start getting customers. Simple.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      <FounderBanner />
      <Header />

      {/* Hero Section */}
      <section className="hero-gradient pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            A professional website for your
            <span className="gradient-text"> trade business</span>
            <br />in minutes, not weeks
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            AI-powered website builder designed for tradespeople. No tech skills needed.
            Just tell us what you want in plain English.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Build Your Free Site
            </Link>
            <Link
              href="/demo"
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              See Demo Sites
            </Link>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            Free to build. Only pay when you go live.
          </p>
        </div>

        {/* Browser mockup placeholder */}
        <div className="max-w-5xl mx-auto mt-16 px-4">
          <div className="bg-white rounded-xl shadow-2xl overflow-hidden border border-gray-200">
            <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white rounded px-3 py-1 text-sm text-gray-500 text-center">
                  smithplumbing.co.uk
                </div>
              </div>
            </div>
            <div className="aspect-video bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
              <p className="text-gray-400 text-lg">Site preview demo</p>
            </div>
          </div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Built for your trade
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Industry-specific features and templates. We know what your customers are looking for.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {trades.map((trade) => (
              <Link
                key={trade.slug}
                href={`/demo/${trade.slug}`}
                className="bg-gray-50 hover:bg-blue-50 rounded-xl p-6 text-center transition-colors group"
              >
                <span className="text-4xl mb-3 block">{trade.icon}</span>
                <span className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                  {trade.name}
                </span>
              </Link>
            ))}
          </div>
          <div className="text-center mt-8">
            <Link
              href="/demo"
              className="text-blue-600 font-medium hover:text-blue-700"
            >
              View all 15 trade demos →
            </Link>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            How it works
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-16">
            From zero to live website in four simple steps
          </p>
          <div className="grid md:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg mb-4">
                  {step.number}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-gray-600">{step.description}</p>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-5 left-14 w-full h-0.5 bg-blue-200" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-4">
            Everything you need to grow
          </h2>
          <p className="text-xl text-gray-600 text-center max-w-2xl mx-auto mb-16">
            Not just a website - a complete toolkit for your trade business
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Simple, honest pricing
          </h2>
          <p className="text-xl text-gray-600 mb-12">
            Build for free. Only pay £25/month when you're ready to go live.
          </p>
          <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
            <div className="flex items-baseline justify-center gap-2 mb-4">
              <span className="text-5xl font-bold text-gray-900">£25</span>
              <span className="text-xl text-gray-500">/month</span>
            </div>
            <p className="text-gray-600 mb-8">Everything you need, no hidden fees</p>
            <ul className="text-left max-w-md mx-auto space-y-3 mb-8">
              {[
                "Custom domain (yourname.co.uk)",
                "Professional email address",
                "AI website builder",
                "Online booking system",
                "SSL security included",
                "Unlimited edits",
                "UK-based support",
              ].map((item, index) => (
                <li key={index} className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-green-500 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/signup"
              className="inline-block bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Start Building Free
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to get more customers?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of tradespeople who've built their online presence with TradeVista.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Build Your Free Website
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
