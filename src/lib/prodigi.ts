import { getSetting } from "./admin";

const PRODIGI_API_BASE = "https://api.prodigi.com/v4.0";
const PRODIGI_SANDBOX_BASE = "https://api.sandbox.prodigi.com/v4.0";

// Use sandbox for testing, production for live orders
const getApiBase = () => PRODIGI_API_BASE;

interface ProdigiApiOptions {
  method?: string;
  body?: Record<string, unknown>;
}

// ============ TYPES ============

export interface ProdigiProduct {
  sku: string;
  description: string;
  productDimensions?: {
    width: number;
    height: number;
    unit: string;
  };
  category?: string;
  attributes?: Record<string, string>;
}

export interface ProdigiQuoteItem {
  sku: string;
  copies: number;
  sizing?: "fillPrintArea" | "fitPrintArea" | "stretchToPrintArea";
  attributes?: Record<string, string>;
}

export interface ProdigiQuote {
  quotes: Array<{
    shipmentMethod: string;
    costSummary: {
      items: { amount: string; currency: string };
      shipping: { amount: string; currency: string };
      totalCost: { amount: string; currency: string };
    };
  }>;
}

export interface ProdigiOrderItem {
  sku: string;
  copies: number;
  sizing?: "fillPrintArea" | "fitPrintArea" | "stretchToPrintArea";
  assets: Array<{
    printArea: string;
    url: string;
  }>;
  attributes?: Record<string, string>;
}

export interface ProdigiRecipient {
  name: string;
  email?: string;
  phoneNumber?: string;
  address: {
    line1: string;
    line2?: string;
    postalOrZipCode: string;
    townOrCity: string;
    stateOrCounty?: string;
    countryCode: string;
  };
}

export interface ProdigiOrder {
  id: string;
  status: {
    stage: string;
    issues?: Array<{ errorCode: string; description: string }>;
  };
  created: string;
  recipient: ProdigiRecipient;
  items: Array<{
    id: string;
    sku: string;
    status: string;
  }>;
  shipments?: Array<{
    id: string;
    carrier: string;
    tracking?: {
      number: string;
      url: string;
    };
  }>;
}

// ============ API HELPERS ============

async function prodigiApiRequest<T>(
  endpoint: string,
  options: ProdigiApiOptions = {}
): Promise<T> {
  const apiKey = await getSetting("prodigi_api_key");
  if (!apiKey) {
    throw new Error("Prodigi API key not configured");
  }

  const response = await fetch(`${getApiBase()}${endpoint}`, {
    method: options.method || "GET",
    headers: {
      "X-API-Key": apiKey,
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Prodigi API error: ${response.status}`);
  }

  return response.json();
}

// ============ PRODUCTS ============

export async function getProdigiProduct(sku: string): Promise<ProdigiProduct | null> {
  try {
    const data = await prodigiApiRequest<{ product: ProdigiProduct }>(`/products/${sku}`);
    return data.product;
  } catch (error) {
    console.error("Failed to fetch Prodigi product:", error);
    return null;
  }
}

// Prodigi doesn't have a list endpoint - we define popular products for trades
export function getProdigiTradeProducts(): Array<{
  sku: string;
  name: string;
  description: string;
  category: string;
  previewUrl: string;
}> {
  return [
    // Wall Art - Canvas
    {
      sku: "GLOBAL-CAN-16x20",
      name: "Canvas Print 16x20\"",
      description: "Gallery-wrapped canvas, perfect for job photos",
      category: "canvas",
      previewUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    },
    {
      sku: "GLOBAL-CAN-12x12",
      name: "Canvas Print 12x12\"",
      description: "Square canvas for before/after shots",
      category: "canvas",
      previewUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    },
    {
      sku: "GLOBAL-CAN-24x36",
      name: "Canvas Print 24x36\"",
      description: "Large canvas for showroom display",
      category: "canvas",
      previewUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=400&h=400&fit=crop",
    },
    // Posters
    {
      sku: "GLOBAL-PPR-A3",
      name: "Poster A3",
      description: "High-quality matte poster",
      category: "poster",
      previewUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop",
    },
    {
      sku: "GLOBAL-PPR-A2",
      name: "Poster A2",
      description: "Large format poster for displays",
      category: "poster",
      previewUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=400&fit=crop",
    },
    // Framed Prints
    {
      sku: "GLOBAL-FRP-A4-BL",
      name: "Framed Print A4 (Black)",
      description: "A4 print with black frame",
      category: "framed",
      previewUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop",
    },
    {
      sku: "GLOBAL-FRP-A3-BL",
      name: "Framed Print A3 (Black)",
      description: "A3 print with black frame",
      category: "framed",
      previewUrl: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=400&h=400&fit=crop",
    },
    // Mugs
    {
      sku: "GLOBAL-MUG-11OZ",
      name: "Ceramic Mug 11oz",
      description: "Branded mug for customers and staff",
      category: "mug",
      previewUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
    },
    {
      sku: "GLOBAL-MUG-15OZ",
      name: "Ceramic Mug 15oz",
      description: "Large branded mug",
      category: "mug",
      previewUrl: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=400&h=400&fit=crop",
    },
    // Apparel
    {
      sku: "GLOBAL-GILDAN-5000-S-BLK",
      name: "T-Shirt Black (S)",
      description: "Gildan cotton t-shirt - Small",
      category: "apparel",
      previewUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    {
      sku: "GLOBAL-GILDAN-5000-M-BLK",
      name: "T-Shirt Black (M)",
      description: "Gildan cotton t-shirt - Medium",
      category: "apparel",
      previewUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    {
      sku: "GLOBAL-GILDAN-5000-L-BLK",
      name: "T-Shirt Black (L)",
      description: "Gildan cotton t-shirt - Large",
      category: "apparel",
      previewUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    {
      sku: "GLOBAL-GILDAN-5000-XL-BLK",
      name: "T-Shirt Black (XL)",
      description: "Gildan cotton t-shirt - X-Large",
      category: "apparel",
      previewUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop",
    },
    // Stickers
    {
      sku: "GLOBAL-STK-3x3",
      name: "Sticker 3x3\"",
      description: "Vinyl stickers for tools and vans",
      category: "sticker",
      previewUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    },
    {
      sku: "GLOBAL-STK-4x4",
      name: "Sticker 4x4\"",
      description: "Larger vinyl stickers",
      category: "sticker",
      previewUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop",
    },
    // Phone Cases
    {
      sku: "GLOBAL-AIP-SNAP-14PRO",
      name: "iPhone 14 Pro Case",
      description: "Snap case with your branding",
      category: "phone-case",
      previewUrl: "https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400&h=400&fit=crop",
    },
  ];
}

// Get products grouped by category
export function getProdigiCategories(): Array<{
  id: string;
  name: string;
  count: number;
}> {
  const products = getProdigiTradeProducts();
  const categoryCount = new Map<string, number>();

  for (const p of products) {
    categoryCount.set(p.category, (categoryCount.get(p.category) || 0) + 1);
  }

  const categoryNames: Record<string, string> = {
    canvas: "Canvas Prints",
    poster: "Posters",
    framed: "Framed Prints",
    mug: "Mugs",
    apparel: "Apparel",
    sticker: "Stickers",
    "phone-case": "Phone Cases",
  };

  return Array.from(categoryCount.entries()).map(([id, count]) => ({
    id,
    name: categoryNames[id] || id,
    count,
  }));
}

export function getProdigiProductsByCategory(category: string) {
  return getProdigiTradeProducts().filter((p) => p.category === category);
}

// ============ QUOTES ============

export interface GetQuoteRequest {
  destinationCountryCode: string;
  currencyCode?: string;
  items: ProdigiQuoteItem[];
}

export async function getQuote(request: GetQuoteRequest): Promise<ProdigiQuote> {
  const data = await prodigiApiRequest<{ outcome: string; quotes: ProdigiQuote["quotes"] }>(
    "/quotes",
    {
      method: "POST",
      body: {
        shippingMethod: "Budget",
        destinationCountryCode: request.destinationCountryCode,
        currencyCode: request.currencyCode || "GBP",
        items: request.items,
      },
    }
  );

  return { quotes: data.quotes };
}

// ============ ORDERS ============

export interface CreateOrderRequest {
  merchantReference: string;
  shippingMethod: "Budget" | "Express" | "Overnight";
  recipient: ProdigiRecipient;
  items: ProdigiOrderItem[];
}

export async function createOrder(request: CreateOrderRequest): Promise<ProdigiOrder> {
  const data = await prodigiApiRequest<{ order: ProdigiOrder }>("/orders", {
    method: "POST",
    body: {
      merchantReference: request.merchantReference,
      shippingMethod: request.shippingMethod,
      recipient: request.recipient,
      items: request.items,
    },
  });

  return data.order;
}

export async function getOrder(orderId: string): Promise<ProdigiOrder> {
  const data = await prodigiApiRequest<{ order: ProdigiOrder }>(`/orders/${orderId}`);
  return data.order;
}

export async function listOrders(limit: number = 20): Promise<ProdigiOrder[]> {
  const data = await prodigiApiRequest<{ orders: ProdigiOrder[] }>(`/orders?limit=${limit}`);
  return data.orders;
}

export async function cancelOrder(orderId: string): Promise<void> {
  await prodigiApiRequest(`/orders/${orderId}/actions/cancel`, {
    method: "POST",
  });
}

// ============ TEST CONNECTION ============

export async function testConnection(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    const apiKey = await getSetting("prodigi_api_key");
    if (!apiKey) {
      return {
        success: false,
        message: "Prodigi API key not configured",
      };
    }

    // Test by fetching a known product
    const response = await fetch(`${getApiBase()}/products/GLOBAL-MUG-11OZ`, {
      headers: {
        "X-API-Key": apiKey,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      return {
        success: true,
        message: "Connected to Prodigi API",
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
      message: error instanceof Error ? error.message : "Failed to connect to Prodigi",
    };
  }
}
