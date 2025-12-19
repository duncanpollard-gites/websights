import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin, getSetting } from "@/lib/admin";

const LOGO_URL = "https://dreamsonwheels.co.uk/wp-content/uploads/2021/11/dreams-on-wheels-logo-1-e1636232340140.png";

// Test endpoint to create sample orders with both Gelato and Prodigi
export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { provider, action } = await request.json();
    const results: Record<string, unknown> = {};

    // ============ PRODIGI ============
    if (!provider || provider === "prodigi") {
      const prodigiKey = await getSetting("prodigi_api_key");

      if (prodigiKey) {
        // Get quote for T-shirt XL and Mug
        if (action === "quote" || !action) {
          try {
            const quoteResponse = await fetch("https://api.prodigi.com/v4.0/quotes", {
              method: "POST",
              headers: {
                "X-API-Key": prodigiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                shippingMethod: "Budget",
                destinationCountryCode: "GB",
                currencyCode: "GBP",
                items: [
                  {
                    sku: "GLOBAL-GILDAN-18000-XL-BLK",  // Gildan Heavy Blend Sweatshirt XL Black
                    copies: 1,
                    attributes: { color: "black" },
                    assets: [{ printArea: "front", url: LOGO_URL }],
                  },
                  {
                    sku: "GLOBAL-MUG-11OZ-WHT",  // 11oz White Mug
                    copies: 1,
                    assets: [{ printArea: "wrap", url: LOGO_URL }],
                  },
                ],
              }),
            });

            const quoteData = await quoteResponse.json();
            results.prodigi_quote = {
              success: quoteResponse.ok,
              status: quoteResponse.status,
              data: quoteData,
            };
          } catch (error) {
            results.prodigi_quote = {
              success: false,
              error: error instanceof Error ? error.message : "Quote failed",
            };
          }
        }

        // Create draft order (sandbox-style - won't actually print)
        if (action === "order") {
          try {
            const orderResponse = await fetch("https://api.prodigi.com/v4.0/orders", {
              method: "POST",
              headers: {
                "X-API-Key": prodigiKey,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                merchantReference: `TEST-DOW-${Date.now()}`,
                shippingMethod: "Budget",
                recipient: {
                  name: "Dreams on Wheels Test",
                  email: "test@dreamsonwheels.co.uk",
                  address: {
                    line1: "123 Test Street",
                    townOrCity: "London",
                    postalOrZipCode: "SW1A 1AA",
                    countryCode: "GB",
                  },
                },
                items: [
                  {
                    merchantReference: "tshirt-xl-test",
                    sku: "GLOBAL-GILDAN-18000-XL-BLK",
                    copies: 1,
                    sizing: "fillPrintArea",
                    assets: [{ printArea: "front", url: LOGO_URL }],
                  },
                  {
                    merchantReference: "mug-test",
                    sku: "GLOBAL-MUG-11OZ-WHT",
                    copies: 1,
                    sizing: "fillPrintArea",
                    assets: [{ printArea: "wrap", url: LOGO_URL }],
                  },
                ],
              }),
            });

            const orderData = await orderResponse.json();
            results.prodigi_order = {
              success: orderResponse.ok,
              status: orderResponse.status,
              data: orderData,
            };
          } catch (error) {
            results.prodigi_order = {
              success: false,
              error: error instanceof Error ? error.message : "Order failed",
            };
          }
        }
      } else {
        results.prodigi = { error: "API key not configured" };
      }
    }

    // ============ GELATO ============
    if (!provider || provider === "gelato") {
      const gelatoKey = await getSetting("gelato_api_key");

      if (gelatoKey) {
        // First, let's find valid product UIDs for t-shirt and mug
        if (action === "products" || !action) {
          try {
            // Search for t-shirt products
            const productsResponse = await fetch(
              "https://product.gelatoapis.com/v3/products?limit=50",
              {
                headers: {
                  "X-API-KEY": gelatoKey,
                  "Content-Type": "application/json",
                },
              }
            );

            const productsData = await productsResponse.json();

            // Find t-shirt and mug products
            const products = productsData.products || [];
            const tshirts = products.filter((p: { productTypeUid: string }) =>
              p.productTypeUid?.includes("t-shirt") || p.productTypeUid?.includes("tshirt")
            ).slice(0, 3);
            const mugs = products.filter((p: { productTypeUid: string }) =>
              p.productTypeUid?.includes("mug")
            ).slice(0, 3);

            results.gelato_products = {
              success: productsResponse.ok,
              tshirts: tshirts.map((p: { productUid: string; productTypeUid: string }) => ({
                uid: p.productUid,
                type: p.productTypeUid,
              })),
              mugs: mugs.map((p: { productUid: string; productTypeUid: string }) => ({
                uid: p.productUid,
                type: p.productTypeUid,
              })),
              allTypes: [...new Set(products.map((p: { productTypeUid: string }) => p.productTypeUid))],
            };
          } catch (error) {
            results.gelato_products = {
              success: false,
              error: error instanceof Error ? error.message : "Failed to fetch products",
            };
          }
        }

        // Get quote for specific products
        if (action === "quote") {
          try {
            // Gelato uses a different quote endpoint
            const quoteResponse = await fetch(
              "https://order.gelatoapis.com/v4/orders:quote",
              {
                method: "POST",
                headers: {
                  "X-API-KEY": gelatoKey,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  orderType: "order",
                  orderReferenceId: `QUOTE-DOW-${Date.now()}`,
                  customerReferenceId: "dreamsonwheels",
                  currency: "GBP",
                  items: [
                    {
                      itemReferenceId: "tshirt-1",
                      productUid: "apparel_product_gca_t-shirt_gsc_crewneck_gcu_unisex_gqa_classic_gsi_xl_gco_black_gpr_4-4",
                      quantity: 1,
                      files: [
                        {
                          url: LOGO_URL,
                          type: "default",
                          areaName: "front",
                        },
                      ],
                    },
                  ],
                  shippingAddress: {
                    firstName: "Test",
                    lastName: "Dreams on Wheels",
                    addressLine1: "123 Test Street",
                    city: "London",
                    postCode: "SW1A 1AA",
                    country: "GB",
                  },
                }),
              }
            );

            const quoteData = await quoteResponse.json();
            results.gelato_quote = {
              success: quoteResponse.ok,
              status: quoteResponse.status,
              data: quoteData,
            };
          } catch (error) {
            results.gelato_quote = {
              success: false,
              error: error instanceof Error ? error.message : "Quote failed",
            };
          }
        }
      } else {
        results.gelato = { error: "API key not configured" };
      }
    }

    return NextResponse.json({
      logoUrl: LOGO_URL,
      results,
    });
  } catch (error) {
    console.error("Test order error:", error);
    return NextResponse.json(
      { error: "Failed to process test order" },
      { status: 500 }
    );
  }
}
