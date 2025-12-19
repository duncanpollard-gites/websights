import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { modifySite, SiteConfig } from "@/lib/ai";
import { query } from "@/lib/db";

interface Site {
  id: string;
  site_config: string;
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Get current site config
    const sites = await query<Site[]>(
      "SELECT id, site_config FROM sites WHERE user_id = ? LIMIT 1",
      [user.id]
    );

    if (!sites.length) {
      return NextResponse.json({ error: "No site found. Generate a site first." }, { status: 404 });
    }

    const currentConfig: SiteConfig = JSON.parse(sites[0].site_config);

    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY === "your-anthropic-api-key-here") {
      // Demo mode - make simple modifications
      let explanation = "Demo mode: ";
      const updatedConfig = { ...currentConfig };

      // Handle some common requests in demo mode
      const lowerPrompt = prompt.toLowerCase();

      if (lowerPrompt.includes("blue")) {
        updatedConfig.colors = { ...updatedConfig.colors, primary: "#2563eb" };
        explanation += "Changed primary color to blue.";
      } else if (lowerPrompt.includes("green")) {
        updatedConfig.colors = { ...updatedConfig.colors, primary: "#10b981" };
        explanation += "Changed primary color to green.";
      } else if (lowerPrompt.includes("red")) {
        updatedConfig.colors = { ...updatedConfig.colors, primary: "#ef4444" };
        explanation += "Changed primary color to red.";
      } else if (lowerPrompt.includes("tagline")) {
        const newTagline = prompt.replace(/change.*tagline.*to\s*/i, "").replace(/"/g, "").trim();
        if (newTagline) {
          updatedConfig.tagline = newTagline;
          explanation += `Updated tagline to "${newTagline}".`;
        }
      } else {
        explanation += "Add ANTHROPIC_API_KEY for full AI-powered modifications.";
      }

      // Save updated config
      await query(
        "UPDATE sites SET site_config = ?, updated_at = NOW() WHERE id = ?",
        [JSON.stringify(updatedConfig), sites[0].id]
      );

      return NextResponse.json({
        success: true,
        config: updatedConfig,
        explanation,
      });
    }

    // Modify with AI
    const result = await modifySite(currentConfig, prompt);

    // Save updated config
    await query(
      "UPDATE sites SET site_config = ?, updated_at = NOW() WHERE id = ?",
      [JSON.stringify(result.config), sites[0].id]
    );

    return NextResponse.json({
      success: true,
      config: result.config,
      explanation: result.explanation,
    });
  } catch (error) {
    console.error("Modify site error:", error);
    return NextResponse.json(
      { error: "Failed to modify site" },
      { status: 500 }
    );
  }
}
