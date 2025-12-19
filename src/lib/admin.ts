import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "./db";
import { cookies } from "next/headers";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "tradevista-admin-secret";
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || "tradevista-encryption-key-32c"; // 32 chars for AES-256

export interface AdminUser {
  id: string;
  email: string;
  name: string | null;
  role: "super_admin" | "admin" | "support";
  created_at: Date;
}

export interface AdminSetting {
  id: number;
  setting_key: string;
  setting_value: string | null;
  is_encrypted: boolean;
  description: string | null;
}

// Encryption helpers for sensitive settings
function encrypt(text: string): string {
  const iv = crypto.randomBytes(16);
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return iv.toString("hex") + ":" + encrypted;
}

function decrypt(text: string): string {
  const [ivHex, encrypted] = text.split(":");
  const iv = Buffer.from(ivHex, "hex");
  const key = crypto.scryptSync(ENCRYPTION_KEY, "salt", 32);
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

// Admin Authentication
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateAdminToken(adminId: string): string {
  return jwt.sign({ adminId, isAdmin: true }, JWT_SECRET, { expiresIn: "24h" });
}

export function verifyAdminToken(token: string): { adminId: string; isAdmin: boolean } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { adminId: string; isAdmin: boolean };
  } catch {
    return null;
  }
}

export async function createAdminUser(email: string, password: string, name?: string): Promise<AdminUser> {
  const passwordHash = await hashPassword(password);
  await query(
    "INSERT INTO admin_users (email, password_hash, name, role) VALUES (?, ?, ?, 'super_admin')",
    [email, passwordHash, name || null]
  );
  const users = await query<AdminUser[]>("SELECT * FROM admin_users WHERE email = ?", [email]);
  return users[0];
}

export async function getAdminByEmail(email: string): Promise<(AdminUser & { password_hash: string }) | null> {
  const users = await query<(AdminUser & { password_hash: string })[]>(
    "SELECT * FROM admin_users WHERE email = ?",
    [email]
  );
  return users[0] || null;
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_token")?.value;

  if (!token) return null;

  const payload = verifyAdminToken(token);
  if (!payload || !payload.isAdmin) return null;

  const users = await query<AdminUser[]>("SELECT * FROM admin_users WHERE id = ?", [payload.adminId]);
  return users[0] || null;
}

// Settings Management
export async function getSetting(key: string): Promise<string | null> {
  const settings = await query<AdminSetting[]>(
    "SELECT * FROM admin_settings WHERE setting_key = ?",
    [key]
  );
  if (!settings[0]?.setting_value) return null;

  if (settings[0].is_encrypted) {
    try {
      return decrypt(settings[0].setting_value);
    } catch {
      return null;
    }
  }
  return settings[0].setting_value;
}

export async function setSetting(key: string, value: string, encrypted: boolean = false): Promise<void> {
  const storedValue = encrypted && value ? encrypt(value) : value;
  await query(
    `INSERT INTO admin_settings (setting_key, setting_value, is_encrypted, created_at, updated_at)
     VALUES (?, ?, ?, NOW(), NOW())
     ON DUPLICATE KEY UPDATE setting_value = VALUES(setting_value), is_encrypted = VALUES(is_encrypted), updated_at = NOW()`,
    [key, storedValue, encrypted]
  );
}

export async function getAllSettings(): Promise<AdminSetting[]> {
  return query<AdminSetting[]>("SELECT * FROM admin_settings ORDER BY setting_key");
}

export async function getDecryptedSettings(): Promise<Record<string, string | null>> {
  const settings = await getAllSettings();
  const result: Record<string, string | null> = {};

  for (const setting of settings) {
    if (!setting.setting_value) {
      result[setting.setting_key] = null;
    } else if (setting.is_encrypted) {
      try {
        result[setting.setting_key] = decrypt(setting.setting_value);
      } catch {
        result[setting.setting_key] = null;
      }
    } else {
      result[setting.setting_key] = setting.setting_value;
    }
  }

  return result;
}

// Use this to get API keys in other parts of the app
export async function getApiKey(keyName: string): Promise<string | null> {
  // First check environment variable
  const envKey = process.env[keyName.toUpperCase()];
  if (envKey && !envKey.includes("your-")) return envKey;

  // Then check database
  return getSetting(keyName);
}
