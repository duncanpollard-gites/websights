import { getSetting } from "./admin";
import { query } from "./db";

const PRINTFUL_API_BASE = "https://api.printful.com";

interface PrintfulApiOptions {
  method?: string;
  body?: unknown;
}

// ============ API REQUEST WRAPPER ============

async function printfulApiRequest<T>(
  endpoint: string,
  options: PrintfulApiOptions = {}
): Promise<T> {
  const apiKey = await getSetting("printful_api_key");
  const storeId = await getSetting("printful_store_id");

  if (!apiKey) {
    throw new Error("Printful API key not configured");
  }

  const headers: Record<string, string> = {
    "Authorization": `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  };

  if (storeId) {
    headers["X-PF-Store-Id"] = storeId;
  }

  const response = await fetch(`${PRINTFUL_API_BASE}${endpoint}`, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await response.json();

  if (data.code !== 200) {
    throw new Error(data.error?.message || data.result || `Printful API error: ${data.code}`);
  }

  return data.result;
}

// ============ TYPES ============

export interface PrintfulProduct {
  id: number;
  type: string;
  type_name: string;
  title: string;
  brand: string | null;
  model: string;
  image: string;
  variant_count: number;
  currency: string;
  files: Array<{
    id: string;
    type: string;
    title: string;
    additional_price: string | null;
  }>;
}

export interface PrintfulVariant {
  id: number;
  product_id: number;
  name: string;
  size: string;
  color: string;
  color_code: string;
  color_code2: string | null;
  image: string;
  price: string;
  in_stock: boolean;
  availability_status: string;
}

export interface PrintfulMockup {
  placement: string;
  variant_ids: number[];
  mockup_url: string;
  extra: Array<{
    title: string;
    option: string;
    url: string;
  }>;
}

export interface PrintfulShippingRate {
  id: string;
  name: string;
  rate: string;
  currency: string;
  minDeliveryDays: number;
  maxDeliveryDays: number;
}

export interface PrintfulOrderRecipient {
  name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  state_code?: string;
  state_name?: string;
  country_code: string;
  country_name?: string;
  zip: string;
  phone?: string;
  email?: string;
}

export interface PrintfulOrderItem {
  variant_id: number;
  quantity: number;
  files: Array<{
    type: string;
    url: string;
  }>;
  options?: Array<{
    id: string;
    value: string;
  }>;
}

// ============ PRODUCTS ============

// Get all products from catalog
export async function getProducts(): Promise<PrintfulProduct[]> {
  const products = await printfulApiRequest<PrintfulProduct[]>("/products");
  return products;
}

// Get product details with variants
export async function getProduct(productId: number): Promise<{
  product: PrintfulProduct;
  variants: PrintfulVariant[];
}> {
  const result = await printfulApiRequest<{
    product: PrintfulProduct;
    variants: PrintfulVariant[];
  }>(`/products/${productId}`);
  return result;
}

// Get products by category
export async function getProductsByCategory(category: string): Promise<PrintfulProduct[]> {
  const allProducts = await getProducts();
  return allProducts.filter(p =>
    p.type_name.toLowerCase().includes(category.toLowerCase()) ||
    p.type.toLowerCase().includes(category.toLowerCase())
  );
}

// Curated products for UK tradespeople
export function getTradeProductIds(): number[] {
  return [
    71,   // Bella + Canvas 3001 T-Shirt
    380,  // Gildan 18000 Sweatshirt
    19,   // White Glossy Mug (11oz)
    300,  // Black Glossy Mug
    83,   // Gildan 18500 Hoodie
    181,  // Unisex Tank Top
    527,  // Stickers
    // Add more as needed
  ];
}

// Get trade-relevant products with details
export async function getTradeProducts(): Promise<Array<{
  product: PrintfulProduct;
  variants: PrintfulVariant[];
}>> {
  const productIds = getTradeProductIds();
  const products = await Promise.all(
    productIds.map(id => getProduct(id).catch(() => null))
  );
  return products.filter((p): p is NonNullable<typeof p> => p !== null);
}

// ============ MOCKUPS ============

export interface MockupRequest {
  productId: number;
  variantIds: number[];
  imageUrl: string;
  placement?: string;
  position?: {
    area_width: number;
    area_height: number;
    width: number;
    height: number;
    top: number;
    left: number;
  };
}

// Create mockup generation task
export async function createMockupTask(request: MockupRequest): Promise<string> {
  // Get printfile info for proper positioning
  const printfiles = await printfulApiRequest<{
    product_id: number;
    available_placements: Record<string, {
      placement: string;
      technique: string;
    }>;
    printfiles: Array<{
      printfile_id: number;
      width: number;
      height: number;
      dpi: number;
      fill_mode: string;
      placements: string[];
    }>;
  }>(`/mockup-generator/printfiles/${request.productId}`);

  // Find the default printfile for positioning
  const defaultPrintfile = printfiles.printfiles?.find(pf =>
    pf.placements?.includes(request.placement || "front") ||
    pf.placements?.includes("default")
  );

  const position = request.position || (defaultPrintfile ? {
    area_width: defaultPrintfile.width,
    area_height: defaultPrintfile.height,
    width: Math.round(defaultPrintfile.width * 0.8),
    height: Math.round(defaultPrintfile.height * 0.8),
    top: Math.round(defaultPrintfile.height * 0.1),
    left: Math.round(defaultPrintfile.width * 0.1),
  } : {
    area_width: 1800,
    area_height: 2400,
    width: 1400,
    height: 1400,
    top: 500,
    left: 200,
  });

  const placement = request.placement || "front";

  const result = await printfulApiRequest<{ task_key: string; status: string }>(
    `/mockup-generator/create-task/${request.productId}`,
    {
      method: "POST",
      body: {
        variant_ids: request.variantIds,
        format: "jpg",
        files: [{
          placement,
          image_url: request.imageUrl,
          position,
        }],
      },
    }
  );

  return result.task_key;
}

// Get mockup task result
export async function getMockupResult(taskKey: string): Promise<{
  status: string;
  mockups: PrintfulMockup[];
  printfiles: Array<{
    variant_ids: number[];
    placement: string;
    url: string;
  }>;
} | null> {
  const result = await printfulApiRequest<{
    task_key: string;
    status: string;
    mockups?: PrintfulMockup[];
    printfiles?: Array<{
      variant_ids: number[];
      placement: string;
      url: string;
    }>;
  }>(`/mockup-generator/task?task_key=${taskKey}`);

  if (result.status === "pending") {
    return null;
  }

  return {
    status: result.status,
    mockups: result.mockups || [],
    printfiles: result.printfiles || [],
  };
}

// Generate mockup and wait for result (with polling)
export async function generateMockup(
  request: MockupRequest,
  maxWaitMs: number = 30000
): Promise<PrintfulMockup[]> {
  const taskKey = await createMockupTask(request);

  const startTime = Date.now();
  const pollInterval = 1000;

  while (Date.now() - startTime < maxWaitMs) {
    const result = await getMockupResult(taskKey);

    if (result && result.status === "completed") {
      return result.mockups;
    }

    if (result && result.status === "failed") {
      throw new Error("Mockup generation failed");
    }

    // Wait before polling again
    await new Promise(resolve => setTimeout(resolve, pollInterval));
  }

  throw new Error("Mockup generation timed out");
}

// ============ SHIPPING ============

export interface ShippingRequest {
  recipient: {
    country_code: string;
    city?: string;
    zip?: string;
  };
  items: Array<{
    variant_id: number;
    quantity: number;
  }>;
}

// Get shipping rates
export async function getShippingRates(request: ShippingRequest): Promise<PrintfulShippingRate[]> {
  const result = await printfulApiRequest<PrintfulShippingRate[]>(
    "/shipping/rates",
    {
      method: "POST",
      body: {
        recipient: request.recipient,
        items: request.items,
      },
    }
  );
  return result;
}

// ============ ORDERS ============

export interface CreateOrderRequest {
  external_id?: string;
  recipient: PrintfulOrderRecipient;
  items: PrintfulOrderItem[];
  retail_costs?: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    tax: string;
  };
  packing_slip?: {
    email: string;
    phone: string;
    message: string;
  };
}

export interface PrintfulOrder {
  id: number;
  external_id: string | null;
  store: number;
  status: string;
  shipping: string;
  shipping_service_name: string;
  created: number;
  updated: number;
  recipient: PrintfulOrderRecipient;
  items: Array<{
    id: number;
    external_id: string | null;
    variant_id: number;
    quantity: number;
    price: string;
    retail_price: string | null;
    name: string;
    product: {
      variant_id: number;
      product_id: number;
      image: string;
      name: string;
    };
    files: Array<{
      type: string;
      url: string;
      preview_url: string;
    }>;
  }>;
  retail_costs: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    tax: string;
    total: string;
  };
  costs: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    tax: string;
    total: string;
  };
  shipments: Array<{
    id: number;
    carrier: string;
    service: string;
    tracking_number: string;
    tracking_url: string;
    ship_date: string;
    shipped_at: number;
  }>;
}

// Create order (draft by default)
export async function createOrder(
  request: CreateOrderRequest,
  confirm: boolean = false
): Promise<PrintfulOrder> {
  const result = await printfulApiRequest<PrintfulOrder>(
    `/orders${confirm ? "?confirm=true" : ""}`,
    {
      method: "POST",
      body: request,
    }
  );
  return result;
}

// Confirm a draft order
export async function confirmOrder(orderId: number): Promise<PrintfulOrder> {
  const result = await printfulApiRequest<PrintfulOrder>(
    `/orders/${orderId}/confirm`,
    { method: "POST" }
  );
  return result;
}

// Get order by ID
export async function getOrder(orderId: number): Promise<PrintfulOrder> {
  const result = await printfulApiRequest<PrintfulOrder>(`/orders/${orderId}`);
  return result;
}

// Get order by external ID
export async function getOrderByExternalId(externalId: string): Promise<PrintfulOrder> {
  const result = await printfulApiRequest<PrintfulOrder>(`/orders/@${externalId}`);
  return result;
}

// Cancel order
export async function cancelOrder(orderId: number): Promise<PrintfulOrder> {
  const result = await printfulApiRequest<PrintfulOrder>(
    `/orders/${orderId}`,
    { method: "DELETE" }
  );
  return result;
}

// Get all orders
export async function getOrders(status?: string, limit: number = 20): Promise<PrintfulOrder[]> {
  const params = new URLSearchParams();
  if (status) params.append("status", status);
  params.append("limit", limit.toString());

  const result = await printfulApiRequest<PrintfulOrder[]>(`/orders?${params}`);
  return result;
}

// ============ ESTIMATES ============

// Get cost estimate for an order
export async function getOrderEstimate(request: CreateOrderRequest): Promise<{
  costs: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    tax: string;
    total: string;
  };
  retail_costs: {
    currency: string;
    subtotal: string;
    discount: string;
    shipping: string;
    tax: string;
    total: string;
  };
}> {
  const result = await printfulApiRequest<{
    costs: {
      currency: string;
      subtotal: string;
      discount: string;
      shipping: string;
      tax: string;
      total: string;
    };
    retail_costs: {
      currency: string;
      subtotal: string;
      discount: string;
      shipping: string;
      tax: string;
      total: string;
    };
  }>("/orders/estimate-costs", {
    method: "POST",
    body: request,
  });
  return result;
}

// ============ STORE ============

export interface PrintfulStore {
  id: number;
  name: string;
  type: string;
  website: string;
  created: number;
}

// Get store info
export async function getStore(): Promise<PrintfulStore> {
  const result = await printfulApiRequest<PrintfulStore>("/store");
  return result;
}

// ============ TEST CONNECTION ============

export async function testConnection(): Promise<{
  success: boolean;
  message: string;
  store?: PrintfulStore;
}> {
  try {
    const apiKey = await getSetting("printful_api_key");
    if (!apiKey) {
      return {
        success: false,
        message: "Printful API key not configured",
      };
    }

    const storeId = await getSetting("printful_store_id");
    if (!storeId) {
      return {
        success: false,
        message: "Printful Store ID not configured",
      };
    }

    const store = await getStore();
    return {
      success: true,
      message: `Connected to ${store.name}`,
      store,
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to connect to Printful",
    };
  }
}

// ============ DATABASE - SAVED PRODUCTS ============

export interface SavedPrintfulProduct {
  id: string;
  printful_product_id: number;
  printful_variant_id: number;
  name: string;
  description: string | null;
  category: string | null;
  base_price: number; // in pence
  markup_percent: number;
  markup_fixed: number;
  is_active: boolean;
  image_url: string | null;
  mockup_url: string | null;
  size: string | null;
  color: string | null;
  created_at: string;
  updated_at: string;
}

// Calculate customer price with markup
export function calculateCustomerPrice(
  basePrice: number,
  markupPercent: number,
  markupFixed: number
): number {
  return Math.round(basePrice * (1 + markupPercent / 100) + markupFixed);
}

// Format price in pounds
export function formatPrice(pence: number): string {
  return `£${(pence / 100).toFixed(2)}`;
}

// Convert USD to GBP (approximate)
export function usdToGbpPence(usdPrice: string | number): number {
  const usd = typeof usdPrice === "string" ? parseFloat(usdPrice) : usdPrice;
  // Approximate conversion rate - in production, use real-time rates
  const gbp = usd * 0.80;
  return Math.round(gbp * 100); // Convert to pence
}

// ============ HELPER FUNCTIONS ============

// Get product categories from catalog
export async function getCategories(): Promise<Array<{
  id: string;
  name: string;
  count: number;
}>> {
  const products = await getProducts();
  const categoryMap = new Map<string, number>();

  for (const product of products) {
    const cat = product.type_name;
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + 1);
  }

  return Array.from(categoryMap.entries())
    .map(([name, count]) => ({
      id: name.toLowerCase().replace(/\s+/g, "-"),
      name,
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

// Find variant by size and color
export function findVariant(
  variants: PrintfulVariant[],
  size: string,
  color: string
): PrintfulVariant | undefined {
  return variants.find(v =>
    v.size.toLowerCase() === size.toLowerCase() &&
    v.color.toLowerCase() === color.toLowerCase() &&
    v.in_stock
  );
}

// Get available sizes for a product
export function getAvailableSizes(variants: PrintfulVariant[]): string[] {
  const sizes = [...new Set(variants.filter(v => v.in_stock).map(v => v.size))];
  // Sort sizes logically
  const sizeOrder = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL", "5XL"];
  return sizes.sort((a, b) => {
    const aIndex = sizeOrder.indexOf(a);
    const bIndex = sizeOrder.indexOf(b);
    if (aIndex === -1 && bIndex === -1) return a.localeCompare(b);
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

// Get available colors for a product
export function getAvailableColors(variants: PrintfulVariant[]): Array<{
  name: string;
  code: string;
}> {
  const colorMap = new Map<string, string>();
  for (const v of variants) {
    if (v.in_stock && !colorMap.has(v.color)) {
      colorMap.set(v.color, v.color_code);
    }
  }
  return Array.from(colorMap.entries())
    .map(([name, code]) => ({ name, code }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
