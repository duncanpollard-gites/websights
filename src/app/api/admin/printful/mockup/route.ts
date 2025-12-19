import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import {
  generateMockup,
  getProduct,
  findVariant,
  testConnection,
} from "@/lib/printful";

// POST - Generate mockup for a product with customer's image
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { productId, imageUrl, size, color, placement } = await request.json();

    if (!productId || !imageUrl) {
      return NextResponse.json(
        { error: "productId and imageUrl are required" },
        { status: 400 }
      );
    }

    // Test connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return NextResponse.json(
        { error: connectionTest.message },
        { status: 400 }
      );
    }

    // Get product details to find variant
    const { product, variants } = await getProduct(productId);

    // Find the variant (or use first in-stock variant)
    let variantId: number;
    if (size && color) {
      const variant = findVariant(variants, size, color);
      if (!variant) {
        return NextResponse.json(
          { error: `No variant found for size ${size}, color ${color}` },
          { status: 400 }
        );
      }
      variantId = variant.id;
    } else {
      // Use first available variant
      const defaultVariant = variants.find(v => v.in_stock);
      if (!defaultVariant) {
        return NextResponse.json(
          { error: "No variants in stock" },
          { status: 400 }
        );
      }
      variantId = defaultVariant.id;
    }

    // Generate mockup
    const mockups = await generateMockup({
      productId,
      variantIds: [variantId],
      imageUrl,
      placement: placement || "front",
    });

    if (!mockups || mockups.length === 0) {
      return NextResponse.json(
        { error: "Failed to generate mockup" },
        { status: 500 }
      );
    }

    // Return all mockup URLs
    const result = {
      product: {
        id: product.id,
        title: product.title,
        brand: product.brand,
        model: product.model,
      },
      variantId,
      mockups: mockups.map(m => ({
        placement: m.placement,
        url: m.mockup_url,
        extra: m.extra.map(e => ({
          title: e.title,
          option: e.option,
          url: e.url,
        })),
      })),
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Mockup generation error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate mockup" },
      { status: 500 }
    );
  }
}
