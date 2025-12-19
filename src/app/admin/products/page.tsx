"use client";

import { useState, useEffect, useRef } from "react";
import {
  Package,
  Loader2,
  RefreshCw,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  ArrowLeft,
  Percent,
  PoundSterling,
  ShoppingBag,
  Image,
} from "lucide-react";

interface Category {
  id: string;
  name: string;
  count: number;
}

interface CatalogProduct {
  productUid: string;
  title: string;
  description?: string;
  category?: string;
  previewUrl?: string;
  provider?: string;
  saved?: boolean;
  is_active?: boolean;
  base_price?: number;
  markup_percent?: number;
  markup_fixed?: number;
  customer_price?: number;
}

interface SavedProduct {
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
  customer_price: number;
}

interface ProviderStatus {
  connected: boolean;
  message: string;
  categories?: Category[];
}

interface PrintfulProduct {
  id: number;
  title: string;
  brand: string | null;
  model: string;
  type: string;
  image: string;
  variantCount: number;
  basePriceUsd?: number;
  basePriceGbp?: number;
  sizes?: string[];
  colors?: Array<{ name: string; code: string }>;
}

interface PrintfulStatus {
  connected: boolean;
  message: string;
  store?: { id: number; name: string };
  products?: PrintfulProduct[];
}

export default function AdminProductsPage() {
  const [gelato, setGelato] = useState<ProviderStatus>({ connected: false, message: "" });
  const [prodigi, setProdigi] = useState<ProviderStatus>({ connected: false, message: "" });
  const [printful, setPrintful] = useState<PrintfulStatus>({ connected: false, message: "" });
  const [savedProducts, setSavedProducts] = useState<SavedProduct[]>([]);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Provider selection
  const [selectedProvider, setSelectedProvider] = useState<"gelato" | "prodigi" | "printful">("printful");

  // Printful products view
  const [printfulProducts, setPrintfulProducts] = useState<PrintfulProduct[]>([]);
  const [printfulLoading, setPrintfulLoading] = useState(false);
  const [selectedPrintfulProduct, setSelectedPrintfulProduct] = useState<PrintfulProduct | null>(null);
  const [mockupLoading, setMockupLoading] = useState(false);
  const [mockupUrl, setMockupUrl] = useState<string | null>(null);
  const mockupImageUrlRef = useRef<HTMLInputElement>(null);

  // Category browsing
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<CatalogProduct[]>([]);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Edit modal
  const [editingProduct, setEditingProduct] = useState<SavedProduct | null>(null);
  const [editMarkupPercent, setEditMarkupPercent] = useState(30);
  const [editMarkupFixed, setEditMarkupFixed] = useState(0);
  const [editBasePrice, setEditBasePrice] = useState(0);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Gelato/Prodigi data
      const response = await fetch("/api/admin/products");
      const data = await response.json();

      setGelato({
        connected: data.gelato?.connected || false,
        message: data.gelato?.message || "",
        categories: data.gelato?.categories || [],
      });
      setProdigi({
        connected: data.prodigi?.connected || false,
        message: data.prodigi?.message || "",
        categories: data.prodigi?.categories || [],
      });
      setSavedProducts(data.savedProducts || []);
      setActiveCount(data.activeCount || 0);

      // Fetch Printful data
      try {
        const printfulResponse = await fetch("/api/admin/printful/products?tradeOnly=true");
        const printfulData = await printfulResponse.json();
        setPrintful({
          connected: printfulData.connected || false,
          message: printfulData.message || (printfulData.error ? printfulData.error : ""),
          store: printfulData.store,
          products: printfulData.products || [],
        });
        setPrintfulProducts(printfulData.products || []);
      } catch (err) {
        console.error("Failed to fetch Printful data:", err);
        setPrintful({ connected: false, message: "Failed to connect" });
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategoryProducts = async (category: Category) => {
    setCategoryLoading(true);
    setSelectedCategory(category);
    try {
      const response = await fetch(
        `/api/admin/products?category=${category.id}&provider=${selectedProvider}`
      );
      const data = await response.json();
      setCategoryProducts(data.products || []);
    } catch (error) {
      console.error("Failed to fetch category products:", error);
      setMessage({ type: "error", text: "Failed to load category" });
    } finally {
      setCategoryLoading(false);
    }
  };

  const addProduct = async (product: CatalogProduct) => {
    setActionLoading(product.productUid);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          product: {
            gelato_product_uid: product.productUid,
            name: product.title,
            description: product.description,
            category: product.category,
            base_price: 0,
            markup_percent: 30,
            markup_fixed: 0,
            is_active: false,
            image_url: product.previewUrl,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: "Product added to your catalog" });
        setCategoryProducts((prev) =>
          prev.map((p) =>
            p.productUid === product.productUid ? { ...p, saved: true } : p
          )
        );
        fetchData();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to add product" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setActionLoading(null);
    }
  };

  const toggleProduct = async (product: SavedProduct) => {
    setActionLoading(product.gelato_product_uid);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "toggle",
          gelato_product_uid: product.gelato_product_uid,
          is_active: !product.is_active,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSavedProducts((prev) =>
          prev.map((p) =>
            p.gelato_product_uid === product.gelato_product_uid
              ? { ...p, is_active: !p.is_active }
              : p
          )
        );
        setActiveCount((prev) => (product.is_active ? prev - 1 : prev + 1));
      }
    } catch {
      setMessage({ type: "error", text: "Failed to update product" });
    } finally {
      setActionLoading(null);
    }
  };

  const deleteProduct = async (product: SavedProduct) => {
    if (!confirm(`Remove "${product.name}" from your catalog?`)) return;

    setActionLoading(product.gelato_product_uid);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "delete",
          gelato_product_uid: product.gelato_product_uid,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSavedProducts((prev) =>
          prev.filter((p) => p.gelato_product_uid !== product.gelato_product_uid)
        );
        if (product.is_active) setActiveCount((prev) => prev - 1);
        setMessage({ type: "success", text: "Product removed" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to remove product" });
    } finally {
      setActionLoading(null);
    }
  };

  const openEditModal = (product: SavedProduct) => {
    setEditingProduct(product);
    setEditBasePrice(product.base_price);
    setEditMarkupPercent(product.markup_percent);
    setEditMarkupFixed(product.markup_fixed);
  };

  const saveProductSettings = async () => {
    if (!editingProduct) return;

    setActionLoading(editingProduct.gelato_product_uid);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          product: {
            gelato_product_uid: editingProduct.gelato_product_uid,
            name: editingProduct.name,
            description: editingProduct.description,
            category: editingProduct.category,
            base_price: editBasePrice,
            markup_percent: editMarkupPercent,
            markup_fixed: editMarkupFixed,
            is_active: editingProduct.is_active,
            image_url: editingProduct.image_url,
          },
        }),
      });

      const data = await response.json();
      if (data.success) {
        const customerPrice = Math.round(
          editBasePrice * (1 + editMarkupPercent / 100) + editMarkupFixed
        );
        setSavedProducts((prev) =>
          prev.map((p) =>
            p.gelato_product_uid === editingProduct.gelato_product_uid
              ? {
                  ...p,
                  base_price: editBasePrice,
                  markup_percent: editMarkupPercent,
                  markup_fixed: editMarkupFixed,
                  customer_price: customerPrice,
                }
              : p
          )
        );
        setEditingProduct(null);
        setMessage({ type: "success", text: "Pricing updated" });
      }
    } catch {
      setMessage({ type: "error", text: "Failed to save pricing" });
    } finally {
      setActionLoading(null);
    }
  };

  const formatPrice = (pence: number) => `£${(pence / 100).toFixed(2)}`;

  const calculatePreviewPrice = () => {
    return Math.round(editBasePrice * (1 + editMarkupPercent / 100) + editMarkupFixed);
  };

  // Generate mockup for a Printful product
  const handleGenerateMockup = async () => {
    const imageUrl = mockupImageUrlRef.current?.value;

    if (!selectedPrintfulProduct) {
      setMessage({ type: "error", text: "No product selected" });
      return;
    }

    if (!imageUrl) {
      setMessage({ type: "error", text: "Please enter an image URL" });
      return;
    }

    console.log("Generating mockup for product:", selectedPrintfulProduct.id, "with image:", imageUrl);

    setMockupLoading(true);
    setMockupUrl(null);
    setMessage(null);

    try {
      const response = await fetch("/api/admin/printful/mockup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedPrintfulProduct.id,
          imageUrl,
        }),
      });

      console.log("Mockup response status:", response.status);

      const data = await response.json();
      console.log("Mockup response data:", data);

      if (data.mockups && data.mockups.length > 0) {
        setMockupUrl(data.mockups[0].url);
        setMessage({ type: "success", text: "Mockup generated!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to generate mockup" });
      }
    } catch (err) {
      console.error("Mockup generation error:", err);
      setMessage({ type: "error", text: "Network error generating mockup" });
    } finally {
      setMockupLoading(false);
    }
  };

  // Add Printful product to catalog
  const addPrintfulProduct = async (product: PrintfulProduct) => {
    setActionLoading(`printful-${product.id}`);
    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "save",
          product: {
            gelato_product_uid: `printful-${product.id}`,
            name: product.title,
            description: `${product.brand || ""} ${product.model || ""}`.trim(),
            category: product.type,
            base_price: product.basePriceGbp || 0,
            markup_percent: 30,
            markup_fixed: 0,
            is_active: false,
            image_url: product.image,
          },
        }),
      });
      const data = await response.json();
      if (data.success) {
        setMessage({ type: "success", text: `${product.title} added to catalog` });
        fetchData();
      } else {
        setMessage({ type: "error", text: data.error || "Failed to add product" });
      }
    } catch {
      setMessage({ type: "error", text: "Network error" });
    } finally {
      setActionLoading(null);
    }
  };

  const currentProvider = selectedProvider === "gelato" ? gelato : selectedProvider === "prodigi" ? prodigi : null;
  const categories = currentProvider?.categories || [];

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  // Category browser view
  if (selectedCategory) {
    return (
      <div className="p-8">
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCategoryProducts([]);
            }}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-white">
                {selectedCategory.name}
              </h1>
              <span className={`text-xs px-2 py-0.5 rounded ${
                selectedProvider === "gelato"
                  ? "bg-orange-600/20 text-orange-400"
                  : "bg-purple-600/20 text-purple-400"
              }`}>
                {selectedProvider === "gelato" ? "Gelato" : "Prodigi"}
              </span>
            </div>
            <p className="text-gray-400">
              {selectedCategory.count} products available - Browse and add to your store
            </p>
          </div>
        </div>

        {message && (
          <div
            className={`mb-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-900/50 border border-green-700 text-green-300"
                : "bg-red-900/50 border border-red-700 text-red-300"
            }`}
          >
            {message.text}
          </div>
        )}

        {categoryLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : categoryProducts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            No products found in this category
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {categoryProducts.map((product) => (
              <div
                key={product.productUid}
                className="bg-gray-800 rounded-xl overflow-hidden border border-gray-700"
              >
                {product.previewUrl ? (
                  <img
                    src={product.previewUrl}
                    alt={product.title}
                    className="w-full h-40 object-cover bg-gray-700"
                  />
                ) : (
                  <div className="w-full h-40 bg-gray-700 flex items-center justify-center">
                    <Package className="w-12 h-12 text-gray-600" />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-medium text-white mb-1 truncate">
                    {product.title}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-gray-500 mb-3">{product.description}</p>
                  )}
                  {product.saved ? (
                    <span className="flex items-center gap-1 text-green-400 text-sm">
                      <Check className="w-4 h-4" />
                      Added to catalog
                    </span>
                  ) : (
                    <button
                      onClick={() => addProduct(product)}
                      disabled={actionLoading === product.productUid}
                      className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {actionLoading === product.productUid ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                      Add to Store
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }

  // Main view
  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Print Products</h1>
          <p className="text-gray-400">
            Browse Printful, Gelato & Prodigi catalogs - add products and set your markup
          </p>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {message && (
        <div
          className={`mb-6 p-4 rounded-lg ${
            message.type === "success"
              ? "bg-green-900/50 border border-green-700 text-green-300"
              : "bg-red-900/50 border border-red-700 text-red-300"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Connection Status */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className={`p-4 rounded-xl border ${
          printful.connected
            ? "bg-green-900/20 border-green-700"
            : "bg-yellow-900/20 border-yellow-700"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center font-bold">
                Pf
              </div>
              <div>
                <p className="font-medium text-white">Printful</p>
                <p className="text-sm text-gray-400">T-shirts, mugs + mockups</p>
              </div>
            </div>
            {printful.connected ? (
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <Check className="w-4 h-4" />
                {printful.store?.name || "Connected"}
              </span>
            ) : (
              <span className="flex items-center gap-1 text-yellow-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {printful.message || "Not connected"}
              </span>
            )}
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          gelato.connected
            ? "bg-green-900/20 border-green-700"
            : "bg-yellow-900/20 border-yellow-700"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-600/20 text-orange-400 rounded-lg flex items-center justify-center font-bold">
                G
              </div>
              <div>
                <p className="font-medium text-white">Gelato</p>
                <p className="text-sm text-gray-400">Business cards, flyers</p>
              </div>
            </div>
            {gelato.connected ? (
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <Check className="w-4 h-4" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-yellow-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {gelato.message || "Not connected"}
              </span>
            )}
          </div>
        </div>

        <div className={`p-4 rounded-xl border ${
          prodigi.connected
            ? "bg-green-900/20 border-green-700"
            : "bg-yellow-900/20 border-yellow-700"
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-600/20 text-purple-400 rounded-lg flex items-center justify-center font-bold">
                P
              </div>
              <div>
                <p className="font-medium text-white">Prodigi</p>
                <p className="text-sm text-gray-400">Canvas, wall art</p>
              </div>
            </div>
            {prodigi.connected ? (
              <span className="flex items-center gap-1 text-green-400 text-sm">
                <Check className="w-4 h-4" />
                Connected
              </span>
            ) : (
              <span className="flex items-center gap-1 text-yellow-400 text-sm">
                <AlertCircle className="w-4 h-4" />
                {prodigi.message || "Add API key in Settings"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{savedProducts.length}</p>
              <p className="text-gray-400 text-sm">Total Products</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600/20 text-green-400 rounded-xl flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{activeCount}</p>
              <p className="text-gray-400 text-sm">Active (Visible to Customers)</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-xl flex items-center justify-center">
              <Percent className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">30%</p>
              <p className="text-gray-400 text-sm">Default Markup</p>
            </div>
          </div>
        </div>
      </div>

      {/* Provider Tabs */}
      <div className="bg-gray-800 rounded-xl p-6 mb-8">
        <h2 className="text-lg font-semibold text-white mb-4">
          Browse Product Catalog
        </h2>

        {/* Tab Buttons */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setSelectedProvider("printful")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedProvider === "printful"
                ? "bg-blue-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-xs font-bold">Pf</span>
            Printful
            <span className="text-xs opacity-75 flex items-center gap-1">
              <Image className="w-3 h-3" />
              Mockups
            </span>
          </button>
          <button
            onClick={() => setSelectedProvider("gelato")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedProvider === "gelato"
                ? "bg-orange-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-sm font-bold">G</span>
            Gelato
            {gelato.categories && (
              <span className="text-xs opacity-75">({gelato.categories.length})</span>
            )}
          </button>
          <button
            onClick={() => setSelectedProvider("prodigi")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
              selectedProvider === "prodigi"
                ? "bg-purple-600 text-white"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            <span className="w-6 h-6 bg-white/20 rounded flex items-center justify-center text-sm font-bold">P</span>
            Prodigi
            {prodigi.categories && (
              <span className="text-xs opacity-75">({prodigi.categories.length})</span>
            )}
          </button>
        </div>

        {/* Content Area */}
        {selectedProvider === "printful" ? (
          // Printful Products Grid
          printful.connected ? (
            <div>
              <p className="text-gray-400 text-sm mb-4">
                Curated products for tradespeople. Click to generate mockups with your logo.
              </p>
              {printfulProducts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {printfulProducts.map((product) => {
                    const isAdded = savedProducts.some(
                      (p) => p.gelato_product_uid === `printful-${product.id}`
                    );
                    return (
                      <div
                        key={product.id}
                        className="bg-gray-700 rounded-xl overflow-hidden border border-gray-600 hover:border-blue-500 transition-colors"
                      >
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-full h-40 object-cover bg-gray-800"
                          />
                        ) : (
                          <div className="w-full h-40 bg-gray-800 flex items-center justify-center">
                            <Package className="w-12 h-12 text-gray-600" />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-medium text-white mb-1 truncate">
                            {product.title}
                          </h3>
                          <p className="text-xs text-gray-500 mb-2">
                            {product.brand} {product.model}
                          </p>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-sm text-gray-400">{product.type}</span>
                            {product.basePriceGbp && (
                              <span className="text-sm font-medium text-green-400">
                                From {formatPrice(product.basePriceGbp)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500 mb-3">
                            {product.sizes && product.sizes.length > 0 && (
                              <span>{product.sizes.length} sizes</span>
                            )}
                            {product.colors && product.colors.length > 0 && (
                              <span>{product.colors.length} colors</span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            {isAdded ? (
                              <span className="flex-1 flex items-center justify-center gap-1 text-green-400 text-sm py-1.5">
                                <Check className="w-4 h-4" />
                                Added
                              </span>
                            ) : (
                              <button
                                onClick={() => addPrintfulProduct(product)}
                                disabled={actionLoading === `printful-${product.id}`}
                                className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                              >
                                {actionLoading === `printful-${product.id}` ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Plus className="w-4 h-4" />
                                )}
                                Add
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedPrintfulProduct(product);
                                setMockupUrl(null);
                              }}
                              className="flex items-center gap-1 px-3 py-1.5 bg-gray-600 text-white rounded-lg text-sm hover:bg-gray-500"
                            >
                              <Image className="w-4 h-4" />
                              Mockup
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />
                  Loading products...
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>Add your Printful API key and Store ID in Settings to browse products</p>
            </div>
          )
        ) : (
          // Gelato/Prodigi Category Grid
          categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => fetchCategoryProducts(category)}
                  className="flex items-center justify-between p-4 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-left"
                >
                  <div>
                    <span className="text-white font-medium block">{category.name}</span>
                    <span className="text-gray-500 text-xs">{category.count} products</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {selectedProvider === "gelato" && !gelato.connected ? (
                <p>Add your Gelato API key in Settings to browse products</p>
              ) : selectedProvider === "prodigi" && !prodigi.connected ? (
                <p>Add your Prodigi API key in Settings to browse products</p>
              ) : (
                <p>No categories available</p>
              )}
            </div>
          )
        )}
      </div>

      {/* Saved Products */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">
          Your Product Catalog
        </h2>

        {savedProducts.length === 0 ? (
          <div className="text-center py-12">
            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 mb-2">No products in your catalog yet</p>
            <p className="text-gray-500 text-sm">
              Browse Gelato or Prodigi above to add products
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3">Base Price</th>
                  <th className="pb-3">Markup</th>
                  <th className="pb-3">Customer Price</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3"></th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {savedProducts.map((product) => (
                  <tr key={product.id} className="border-b border-gray-700">
                    <td className="py-4">
                      <div className="flex items-center gap-3">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="w-10 h-10 rounded object-cover bg-gray-700"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded bg-gray-700 flex items-center justify-center">
                            <Package className="w-5 h-5 text-gray-500" />
                          </div>
                        )}
                        <span className="font-medium text-white">
                          {product.name}
                        </span>
                      </div>
                    </td>
                    <td className="py-4 text-gray-400">
                      {product.category || "-"}
                    </td>
                    <td className="py-4">
                      {product.base_price > 0
                        ? formatPrice(product.base_price)
                        : "-"}
                    </td>
                    <td className="py-4">
                      {product.markup_percent}%
                      {product.markup_fixed > 0 &&
                        ` + ${formatPrice(product.markup_fixed)}`}
                    </td>
                    <td className="py-4 font-medium text-white">
                      {product.customer_price > 0
                        ? formatPrice(product.customer_price)
                        : "-"}
                    </td>
                    <td className="py-4">
                      <button
                        onClick={() => toggleProduct(product)}
                        disabled={actionLoading === product.gelato_product_uid}
                        className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                          product.is_active
                            ? "bg-green-900/50 text-green-400"
                            : "bg-gray-700 text-gray-400"
                        }`}
                      >
                        {actionLoading === product.gelato_product_uid ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : product.is_active ? (
                          <ToggleRight className="w-4 h-4" />
                        ) : (
                          <ToggleLeft className="w-4 h-4" />
                        )}
                        {product.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEditModal(product)}
                          className="px-3 py-1 text-blue-400 hover:bg-gray-700 rounded text-sm"
                        >
                          Edit Pricing
                        </button>
                        <button
                          onClick={() => deleteProduct(product)}
                          disabled={actionLoading === product.gelato_product_uid}
                          className="p-1 text-gray-500 hover:text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Pricing Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-bold text-white mb-6">
              Edit Pricing: {editingProduct.name}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <PoundSterling className="w-4 h-4 inline mr-1" />
                  Base Cost (from supplier) in pence
                </label>
                <input
                  type="number"
                  value={editBasePrice}
                  onChange={(e) => setEditBasePrice(parseInt(e.target.value) || 0)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                  placeholder="e.g. 1499 for £14.99"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Enter the price in pence (e.g., 1499 = £14.99)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <Percent className="w-4 h-4 inline mr-1" />
                  Markup Percentage
                </label>
                <input
                  type="number"
                  value={editMarkupPercent}
                  onChange={(e) =>
                    setEditMarkupPercent(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  <PoundSterling className="w-4 h-4 inline mr-1" />
                  Fixed Markup (pence)
                </label>
                <input
                  type="number"
                  value={editMarkupFixed}
                  onChange={(e) =>
                    setEditMarkupFixed(parseInt(e.target.value) || 0)
                  }
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white"
                />
              </div>

              {/* Preview */}
              <div className="bg-gray-700 rounded-lg p-4">
                <p className="text-sm text-gray-400 mb-2">Customer Price Preview</p>
                <p className="text-2xl font-bold text-white">
                  {formatPrice(calculatePreviewPrice())}
                </p>
                <p className="text-xs text-gray-500">
                  {formatPrice(editBasePrice)} + {editMarkupPercent}%
                  {editMarkupFixed > 0 && ` + ${formatPrice(editMarkupFixed)}`}
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setEditingProduct(null)}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={saveProductSettings}
                disabled={actionLoading === editingProduct.gelato_product_uid}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {actionLoading === editingProduct.gelato_product_uid ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Check className="w-4 h-4" />
                )}
                Save Pricing
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mockup Generation Modal */}
      {selectedPrintfulProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">
                Generate Mockup: {selectedPrintfulProduct.title}
              </h2>
              <button
                onClick={() => {
                  setSelectedPrintfulProduct(null);
                  setMockupUrl(null);
                }}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Product Info */}
              <div>
                <img
                  src={selectedPrintfulProduct.image}
                  alt={selectedPrintfulProduct.title}
                  className="w-full h-48 object-cover rounded-lg bg-gray-700 mb-4"
                />
                <p className="text-gray-400 text-sm mb-2">
                  {selectedPrintfulProduct.brand} {selectedPrintfulProduct.model}
                </p>
                <p className="text-gray-500 text-sm">
                  {selectedPrintfulProduct.variantCount} variants available
                </p>
                {selectedPrintfulProduct.basePriceGbp && (
                  <p className="text-green-400 font-medium mt-2">
                    From {formatPrice(selectedPrintfulProduct.basePriceGbp)}
                  </p>
                )}
              </div>

              {/* Mockup Generator */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Logo/Image URL
                </label>
                <input
                  type="text"
                  ref={mockupImageUrlRef}
                  defaultValue="https://dreamsonwheels.co.uk/wp-content/uploads/2021/11/dreams-on-wheels-logo-1-e1636232340140.png"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white mb-4"
                  placeholder="Enter image URL..."
                />

                <button
                  onClick={handleGenerateMockup}
                  disabled={mockupLoading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 mb-4"
                >
                  {mockupLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Image className="w-5 h-5" />
                      Generate Mockup
                    </>
                  )}
                </button>

                {mockupUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Generated Mockup:</p>
                    <img
                      src={mockupUrl}
                      alt="Generated mockup"
                      className="w-full rounded-lg border border-gray-600"
                    />
                    <a
                      href={mockupUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center text-blue-400 text-sm mt-2 hover:underline"
                    >
                      Open full size ↗
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setSelectedPrintfulProduct(null);
                  setMockupUrl(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
              {!savedProducts.some(p => p.gelato_product_uid === `printful-${selectedPrintfulProduct.id}`) && (
                <button
                  onClick={() => {
                    addPrintfulProduct(selectedPrintfulProduct);
                    setSelectedPrintfulProduct(null);
                    setMockupUrl(null);
                  }}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add to Catalog
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
