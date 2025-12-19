import { Metadata } from "next";
import Link from "next/link";
import {
  Check,
  Zap,
  Clock,
  Smartphone,
  Globe,
  MessageSquare,
  Star,
  ArrowRight,
  Wrench,
  Lightbulb,
  HardHat,
  Paintbrush,
  Hammer,
  Thermometer,
  Car,
  Scissors,
  Home,
} from "lucide-react";

// Trade-specific content
const tradeData: Record<
  string,
  {
    name: string;
    plural: string;
    icon: React.ReactNode;
    headline: string;
    subheadline: string;
    painPoints: string[];
    benefits: string[];
    features: string[];
    testimonial: {
      quote: string;
      name: string;
      business: string;
      location: string;
    };
    stats: { label: string; value: string }[];
    color: string;
  }
> = {
  plumber: {
    name: "Plumber",
    plural: "Plumbers",
    icon: <Wrench className="w-8 h-8" />,
    headline: "Get More Plumbing Jobs Without the Hassle",
    subheadline:
      "Professional websites for plumbers that bring in customers while you fix leaks",
    painPoints: [
      "Tired of relying on word-of-mouth alone?",
      "Losing jobs to competitors with better online presence?",
      "No time to build and maintain a website?",
      "Paying too much for web agencies that don't understand trades?",
    ],
    benefits: [
      "24/7 online presence that works while you sleep",
      "Professional look that builds trust instantly",
      "Easy booking system for emergency callouts",
      "Show off your Gas Safe registration",
    ],
    features: [
      "Emergency callout button with click-to-call",
      "Service area map for local SEO",
      "Customer reviews and testimonials",
      "Before & after photo gallery",
      "Online quote request forms",
      "Gas Safe & certification badges",
    ],
    testimonial: {
      quote:
        "I was sceptical at first, but within a month I had 3 new regular customers from my website. The AI built it in minutes and it looks proper professional.",
      name: "Dave Thompson",
      business: "Thompson Plumbing Services",
      location: "Manchester",
    },
    stats: [
      { label: "Average new enquiries/month", value: "12" },
      { label: "Time to build your site", value: "5 min" },
      { label: "Cost per day", value: "83p" },
    ],
    color: "blue",
  },
  electrician: {
    name: "Electrician",
    plural: "Electricians",
    icon: <Lightbulb className="w-8 h-8" />,
    headline: "Power Up Your Electrical Business Online",
    subheadline:
      "Professional websites for electricians that generate leads while you're on the job",
    painPoints: [
      "Customers checking online before they call?",
      "Losing commercial contracts to competitors?",
      "NICEIC certification but no way to show it off?",
      "Spending evenings doing admin instead of earning?",
    ],
    benefits: [
      "Showcase your certifications prominently",
      "Attract commercial and domestic clients",
      "Professional portfolio of completed work",
      "Automated enquiry handling",
    ],
    features: [
      "NICEIC/NAPIT badge display",
      "Commercial & domestic service pages",
      "Electrical inspection booking",
      "Certificate gallery",
      "Emergency callout feature",
      "PAT testing scheduling",
    ],
    testimonial: {
      quote:
        "Since getting my TradeVista page, I've landed two commercial contracts. The site shows off my NICEIC registration and portfolio - clients love it.",
      name: "James Wilson",
      business: "JW Electrical Solutions",
      location: "Leeds",
    },
    stats: [
      { label: "Average new enquiries/month", value: "15" },
      { label: "Time to build your site", value: "5 min" },
      { label: "Cost per day", value: "83p" },
    ],
    color: "yellow",
  },
  builder: {
    name: "Builder",
    plural: "Builders",
    icon: <HardHat className="w-8 h-8" />,
    headline: "Build Your Online Presence, Win More Projects",
    subheadline:
      "Professional websites for builders that showcase your craftsmanship and win contracts",
    painPoints: [
      "Struggling to show quality of your work?",
      "Losing quotes to flashy competitors?",
      "Want bigger projects but can't prove your track record?",
      "Customers want to see past work before committing?",
    ],
    benefits: [
      "Stunning project galleries that sell your work",
      "Build trust with testimonials and case studies",
      "Professional presence for commercial tenders",
      "Easy contact for project enquiries",
    ],
    features: [
      "Project portfolio with before/after",
      "Customer testimonial showcase",
      "Service area coverage map",
      "Insurance & certification display",
      "Project timeline examples",
      "Quote request system",
    ],
    testimonial: {
      quote:
        "My website paid for itself with one kitchen extension enquiry. Customers say they chose me because my site looked professional and trustworthy.",
      name: "Mike Roberts",
      business: "Roberts Building & Construction",
      location: "Birmingham",
    },
    stats: [
      { label: "Average project value increase", value: "40%" },
      { label: "Time to build your site", value: "5 min" },
      { label: "Cost per day", value: "83p" },
    ],
    color: "orange",
  },
  painter: {
    name: "Painter & Decorator",
    plural: "Painters & Decorators",
    icon: <Paintbrush className="w-8 h-8" />,
    headline: "Show Off Your Finish, Get More Decorating Jobs",
    subheadline:
      "Professional websites for painters that display your work beautifully",
    painPoints: [
      "Photos on your phone but nowhere to show them?",
      "Customers want to see examples before booking?",
      "Competing against bigger decorating firms?",
      "Need to stand out in a crowded market?",
    ],
    benefits: [
      "Beautiful galleries that showcase your finishes",
      "Colour scheme inspiration for customers",
      "Professional image that justifies your rates",
      "Easy booking for quotes and consultations",
    ],
    features: [
      "Photo gallery with room categories",
      "Colour consultation booking",
      "Before & after transformations",
      "Customer review showcase",
      "Service area display",
      "Quick quote calculator",
    ],
    testimonial: {
      quote:
        "People always comment on how professional my website looks. It's helped me move from basic jobs to full house renovations.",
      name: "Sarah Collins",
      business: "Collins Decorating",
      location: "Bristol",
    },
    stats: [
      { label: "Average new enquiries/month", value: "10" },
      { label: "Time to build your site", value: "5 min" },
      { label: "Cost per day", value: "83p" },
    ],
    color: "pink",
  },
  carpenter: {
    name: "Carpenter",
    plural: "Carpenters",
    icon: <Hammer className="w-8 h-8" />,
    headline: "Craft Your Online Presence Like Your Woodwork",
    subheadline: "Professional websites for carpenters that showcase your craftsmanship",
    painPoints: [
      "Beautiful work but no way to display it online?",
      "Customers can't appreciate the quality in photos?",
      "Losing bespoke jobs to competitors with websites?",
      "Word of mouth not bringing enough work?",
    ],
    benefits: [
      "Gallery that does justice to your craftsmanship",
      "Attract high-value bespoke projects",
      "Build reputation as a skilled artisan",
      "Commission enquiries 24/7",
    ],
    features: [
      "Portfolio with detailed project shots",
      "Custom furniture gallery",
      "Material and finish showcase",
      "Commission request forms",
      "Testimonials from satisfied clients",
      "Workshop and process photos",
    ],
    testimonial: {
      quote:
        "My fitted furniture commissions have doubled since I got my website. Customers love seeing the detail shots of my joinery.",
      name: "Tom Edwards",
      business: "Edwards Bespoke Carpentry",
      location: "Oxford",
    },
    stats: [
      { label: "Average commission value", value: "£2,400" },
      { label: "Time to build your site", value: "5 min" },
      { label: "Cost per day", value: "83p" },
    ],
    color: "amber",
  },
  "heating-engineer": {
    name: "Heating Engineer",
    plural: "Heating Engineers",
    icon: <Thermometer className="w-8 h-8" />,
    headline: "Heat Up Your Business with More Boiler Jobs",
    subheadline:
      "Professional websites for heating engineers that generate year-round enquiries",
    painPoints: [
      "Busy in winter but quiet in summer?",
      "Customers shopping around for boiler quotes?",
      "Gas Safe registered but not showing it off?",
      "Want more maintenance contracts?",
    ],
    benefits: [
      "Year-round enquiries for servicing",
      "Prominent Gas Safe certification display",
      "Build recurring maintenance customer base",
      "Emergency callout booking system",
    ],
    features: [
      "Gas Safe registration display",
      "Boiler brand certifications",
      "Service plan information",
      "Emergency breakdown booking",
      "Annual service reminders",
      "Energy efficiency guides",
    ],
    testimonial: {
      quote:
        "I've built up 50 annual service customers through my website. The reminder system brings them back every year automatically.",
      name: "Paul Hughes",
      business: "Hughes Heating Services",
      location: "Sheffield",
    },
    stats: [
      { label: "Average annual service bookings", value: "50+" },
      { label: "Time to build your site", value: "5 min" },
      { label: "Cost per day", value: "83p" },
    ],
    color: "red",
  },
  mechanic: {
    name: "Mechanic",
    plural: "Mechanics",
    icon: <Car className="w-8 h-8" />,
    headline: "Rev Up Your Garage Business Online",
    subheadline:
      "Professional websites for mechanics and garages that bring customers through your doors",
    painPoints: [
      "Competing against main dealers?",
      "Customers don't know about your specialities?",
      "Reviews scattered across different sites?",
      "Want more MOT and service bookings?",
    ],
    benefits: [
      "Online booking for MOT and services",
      "Showcase your specialities and expertise",
      "Build trust with consolidated reviews",
      "Compete professionally with dealers",
    ],
    features: [
      "MOT and service booking calendar",
      "Speciality services showcase",
      "Customer review aggregation",
      "Parts and labour estimates",
      "Vehicle make expertise display",
      "Opening hours and contact",
    ],
    testimonial: {
      quote:
        "Online bookings have transformed my garage. I get MOT bookings while I'm under the bonnet now.",
      name: "Steve Morris",
      business: "Morris Motors",
      location: "Nottingham",
    },
    stats: [
      { label: "Average monthly MOT bookings", value: "25" },
      { label: "Time to build your site", value: "5 min" },
      { label: "Cost per day", value: "83p" },
    ],
    color: "slate",
  },
  gardener: {
    name: "Gardener",
    plural: "Gardeners",
    icon: <Home className="w-8 h-8" />,
    headline: "Grow Your Gardening Business Online",
    subheadline:
      "Professional websites for gardeners and landscapers that bloom with enquiries",
    painPoints: [
      "Seasonal work leaving gaps in your diary?",
      "Beautiful gardens but no way to show them?",
      "Want regular maintenance contracts?",
      "Competing against bigger landscaping firms?",
    ],
    benefits: [
      "Stunning garden transformation galleries",
      "Regular maintenance contract bookings",
      "Seasonal service promotions",
      "Build a loyal customer base",
    ],
    features: [
      "Garden transformation gallery",
      "Seasonal service packages",
      "Regular maintenance booking",
      "Plant care guides",
      "Before & after showcases",
      "Quote request for landscaping",
    ],
    testimonial: {
      quote:
        "My regular maintenance customers doubled after getting my website. The galleries really show off what I can do.",
      name: "Jenny Clark",
      business: "Clark's Garden Services",
      location: "Cambridge",
    },
    stats: [
      { label: "Regular maintenance customers", value: "35+" },
      { label: "Time to build your site", value: "5 min" },
      { label: "Cost per day", value: "83p" },
    ],
    color: "green",
  },
  hairdresser: {
    name: "Hairdresser",
    plural: "Hairdressers",
    icon: <Scissors className="w-8 h-8" />,
    headline: "Style Your Business Success Online",
    subheadline:
      "Professional websites for hairdressers and salons that fill your appointment book",
    painPoints: [
      "Clients booking with competitors online?",
      "Social media not converting to bookings?",
      "Want to show off your best work?",
      "Need a proper booking system?",
    ],
    benefits: [
      "Online appointment booking 24/7",
      "Portfolio that showcases your skills",
      "Service menu with clear pricing",
      "Fill quiet slots with promotions",
    ],
    features: [
      "Online booking integration",
      "Hair transformation gallery",
      "Service and pricing menu",
      "Stylist profiles",
      "Special offers section",
      "Customer review showcase",
    ],
    testimonial: {
      quote:
        "I get bookings at midnight now! Clients love being able to book without calling during my busy times.",
      name: "Lisa Turner",
      business: "Turner Hair Studio",
      location: "Liverpool",
    },
    stats: [
      { label: "Average online bookings/week", value: "20" },
      { label: "Time to build your site", value: "5 min" },
      { label: "Cost per day", value: "83p" },
    ],
    color: "purple",
  },
};

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ trade: string }>;
}): Promise<Metadata> {
  const { trade } = await params;
  const data = tradeData[trade];

  if (!data) {
    return {
      title: "Trade Website Builder | TradeVista",
    };
  }

  return {
    title: `Websites for ${data.plural} | TradeVista`,
    description: data.subheadline,
    openGraph: {
      title: `Professional Websites for ${data.plural}`,
      description: data.subheadline,
    },
  };
}

// Generate static params for all trades
export async function generateStaticParams() {
  return Object.keys(tradeData).map((trade) => ({
    trade,
  }));
}

export default async function TradeLandingPage({
  params,
}: {
  params: Promise<{ trade: string }>;
}) {
  const { trade } = await params;
  const data = tradeData[trade];

  if (!data) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Trade Not Found</h1>
          <Link
            href="/"
            className="text-blue-400 hover:text-blue-300"
          >
            Return to homepage
          </Link>
        </div>
      </div>
    );
  }

  const colorClasses: Record<string, { bg: string; text: string; border: string }> = {
    blue: { bg: "bg-blue-600", text: "text-blue-400", border: "border-blue-500" },
    yellow: { bg: "bg-yellow-500", text: "text-yellow-400", border: "border-yellow-500" },
    orange: { bg: "bg-orange-600", text: "text-orange-400", border: "border-orange-500" },
    pink: { bg: "bg-pink-600", text: "text-pink-400", border: "border-pink-500" },
    amber: { bg: "bg-amber-600", text: "text-amber-400", border: "border-amber-500" },
    red: { bg: "bg-red-600", text: "text-red-400", border: "border-red-500" },
    slate: { bg: "bg-slate-600", text: "text-slate-400", border: "border-slate-500" },
    green: { bg: "bg-green-600", text: "text-green-400", border: "border-green-500" },
    purple: { bg: "bg-purple-600", text: "text-purple-400", border: "border-purple-500" },
  };

  const colors = colorClasses[data.color] || colorClasses.blue;

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900" />
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div
                className={`inline-flex items-center gap-2 px-4 py-2 ${colors.bg} rounded-full text-white text-sm font-medium mb-6`}
              >
                {data.icon}
                <span>Built for {data.plural}</span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                {data.headline}
              </h1>

              <p className="text-xl text-gray-300 mb-8">{data.subheadline}</p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                {data.stats.map((stat, index) => (
                  <div key={index}>
                    <p className={`text-3xl font-bold ${colors.text}`}>
                      {stat.value}
                    </p>
                    <p className="text-sm text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className={`${colors.bg} text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity text-center flex items-center justify-center gap-2`}
                >
                  Build Your Site Free
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="#features"
                  className="bg-gray-800 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-700 transition-colors text-center"
                >
                  See Features
                </Link>
              </div>
            </div>

            {/* Pain Points Card */}
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">
                Sound familiar?
              </h3>
              <ul className="space-y-4">
                {data.painPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 pt-6 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  TradeVista solves all of this - in just 5 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-800">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Everything a {data.name} Needs Online
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Our AI builds your perfect website with all the features {data.plural.toLowerCase()} need to win more work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.features.map((feature, index) => (
              <div
                key={index}
                className="bg-gray-900 rounded-xl p-6 border border-gray-700"
              >
                <div
                  className={`w-12 h-12 ${colors.bg} rounded-xl flex items-center justify-center mb-4`}
                >
                  <Check className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">
                  {feature}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Your Website in 3 Simple Steps
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <MessageSquare className="w-8 h-8" />,
                title: "Tell Us About Your Business",
                description:
                  "Answer a few quick questions about your services, area, and style preferences.",
              },
              {
                icon: <Zap className="w-8 h-8" />,
                title: "AI Builds Your Site",
                description:
                  "Our AI creates a professional website tailored specifically for your trade.",
              },
              {
                icon: <Globe className="w-8 h-8" />,
                title: "Go Live & Get Customers",
                description:
                  "Publish instantly and start receiving enquiries from new customers.",
              },
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div
                  className={`w-16 h-16 ${colors.bg} rounded-2xl flex items-center justify-center mx-auto mb-6`}
                >
                  {step.icon}
                </div>
                <div className="text-sm text-gray-500 mb-2">
                  Step {index + 1}
                </div>
                <h3 className="text-xl font-semibold text-white mb-3">
                  {step.title}
                </h3>
                <p className="text-gray-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="py-20 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gray-900 rounded-2xl p-8 lg:p-12 border border-gray-700">
            <div className="flex gap-1 mb-6">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-6 h-6 ${colors.text} fill-current`}
                />
              ))}
            </div>
            <blockquote className="text-xl lg:text-2xl text-white mb-8 leading-relaxed">
              &ldquo;{data.testimonial.quote}&rdquo;
            </blockquote>
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                <span className="text-white font-bold text-lg">
                  {data.testimonial.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="font-semibold text-white">
                  {data.testimonial.name}
                </p>
                <p className="text-gray-400 text-sm">
                  {data.testimonial.business}, {data.testimonial.location}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
                Why {data.plural} Choose TradeVista
              </h2>
              <ul className="space-y-4">
                {data.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div
                      className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
                    >
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-gray-300 text-lg">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6">
                What You Get
              </h3>
              <ul className="space-y-4">
                {[
                  "Professional mobile-friendly website",
                  "Custom domain (yourname.co.uk)",
                  "Business email setup",
                  "Contact form with instant alerts",
                  "Google Maps integration",
                  "Social media links",
                  "SSL security certificate",
                  "Unlimited changes via chat",
                ].map((item, index) => (
                  <li key={index} className="flex items-center gap-3 text-gray-300">
                    <Check className={`w-5 h-5 ${colors.text}`} />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-8 pt-6 border-t border-gray-700">
                <div className="flex items-baseline gap-2 mb-4">
                  <span className="text-4xl font-bold text-white">£25</span>
                  <span className="text-gray-400">/month</span>
                </div>
                <p className="text-gray-500 text-sm mb-6">
                  No setup fees. Cancel anytime. 14-day free trial.
                </p>
                <Link
                  href="/signup"
                  className={`block w-full ${colors.bg} text-white py-4 rounded-xl font-semibold text-center hover:opacity-90 transition-opacity`}
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-20 ${colors.bg}`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Get More {data.name} Jobs?
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Join hundreds of {data.plural.toLowerCase()} growing their business with TradeVista.
            Build your professional website in 5 minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/signup"
              className="bg-white text-gray-900 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
            >
              Build My Free Website
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
          <p className="text-white/60 text-sm mt-6">
            No credit card required. Takes 5 minutes.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-white text-center mb-12">
            Common Questions from {data.plural}
          </h2>
          <div className="space-y-6">
            {[
              {
                q: "Do I need any technical skills?",
                a: "Not at all! Just chat with our AI about your business and it builds everything for you. If you can send a text message, you can build a website.",
              },
              {
                q: "Can I make changes after it's built?",
                a: "Yes! Just tell the AI what you want to change - like 'make the header blue' or 'add my new phone number' - and it updates instantly.",
              },
              {
                q: "What if I already have a website?",
                a: "We can help migrate your content or start fresh. Many tradespeople switch to TradeVista because it's simpler and more effective.",
              },
              {
                q: "Is the £25/month all-inclusive?",
                a: "Yes - that covers hosting, your domain, SSL security, unlimited changes, and support. No hidden fees.",
              },
              {
                q: "Can I cancel anytime?",
                a: "Absolutely. No contracts, no cancellation fees. Though we're confident you'll love it!",
              },
            ].map((faq, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl p-6 border border-gray-700"
              >
                <h3 className="text-lg font-semibold text-white mb-3">
                  {faq.q}
                </h3>
                <p className="text-gray-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 bg-gray-800">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <Clock className={`w-12 h-12 ${colors.text} mx-auto mb-4`} />
          <h2 className="text-2xl font-bold text-white mb-4">
            Your Competitors Already Have Websites
          </h2>
          <p className="text-gray-400 mb-8">
            Don&apos;t let another customer choose them because you&apos;re not online.
            Get your professional website today.
          </p>
          <Link
            href="/signup"
            className={`inline-flex items-center gap-2 ${colors.bg} text-white px-8 py-4 rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity`}
          >
            Start My Free Website
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} TradeVista. Professional websites for trades.
          </p>
          <div className="flex gap-6 text-sm">
            <Link href="/privacy" className="text-gray-500 hover:text-white">
              Privacy
            </Link>
            <Link href="/terms" className="text-gray-500 hover:text-white">
              Terms
            </Link>
            <Link href="/" className="text-gray-500 hover:text-white">
              Home
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
