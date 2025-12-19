import { query } from "./db";

// ==================== CMS Content ====================

export interface CMSContent {
  id: number;
  content_key: string;
  content_type: "text" | "html" | "json" | "image_url";
  content_value: string | null;
  description: string | null;
  category: string | null;
  is_published: boolean;
  version: number;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get a single content item by key
 */
export async function getContent(key: string): Promise<string | null> {
  const results = await query<CMSContent[]>(
    "SELECT content_value FROM cms_content WHERE content_key = ? AND is_published = TRUE",
    [key]
  );
  return results[0]?.content_value || null;
}

/**
 * Get JSON content parsed
 */
export async function getJsonContent<T>(key: string): Promise<T | null> {
  const value = await getContent(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

/**
 * Get all content by category
 */
export async function getContentByCategory(
  category: string
): Promise<Record<string, string | null>> {
  const results = await query<CMSContent[]>(
    "SELECT content_key, content_value FROM cms_content WHERE category = ? AND is_published = TRUE",
    [category]
  );
  return results.reduce(
    (acc, item) => {
      acc[item.content_key] = item.content_value;
      return acc;
    },
    {} as Record<string, string | null>
  );
}

/**
 * Get all CMS content (admin)
 */
export async function getAllContent(category?: string): Promise<CMSContent[]> {
  if (category) {
    return query<CMSContent[]>(
      "SELECT * FROM cms_content WHERE category = ? ORDER BY content_key",
      [category]
    );
  }
  return query<CMSContent[]>("SELECT * FROM cms_content ORDER BY category, content_key");
}

/**
 * Update content (admin)
 */
export async function updateContent(
  key: string,
  value: string,
  adminUserId: string
): Promise<void> {
  await query(
    `UPDATE cms_content SET content_value = ?, version = version + 1, updated_by = ? WHERE content_key = ?`,
    [value, adminUserId, key]
  );
}

/**
 * Create new content (admin)
 */
export async function createContent(
  key: string,
  value: string,
  contentType: CMSContent["content_type"],
  description: string | null,
  category: string | null,
  adminUserId: string
): Promise<void> {
  await query(
    `INSERT INTO cms_content (content_key, content_value, content_type, description, category, updated_by)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [key, value, contentType, description, category, adminUserId]
  );
}

/**
 * Delete content (admin)
 */
export async function deleteContent(key: string): Promise<void> {
  await query("DELETE FROM cms_content WHERE content_key = ?", [key]);
}

// ==================== Trade Categories ====================

export interface TradeCategory {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get active trade categories (for public use)
 */
export async function getActiveTradeCategories(): Promise<TradeCategory[]> {
  return query<TradeCategory[]>(
    "SELECT * FROM trade_categories WHERE is_active = TRUE ORDER BY sort_order ASC"
  );
}

/**
 * Get all trade categories (admin)
 */
export async function getAllTradeCategories(): Promise<TradeCategory[]> {
  return query<TradeCategory[]>("SELECT * FROM trade_categories ORDER BY sort_order ASC");
}

/**
 * Get trade by slug
 */
export async function getTradeBySlug(slug: string): Promise<TradeCategory | null> {
  const results = await query<TradeCategory[]>(
    "SELECT * FROM trade_categories WHERE slug = ?",
    [slug]
  );
  return results[0] || null;
}

/**
 * Create trade category (admin)
 */
export async function createTradeCategory(
  slug: string,
  name: string,
  description: string | null,
  icon: string | null
): Promise<void> {
  const [maxOrder] = await query<{ max_order: number }[]>(
    "SELECT MAX(sort_order) as max_order FROM trade_categories"
  );
  const sortOrder = (maxOrder?.max_order || 0) + 1;

  await query(
    `INSERT INTO trade_categories (slug, name, description, icon, sort_order)
     VALUES (?, ?, ?, ?, ?)`,
    [slug, name, description, icon, sortOrder]
  );
}

/**
 * Update trade category (admin)
 */
export async function updateTradeCategory(
  id: number,
  updates: Partial<Pick<TradeCategory, "slug" | "name" | "description" | "icon" | "sort_order" | "is_active">>
): Promise<void> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.slug !== undefined) {
    fields.push("slug = ?");
    values.push(updates.slug);
  }
  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    values.push(updates.description);
  }
  if (updates.icon !== undefined) {
    fields.push("icon = ?");
    values.push(updates.icon);
  }
  if (updates.sort_order !== undefined) {
    fields.push("sort_order = ?");
    values.push(updates.sort_order);
  }
  if (updates.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(updates.is_active);
  }

  if (fields.length === 0) return;

  values.push(id);
  await query(`UPDATE trade_categories SET ${fields.join(", ")} WHERE id = ?`, values);
}

/**
 * Delete trade category (admin)
 */
export async function deleteTradeCategory(id: number): Promise<void> {
  await query("DELETE FROM trade_categories WHERE id = ?", [id]);
}

// ==================== Email Templates ====================

export interface EmailTemplate {
  id: number;
  template_key: string;
  name: string;
  subject: string;
  body_html: string;
  body_text: string | null;
  variables: string[];
  is_active: boolean;
  updated_by: number | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Get email template by key
 */
export async function getEmailTemplate(key: string): Promise<EmailTemplate | null> {
  const results = await query<EmailTemplate[]>(
    "SELECT * FROM email_templates WHERE template_key = ? AND is_active = TRUE",
    [key]
  );
  if (!results[0]) return null;
  return {
    ...results[0],
    variables: results[0].variables
      ? typeof results[0].variables === "string"
        ? JSON.parse(results[0].variables)
        : results[0].variables
      : [],
  };
}

/**
 * Get all email templates (admin)
 */
export async function getAllEmailTemplates(): Promise<EmailTemplate[]> {
  const results = await query<EmailTemplate[]>(
    "SELECT * FROM email_templates ORDER BY template_key"
  );
  return results.map((t) => ({
    ...t,
    variables: t.variables
      ? typeof t.variables === "string"
        ? JSON.parse(t.variables)
        : t.variables
      : [],
  }));
}

/**
 * Render email template with variables
 */
export function renderEmailTemplate(
  template: EmailTemplate,
  data: Record<string, string>
): { subject: string; html: string; text: string | null } {
  let subject = template.subject;
  let html = template.body_html;
  let text = template.body_text;

  for (const [key, value] of Object.entries(data)) {
    const placeholder = new RegExp(`{{${key}}}`, "g");
    subject = subject.replace(placeholder, value);
    html = html.replace(placeholder, value);
    if (text) {
      text = text.replace(placeholder, value);
    }
  }

  return { subject, html, text };
}

/**
 * Update email template (admin)
 */
export async function updateEmailTemplate(
  id: number,
  updates: Partial<Pick<EmailTemplate, "name" | "subject" | "body_html" | "body_text" | "variables" | "is_active">>,
  adminUserId: string
): Promise<void> {
  const fields: string[] = ["updated_by = ?"];
  const values: unknown[] = [adminUserId];

  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.subject !== undefined) {
    fields.push("subject = ?");
    values.push(updates.subject);
  }
  if (updates.body_html !== undefined) {
    fields.push("body_html = ?");
    values.push(updates.body_html);
  }
  if (updates.body_text !== undefined) {
    fields.push("body_text = ?");
    values.push(updates.body_text);
  }
  if (updates.variables !== undefined) {
    fields.push("variables = ?");
    values.push(JSON.stringify(updates.variables));
  }
  if (updates.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(updates.is_active);
  }

  values.push(id);
  await query(`UPDATE email_templates SET ${fields.join(", ")} WHERE id = ?`, values);
}

// ==================== Feature Flags ====================

export interface FeatureFlag {
  id: number;
  flag_key: string;
  name: string;
  description: string | null;
  is_enabled: boolean;
  conditions: Record<string, unknown> | null;
  created_at: Date;
  updated_at: Date;
}

/**
 * Check if a feature is enabled
 */
export async function isFeatureEnabled(flagKey: string): Promise<boolean> {
  const results = await query<FeatureFlag[]>(
    "SELECT is_enabled FROM feature_flags WHERE flag_key = ?",
    [flagKey]
  );
  return results[0]?.is_enabled || false;
}

/**
 * Get all feature flags (admin)
 */
export async function getAllFeatureFlags(): Promise<FeatureFlag[]> {
  const results = await query<FeatureFlag[]>(
    "SELECT * FROM feature_flags ORDER BY flag_key"
  );
  return results.map((f) => ({
    ...f,
    conditions: f.conditions
      ? typeof f.conditions === "string"
        ? JSON.parse(f.conditions)
        : f.conditions
      : null,
  }));
}

/**
 * Toggle feature flag (admin)
 */
export async function toggleFeatureFlag(id: number, enabled: boolean): Promise<void> {
  await query("UPDATE feature_flags SET is_enabled = ? WHERE id = ?", [enabled, id]);
}

/**
 * Create feature flag (admin)
 */
export async function createFeatureFlag(
  flagKey: string,
  name: string,
  description: string | null
): Promise<void> {
  await query(
    `INSERT INTO feature_flags (flag_key, name, description)
     VALUES (?, ?, ?)`,
    [flagKey, name, description]
  );
}

// ==================== Pricing Plans ====================

export interface PricingPlan {
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
  created_at: Date;
  updated_at: Date;
}

/**
 * Get active pricing plans
 */
export async function getActivePricingPlans(): Promise<PricingPlan[]> {
  const results = await query<PricingPlan[]>(
    "SELECT * FROM pricing_plans WHERE is_active = TRUE ORDER BY sort_order ASC"
  );
  return results.map((plan) => ({
    ...plan,
    features: plan.features
      ? typeof plan.features === "string"
        ? JSON.parse(plan.features)
        : plan.features
      : [],
    limits: plan.limits
      ? typeof plan.limits === "string"
        ? JSON.parse(plan.limits)
        : plan.limits
      : {},
  }));
}

/**
 * Get all pricing plans (admin)
 */
export async function getAllPricingPlans(): Promise<PricingPlan[]> {
  const results = await query<PricingPlan[]>(
    "SELECT * FROM pricing_plans ORDER BY sort_order ASC"
  );
  return results.map((plan) => ({
    ...plan,
    features: plan.features
      ? typeof plan.features === "string"
        ? JSON.parse(plan.features)
        : plan.features
      : [],
    limits: plan.limits
      ? typeof plan.limits === "string"
        ? JSON.parse(plan.limits)
        : plan.limits
      : {},
  }));
}

/**
 * Get pricing plan by key
 */
export async function getPricingPlan(planKey: string): Promise<PricingPlan | null> {
  const results = await query<PricingPlan[]>(
    "SELECT * FROM pricing_plans WHERE plan_key = ?",
    [planKey]
  );
  if (!results[0]) return null;
  return {
    ...results[0],
    features: results[0].features
      ? typeof results[0].features === "string"
        ? JSON.parse(results[0].features)
        : results[0].features
      : [],
    limits: results[0].limits
      ? typeof results[0].limits === "string"
        ? JSON.parse(results[0].limits)
        : results[0].limits
      : {},
  };
}

/**
 * Update pricing plan (admin)
 */
export async function updatePricingPlan(
  id: number,
  updates: Partial<Omit<PricingPlan, "id" | "created_at" | "updated_at">>
): Promise<void> {
  const fields: string[] = [];
  const values: unknown[] = [];

  if (updates.plan_key !== undefined) {
    fields.push("plan_key = ?");
    values.push(updates.plan_key);
  }
  if (updates.name !== undefined) {
    fields.push("name = ?");
    values.push(updates.name);
  }
  if (updates.description !== undefined) {
    fields.push("description = ?");
    values.push(updates.description);
  }
  if (updates.price_monthly !== undefined) {
    fields.push("price_monthly = ?");
    values.push(updates.price_monthly);
  }
  if (updates.price_yearly !== undefined) {
    fields.push("price_yearly = ?");
    values.push(updates.price_yearly);
  }
  if (updates.trial_days !== undefined) {
    fields.push("trial_days = ?");
    values.push(updates.trial_days);
  }
  if (updates.features !== undefined) {
    fields.push("features = ?");
    values.push(JSON.stringify(updates.features));
  }
  if (updates.limits !== undefined) {
    fields.push("limits = ?");
    values.push(JSON.stringify(updates.limits));
  }
  if (updates.stripe_price_id !== undefined) {
    fields.push("stripe_price_id = ?");
    values.push(updates.stripe_price_id);
  }
  if (updates.is_active !== undefined) {
    fields.push("is_active = ?");
    values.push(updates.is_active);
  }
  if (updates.sort_order !== undefined) {
    fields.push("sort_order = ?");
    values.push(updates.sort_order);
  }

  if (fields.length === 0) return;

  values.push(id);
  await query(`UPDATE pricing_plans SET ${fields.join(", ")} WHERE id = ?`, values);
}

/**
 * Create pricing plan (admin)
 */
export async function createPricingPlan(plan: {
  plan_key: string;
  name: string;
  description?: string;
  price_monthly: number;
  price_yearly?: number;
  trial_days?: number;
  features?: string[];
  limits?: Record<string, number>;
  stripe_price_id?: string;
}): Promise<void> {
  const [maxOrder] = await query<{ max_order: number }[]>(
    "SELECT MAX(sort_order) as max_order FROM pricing_plans"
  );
  const sortOrder = (maxOrder?.max_order || 0) + 1;

  await query(
    `INSERT INTO pricing_plans (plan_key, name, description, price_monthly, price_yearly, trial_days, features, limits, stripe_price_id, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      plan.plan_key,
      plan.name,
      plan.description || null,
      plan.price_monthly,
      plan.price_yearly || null,
      plan.trial_days || 0,
      JSON.stringify(plan.features || []),
      JSON.stringify(plan.limits || {}),
      plan.stripe_price_id || null,
      sortOrder,
    ]
  );
}
