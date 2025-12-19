"use client";

import { useState, useEffect } from "react";
import {
  FileText,
  Briefcase,
  Mail,
  ToggleLeft,
  CreditCard,
  Plus,
  Pencil,
  Trash2,
  Save,
  X,
  Loader2,
  Check,
} from "lucide-react";

type Tab = "content" | "trades" | "emails" | "features" | "pricing";

interface CMSContent {
  id: number;
  content_key: string;
  content_type: "text" | "html" | "json" | "image_url";
  content_value: string | null;
  description: string | null;
  category: string | null;
  is_published: boolean;
  version: number;
}

interface TradeCategory {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
}

interface EmailTemplate {
  id: number;
  template_key: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string | null;
  variables: string[];
  is_active: boolean;
}

interface FeatureFlag {
  id: number;
  flag_key: string;
  name: string;
  description: string | null;
  is_enabled: boolean;
}

interface PricingPlan {
  id: number;
  plan_key: string;
  name: string;
  description: string | null;
  price_monthly: number;
  price_yearly: number | null;
  trial_days: number;
  features: string[];
  limits: Record<string, number>;
  stripe_price_id: string | null;
  is_active: boolean;
  sort_order: number;
}

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "content", label: "Homepage Content", icon: FileText },
  { id: "trades", label: "Trade Categories", icon: Briefcase },
  { id: "emails", label: "Email Templates", icon: Mail },
  { id: "features", label: "Feature Flags", icon: ToggleLeft },
  { id: "pricing", label: "Pricing Plans", icon: CreditCard },
];

export default function CMSPage() {
  const [activeTab, setActiveTab] = useState<Tab>("content");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Data states
  const [content, setContent] = useState<CMSContent[]>([]);
  const [trades, setTrades] = useState<TradeCategory[]>([]);
  const [emails, setEmails] = useState<EmailTemplate[]>([]);
  const [features, setFeatures] = useState<FeatureFlag[]>([]);
  const [pricing, setPricing] = useState<PricingPlan[]>([]);

  // Edit states
  const [editingContent, setEditingContent] = useState<CMSContent | null>(null);
  const [editingTrade, setEditingTrade] = useState<TradeCategory | null>(null);
  const [editingEmail, setEditingEmail] = useState<EmailTemplate | null>(null);
  const [editingPricing, setEditingPricing] = useState<PricingPlan | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    try {
      switch (activeTab) {
        case "content":
          const contentRes = await fetch("/api/admin/cms");
          const contentData = await contentRes.json();
          setContent(contentData.content || []);
          break;
        case "trades":
          const tradesRes = await fetch("/api/admin/trades");
          const tradesData = await tradesRes.json();
          setTrades(tradesData.trades || []);
          break;
        case "emails":
          const emailsRes = await fetch("/api/admin/emails");
          const emailsData = await emailsRes.json();
          setEmails(emailsData.templates || []);
          break;
        case "features":
          const featuresRes = await fetch("/api/admin/features");
          const featuresData = await featuresRes.json();
          setFeatures(featuresData.flags || []);
          break;
        case "pricing":
          const pricingRes = await fetch("/api/admin/pricing");
          const pricingData = await pricingRes.json();
          setPricing(pricingData.plans || []);
          break;
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveContent = async (item: CMSContent) => {
    setSaving(true);
    try {
      await fetch("/api/admin/cms", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: item.content_key, value: item.content_value }),
      });
      setEditingContent(null);
      loadData();
    } catch (error) {
      console.error("Error saving content:", error);
    } finally {
      setSaving(false);
    }
  };

  const saveTrade = async (item: TradeCategory) => {
    setSaving(true);
    try {
      await fetch("/api/admin/trades", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      setEditingTrade(null);
      loadData();
    } catch (error) {
      console.error("Error saving trade:", error);
    } finally {
      setSaving(false);
    }
  };

  const toggleFeature = async (id: number, enabled: boolean) => {
    try {
      await fetch("/api/admin/features", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, is_enabled: enabled }),
      });
      loadData();
    } catch (error) {
      console.error("Error toggling feature:", error);
    }
  };

  const saveEmail = async (item: EmailTemplate) => {
    setSaving(true);
    try {
      await fetch("/api/admin/emails", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      setEditingEmail(null);
      loadData();
    } catch (error) {
      console.error("Error saving email:", error);
    } finally {
      setSaving(false);
    }
  };

  const savePricing = async (item: PricingPlan) => {
    setSaving(true);
    try {
      await fetch("/api/admin/pricing", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      });
      setEditingPricing(null);
      loadData();
    } catch (error) {
      console.error("Error saving pricing:", error);
    } finally {
      setSaving(false);
    }
  };

  const deleteTrade = async (id: number) => {
    if (!confirm("Are you sure you want to delete this trade category?")) return;
    try {
      await fetch(`/api/admin/trades?id=${id}`, { method: "DELETE" });
      loadData();
    } catch (error) {
      console.error("Error deleting trade:", error);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        </div>
      );
    }

    switch (activeTab) {
      case "content":
        return (
          <div className="space-y-4">
            {Object.entries(
              content.reduce((acc, item) => {
                const cat = item.category || "uncategorized";
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(item);
                return acc;
              }, {} as Record<string, CMSContent[]>)
            ).map(([category, items]) => (
              <div key={category} className="bg-gray-800 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-white capitalize mb-4">{category}</h3>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="bg-gray-700 rounded-lg p-4">
                      {editingContent?.id === item.id ? (
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-400 mb-1">{item.content_key}</label>
                            {item.content_type === "json" ? (
                              <textarea
                                value={editingContent.content_value || ""}
                                onChange={(e) =>
                                  setEditingContent({ ...editingContent, content_value: e.target.value })
                                }
                                className="w-full bg-gray-600 text-white rounded px-3 py-2 h-48 font-mono text-sm"
                              />
                            ) : (
                              <input
                                type="text"
                                value={editingContent.content_value || ""}
                                onChange={(e) =>
                                  setEditingContent({ ...editingContent, content_value: e.target.value })
                                }
                                className="w-full bg-gray-600 text-white rounded px-3 py-2"
                              />
                            )}
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => saveContent(editingContent)}
                              disabled={saving}
                              className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                            >
                              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                              Save
                            </button>
                            <button
                              onClick={() => setEditingContent(null)}
                              className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                            >
                              <X className="w-4 h-4" />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white font-medium">{item.content_key}</span>
                              <span className="text-xs bg-gray-600 text-gray-300 px-2 py-0.5 rounded">
                                {item.content_type}
                              </span>
                            </div>
                            {item.description && (
                              <p className="text-sm text-gray-400 mt-1">{item.description}</p>
                            )}
                            <p className="text-gray-300 mt-2 text-sm">
                              {item.content_type === "json"
                                ? (item.content_value || "").slice(0, 100) + "..."
                                : item.content_value}
                            </p>
                          </div>
                          <button
                            onClick={() => setEditingContent(item)}
                            className="text-gray-400 hover:text-white p-2"
                          >
                            <Pencil className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        );

      case "trades":
        return (
          <div className="space-y-4">
            <div className="grid gap-4">
              {trades.map((trade) => (
                <div key={trade.id} className="bg-gray-800 rounded-lg p-4">
                  {editingTrade?.id === trade.id ? (
                    <div className="space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Name</label>
                          <input
                            type="text"
                            value={editingTrade.name}
                            onChange={(e) => setEditingTrade({ ...editingTrade, name: e.target.value })}
                            className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Slug</label>
                          <input
                            type="text"
                            value={editingTrade.slug}
                            onChange={(e) => setEditingTrade({ ...editingTrade, slug: e.target.value })}
                            className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Description</label>
                        <input
                          type="text"
                          value={editingTrade.description || ""}
                          onChange={(e) => setEditingTrade({ ...editingTrade, description: e.target.value })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Icon</label>
                          <input
                            type="text"
                            value={editingTrade.icon || ""}
                            onChange={(e) => setEditingTrade({ ...editingTrade, icon: e.target.value })}
                            className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-gray-400 mb-1">Sort Order</label>
                          <input
                            type="number"
                            value={editingTrade.sort_order}
                            onChange={(e) =>
                              setEditingTrade({ ...editingTrade, sort_order: parseInt(e.target.value) })
                            }
                            className="w-full bg-gray-700 text-white rounded px-3 py-2"
                          />
                        </div>
                        <div className="flex items-end">
                          <label className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              checked={editingTrade.is_active}
                              onChange={(e) =>
                                setEditingTrade({ ...editingTrade, is_active: e.target.checked })
                              }
                              className="w-5 h-5 rounded"
                            />
                            <span className="text-white">Active</span>
                          </label>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => saveTrade(editingTrade)}
                          disabled={saving}
                          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTrade(null)}
                          className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                        >
                          <X className="w-4 h-4" />
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-700 rounded-lg flex items-center justify-center text-gray-400">
                          {trade.sort_order}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{trade.name}</span>
                            {!trade.is_active && (
                              <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">
                                Inactive
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-400">{trade.slug}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingTrade(trade)}
                          className="text-gray-400 hover:text-white p-2"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => deleteTrade(trade.id)}
                          className="text-gray-400 hover:text-red-400 p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );

      case "emails":
        return (
          <div className="space-y-4">
            {emails.map((email) => (
              <div key={email.id} className="bg-gray-800 rounded-lg p-4">
                {editingEmail?.id === email.id ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Template Name</label>
                      <input
                        type="text"
                        value={editingEmail.name}
                        onChange={(e) => setEditingEmail({ ...editingEmail, name: e.target.value })}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Subject</label>
                      <input
                        type="text"
                        value={editingEmail.subject}
                        onChange={(e) => setEditingEmail({ ...editingEmail, subject: e.target.value })}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">
                        HTML Body{" "}
                        <span className="text-gray-500">
                          (Variables: {email.variables.map((v) => `{{${v}}}`).join(", ")})
                        </span>
                      </label>
                      <textarea
                        value={editingEmail.body_html}
                        onChange={(e) => setEditingEmail({ ...editingEmail, body_html: e.target.value })}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 h-48 font-mono text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Plain Text Body</label>
                      <textarea
                        value={editingEmail.body_text || ""}
                        onChange={(e) => setEditingEmail({ ...editingEmail, body_text: e.target.value })}
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 h-32 font-mono text-sm"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => saveEmail(editingEmail)}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                      </button>
                      <button
                        onClick={() => setEditingEmail(null)}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{email.name}</span>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-mono">
                          {email.template_key}
                        </span>
                        {!email.is_active && (
                          <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mt-1">{email.subject}</p>
                      <div className="flex gap-2 mt-2">
                        {email.variables.map((v) => (
                          <span key={v} className="text-xs bg-blue-900/30 text-blue-400 px-2 py-0.5 rounded">
                            {`{{${v}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                    <button onClick={() => setEditingEmail(email)} className="text-gray-400 hover:text-white p-2">
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case "features":
        return (
          <div className="space-y-4">
            {features.map((flag) => (
              <div key={flag.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-white font-medium">{flag.name}</span>
                    <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-mono">
                      {flag.flag_key}
                    </span>
                  </div>
                  {flag.description && <p className="text-sm text-gray-400 mt-1">{flag.description}</p>}
                </div>
                <button
                  onClick={() => toggleFeature(flag.id, !flag.is_enabled)}
                  className={`relative w-14 h-7 rounded-full transition-colors ${
                    flag.is_enabled ? "bg-green-600" : "bg-gray-600"
                  }`}
                >
                  <div
                    className={`absolute top-1 w-5 h-5 rounded-full bg-white transition-all ${
                      flag.is_enabled ? "left-8" : "left-1"
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        );

      case "pricing":
        return (
          <div className="space-y-4">
            {pricing.map((plan) => (
              <div key={plan.id} className="bg-gray-800 rounded-lg p-4">
                {editingPricing?.id === plan.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Plan Name</label>
                        <input
                          type="text"
                          value={editingPricing.name}
                          onChange={(e) => setEditingPricing({ ...editingPricing, name: e.target.value })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Plan Key</label>
                        <input
                          type="text"
                          value={editingPricing.plan_key}
                          onChange={(e) => setEditingPricing({ ...editingPricing, plan_key: e.target.value })}
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Description</label>
                      <input
                        type="text"
                        value={editingPricing.description || ""}
                        onChange={(e) =>
                          setEditingPricing({ ...editingPricing, description: e.target.value })
                        }
                        className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Monthly Price (pence)</label>
                        <input
                          type="number"
                          value={editingPricing.price_monthly}
                          onChange={(e) =>
                            setEditingPricing({ ...editingPricing, price_monthly: parseInt(e.target.value) })
                          }
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Yearly Price (pence)</label>
                        <input
                          type="number"
                          value={editingPricing.price_yearly || ""}
                          onChange={(e) =>
                            setEditingPricing({
                              ...editingPricing,
                              price_yearly: e.target.value ? parseInt(e.target.value) : null,
                            })
                          }
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        />
                      </div>
                      <div>
                        <label className="block text-sm text-gray-400 mb-1">Trial Days</label>
                        <input
                          type="number"
                          value={editingPricing.trial_days}
                          onChange={(e) =>
                            setEditingPricing({ ...editingPricing, trial_days: parseInt(e.target.value) })
                          }
                          className="w-full bg-gray-700 text-white rounded px-3 py-2"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Features (one per line)</label>
                      <textarea
                        value={editingPricing.features.join("\n")}
                        onChange={(e) =>
                          setEditingPricing({
                            ...editingPricing,
                            features: e.target.value.split("\n").filter((f) => f.trim()),
                          })
                        }
                        className="w-full bg-gray-700 text-white rounded px-3 py-2 h-32"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-400 mb-1">Stripe Price ID</label>
                      <input
                        type="text"
                        value={editingPricing.stripe_price_id || ""}
                        onChange={(e) =>
                          setEditingPricing({ ...editingPricing, stripe_price_id: e.target.value || null })
                        }
                        className="w-full bg-gray-700 text-white rounded px-3 py-2"
                      />
                    </div>
                    <div className="flex items-center gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingPricing.is_active}
                          onChange={(e) =>
                            setEditingPricing({ ...editingPricing, is_active: e.target.checked })
                          }
                          className="w-5 h-5 rounded"
                        />
                        <span className="text-white">Active</span>
                      </label>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => savePricing(editingPricing)}
                        disabled={saving}
                        className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                      >
                        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        Save
                      </button>
                      <button
                        onClick={() => setEditingPricing(null)}
                        className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-500"
                      >
                        <X className="w-4 h-4" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-white font-medium">{plan.name}</span>
                        <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded font-mono">
                          {plan.plan_key}
                        </span>
                        {!plan.is_active && (
                          <span className="text-xs bg-red-900/50 text-red-400 px-2 py-0.5 rounded">
                            Inactive
                          </span>
                        )}
                      </div>
                      {plan.description && <p className="text-gray-400 mt-1">{plan.description}</p>}
                      <div className="flex items-center gap-4 mt-2">
                        <span className="text-2xl font-bold text-white">
                          £{(plan.price_monthly / 100).toFixed(2)}
                          <span className="text-sm text-gray-400 font-normal">/mo</span>
                        </span>
                        {plan.price_yearly && (
                          <span className="text-gray-400">
                            or £{(plan.price_yearly / 100).toFixed(2)}/year
                          </span>
                        )}
                        {plan.trial_days > 0 && (
                          <span className="text-xs bg-green-900/30 text-green-400 px-2 py-0.5 rounded">
                            {plan.trial_days} day trial
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {plan.features.slice(0, 4).map((f, i) => (
                          <span key={i} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded flex items-center gap-1">
                            <Check className="w-3 h-3 text-green-400" />
                            {f}
                          </span>
                        ))}
                        {plan.features.length > 4 && (
                          <span className="text-xs text-gray-400">+{plan.features.length - 4} more</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingPricing(plan)}
                      className="text-gray-400 hover:text-white p-2"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Content Management</h1>
        <p className="text-gray-400 mt-1">Manage homepage content, trade categories, emails, and pricing</p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-800 text-gray-300 hover:bg-gray-700"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {renderContent()}
    </div>
  );
}
