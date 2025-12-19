import { getSetting } from "./admin";
import { query } from "./db";

const GELATO_API_BASE = "https://product.gelatoapis.com/v3";
const GELATO_ORDER_API = "https://order.gelatoapis.com/v4";

interface GelatoApiOptions {
  method?: string;
  body?: Record<string, unknown>;
}

// Product types for trades
export interface GelatoProduct {
  productUid: string;
  title: string;
  description: string;
  category: string;
  printAreas: Array<{
    name: string;
    width: number;
    height: number;
  }>;
  variants: Array<{
    variantUid: string;
    title: string;
    price: number;
    currency: string;
  }>;
}

export interface GelatoOrderItem {
  itemReferenceId: string;
  productUid: string;
  quantity: number;
  files: Array<{
    url: string;
    type: string;
    areaName: string;
  }>;
}

export interface GelatoOrder {
  id: string;
  orderReferenceId: string;
  status: string;
  items: Array<{
    itemReferenceId: string;
    productUid: string;
    status: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    city: string;
    postCode: string;
    country: string;
  };
  createdAt: string;
}

async function gelatoApiRequest<T>(
  baseUrl: string,
  endpoint: string,
  options: GelatoApiOptions = {}
): Promise<T> {
  const apiKey = await getSetting("gelato_api_key");
  if (!apiKey) {
    throw new Error("Gelato API key not configured");
  }

  const response = await fetch(`${baseUrl}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Gelato API error: ${response.status}`);
  }

  return response.json();
}

// ============ PRODUCTS ============

// Get product catalog - filtered for relevant trade products
export async function getTradeProducts(): Promise<GelatoProduct[]> {
  // Gelato product UIDs for trade-relevant items
  const tradeProductCategories = [
    "business-cards",
    "flyers",
    "stickers",
    "mugs",
    "t-shirts",
    "posters",
    "banners",
  ];

  // In production, you would fetch from the catalog API
  // For now, return curated products for trades
  const products: GelatoProduct[] = [
    {
      productUid: "business_cards_standard_85x55",
      title: "Business Cards",
      description: "Premium 400gsm business cards, perfect for trades",
      category: "business-cards",
      printAreas: [
        { name: "front", width: 85, height: 55 },
        { name: "back", width: 85, height: 55 },
      ],
      variants: [
        {
          variantUid: "bc_100_matt",
          title: "100 cards - Matt finish",
          price: 1499,
          currency: "GBP",
        },
        {
          variantUid: "bc_250_matt",
          title: "250 cards - Matt finish",
          price: 2499,
          currency: "GBP",
        },
        {
          variantUid: "bc_500_matt",
          title: "500 cards - Matt finish",
          price: 3999,
          currency: "GBP",
        },
        {
          variantUid: "bc_100_gloss",
          title: "100 cards - Gloss finish",
          price: 1699,
          currency: "GBP",
        },
        {
          variantUid: "bc_250_gloss",
          title: "250 cards - Gloss finish",
          price: 2899,
          currency: "GBP",
        },
      ],
    },
    {
      productUid: "flyers_a5_single",
      title: "A5 Flyers",
      description: "A5 flyers for service promotion and door drops",
      category: "flyers",
      printAreas: [{ name: "front", width: 148, height: 210 }],
      variants: [
        {
          variantUid: "flyer_100",
          title: "100 flyers",
          price: 2499,
          currency: "GBP",
        },
        {
          variantUid: "flyer_250",
          title: "250 flyers",
          price: 3999,
          currency: "GBP",
        },
        {
          variantUid: "flyer_500",
          title: "500 flyers",
          price: 5999,
          currency: "GBP",
        },
        {
          variantUid: "flyer_1000",
          title: "1000 flyers",
          price: 8999,
          currency: "GBP",
        },
      ],
    },
    {
      productUid: "stickers_circle_50mm",
      title: "Round Stickers (50mm)",
      description: "Branded stickers for vans, tools, and marketing",
      category: "stickers",
      printAreas: [{ name: "front", width: 50, height: 50 }],
      variants: [
        {
          variantUid: "sticker_50",
          title: "50 stickers",
          price: 999,
          currency: "GBP",
        },
        {
          variantUid: "sticker_100",
          title: "100 stickers",
          price: 1499,
          currency: "GBP",
        },
        {
          variantUid: "sticker_250",
          title: "250 stickers",
          price: 2499,
          currency: "GBP",
        },
      ],
    },
    {
      productUid: "mug_white_11oz",
      title: "Branded Mug",
      description: "11oz white ceramic mug with your branding",
      category: "mugs",
      printAreas: [{ name: "wrap", width: 200, height: 80 }],
      variants: [
        {
          variantUid: "mug_single",
          title: "Single mug",
          price: 1299,
          currency: "GBP",
        },
        {
          variantUid: "mug_6",
          title: "Pack of 6",
          price: 5999,
          currency: "GBP",
        },
        {
          variantUid: "mug_12",
          title: "Pack of 12",
          price: 9999,
          currency: "GBP",
        },
      ],
    },
    {
      productUid: "tshirt_workwear",
      title: "Workwear T-Shirt",
      description: "Durable cotton t-shirt with logo print",
      category: "t-shirts",
      printAreas: [
        { name: "front", width: 300, height: 400 },
        { name: "back", width: 300, height: 400 },
      ],
      variants: [
        { variantUid: "tshirt_s", title: "Small", price: 1899, currency: "GBP" },
        {
          variantUid: "tshirt_m",
          title: "Medium",
          price: 1899,
          currency: "GBP",
        },
        { variantUid: "tshirt_l", title: "Large", price: 1899, currency: "GBP" },
        {
          variantUid: "tshirt_xl",
          title: "X-Large",
          price: 1899,
          currency: "GBP",
        },
        {
          variantUid: "tshirt_xxl",
          title: "XX-Large",
          price: 1999,
          currency: "GBP",
        },
      ],
    },
    {
      productUid: "banner_pvc_1x2m",
      title: "PVC Banner (1m x 2m)",
      description: "Durable outdoor banner for job sites",
      category: "banners",
      printAreas: [{ name: "front", width: 2000, height: 1000 }],
      variants: [
        {
          variantUid: "banner_single",
          title: "Single banner",
          price: 4999,
          currency: "GBP",
        },
        {
          variantUid: "banner_2",
          title: "Pack of 2",
          price: 8999,
          currency: "GBP",
        },
      ],
    },
    {
      productUid: "van_magnet_a3",
      title: "Van Magnet (A3)",
      description: "Removable magnetic sign for vehicles",
      category: "vehicle",
      printAreas: [{ name: "front", width: 420, height: 297 }],
      variants: [
        {
          variantUid: "magnet_single",
          title: "Single magnet",
          price: 2999,
          currency: "GBP",
        },
        {
          variantUid: "magnet_pair",
          title: "Pair (both sides)",
          price: 4999,
          currency: "GBP",
        },
      ],
    },
  ];

  return products;
}

export async function getProductDetails(
  productUid: string
): Promise<GelatoProduct | null> {
  const products = await getTradeProducts();
  return products.find((p) => p.productUid === productUid) || null;
}

// ============ QUOTES ============

export interface QuoteRequest {
  productUid: string;
  variantUid: string;
  quantity: number;
  shippingCountry: string;
}

export interface QuoteResponse {
  productCost: number;
  shippingCost: number;
  totalCost: number;
  currency: string;
  estimatedDelivery: string;
}

export async function getQuote(request: QuoteRequest): Promise<QuoteResponse> {
  // In production, this would call the Gelato pricing API
  // For now, calculate based on our product data
  const product = await getProductDetails(request.productUid);
  if (!product) {
    throw new Error("Product not found");
  }

  const variant = product.variants.find(
    (v) => v.variantUid === request.variantUid
  );
  if (!variant) {
    throw new Error("Variant not found");
  }

  const productCost = variant.price * request.quantity;
  const shippingCost = request.shippingCountry === "GB" ? 399 : 999;

  return {
    productCost,
    shippingCost,
    totalCost: productCost + shippingCost,
    currency: "GBP",
    estimatedDelivery:
      request.shippingCountry === "GB" ? "3-5 business days" : "7-14 business days",
  };
}

// ============ ORDERS ============

export interface CreateOrderRequest {
  orderReferenceId: string;
  shippingAddress: {
    firstName: string;
    lastName: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    postCode: string;
    country: string;
    phone?: string;
    email: string;
  };
  items: Array<{
    itemReferenceId: string;
    productUid: string;
    quantity: number;
    files: Array<{
      url: string;
      type: "default" | "preview";
      areaName: string;
    }>;
  }>;
}

export async function createOrder(
  request: CreateOrderRequest
): Promise<GelatoOrder> {
  const data = await gelatoApiRequest<{ order: GelatoOrder }>(
    GELATO_ORDER_API,
    "/orders",
    {
      method: "POST",
      body: {
        orderReferenceId: request.orderReferenceId,
        orderType: "order",
        shippingAddress: request.shippingAddress,
        items: request.items,
      },
    }
  );

  return data.order;
}

export async function getOrder(orderId: string): Promise<GelatoOrder> {
  const data = await gelatoApiRequest<{ order: GelatoOrder }>(
    GELATO_ORDER_API,
    `/orders/${orderId}`
  );
  return data.order;
}

export async function getOrderByReference(
  referenceId: string
): Promise<GelatoOrder> {
  const data = await gelatoApiRequest<{ orders: GelatoOrder[] }>(
    GELATO_ORDER_API,
    `/orders?orderReferenceId=${referenceId}`
  );

  if (!data.orders || data.orders.length === 0) {
    throw new Error("Order not found");
  }

  return data.orders[0];
}

export async function cancelOrder(orderId: string): Promise<void> {
  await gelatoApiRequest(GELATO_ORDER_API, `/orders/${orderId}/cancel`, {
    method: "POST",
  });
}

// ============ SHIPMENTS ============

export interface Shipment {
  id: string;
  orderId: string;
  carrier: string;
  trackingCode: string;
  trackingUrl: string;
  status: string;
}

export async function getOrderShipments(orderId: string): Promise<Shipment[]> {
  const data = await gelatoApiRequest<{ shipments: Shipment[] }>(
    GELATO_ORDER_API,
    `/orders/${orderId}/shipments`
  );
  return data.shipments || [];
}

// ============ CATALOG (Real API) ============

export interface GelatoCatalogProduct {
  productUid: string;
  title: string;
  description?: string;
  category?: string;
  previewUrl?: string;
}

export interface GelatoCatalog {
  catalogUid: string;
  title: string;
  products: GelatoCatalogProduct[];
}

// Fetch all products from Gelato and group by product type
export async function getGelatoProducts(): Promise<{
  products: GelatoCatalogProduct[];
  categories: Array<{ id: string; name: string; count: number }>;
}> {
  const apiKey = await getSetting("gelato_api_key");
  if (!apiKey) {
    throw new Error("Gelato API key not configured");
  }

  const response = await fetch(`${GELATO_API_BASE}/products?limit=200`, {
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = await response.json();
  const rawProducts = data.products || [];

  // Transform and deduplicate by productNameUid (e.g., "business-cards", "t-shirt")
  const productMap = new Map<string, GelatoCatalogProduct>();
  const categoryCount = new Map<string, number>();

  for (const p of rawProducts) {
    const category = p.productTypeUid || "other";
    categoryCount.set(category, (categoryCount.get(category) || 0) + 1);

    // Use productNameUid as key to get unique product types
    if (!productMap.has(p.productNameUid)) {
      productMap.set(p.productNameUid, {
        productUid: p.productUid,
        title: formatProductName(p.productNameUid),
        description: p.productTypeUid,
        category: p.productTypeUid,
      });
    }
  }

  // Build categories list
  const categories = Array.from(categoryCount.entries())
    .map(([id, count]) => ({
      id,
      name: formatProductName(id),
      count,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    products: Array.from(productMap.values()),
    categories,
  };
}

// Fetch products by category/type
export async function getProductsByCategory(category: string): Promise<GelatoCatalogProduct[]> {
  const apiKey = await getSetting("gelato_api_key");
  if (!apiKey) {
    throw new Error("Gelato API key not configured");
  }

  const response = await fetch(`${GELATO_API_BASE}/products?limit=100`, {
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch products: ${response.status}`);
  }

  const data = await response.json();
  const rawProducts = data.products || [];

  // Filter by category and deduplicate by productNameUid
  const filtered = rawProducts.filter((p: { productTypeUid: string }) => p.productTypeUid === category);
  const productMap = new Map<string, GelatoCatalogProduct>();

  for (const p of filtered) {
    if (!productMap.has(p.productNameUid)) {
      // Get first variant's dimensions for description
      const dims = p.dimensions?.map((d: { valueFormatted: string }) => d.valueFormatted).join(", ") || "";
      productMap.set(p.productNameUid + "_" + p.productUid, {
        productUid: p.productUid,
        title: formatProductName(p.productNameUid) + (dims ? ` - ${dims}` : ""),
        description: p.productTypeUid,
        category: p.productTypeUid,
        // Try various possible image fields from Gelato API
        previewUrl: p.previewUrl || p.imageUrl || p.thumbnailUrl || p.mockupImageUrl || getGelatoProductImage(p.productTypeUid),
      });
    }
  }

  return Array.from(productMap.values()).slice(0, 50); // Limit to 50 per category
}

// Fallback images for Gelato product categories
function getGelatoProductImage(productType: string): string {
  const images: Record<string, string> = {
    "hoodie": "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop",
    "t-shirt": "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    "poster": "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop",
    "canvas": "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    "mug": "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
    "phone-case": "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop",
    "tote-bag": "https://images.unsplash.com/photo-1597633125097-5a9ae3a22e77?w=400&h=400&fit=crop",
    "sticker": "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    "business-card": "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=400&h=400&fit=crop",
    "flyer": "https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=400&h=400&fit=crop",
    "photobook": "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop",
    "wall-art": "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop",
    "cushion": "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop",
    "blanket": "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop",
  };
  return images[productType] || "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=400&fit=crop";
}

// Helper to format product names
function formatProductName(name: string): string {
  return name
    .replace(/-/g, " ")
    .replace(/:/g, " - ")
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

// Get product details including pricing
export async function getGelatoProductDetails(productUid: string): Promise<{
  productUid: string;
  title: string;
  description: string;
  previewUrl?: string;
  variants: Array<{
    productUid: string;
    title: string;
    variantOptions: Record<string, string>;
  }>;
} | null> {
  const apiKey = await getSetting("gelato_api_key");
  if (!apiKey) {
    throw new Error("Gelato API key not configured");
  }

  const response = await fetch(`${GELATO_API_BASE}/products/${productUid}`, {
    headers: {
      "X-API-KEY": apiKey,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch product: ${response.status}`);
  }

  return response.json();
}

// Get pricing for a product
export async function getProductPricing(productUid: string, country: string = "GB"): Promise<{
  productUid: string;
  currency: string;
  prices: Array<{
    quantity: number;
    price: number;
    priceInclVat: number;
  }>;
} | null> {
  const apiKey = await getSetting("gelato_api_key");
  if (!apiKey) {
    throw new Error("Gelato API key not configured");
  }

  const response = await fetch(
    `${GELATO_API_BASE}/products/${productUid}/prices?country=${country}&currency=GBP`,
    {
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    if (response.status === 404) return null;
    throw new Error(`Failed to fetch pricing: ${response.status}`);
  }

  return response.json();
}

// ============ DATABASE PRODUCT MANAGEMENT ============

export interface SavedProduct {
  id: string;
  gelato_product_uid: string;
  name: string;
  description: string | null;
  category: string | null;
  base_price: number;
  markup_percent: number;
  markup_fixed: number;
  is_active: boolean;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

// Get all saved products from database
export async function getSavedProducts(activeOnly: boolean = false): Promise<SavedProduct[]> {
  const whereClause = activeOnly ? "WHERE is_active = TRUE" : "";
  const products = await query<SavedProduct[]>(
    `SELECT * FROM print_products ${whereClause} ORDER BY category, name`
  );
  return products;
}

// Save or update a product in database
export async function saveProduct(product: {
  gelato_product_uid: string;
  name: string;
  description?: string;
  category?: string;
  base_price: number;
  markup_percent?: number;
  markup_fixed?: number;
  is_active?: boolean;
  image_url?: string;
}): Promise<void> {
  const existing = await query<SavedProduct[]>(
    "SELECT id FROM print_products WHERE gelato_product_uid = ?",
    [product.gelato_product_uid]
  );

  if (existing.length > 0) {
    // Update existing
    await query(
      `UPDATE print_products SET
        name = ?,
        description = ?,
        category = ?,
        base_price = ?,
        markup_percent = ?,
        markup_fixed = ?,
        is_active = ?,
        image_url = ?
      WHERE gelato_product_uid = ?`,
      [
        product.name,
        product.description || null,
        product.category || null,
        product.base_price,
        product.markup_percent ?? 30,
        product.markup_fixed ?? 0,
        product.is_active ?? false,
        product.image_url || null,
        product.gelato_product_uid,
      ]
    );
  } else {
    // Insert new
    await query(
      `INSERT INTO print_products
        (gelato_product_uid, name, description, category, base_price, markup_percent, markup_fixed, is_active, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        product.gelato_product_uid,
        product.name,
        product.description || null,
        product.category || null,
        product.base_price,
        product.markup_percent ?? 30,
        product.markup_fixed ?? 0,
        product.is_active ?? false,
        product.image_url || null,
      ]
    );
  }
}

// Update product markup/active status
export async function updateProductSettings(
  gelatoProductUid: string,
  settings: {
    markup_percent?: number;
    markup_fixed?: number;
    is_active?: boolean;
  }
): Promise<void> {
  const updates: string[] = [];
  const values: (number | boolean)[] = [];

  if (settings.markup_percent !== undefined) {
    updates.push("markup_percent = ?");
    values.push(settings.markup_percent);
  }
  if (settings.markup_fixed !== undefined) {
    updates.push("markup_fixed = ?");
    values.push(settings.markup_fixed);
  }
  if (settings.is_active !== undefined) {
    updates.push("is_active = ?");
    values.push(settings.is_active);
  }

  if (updates.length === 0) return;

  values.push(gelatoProductUid as unknown as number); // Type hack for the WHERE clause
  await query(
    `UPDATE print_products SET ${updates.join(", ")} WHERE gelato_product_uid = ?`,
    values
  );
}

// Delete a product from database
export async function deleteProduct(gelatoProductUid: string): Promise<void> {
  await query("DELETE FROM print_products WHERE gelato_product_uid = ?", [gelatoProductUid]);
}

// Calculate customer price with markup
export function calculateCustomerPrice(basePrice: number, markupPercent: number, markupFixed: number): number {
  return Math.round(basePrice * (1 + markupPercent / 100) + markupFixed);
}

// ============ TEST CONNECTION ============

export async function testConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const apiKey = await getSetting("gelato_api_key");
    if (!apiKey) {
      return {
        success: false,
        message: "Gelato API key not configured",
      };
    }

    // Test by fetching products (the /products endpoint exists)
    const response = await fetch(`${GELATO_API_BASE}/products?limit=1`, {
      headers: {
        "X-API-KEY": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return {
        success: true,
        message: "Connected to Gelato API",
      };
    } else {
      return {
        success: false,
        message: `API returned status ${response.status}`,
      };
    }
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to connect to Gelato",
    };
  }
}

// ============ DESIGN TEMPLATES ============

// Pre-made templates for trades
export interface DesignTemplate {
  id: string;
  name: string;
  trade: string;
  productUid: string;
  previewUrl: string;
  editableFields: string[];
}

export function getDesignTemplates(trade: string): DesignTemplate[] {
  // Templates would be stored in database or generated
  // This is a placeholder structure
  const templates: DesignTemplate[] = [
    {
      id: "bc_plumber_1",
      name: "Professional Plumber Card",
      trade: "plumber",
      productUid: "business_cards_standard_85x55",
      previewUrl: "/templates/bc-plumber-1.png",
      editableFields: ["businessName", "name", "phone", "email", "website"],
    },
    {
      id: "bc_electrician_1",
      name: "Electric Services Card",
      trade: "electrician",
      productUid: "business_cards_standard_85x55",
      previewUrl: "/templates/bc-electrician-1.png",
      editableFields: ["businessName", "name", "phone", "email", "certifications"],
    },
    {
      id: "bc_builder_1",
      name: "Builder Business Card",
      trade: "builder",
      productUid: "business_cards_standard_85x55",
      previewUrl: "/templates/bc-builder-1.png",
      editableFields: ["businessName", "name", "phone", "email", "services"],
    },
    {
      id: "flyer_plumber_1",
      name: "Plumbing Services Flyer",
      trade: "plumber",
      productUid: "flyers_a5_single",
      previewUrl: "/templates/flyer-plumber-1.png",
      editableFields: [
        "businessName",
        "phone",
        "services",
        "callToAction",
        "area",
      ],
    },
  ];

  return templates.filter((t) => t.trade === trade || trade === "all");
}
