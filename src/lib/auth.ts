import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "./db";
import { cookies } from "next/headers";

const JWT_SECRET = process.env.JWT_SECRET || "websights-dev-secret-change-in-production";

export interface User {
  id: string;
  email: string;
  name: string | null;
  trade: string | null;
  business_name: string | null;
  location: string | null;
  phone: string | null;
  services: string | null;
  existing_website: string | null;
  competitors: string | null;
  created_at: Date;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export async function createUser(data: {
  email: string;
  password: string;
  trade?: string;
  businessName?: string;
  location?: string;
  phone?: string;
  services?: string;
  existingWebsite?: string;
  competitors?: string;
}): Promise<User> {
  const passwordHash = await hashPassword(data.password);

  await query(
    `INSERT INTO users (email, password_hash, trade, business_name, location, phone, services, existing_website, competitors)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.email,
      passwordHash,
      data.trade || null,
      data.businessName || null,
      data.location || null,
      data.phone || null,
      data.services || null,
      data.existingWebsite || null,
      data.competitors || null,
    ]
  );

  const users = await query<User[]>("SELECT * FROM users WHERE email = ?", [data.email]);
  return users[0];
}

export async function getUserByEmail(email: string): Promise<(User & { password_hash: string }) | null> {
  const users = await query<(User & { password_hash: string })[]>(
    "SELECT * FROM users WHERE email = ?",
    [email]
  );
  return users[0] || null;
}

export async function getUserById(id: string): Promise<User | null> {
  const users = await query<User[]>("SELECT * FROM users WHERE id = ?", [id]);
  return users[0] || null;
}

export async function getCurrentUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  return getUserById(payload.userId);
}
