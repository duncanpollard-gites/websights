import Link from "next/link";
import Header from "@/components/marketing/Header";
import Footer from "@/components/marketing/Footer";
import { Check, X, Sparkles, HelpCircle } from "lucide-react";

const plans = [
  {
    name: "Free",
    description: "Perfect for getting started",
    price: "0",
    period: "forever",
    features: [
      { text: "AI-powered website builder", included: true },
      { text: "TradeVista subdomain", included: true },
      { text: "Mobile-responsive design", included: true },
      { text: "Basic SEO", included: true },
      { text: "SSL security", included: true },
      { text: "TradeVista branding", included: true, note: "Powered by TradeVista badge" },
      { text: "Custom domain", included: false },
      { text: "Professional email", included: false },
      { text: "AI quote generator", included: false },
      { text: "Online booking", included: false },
      { text: "Review automation", included: false },
    ],
    cta: "Start Free",
    ctaLink: "/signup",
    popular: false,
  },
  {
    name: "Pro",
    description: "Everything you need to grow",
    price: "29",
    period: "/month",
    features: [
      { text: "Everything in Free, plus:", included: true, bold: true },
      { text: "Custom .co.uk domain", included: true },
      { text: "Professional email address", included: true },
      { text: "AI quote generator", included: true },
      { text: "Online booking system", included: true },
      { text: "Review collection & automation", included: true },
      { text: "Advanced SEO tools", included: true },
      { text: "Analytics dashboard", included: true },
      { text: "Live chat widget", included: true },
      { text: "No TradeVista branding", included: true },
      { text: "Priority support", included: true },
    ],
    cta: "Start 14-Day Free Trial",
    ctaLink: "/signup?plan=pro",
    popular: true,
  },
  {
    name: "Enterprise",
    description: "For larger businesses",
    price: "Custom",
    period: "",
    features: [
      { text: "Everything in Pro, plus:", included: true, bold: true },
      { text: "Multiple team members", included: true },
      { text: "Multi-location support", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Phone support", included: true },
      { text: "Custom training", included: true },
      { text: "SLA guarantee", included: true },
    ],
    cta: "Contact Us",
    ctaLink: "/contact",
    popular: false,
  },
];

const faqs = [
  {
    question: "Is there really a free plan?",
    answer:
      "Yes! You can build and publish your website for free with a tradevista.co.uk subdomain. The free plan includes our AI builder and a professional-looking site. Upgrade to Pro when you want your own domain and advanced features.",
  },
  {
    question: "Can I try Pro before paying?",
    answer:
      "Absolutely. Pro comes with a 14-day free trial. No credit card required to start. If you decide it's not for you, just stay on the free plan - no hard feelings.",
  },
  {
    question: "What happens to my site if I cancel Pro?",
    answer:
      "Your site stays online on the free plan. You'll keep your content but lose Pro features like your custom domain and booking system. You can always upgrade again later.",
  },
  {
    question: "Are there any hidden fees?",
    answer:
      "None at all. The price you see is the price you pay. Domain registration is included in Pro, and there are no setup fees, transaction fees, or surprise charges.",
  },
  {
    question: "Do you offer discounts for annual billing?",
    answer:
      "Yes! Pay annually and get 2 months free - that's £290/year instead of £348. You can switch to annual billing anytime from your dashboard.",
  },
  {
    question: "Can I change plans later?",
    answer:
      "You can upgrade or downgrade anytime. If you upgrade mid-cycle, you'll be credited for the unused portion. Downgrades take effect at the end of your billing period.",
  },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            Simple, honest pricing
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Start free, upgrade when you&apos;re ready. No hidden fees, no surprises.
          </p>
        </div>
      </section>

      {/* Founder Special Banner */}
      <section className="px-4 -mt-4 mb-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-center text-white">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-bold text-lg">Founder Special</span>
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-lg">
              Be one of the first 100 to sign up and get <strong>1 year of Pro FREE</strong>
            </p>
            <p className="text-amber-100 text-sm mt-1">Limited spots remaining</p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div
                key={plan.name}
                className={`relative bg-white rounded-2xl p-8 ${
                  plan.popular
                    ? "ring-2 ring-blue-600 shadow-xl scale-105"
                    : "border border-gray-200 shadow-sm"
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <span className="bg-blue-600 text-white text-sm font-medium px-4 py-1 rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-500 mb-4">{plan.description}</p>
                  <div className="flex items-baseline justify-center gap-1">
                    {plan.price !== "Custom" && <span className="text-2xl text-gray-500">£</span>}
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`${
                          feature.included ? "text-gray-700" : "text-gray-400"
                        } ${"bold" in feature && feature.bold ? "font-semibold" : ""}`}
                      >
                        {feature.text}
                        {"note" in feature && feature.note && (
                          <span className="text-sm text-gray-400 block">{feature.note}</span>
                        )}
                      </span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.ctaLink}
                  className={`block w-full py-3 rounded-full font-semibold text-center transition-colors ${
                    plan.popular
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What's Included */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">All plans include</h2>
          <p className="text-gray-600 mb-12">The essentials you need to look professional online</p>
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
            {[
              "AI website builder",
              "Mobile-responsive",
              "SSL security",
              "UK hosting",
              "Basic SEO",
              "Contact form",
              "Social links",
              "Unlimited edits",
            ].map((item) => (
              <div key={item} className="bg-white rounded-xl p-4 shadow-sm">
                <Check className="w-5 h-5 text-green-500 mx-auto mb-2" />
                <p className="text-gray-700 text-sm">{item}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently asked questions</h2>
            <p className="text-gray-600">Got questions? We&apos;ve got answers.</p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-6">
                <div className="flex items-start gap-4">
                  <HelpCircle className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-blue-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Start building your site today
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Free to start. No credit card required.
          </p>
          <Link
            href="/signup"
            className="inline-block bg-white text-blue-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Get Started Free
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
