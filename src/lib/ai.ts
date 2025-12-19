import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface SiteConfig {
  businessName: string;
  trade: string;
  location: string;
  phone: string;
  services: string[];
  tagline?: string;
  about?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
  sections: SiteSection[];
}

export interface SiteSection {
  id: string;
  type: "hero" | "services" | "about" | "testimonials" | "gallery" | "contact" | "cta" | "custom";
  title?: string;
  content?: string;
  items?: Array<{ title: string; description: string; icon?: string }>;
  images?: string[];
  visible: boolean;
}

const SYSTEM_PROMPT = `You are an expert web designer specializing in websites for UK tradespeople (plumbers, electricians, builders, etc.).

Your job is to generate and modify website configurations in JSON format. The websites should be:
- Professional and trustworthy
- Mobile-friendly
- Focused on getting customers to call or book
- Include relevant industry terminology
- Use UK English spelling

When generating a site, create compelling copy that:
- Highlights the tradesperson's experience and reliability
- Mentions their location prominently (for local SEO)
- Lists services clearly
- Includes a strong call-to-action

Always respond with valid JSON matching the SiteConfig schema.`;

export async function generateInitialSite(userData: {
  trade: string;
  businessName: string;
  location: string;
  phone: string;
  services: string;
}): Promise<SiteConfig> {
  const servicesList = userData.services
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);

  const prompt = `Generate a complete website configuration for this trade business:

Business Name: ${userData.businessName}
Trade: ${userData.trade}
Location: ${userData.location}
Phone: ${userData.phone}
Services: ${servicesList.join(", ")}

Create a JSON configuration with:
1. A compelling tagline
2. An "about" section (2-3 sentences about being a trusted local ${userData.trade})
3. Appropriate colors for a ${userData.trade} business
4. These sections: hero, services, about, testimonials (with 3 placeholder testimonials), contact, cta

Return ONLY valid JSON matching this structure:
{
  "businessName": string,
  "trade": string,
  "location": string,
  "phone": string,
  "services": string[],
  "tagline": string,
  "about": string,
  "colors": { "primary": hex, "secondary": hex, "accent": hex },
  "sections": [
    {
      "id": string,
      "type": "hero" | "services" | "about" | "testimonials" | "gallery" | "contact" | "cta",
      "title": string,
      "content": string (optional),
      "items": array (optional, for services/testimonials),
      "visible": true
    }
  ]
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  // Extract JSON from response (handle markdown code blocks)
  let jsonStr = content.text;
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  return JSON.parse(jsonStr.trim());
}

export interface QuoteItem {
  description: string;
  quantity?: string;
  unitPrice?: number;
  total: number;
}

export interface GeneratedQuote {
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

const QUOTE_SYSTEM_PROMPT = `You are an expert UK tradesperson who generates professional, realistic quotes.

Your quotes should:
- Use realistic UK pricing (2024 rates)
- Include labour and materials separately where applicable
- Be detailed but not overwhelming
- Include VAT at 20% (if the business is VAT registered, assume they are for larger jobs)
- Include practical notes and terms
- Use UK English spelling

Always respond with valid JSON only, no additional text.`;

export async function generateQuote(params: {
  trade: string;
  businessName: string;
  location: string;
  jobDescription: string;
  customerName?: string;
}): Promise<GeneratedQuote> {
  const prompt = `Generate a professional quote for this job:

Trade: ${params.trade}
Business: ${params.businessName}
Location: ${params.location}
Customer: ${params.customerName || "Mr/Mrs Customer"}
Job Description: "${params.jobDescription}"

Create a realistic, detailed quote with UK pricing. Include:
- Itemized breakdown of work
- Labour costs (use realistic hourly/daily rates for a ${params.trade})
- Materials if applicable
- VAT at 20%
- Estimated duration
- Practical notes specific to this type of job
- Standard terms

Return ONLY valid JSON matching this structure:
{
  "reference": "QUO-XXXXX",
  "date": "DD/MM/YYYY",
  "validUntil": "DD/MM/YYYY (30 days from date)",
  "customerName": string,
  "jobSummary": "Brief 1-2 sentence summary",
  "items": [
    {
      "description": "Item description",
      "quantity": "e.g., 2 hours, 1 unit, 10m²",
      "unitPrice": number (optional),
      "total": number
    }
  ],
  "labourCost": number,
  "materialsCost": number,
  "subtotal": number,
  "vat": number,
  "total": number,
  "estimatedDuration": "e.g., 1-2 days, 4-6 hours",
  "notes": ["Relevant notes about the job", "Access requirements", "What's included"],
  "terms": "Payment terms and conditions"
}`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 2000,
    system: QUOTE_SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  let jsonStr = content.text;
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  return JSON.parse(jsonStr.trim());
}

export async function modifySite(
  currentConfig: SiteConfig,
  userRequest: string
): Promise<{ config: SiteConfig; explanation: string }> {
  const prompt = `Current website configuration:
${JSON.stringify(currentConfig, null, 2)}

User request: "${userRequest}"

Modify the configuration based on the user's request. Common requests include:
- Changing colors ("make it blue", "use green")
- Updating text ("change the tagline to...", "update the about section")
- Adding/removing sections ("add a gallery", "remove testimonials")
- Modifying services ("add bathroom installations")

Return a JSON object with:
{
  "config": <the updated SiteConfig>,
  "explanation": "<brief explanation of what you changed>"
}

Return ONLY valid JSON.`;

  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 3000,
    system: SYSTEM_PROMPT,
    messages: [{ role: "user", content: prompt }],
  });

  const content = response.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  let jsonStr = content.text;
  const jsonMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    jsonStr = jsonMatch[1];
  }

  return JSON.parse(jsonStr.trim());
}
