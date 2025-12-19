"use client";

import { useState } from "react";
import {
  Sparkles,
  Loader2,
  FileText,
  Clock,
  PoundSterling,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

interface QuoteItem {
  description: string;
  quantity?: string;
  unitPrice?: number;
  total: number;
}

interface GeneratedQuote {
  reference: string;
  date: string;
  validUntil: string;
  customerName: string;
  jobSummary: string;
  items: QuoteItem[];
  labourCost: number;
  materialsCost: number;
  subtotal: number;
  vat: number;
  total: number;
  estimatedDuration: string;
  notes: string[];
  terms: string;
}

interface QuoteGeneratorProps {
  trade: string;
  businessName: string;
  location: string;
  phone: string;
  primaryColor: string;
  accentColor: string;
}

const exampleJobs: Record<string, string[]> = {
  plumber: [
    "Fix a leaking tap in the kitchen",
    "Install a new bathroom suite",
    "Unblock a severely clogged drain",
    "Replace the boiler with a new combi",
  ],
  electrician: [
    "Install 6 new downlights in the kitchen",
    "Full house rewire (3 bed semi)",
    "Install an EV charger in the garage",
    "Add extra sockets in the living room",
  ],
  builder: [
    "Build a single storey rear extension 4x3m",
    "Convert the loft into a bedroom",
    "Knock through kitchen and dining room",
    "Build a garden wall with gate",
  ],
  carpenter: [
    "Build fitted wardrobes for master bedroom",
    "Install a new wooden staircase",
    "Fit a new front door and frame",
    "Build custom shelving unit for living room",
  ],
  painter: [
    "Paint the entire interior (3 bed house)",
    "Exterior painting - front of house",
    "Wallpaper feature wall in bedroom",
    "Paint kitchen cabinets white",
  ],
  roofer: [
    "Replace 20 broken roof tiles",
    "Install new flat roof on garage",
    "Full roof replacement (3 bed semi)",
    "Repair chimney flashing and repoint",
  ],
  landscaper: [
    "Design and install new patio 5x4m",
    "Full garden redesign with planting",
    "Install artificial grass lawn",
    "Build raised beds and garden path",
  ],
  plasterer: [
    "Plaster walls in living room",
    "Skim coat entire ground floor",
    "Repair ceiling after water damage",
    "Install coving throughout house",
  ],
  tiler: [
    "Tile bathroom floor and walls",
    "Install kitchen splashback",
    "Tile shower enclosure floor to ceiling",
    "Retile hallway floor 10m²",
  ],
  locksmith: [
    "Replace all locks after break-in",
    "Install smart lock on front door",
    "Fit 5-lever mortice locks on all doors",
    "Emergency lockout - lost keys",
  ],
  handyman: [
    "Assemble 3 wardrobes and 2 beds",
    "Hang 5 pictures and mount TV",
    "Fix squeaky doors and loose handles",
    "Install new curtain rails throughout",
  ],
  cleaner: [
    "Deep clean 3 bed house end of tenancy",
    "Weekly cleaning service quote",
    "After-builders clean (whole house)",
    "Carpet cleaning throughout",
  ],
  gardener: [
    "Monthly garden maintenance quote",
    "Clear overgrown garden and tidy up",
    "Hedge trimming (20m of hedges)",
    "Tree pruning and stump removal",
  ],
  "pest-control": [
    "Mouse problem in kitchen - full treatment",
    "Wasp nest removal from loft",
    "Bed bug treatment for bedroom",
    "Annual commercial pest contract",
  ],
  hvac: [
    "Install new air conditioning unit",
    "Service and repair boiler",
    "Install heat pump system",
    "Replace radiators throughout house",
  ],
};

export default function QuoteGenerator({
  trade,
  businessName,
  location,
  phone,
  primaryColor,
  accentColor,
}: QuoteGeneratorProps) {
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [quote, setQuote] = useState<GeneratedQuote | null>(null);
  const [error, setError] = useState<string | null>(null);

  const examples = exampleJobs[trade] || exampleJobs.plumber;

  const generateQuote = async () => {
    if (!jobDescription.trim()) return;

    setLoading(true);
    setError(null);
    setQuote(null);

    try {
      const response = await fetch("/api/demo/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trade,
          businessName,
          location,
          jobDescription,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate quote");
      }

      setQuote(data.quote);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 px-6 bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4"
            style={{ backgroundColor: `${primaryColor}30`, color: primaryColor }}
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Feature
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Get an Instant Quote
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Describe your job and our AI will generate a detailed quote in seconds.
            No waiting, no phone calls - just instant pricing.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="bg-gray-800 rounded-2xl p-6 md:p-8">
            <h3 className="text-xl font-semibold text-white mb-4">
              Describe Your Job
            </h3>

            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="E.g., I need a new boiler installed in my 3 bedroom house. The current one is 15 years old and keeps breaking down..."
              className="w-full h-40 px-4 py-3 bg-gray-700 text-white rounded-xl border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none placeholder:text-gray-500"
            />

            {/* Example Jobs */}
            <div className="mt-4">
              <p className="text-sm text-gray-400 mb-2">Try an example:</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, i) => (
                  <button
                    key={i}
                    onClick={() => setJobDescription(example)}
                    className="text-xs px-3 py-1.5 bg-gray-700 text-gray-300 rounded-full hover:bg-gray-600 transition-colors"
                  >
                    {example.length > 30 ? example.substring(0, 30) + "..." : example}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateQuote}
              disabled={loading || !jobDescription.trim()}
              className="w-full mt-6 py-4 rounded-xl font-semibold text-white text-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: loading ? "#666" : primaryColor }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating Quote...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Get Instant Quote
                </>
              )}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center gap-3 text-red-400">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {error}
              </div>
            )}
          </div>

          {/* Quote Output */}
          <div className="bg-white rounded-2xl p-6 md:p-8 shadow-2xl">
            {quote ? (
              <div>
                {/* Quote Header */}
                <div className="flex justify-between items-start mb-6 pb-6 border-b">
                  <div>
                    <div
                      className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold text-xl mb-2"
                      style={{ backgroundColor: primaryColor }}
                    >
                      {businessName.charAt(0)}
                    </div>
                    <h3 className="font-bold text-gray-900">{businessName}</h3>
                    <p className="text-sm text-gray-500">{location}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm font-medium" style={{ color: primaryColor }}>
                      <FileText className="w-4 h-4" />
                      {quote.reference}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">Date: {quote.date}</p>
                    <p className="text-sm text-gray-500">Valid until: {quote.validUntil}</p>
                  </div>
                </div>

                {/* Job Summary */}
                <div className="mb-6">
                  <p className="text-sm font-medium text-gray-500 mb-1">Job Summary</p>
                  <p className="text-gray-700">{quote.jobSummary}</p>
                </div>

                {/* Items */}
                <div className="mb-6">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-2 text-gray-500 font-medium">Description</th>
                        <th className="text-right py-2 text-gray-500 font-medium">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quote.items.map((item, i) => (
                        <tr key={i} className="border-b border-gray-100">
                          <td className="py-3">
                            <p className="text-gray-700">{item.description}</p>
                            {item.quantity && (
                              <p className="text-xs text-gray-400">{item.quantity}</p>
                            )}
                          </td>
                          <td className="py-3 text-right text-gray-700">
                            £{item.total.toFixed(2)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="bg-gray-50 rounded-xl p-4 mb-6">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Labour</span>
                    <span className="text-gray-700">£{quote.labourCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Materials</span>
                    <span className="text-gray-700">£{quote.materialsCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="text-gray-700">£{quote.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm mb-3 pb-3 border-b border-gray-200">
                    <span className="text-gray-500">VAT (20%)</span>
                    <span className="text-gray-700">£{quote.vat.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span
                      className="text-2xl font-bold"
                      style={{ color: primaryColor }}
                    >
                      £{quote.total.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                  <Clock className="w-4 h-4" />
                  Estimated duration: {quote.estimatedDuration}
                </div>

                {/* Notes */}
                {quote.notes.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Notes:</p>
                    <ul className="space-y-1">
                      {quote.notes.map((note, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                          <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA */}
                <div className="mt-6 pt-6 border-t">
                  <p className="text-center text-sm text-gray-500 mb-3">
                    Happy with this quote?
                  </p>
                  <a
                    href={`tel:${phone}`}
                    className="block w-full py-3 rounded-xl font-semibold text-white text-center"
                    style={{ backgroundColor: primaryColor }}
                  >
                    Call to Book: {phone}
                  </a>
                </div>
              </div>
            ) : (
              /* Empty State */
              <div className="h-full flex flex-col items-center justify-center text-center py-12">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <PoundSterling className="w-8 h-8" style={{ color: primaryColor }} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Your Quote Will Appear Here
                </h3>
                <p className="text-gray-500 max-w-sm">
                  Describe your job on the left and click "Get Instant Quote" to see
                  a professional quote generated by AI.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            <Sparkles className="w-4 h-4 inline mr-1" />
            Powered by TradeVista AI - Quotes generated in seconds, not days
          </p>
        </div>
      </div>
    </section>
  );
}
