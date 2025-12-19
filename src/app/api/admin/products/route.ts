import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/admin";
import {
  getGelatoProducts,
  getProductsByCategory as getGelatoProductsByCategory,
  getSavedProducts,
  saveProduct,
  updateProductSettings,
  deleteProduct,
  testConnection as testGelatoConnection,
  calculateCustomerPrice,
} from "@/lib/gelato";
import {
  getProdigiCategories,
  getProdigiProductsByCategory,
  testConnection as testProdigiConnection,
} from "@/lib/prodigi";

// GET - Fetch products and categories from Gelato and Prodigi
export async function GET(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const provider = searchParams.get("provider") || "gelato";

    // Test connections
    const gelatoTest = await testGelatoConnection();
    const prodigiTest = await testProdigiConnection();

    // Get saved products from database
    const savedProducts = await getSavedProducts();
    const savedProductsMap = new Map(
      savedProducts.map((p) => [p.gelato_product_uid, p])
    );

    // If requesting products for a specific category
    if (category) {
      try {
        let products: Array<{
          productUid: string;
          title: string;
          description?: string;
          category?: string;
          previewUrl?: string;
        }> = [];

        if (provider === "prodigi") {
          // Get Prodigi products
          const prodigiProducts = getProdigiProductsByCategory(category);
          products = prodigiProducts.map((p) => ({
            productUid: p.sku,
            title: p.name,
            description: p.description,
            category: p.category,
            previewUrl: p.previewUrl,
          }));
        } else {
          // Get Gelato products
          products = await getGelatoProductsByCategory(category);
        }

        // Merge with saved data
        const mergedProducts = products.map((p) => {
          const saved = savedProductsMap.get(p.productUid);
          return {
            ...p,
            provider,
            saved: !!saved,
            is_active: saved?.is_active || false,
            base_price: saved?.base_price || 0,
            markup_percent: saved?.markup_percent || 30,
            markup_fixed: saved?.markup_fixed || 0,
            customer_price: saved
              ? calculateCustomerPrice(
                  saved.base_price,
                  saved.markup_percent,
                  saved.markup_fixed
                )
              : 0,
          };
        });

        return NextResponse.json({
          gelato: { connected: gelatoTest.success, message: gelatoTest.message },
          prodigi: { connected: prodigiTest.success, message: prodigiTest.message },
          products: mergedProducts,
        });
      } catch (error) {
        console.error("Failed to fetch category products:", error);
        return NextResponse.json({
          gelato: { connected: gelatoTest.success, message: gelatoTest.message },
          prodigi: { connected: prodigiTest.success, message: prodigiTest.message },
          products: [],
          error: "Failed to fetch category products",
        });
      }
    }

    // Get all products and categories from both providers
    let gelatoCategories: Array<{ id: string; name: string; count: number }> = [];
    if (gelatoTest.success) {
      try {
        const result = await getGelatoProducts();
        gelatoCategories = result.categories;
      } catch (error) {
        console.error("Failed to fetch Gelato products:", error);
      }
    }

    // Get Prodigi categories (always available - local data)
    const prodigiCategories = getProdigiCategories();

    // Return saved products with calculated prices
    const productsWithPrices = savedProducts.map((p) => ({
      ...p,
      customer_price: calculateCustomerPrice(
        p.base_price,
        p.markup_percent,
        p.markup_fixed
      ),
    }));

    return NextResponse.json({
      gelato: {
        connected: gelatoTest.success,
        message: gelatoTest.message,
        categories: gelatoCategories,
      },
      prodigi: {
        connected: prodigiTest.success,
        message: prodigiTest.message,
        categories: prodigiCategories,
      },
      savedProducts: productsWithPrices,
      activeCount: savedProducts.filter((p) => p.is_active).length,
    });
  } catch (error) {
    console.error("Products error:", error);
    return NextResponse.json(
      { error: "Failed to get products" },
      { status: 500 }
    );
  }
}

// POST - Save/add a product
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    switch (action) {
      case "save": {
        const { product } = body;
        if (!product?.gelato_product_uid || !product?.name) {
          return NextResponse.json(
            { error: "Product UID and name required" },
            { status: 400 }
          );
        }

        await saveProduct({
          gelato_product_uid: product.gelato_product_uid,
          name: product.name,
          description: product.description,
          category: product.category,
          base_price: product.base_price || 0,
          markup_percent: product.markup_percent ?? 30,
          markup_fixed: product.markup_fixed ?? 0,
          is_active: product.is_active ?? false,
          image_url: product.image_url,
        });

        return NextResponse.json({
          success: true,
          message: "Product saved",
        });
      }

      case "update": {
        const { gelato_product_uid, settings } = body;
        if (!gelato_product_uid) {
          return NextResponse.json(
            { error: "Product UID required" },
            { status: 400 }
          );
        }

        await updateProductSettings(gelato_product_uid, settings);

        return NextResponse.json({
          success: true,
          message: "Product updated",
        });
      }

      case "delete": {
        const { gelato_product_uid } = body;
        if (!gelato_product_uid) {
          return NextResponse.json(
            { error: "Product UID required" },
            { status: 400 }
          );
        }

        await deleteProduct(gelato_product_uid);

        return NextResponse.json({
          success: true,
          message: "Product removed",
        });
      }

      case "toggle": {
        const { gelato_product_uid, is_active } = body;
        if (!gelato_product_uid) {
          return NextResponse.json(
            { error: "Product UID required" },
            { status: 400 }
          );
        }

        await updateProductSettings(gelato_product_uid, { is_active });

        return NextResponse.json({
          success: true,
          message: is_active ? "Product activated" : "Product deactivated",
        });
      }

      default:
        return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }
  } catch (error) {
    console.error("Product action error:", error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
}
