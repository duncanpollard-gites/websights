import { NextRequest, NextResponse } from "next/server";
import { generateQuote, GeneratedQuote } from "@/lib/ai";

// Demo mode fallback quotes for when API key isn't configured
function generateDemoQuote(trade: string, jobDescription: string, businessName: string): GeneratedQuote {
  const today = new Date();
  const validUntil = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);

  const formatDate = (d: Date) => d.toLocaleDateString('en-GB');

  // Trade-specific pricing templates
  const templates: Record<string, { hourlyRate: number; items: Array<{ desc: string; hours: number; materials: number }> }> = {
    plumber: {
      hourlyRate: 60,
      items: [
        { desc: "Initial inspection and diagnosis", hours: 1, materials: 0 },
        { desc: "Repair/installation work", hours: 3, materials: 150 },
        { desc: "Testing and cleanup", hours: 0.5, materials: 0 },
      ]
    },
    electrician: {
      hourlyRate: 55,
      items: [
        { desc: "Electrical inspection", hours: 1, materials: 0 },
        { desc: "Installation/repair work", hours: 4, materials: 120 },
        { desc: "Testing and certification", hours: 1, materials: 0 },
      ]
    },
    builder: {
      hourlyRate: 45,
      items: [
        { desc: "Site preparation", hours: 4, materials: 100 },
        { desc: "Construction work", hours: 16, materials: 800 },
        { desc: "Finishing and cleanup", hours: 4, materials: 50 },
      ]
    },
    default: {
      hourlyRate: 50,
      items: [
        { desc: "Initial assessment", hours: 1, materials: 0 },
        { desc: "Main work", hours: 4, materials: 200 },
        { desc: "Completion and cleanup", hours: 1, materials: 0 },
      ]
    }
  };

  const template = templates[trade] || templates.default;

  const items = template.items.map(item => ({
    description: item.desc,
    quantity: item.hours > 0 ? `${item.hours} hours` : undefined,
    unitPrice: item.hours > 0 ? template.hourlyRate : undefined,
    total: (item.hours * template.hourlyRate) + item.materials
  }));

  const labourCost = template.items.reduce((sum, item) => sum + (item.hours * template.hourlyRate), 0);
  const materialsCost = template.items.reduce((sum, item) => sum + item.materials, 0);
  const subtotal = labourCost + materialsCost;
  const vat = Math.round(subtotal * 0.2);
  const total = subtotal + vat;

  const totalHours = template.items.reduce((sum, item) => sum + item.hours, 0);

  return {
    reference: `QUO-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
    date: formatDate(today),
    validUntil: formatDate(validUntil),
    customerName: "Valued Customer",
    jobSummary: jobDescription.length > 100 ? jobDescription.substring(0, 100) + "..." : jobDescription,
    items,
    labourCost,
    materialsCost,
    subtotal,
    vat,
    total,
    estimatedDuration: totalHours <= 8 ? `${totalHours} hours` : `${Math.ceil(totalHours / 8)} days`,
    notes: [
      "Quote based on description provided - final price may vary after site inspection",
      "All work guaranteed for 12 months",
      "Fully insured and certified"
    ],
    terms: "50% deposit required to secure booking. Balance due on completion. Payment by bank transfer or card."
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { trade, businessName, location, jobDescription, customerName } = body;

    if (!trade || !jobDescription) {
      return NextResponse.json(
        { error: "Trade and job description are required" },
        { status: 400 }
      );
    }

    // Check if API key is configured
    const hasApiKey = process.env.ANTHROPIC_API_KEY &&
                      !process.env.ANTHROPIC_API_KEY.includes("your-");

    let quote: GeneratedQuote;

    if (hasApiKey) {
      // Use real AI generation
      quote = await generateQuote({
        trade,
        businessName: businessName || "Demo Business",
        location: location || "UK",
        jobDescription,
        customerName,
      });
    } else {
      // Use demo fallback
      quote = generateDemoQuote(trade, jobDescription, businessName || "Demo Business");
    }

    return NextResponse.json({
      success: true,
      quote,
      isDemo: !hasApiKey,
    });
  } catch (error) {
    console.error("Quote generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate quote" },
      { status: 500 }
    );
  }
}
