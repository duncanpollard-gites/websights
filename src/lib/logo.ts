import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface LogoRequest {
  businessName: string;
  trade: string;
  style: "modern" | "classic" | "bold" | "minimal" | "playful";
  primaryColor?: string;
  secondaryColor?: string;
}

export interface GeneratedLogo {
  id: string;
  svg: string;
  name: string;
  description: string;
}

const LOGO_SYSTEM_PROMPT = `You are an expert logo designer who creates professional SVG logos for trade businesses.

Your logos should be:
- Simple and memorable
- Work at any size (from favicon to billboard)
- Use clean, scalable vector shapes
- Include the business name or initials
- Incorporate subtle trade-related iconography
- Professional and trustworthy

SVG Requirements:
- Use viewBox="0 0 200 200" for square logos or viewBox="0 0 300 100" for horizontal
- Use simple paths, circles, rects - no complex gradients or filters
- Include the business name as text with a professional font-family (system fonts like Arial, Helvetica, or sans-serif)
- Limit to 2-3 colors maximum
- Ensure the SVG is complete and valid

Trade Icons to consider:
- Plumber: water drops, pipes, wrenches
- Electrician: lightning bolts, plugs, bulbs
- Builder: houses, bricks, hard hats
- Carpenter: wood grain, tools, sawblades
- Painter: paint brushes, rollers, color swatches
- Roofer: house roofs, tiles, chimneys
- Landscaper: leaves, trees, gardens
- Plasterer: trowels, walls
- Tiler: grid patterns, tiles
- Locksmith: keys, locks, shields
- Handyman: toolboxes, multiple tools
- Cleaner: sparkles, spray bottles, shine
- Gardener: flowers, plants, shovels
- Pest Control: shields, bugs crossed out
- HVAC: snowflakes, flames, fans

Return ONLY valid JSON with an array of logo objects. Each logo must have complete, valid SVG code.`;

export async function generateLogos(request: LogoRequest): Promise<GeneratedLogo[]> {
  const { businessName, trade, style, primaryColor = "#2563eb", secondaryColor = "#1e40af" } = request;

  const styleDescriptions = {
    modern: "clean lines, geometric shapes, sans-serif fonts, minimal decoration",
    classic: "traditional styling, serif or elegant fonts, timeless appearance",
    bold: "strong shapes, thick lines, impactful typography, high contrast",
    minimal: "extremely simple, lots of whitespace, essential elements only",
    playful: "friendly curves, approachable feel, slightly rounded elements",
  };

  const prompt = `Create 4 different professional logo designs for this trade business:

Business Name: ${businessName}
Trade: ${trade}
Style: ${style} (${styleDescriptions[style]})
Primary Color: ${primaryColor}
Secondary Color: ${secondaryColor}

Create 4 varied logos:
1. Icon + Text horizontal layout
2. Icon above text (stacked/vertical)
3. Text-based with subtle icon integration
4. Monogram/initials with icon element

Return ONLY this JSON format (no markdown, no explanation):
[
  {
    "id": "logo1",
    "name": "Horizontal Icon",
    "description": "Brief description of the design",
    "svg": "<svg viewBox=\"0 0 300 100\" xmlns=\"http://www.w3.org/2000/svg\">...complete SVG code...</svg>"
  },
  {
    "id": "logo2",
    "name": "Stacked",
    "description": "Brief description",
    "svg": "<svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\">...complete SVG code...</svg>"
  },
  {
    "id": "logo3",
    "name": "Text Focus",
    "description": "Brief description",
    "svg": "<svg viewBox=\"0 0 300 100\" xmlns=\"http://www.w3.org/2000/svg\">...complete SVG code...</svg>"
  },
  {
    "id": "logo4",
    "name": "Monogram",
    "description": "Brief description",
    "svg": "<svg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\">...complete SVG code...</svg>"
  }
]`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 8000,
    system: LOGO_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  // Extract JSON from response
  let jsonStr = content.text;

  // Remove any markdown code blocks if present
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  // Find the JSON array
  const arrayStart = jsonStr.indexOf('[');
  const arrayEnd = jsonStr.lastIndexOf(']');
  if (arrayStart !== -1 && arrayEnd !== -1) {
    jsonStr = jsonStr.substring(arrayStart, arrayEnd + 1);
  }

  try {
    const logos = JSON.parse(jsonStr.trim());
    return logos;
  } catch (e) {
    console.error("Failed to parse logo JSON:", e);
    console.error("Raw response:", content.text);
    throw new Error("Failed to generate logos - invalid response format");
  }
}

// Trade-specific color palettes
export const tradeColors: Record<string, { primary: string; secondary: string }> = {
  plumber: { primary: "#0ea5e9", secondary: "#0284c7" },
  electrician: { primary: "#f59e0b", secondary: "#d97706" },
  builder: { primary: "#78716c", secondary: "#57534e" },
  carpenter: { primary: "#92400e", secondary: "#78350f" },
  painter: { primary: "#8b5cf6", secondary: "#7c3aed" },
  roofer: { primary: "#dc2626", secondary: "#b91c1c" },
  landscaper: { primary: "#22c55e", secondary: "#16a34a" },
  plasterer: { primary: "#a8a29e", secondary: "#78716c" },
  tiler: { primary: "#06b6d4", secondary: "#0891b2" },
  locksmith: { primary: "#1e293b", secondary: "#0f172a" },
  handyman: { primary: "#ea580c", secondary: "#c2410c" },
  cleaner: { primary: "#14b8a6", secondary: "#0d9488" },
  gardener: { primary: "#84cc16", secondary: "#65a30d" },
  "pest-control": { primary: "#059669", secondary: "#047857" },
  hvac: { primary: "#3b82f6", secondary: "#2563eb" },
};

// Demo fallback logos (simple SVG templates)
export function generateDemoLogo(businessName: string, trade: string, style: "icon" | "text" | "monogram" = "icon"): string {
  const colors = tradeColors[trade] || { primary: "#2563eb", secondary: "#1e40af" };
  const initial = businessName.charAt(0).toUpperCase();

  const tradeIcons: Record<string, string> = {
    plumber: '<path d="M50 30 L50 50 L30 50 L30 70 L70 70 L70 50 L50 50" stroke="white" stroke-width="4" fill="none"/><circle cx="50" cy="25" r="8" fill="white"/>',
    electrician: '<path d="M55 20 L45 45 L55 45 L45 80" stroke="white" stroke-width="4" fill="none" stroke-linecap="round"/>',
    builder: '<path d="M30 70 L50 30 L70 70 Z" stroke="white" stroke-width="3" fill="none"/><rect x="40" y="50" width="20" height="20" fill="white"/>',
    carpenter: '<rect x="25" y="40" width="50" height="10" fill="white" rx="2"/><rect x="45" y="30" width="10" height="40" fill="white" rx="2"/>',
    painter: '<circle cx="50" cy="50" r="20" stroke="white" stroke-width="3" fill="none"/><path d="M50 30 L50 15 L60 15" stroke="white" stroke-width="3" fill="none"/>',
    roofer: '<path d="M20 60 L50 30 L80 60" stroke="white" stroke-width="4" fill="none"/><rect x="30" y="60" width="40" height="15" fill="white"/>',
    landscaper: '<circle cx="50" cy="55" r="20" fill="white"/><path d="M50 35 L50 20 M40 25 L50 35 L60 25" stroke="' + colors.primary + '" stroke-width="3" fill="none"/>',
    plasterer: '<rect x="30" y="35" width="40" height="30" fill="white" rx="3"/><path d="M35 50 L65 50" stroke="' + colors.primary + '" stroke-width="3"/>',
    tiler: '<rect x="28" y="28" width="18" height="18" fill="white"/><rect x="54" y="28" width="18" height="18" fill="white"/><rect x="28" y="54" width="18" height="18" fill="white"/><rect x="54" y="54" width="18" height="18" fill="white"/>',
    locksmith: '<circle cx="50" cy="45" r="18" stroke="white" stroke-width="3" fill="none"/><rect x="46" y="58" width="8" height="20" fill="white" rx="2"/>',
    handyman: '<rect x="35" y="30" width="30" height="25" fill="white" rx="3"/><rect x="45" y="55" width="10" height="20" fill="white"/>',
    cleaner: '<circle cx="50" cy="50" r="15" stroke="white" stroke-width="2" fill="none"/><path d="M40 40 L60 60 M60 40 L40 60" stroke="white" stroke-width="2"/><circle cx="35" cy="35" r="5" fill="white"/><circle cx="65" cy="35" r="5" fill="white"/><circle cx="35" cy="65" r="5" fill="white"/><circle cx="65" cy="65" r="5" fill="white"/>',
    gardener: '<ellipse cx="50" cy="60" rx="25" ry="15" fill="white"/><path d="M50 45 L50 25" stroke="white" stroke-width="3"/><circle cx="50" cy="20" r="8" fill="white"/>',
    "pest-control": '<circle cx="50" cy="50" r="22" stroke="white" stroke-width="3" fill="none"/><path d="M35 35 L65 65 M35 65 L65 35" stroke="white" stroke-width="3"/>',
    hvac: '<circle cx="50" cy="50" r="20" stroke="white" stroke-width="3" fill="none"/><path d="M50 35 L50 50 L62 58" stroke="white" stroke-width="3" fill="none"/>',
  };

  const icon = tradeIcons[trade] || tradeIcons.builder;

  if (style === "monogram") {
    return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="100" rx="20" fill="${colors.primary}"/>
      <text x="50" y="65" font-family="Arial, sans-serif" font-size="50" font-weight="bold" fill="white" text-anchor="middle">${initial}</text>
    </svg>`;
  }

  if (style === "text") {
    const shortName = businessName.length > 15 ? businessName.substring(0, 15) + "..." : businessName;
    return `<svg viewBox="0 0 300 80" xmlns="http://www.w3.org/2000/svg">
      <text x="150" y="55" font-family="Arial, sans-serif" font-size="36" font-weight="bold" fill="${colors.primary}" text-anchor="middle">${shortName}</text>
    </svg>`;
  }

  // Icon style (default)
  return `<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="45" fill="${colors.primary}"/>
    <g>${icon}</g>
  </svg>`;
}
