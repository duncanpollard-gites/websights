"use client";

import { SiteConfig } from "@/lib/ai";

interface SitePreviewProps {
  config: SiteConfig;
}

export default function SitePreview({ config }: SitePreviewProps) {
  const { colors, sections } = config;

  return (
    <div className="bg-white min-h-full">
      {/* Site Preview */}
      {sections.filter(s => s.visible).map((section) => {
        switch (section.type) {
          case "hero":
            return (
              <section
                key={section.id}
                className="py-20 px-6 text-center"
                style={{ backgroundColor: colors.primary }}
              >
                <h1 className="text-4xl font-bold text-white mb-4">
                  {config.businessName}
                </h1>
                <p className="text-xl text-white/90 mb-6">{config.tagline}</p>
                <p className="text-white/80 max-w-2xl mx-auto mb-8">
                  {section.content}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    className="px-6 py-3 rounded-full font-semibold"
                    style={{ backgroundColor: colors.accent, color: "white" }}
                  >
                    Get a Quote
                  </button>
                  <a
                    href={`tel:${config.phone}`}
                    className="px-6 py-3 bg-white rounded-full font-semibold"
                    style={{ color: colors.primary }}
                  >
                    Call {config.phone}
                  </a>
                </div>
              </section>
            );

          case "services":
            return (
              <section key={section.id} className="py-16 px-6" style={{ backgroundColor: colors.secondary }}>
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-12" style={{ color: colors.primary }}>
                    {section.title}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {section.items?.map((item, i) => (
                      <div
                        key={i}
                        className="bg-white p-6 rounded-xl shadow-sm"
                      >
                        <div
                          className="w-12 h-12 rounded-lg flex items-center justify-center mb-4 text-2xl"
                          style={{ backgroundColor: `${colors.primary}20`, color: colors.primary }}
                        >
                          🔧
                        </div>
                        <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                        <p className="text-gray-600">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case "about":
            return (
              <section key={section.id} className="py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-8" style={{ color: colors.primary }}>
                    {section.title}
                  </h2>
                  <p className="text-lg text-gray-600 text-center leading-relaxed">
                    {section.content || config.about}
                  </p>
                </div>
              </section>
            );

          case "testimonials":
            return (
              <section key={section.id} className="py-16 px-6" style={{ backgroundColor: colors.secondary }}>
                <div className="max-w-6xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-12" style={{ color: colors.primary }}>
                    {section.title}
                  </h2>
                  <div className="grid md:grid-cols-3 gap-6">
                    {section.items?.map((item, i) => (
                      <div key={i} className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex mb-3">
                          {[...Array(5)].map((_, j) => (
                            <span key={j} className="text-yellow-400">★</span>
                          ))}
                        </div>
                        <p className="text-gray-600 mb-4">"{item.description}"</p>
                        <p className="font-semibold" style={{ color: colors.primary }}>
                          — {item.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );

          case "contact":
            return (
              <section key={section.id} className="py-16 px-6 bg-white">
                <div className="max-w-2xl mx-auto">
                  <h2 className="text-3xl font-bold text-center mb-4" style={{ color: colors.primary }}>
                    {section.title}
                  </h2>
                  <p className="text-center text-gray-600 mb-8">{section.content}</p>
                  <div className="bg-gray-50 p-8 rounded-xl">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                        <input
                          type="tel"
                          className="w-full px-4 py-2 rounded-lg border border-gray-300"
                          placeholder="Your phone number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                        <textarea
                          className="w-full px-4 py-2 rounded-lg border border-gray-300"
                          rows={4}
                          placeholder="How can we help?"
                        />
                      </div>
                      <button
                        className="w-full py-3 rounded-lg font-semibold text-white"
                        style={{ backgroundColor: colors.primary }}
                      >
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </section>
            );

          case "cta":
            return (
              <section
                key={section.id}
                className="py-16 px-6 text-center"
                style={{ backgroundColor: colors.primary }}
              >
                <h2 className="text-3xl font-bold text-white mb-4">{section.title}</h2>
                <p className="text-white/90 mb-8">{section.content}</p>
                <a
                  href={`tel:${config.phone}`}
                  className="inline-block px-8 py-4 bg-white rounded-full font-semibold text-lg"
                  style={{ color: colors.primary }}
                >
                  Call {config.phone}
                </a>
              </section>
            );

          default:
            return null;
        }
      })}

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-white text-center">
        <p className="text-gray-400">
          © {new Date().getFullYear()} {config.businessName}. {config.location}.
        </p>
      </footer>
    </div>
  );
}
