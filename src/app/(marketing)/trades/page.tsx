import { Metadata } from "next";
import Link from "next/link";
import {
  Wrench,
  Lightbulb,
  HardHat,
  Paintbrush,
  Hammer,
  Thermometer,
  Car,
  Scissors,
  Home,
  ArrowRight,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Websites for Trades | TradeVista",
  description:
    "Professional AI-built websites for plumbers, electricians, builders, and all trades. Get your website in 5 minutes.",
};

const trades = [
  {
    slug: "plumber",
    name: "Plumbers",
    icon: <Wrench className="w-8 h-8" />,
    description: "Emergency callouts, Gas Safe display, booking systems",
    color: "bg-blue-600",
  },
  {
    slug: "electrician",
    name: "Electricians",
    icon: <Lightbulb className="w-8 h-8" />,
    description: "NICEIC badges, commercial & domestic, certification display",
    color: "bg-yellow-500",
  },
  {
    slug: "builder",
    name: "Builders",
    icon: <HardHat className="w-8 h-8" />,
    description: "Project portfolios, before/after galleries, quote systems",
    color: "bg-orange-600",
  },
  {
    slug: "painter",
    name: "Painters & Decorators",
    icon: <Paintbrush className="w-8 h-8" />,
    description: "Colour consultations, transformation galleries, quotes",
    color: "bg-pink-600",
  },
  {
    slug: "carpenter",
    name: "Carpenters",
    icon: <Hammer className="w-8 h-8" />,
    description: "Bespoke furniture showcases, commission requests",
    color: "bg-amber-600",
  },
  {
    slug: "heating-engineer",
    name: "Heating Engineers",
    icon: <Thermometer className="w-8 h-8" />,
    description: "Gas Safe display, boiler servicing, emergency callouts",
    color: "bg-red-600",
  },
  {
    slug: "mechanic",
    name: "Mechanics",
    icon: <Car className="w-8 h-8" />,
    description: "MOT booking, service scheduling, speciality showcases",
    color: "bg-slate-600",
  },
  {
    slug: "gardener",
    name: "Gardeners",
    icon: <Home className="w-8 h-8" />,
    description: "Garden galleries, maintenance contracts, seasonal services",
    color: "bg-green-600",
  },
  {
    slug: "hairdresser",
    name: "Hairdressers",
    icon: <Scissors className="w-8 h-8" />,
    description: "Online booking, style galleries, service menus",
    color: "bg-purple-600",
  },
];

export default function TradesPage() {
  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero */}
      <section className="py-20 lg:py-32">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Professional Websites for Every Trade
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-12">
            Our AI builds websites specifically designed for tradespeople.
            Choose your trade below to see features tailored just for you.
          </p>
        </div>
      </section>

      {/* Trades Grid */}
      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {trades.map((trade) => (
              <Link
                key={trade.slug}
                href={`/trades/${trade.slug}`}
                className="group bg-gray-800 rounded-xl p-6 border border-gray-700 hover:border-gray-600 transition-all hover:-translate-y-1"
              >
                <div
                  className={`w-16 h-16 ${trade.color} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}
                >
                  {trade.icon}
                </div>
                <h2 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
                  {trade.name}
                </h2>
                <p className="text-gray-400 text-sm mb-4">{trade.description}</p>
                <span className="inline-flex items-center gap-2 text-blue-400 text-sm font-medium group-hover:gap-3 transition-all">
                  Learn more
                  <ArrowRight className="w-4 h-4" />
                </span>
              </Link>
            ))}
          </div>

          {/* Other Trades */}
          <div className="mt-12 text-center">
            <p className="text-gray-400 mb-4">
              Don&apos;t see your trade? TradeVista works for any service business.
            </p>
            <Link
              href="/signup"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors"
            >
              Build Your Website
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Trades Choose Us */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white mb-4">
              Why Tradespeople Love TradeVista
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              We understand that tradespeople are busy doing the actual work.
              That&apos;s why we&apos;ve made getting online as simple as possible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Built in 5 Minutes",
                description:
                  "No technical skills needed. Just answer a few questions and our AI builds your site.",
              },
              {
                title: "Trade-Specific Features",
                description:
                  "Certification badges, booking systems, galleries - everything your trade needs.",
              },
              {
                title: "£25/Month All-In",
                description:
                  "Hosting, domain, security, support - one simple price with no hidden fees.",
              },
            ].map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 text-white font-bold text-xl">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Get More Customers?
          </h2>
          <p className="text-gray-400 text-lg mb-8">
            Join hundreds of tradespeople who&apos;ve grown their business with a professional website.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors"
          >
            Start Your Free Trial
            <ArrowRight className="w-5 h-5" />
          </Link>
          <p className="text-gray-500 text-sm mt-4">
            No credit card required. Build your site in 5 minutes.
          </p>
        </div>
      </section>
    </div>
  );
}
