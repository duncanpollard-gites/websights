import Link from "next/link";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { Target, Heart, Zap, Users, MapPin, Clock } from "lucide-react";

const stats = [
  { number: "500+", label: "Tradespeople" },
  { number: "15", label: "Trade Categories" },
  { number: "99.9%", label: "Uptime" },
  { number: "UK", label: "Based & Hosted" },
];

const values = [
  {
    icon: Target,
    title: "Built for Tradespeople",
    description:
      "We're not a generic website builder. Every feature is designed specifically for plumbers, electricians, builders, and other UK trades. We understand your business.",
  },
  {
    icon: Heart,
    title: "Honest & Transparent",
    description:
      "No hidden fees, no complicated pricing tiers, no bait-and-switch tactics. What you see is what you get. We believe in earning trust through transparency.",
  },
  {
    icon: Zap,
    title: "Keep It Simple",
    description:
      "You're busy running a business. You don't have time to learn complicated software. That's why everything works with plain English commands and intuitive design.",
  },
  {
    icon: Users,
    title: "Real Support",
    description:
      "When you need help, you'll talk to a real person who understands your trade. Not a chatbot, not a call centre abroad. UK-based support from people who get it.",
  },
];

const team = [
  {
    name: "The Vision",
    role: "Why We Built This",
    description:
      "We saw talented tradespeople losing work to competitors with flashy websites, while their own online presence was a Facebook page or outdated site. That's not right. Great work deserves great visibility.",
  },
  {
    name: "The Technology",
    role: "AI That Actually Helps",
    description:
      "We use the latest AI to make website building feel like having a conversation. Tell us what you want, and we make it happen. No jargon, no technical knowledge needed.",
  },
  {
    name: "The Future",
    role: "Where We're Going",
    description:
      "We're building the complete toolkit for trade businesses - from website to booking to quotes to reviews. Everything you need to compete with the big players, at a price that makes sense.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Helping tradespeople
            <span className="text-blue-600"> win more work</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            We&apos;re on a mission to give every skilled tradesperson the professional online
            presence they deserve - without the complexity or cost.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 px-4 border-b border-gray-100">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl font-bold text-blue-600">{stat.number}</p>
                <p className="text-gray-600 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The problem we&apos;re solving
              </h2>
              <div className="space-y-4 text-gray-600 text-lg">
                <p>
                  You&apos;re brilliant at your trade. You&apos;ve spent years perfecting your craft.
                  But when it comes to getting found online? That&apos;s another story.
                </p>
                <p>
                  Traditional web designers charge thousands and take weeks. DIY website
                  builders are confusing and generic. Social media only gets you so far.
                </p>
                <p>
                  <strong className="text-gray-900">
                    Meanwhile, competitors with inferior skills but better websites are winning
                    the jobs you deserve.
                  </strong>
                </p>
                <p>
                  We built TradeVista to fix this. A professional website in minutes, not weeks.
                  Features designed for trades. Prices that make sense. Technology that just works.
                </p>
              </div>
            </div>
            <div className="bg-gray-100 rounded-2xl aspect-square flex items-center justify-center">
              <div className="text-center p-8">
                <div className="text-6xl mb-4">🔧</div>
                <p className="text-gray-500">Great work deserves great visibility</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">What we believe</h2>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {values.map((value) => (
              <div key={value.title} className="bg-white rounded-xl p-8 shadow-sm">
                <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our story</h2>
            <p className="text-xl text-gray-600">From idea to reality</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((item, i) => (
              <div key={item.name} className="relative">
                <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
                  {i + 1}
                </div>
                <div className="pl-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{item.name}</h3>
                  <p className="text-blue-600 text-sm mb-3">{item.role}</p>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* UK Based */}
      <section className="py-20 px-4 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Proudly UK based
              </h2>
              <div className="space-y-4 text-blue-100 text-lg">
                <p>
                  TradeVista is built, hosted, and supported entirely in the United Kingdom.
                </p>
                <p>
                  Your data stays in the UK. Your support calls go to the UK. Your website
                  loads fast for your UK customers.
                </p>
                <p>
                  We understand UK trades, UK regulations, UK customers. Because we&apos;re one of you.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <MapPin className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">UK Hosted</p>
                <p className="text-sm text-blue-200">Fast loading times</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <Users className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">UK Support</p>
                <p className="text-sm text-blue-200">Real people who get it</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <Clock className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">UK Hours</p>
                <p className="text-sm text-blue-200">When you need us</p>
              </div>
              <div className="bg-white/10 rounded-xl p-6 text-center">
                <Heart className="w-8 h-8 mx-auto mb-2" />
                <p className="font-semibold">UK Focused</p>
                <p className="text-sm text-blue-200">Built for your market</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Ready to join us?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Start building your professional website today
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
        </div>
      </section>

      <Footer />
    </div>
  );
}
