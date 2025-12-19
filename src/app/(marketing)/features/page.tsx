import Link from "next/link";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import {
  Sparkles,
  Globe,
  Calendar,
  Mail,
  FileText,
  Star,
  MessageSquare,
  BarChart3,
  Smartphone,
  Search,
  Shield,
  Zap,
  Check,
} from "lucide-react";

const mainFeatures = [
  {
    icon: Sparkles,
    title: "AI-Powered Website Builder",
    description:
      "Just describe what you want in plain English. Our AI understands requests like 'add a gallery of my bathroom work' or 'make the header blue' and makes it happen instantly.",
    highlights: [
      "No coding or design skills needed",
      "Natural language commands",
      "Instant updates and changes",
      "Trade-specific templates",
    ],
  },
  {
    icon: FileText,
    title: "AI Quote Generator",
    description:
      "Let customers describe their job and get an instant, professional quote. Uses AI to understand the work and generate accurate pricing based on your rates.",
    highlights: [
      "Instant quotes for customers",
      "Customised to your pricing",
      "Professional PDF quotes",
      "Track and follow up",
    ],
  },
  {
    icon: Calendar,
    title: "Online Booking System",
    description:
      "Customers can book appointments directly from your website. No more phone tag - they pick a slot, you get notified. Syncs with your calendar.",
    highlights: [
      "24/7 booking availability",
      "Automatic reminders",
      "Calendar sync",
      "Deposit collection",
    ],
  },
  {
    icon: Globe,
    title: "Custom Domain",
    description:
      "Get a professional yourname.co.uk domain or transfer your existing one. We handle all the technical DNS setup - you just pick the name.",
    highlights: [
      "Free subdomain included",
      ".co.uk or .com domains",
      "SSL security included",
      "Email forwarding",
    ],
  },
  {
    icon: Mail,
    title: "Professional Email",
    description:
      "Get info@yourbusiness.co.uk - look professional and keep work separate from personal. Full inbox with mobile apps.",
    highlights: [
      "Unlimited aliases",
      "Mobile & desktop apps",
      "Spam protection",
      "Calendar integration",
    ],
  },
  {
    icon: Star,
    title: "Review Collection",
    description:
      "Automatically ask happy customers for Google reviews after completing a job. Build your reputation on autopilot.",
    highlights: [
      "Automated review requests",
      "Google Business integration",
      "Display reviews on site",
      "Track your rating",
    ],
  },
];

const additionalFeatures = [
  {
    icon: MessageSquare,
    title: "Live Chat Widget",
    description: "Let customers message you directly from your website. Never miss an enquiry.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "See how many people visit your site, where they come from, and what they click.",
  },
  {
    icon: Smartphone,
    title: "Mobile Optimised",
    description: "Your site looks perfect on phones, tablets, and desktops. Most customers will find you on mobile.",
  },
  {
    icon: Search,
    title: "SEO Built-In",
    description: "Optimised for Google from day one. Get found when people search for your services locally.",
  },
  {
    icon: Shield,
    title: "GDPR Compliant",
    description: "Cookie notices, privacy policy, and data handling all sorted. Stay compliant without the headache.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Sites load in under 2 seconds. Fast sites rank better on Google and convert more visitors.",
  },
];

export default function FeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Everything you need to
            <span className="text-blue-600"> grow your trade business</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Professional website, online booking, quote system, and more - all powered by AI
            and designed specifically for UK tradespeople.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-blue-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-blue-700 transition-colors"
            >
              Start Building Free
            </Link>
            <Link
              href="/demo"
              className="bg-white text-gray-900 px-8 py-4 rounded-full font-semibold text-lg border border-gray-200 hover:border-gray-300 transition-colors"
            >
              See Demo Sites
            </Link>
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Powerful features, simple to use
            </h2>
            <p className="text-xl text-gray-600">
              Built for tradespeople who want results, not complexity
            </p>
          </div>

          <div className="space-y-24">
            {mainFeatures.map((feature, i) => (
              <div
                key={feature.title}
                className={`grid lg:grid-cols-2 gap-12 items-center ${
                  i % 2 === 1 ? "lg:flex-row-reverse" : ""
                }`}
              >
                <div className={i % 2 === 1 ? "lg:order-2" : ""}>
                  <div
                    className="w-14 h-14 rounded-2xl bg-blue-100 flex items-center justify-center mb-6"
                  >
                    <feature.icon className="w-7 h-7 text-blue-600" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-6">{feature.description}</p>
                  <ul className="space-y-3">
                    {feature.highlights.map((highlight) => (
                      <li key={highlight} className="flex items-center gap-3">
                        <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-green-600" />
                        </div>
                        <span className="text-gray-700">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className={`${i % 2 === 1 ? "lg:order-1" : ""}`}>
                  <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center">
                    <feature.icon className="w-24 h-24 text-gray-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Grid */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              And much more...
            </h2>
            <p className="text-xl text-gray-600">
              Everything&apos;s included - no extra fees or add-ons
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {additionalFeatures.map((feature) => (
              <div key={feature.title} className="bg-white p-6 rounded-xl shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              TradeVista vs the alternatives
            </h2>
            <p className="text-xl text-gray-600">
              Why tradespeople choose us over generic website builders
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-gray-600 font-medium">Feature</th>
                  <th className="px-6 py-4 text-center text-blue-600 font-bold">TradeVista</th>
                  <th className="px-6 py-4 text-center text-gray-400 font-medium">Others</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  "Built for UK trades",
                  "AI-powered editing",
                  "AI quote generator",
                  "Trade-specific templates",
                  "Online booking included",
                  "Review automation",
                  "No coding required",
                  "UK-based support",
                ].map((feature) => (
                  <tr key={feature}>
                    <td className="px-6 py-4 text-gray-700">{feature}</td>
                    <td className="px-6 py-4 text-center">
                      <Check className="w-5 h-5 text-green-500 mx-auto" />
                    </td>
                    <td className="px-6 py-4 text-center text-gray-300">-</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to grow your business?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join hundreds of tradespeople who&apos;ve upgraded their online presence
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Build Your Free Site
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            Free to build. Only pay when you go live.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
