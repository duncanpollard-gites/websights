import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import {
  getProducts,
  getProduct,
  getCategories,
  getTradeProducts,
  testConnection,
  usdToGbpPence,
  getAvailableSizes,
  getAvailableColors,
} from "@/lib/printful";

// GET - Fetch products from Printful catalog
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const productId = searchParams.get("productId");
    const category = searchParams.get("category");
    const tradeOnly = searchParams.get("tradeOnly") === "true";

    // Test connection first
    const connectionTest = await testConnection();
    if (!connectionTest.success) {
      return NextResponse.json({
        connected: false,
        message: connectionTest.message,
        products: [],
        categories: [],
      });
    }

    // Get specific product details
    if (productId) {
      try {
        const { product, variants } = await getProduct(parseInt(productId));

        // Get available sizes and colors
        const sizes = getAvailableSizes(variants);
        const colors = getAvailableColors(variants);

        // Get base price (lowest variant price)
        const prices = variants
          .filter(v => v.in_stock)
          .map(v => parseFloat(v.price));
        const basePrice = prices.length > 0 ? Math.min(...prices) : 0;

        return NextResponse.json({
          connected: true,
          product: {
            ...product,
            basePriceUsd: basePrice,
            basePriceGbp: usdToGbpPence(basePrice),
            sizes,
            colors,
            variantCount: variants.length,
            inStockCount: variants.filter(v => v.in_stock).length,
          },
          variants: variants.map(v => ({
            id: v.id,
            name: v.name,
            size: v.size,
            color: v.color,
            colorCode: v.color_code,
            priceUsd: parseFloat(v.price),
            priceGbp: usdToGbpPence(v.price),
            inStock: v.in_stock,
            image: v.image,
          })),
        });
      } catch (error) {
        return NextResponse.json(
          { error: error instanceof Error ? error.message : "Product not found" },
          { status: 404 }
        );
      }
    }

    // Get trade products (curated list)
    if (tradeOnly) {
      try {
        const tradeProducts = await getTradeProducts();

        return NextResponse.json({
          connected: true,
          store: connectionTest.store,
          products: tradeProducts.map(({ product, variants }) => {
            const prices = variants
              .filter(v => v.in_stock)
              .map(v => parseFloat(v.price));
            const basePrice = prices.length > 0 ? Math.min(...prices) : 0;

            return {
              id: product.id,
              title: product.title,
              brand: product.brand,
              model: product.model,
              type: product.type_name,
              image: product.image,
              variantCount: product.variant_count,
              basePriceUsd: basePrice,
              basePriceGbp: usdToGbpPence(basePrice),
              sizes: getAvailableSizes(variants),
              colors: getAvailableColors(variants),
            };
          }),
        });
      } catch (error) {
        console.error("Error fetching trade products:", error);
        return NextResponse.json({
          connected: true,
          store: connectionTest.store,
          products: [],
          error: "Failed to fetch trade products",
        });
      }
    }

    // Get all products or filter by category
    try {
      const allProducts = await getProducts();
      const categories = await getCategories();

      let filteredProducts = allProducts;
      if (category) {
        filteredProducts = allProducts.filter(p =>
          p.type_name.toLowerCase().includes(category.toLowerCase())
        );
      }

      return NextResponse.json({
        connected: true,
        store: connectionTest.store,
        categories,
        products: filteredProducts.map(p => ({
          id: p.id,
          title: p.title,
          brand: p.brand,
          model: p.model,
          type: p.type_name,
          image: p.image,
          variantCount: p.variant_count,
        })),
        total: filteredProducts.length,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      return NextResponse.json({
        connected: true,
        store: connectionTest.store,
        products: [],
        categories: [],
        error: "Failed to fetch products",
      });
    }
  } catch (error) {
    console.error("Printful products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}
