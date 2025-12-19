import { query } from "./db";
import { headers } from "next/headers";

export type LogType = "api_call" | "user_action" | "admin_action" | "error" | "system";

interface LogEntry {
  logType: LogType;
  action: string;
  description?: string;
  userId?: string;
  adminUserId?: string;
  impersonatedUserId?: string;
  requestMethod?: string;
  requestPath?: string;
  requestBody?: Record<string, unknown>;
  responseStatus?: number;
  responseTimeMs?: number;
  errorMessage?: string;
  errorStack?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Log an activity to the database
 */
export async function logActivity(entry: LogEntry): Promise<void> {
  try {
    const headersList = await headers();
    const ipAddress =
      headersList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      headersList.get("x-real-ip") ||
      "unknown";
    const userAgent = headersList.get("user-agent") || "";

    // Sanitize request body - remove sensitive fields
    let sanitizedBody = entry.requestBody;
    if (sanitizedBody) {
      const sensitiveFields = ["password", "password_hash", "api_key", "token", "secret"];
      sanitizedBody = { ...sanitizedBody };
      for (const field of sensitiveFields) {
        if (field in sanitizedBody) {
          sanitizedBody[field] = "[REDACTED]";
        }
      }
    }

    await query(
      `INSERT INTO activity_logs (
        log_type, action, description, user_id, admin_user_id, impersonated_user_id,
        ip_address, user_agent, request_method, request_path, request_body,
        response_status, response_time_ms, error_message, error_stack, metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        entry.logType,
        entry.action,
        entry.description || null,
        entry.userId || null,
        entry.adminUserId || null,
        entry.impersonatedUserId || null,
        ipAddress,
        userAgent.slice(0, 500), // Truncate long user agents
        entry.requestMethod || null,
        entry.requestPath || null,
        sanitizedBody ? JSON.stringify(sanitizedBody) : null,
        entry.responseStatus || null,
        entry.responseTimeMs || null,
        entry.errorMessage || null,
        entry.errorStack?.slice(0, 2000) || null, // Truncate long stacks
        entry.metadata ? JSON.stringify(entry.metadata) : null,
      ]
    );
  } catch (error) {
    // Don't throw - logging should never break the app
    console.error("Failed to log activity:", error);
  }
}

/**
 * Log a user action (signup, login, site edit, etc.)
 */
export async function logUserAction(
  action: string,
  userId: string,
  description?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  return logActivity({
    logType: "user_action",
    action,
    userId,
    description,
    metadata,
  });
}

/**
 * Log an admin action
 */
export async function logAdminAction(
  action: string,
  adminUserId: string,
  description?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  return logActivity({
    logType: "admin_action",
    action,
    adminUserId,
    description,
    metadata,
  });
}

/**
 * Log an error
 */
export async function logError(
  action: string,
  error: Error,
  metadata?: Record<string, unknown>
): Promise<void> {
  return logActivity({
    logType: "error",
    action,
    errorMessage: error.message,
    errorStack: error.stack,
    metadata,
  });
}

/**
 * Log an API call
 */
export async function logApiCall(
  action: string,
  method: string,
  path: string,
  status: number,
  timeMs: number,
  userId?: string,
  adminUserId?: string
): Promise<void> {
  return logActivity({
    logType: "api_call",
    action,
    requestMethod: method,
    requestPath: path,
    responseStatus: status,
    responseTimeMs: timeMs,
    userId,
    adminUserId,
  });
}

/**
 * Log a system event
 */
export async function logSystem(
  action: string,
  description?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  return logActivity({
    logType: "system",
    action,
    description,
    metadata,
  });
}

/**
 * Query activity logs with filters
 */
export interface LogFilter {
  logType?: LogType;
  action?: string;
  userId?: string;
  adminUserId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
  page?: number;
  limit?: number;
}

export interface ActivityLog {
  id: number;
  log_type: LogType;
  action: string;
  description: string | null;
  user_id: string | null;
  admin_user_id: string | null;
  impersonated_user_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  request_method: string | null;
  request_path: string | null;
  request_body: Record<string, unknown> | null;
  response_status: number | null;
  response_time_ms: number | null;
  error_message: string | null;
  error_stack: string | null;
  metadata: Record<string, unknown> | null;
  created_at: Date;
}

export async function getActivityLogs(filter: LogFilter = {}): Promise<{
  logs: ActivityLog[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const { page = 1, limit = 50 } = filter;
  const offset = (page - 1) * limit;

  const conditions: string[] = [];
  const params: unknown[] = [];

  if (filter.logType) {
    conditions.push("log_type = ?");
    params.push(filter.logType);
  }

  if (filter.action) {
    conditions.push("action LIKE ?");
    params.push(`%${filter.action}%`);
  }

  if (filter.userId) {
    conditions.push("user_id = ?");
    params.push(filter.userId);
  }

  if (filter.adminUserId) {
    conditions.push("admin_user_id = ?");
    params.push(filter.adminUserId);
  }

  if (filter.search) {
    conditions.push("(action LIKE ? OR description LIKE ? OR ip_address LIKE ? OR user_id LIKE ?)");
    const searchTerm = `%${filter.search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (filter.startDate) {
    conditions.push("created_at >= ?");
    params.push(filter.startDate);
  }

  if (filter.endDate) {
    conditions.push("created_at <= ?");
    params.push(filter.endDate);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  // Get total count
  const [countResult] = await query<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM activity_logs ${whereClause}`,
    params
  );
  const total = countResult?.count || 0;

  // Get logs
  const logs = await query<ActivityLog[]>(
    `SELECT * FROM activity_logs ${whereClause}
     ORDER BY created_at DESC
     LIMIT ? OFFSET ?`,
    [...params, limit, offset]
  );

  // Parse JSON fields
  const parsedLogs = logs.map((log) => ({
    ...log,
    request_body: log.request_body ? (typeof log.request_body === "string" ? JSON.parse(log.request_body) : log.request_body) : null,
    metadata: log.metadata ? (typeof log.metadata === "string" ? JSON.parse(log.metadata) : log.metadata) : null,
  }));

  return {
    logs: parsedLogs,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

/**
 * Get log statistics for analytics
 */
export async function getLogStats(days: number = 30): Promise<{
  totalLogs: number;
  byType: Record<LogType, number>;
  topActions: { action: string; count: number }[];
  errorRate: number;
}> {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const [totalResult] = await query<{ count: number }[]>(
    "SELECT COUNT(*) as count FROM activity_logs WHERE created_at >= ?",
    [startDate]
  );

  const byTypeResults = await query<{ log_type: LogType; count: number }[]>(
    `SELECT log_type, COUNT(*) as count FROM activity_logs
     WHERE created_at >= ?
     GROUP BY log_type`,
    [startDate]
  );

  const topActions = await query<{ action: string; count: number }[]>(
    `SELECT action, COUNT(*) as count FROM activity_logs
     WHERE created_at >= ?
     GROUP BY action
     ORDER BY count DESC
     LIMIT 10`,
    [startDate]
  );

  const [errorCount] = await query<{ count: number }[]>(
    `SELECT COUNT(*) as count FROM activity_logs
     WHERE log_type = 'error' AND created_at >= ?`,
    [startDate]
  );

  const total = totalResult?.count || 0;
  const errors = errorCount?.count || 0;

  return {
    totalLogs: total,
    byType: byTypeResults.reduce(
      (acc, row) => {
        acc[row.log_type] = row.count;
        return acc;
      },
      {} as Record<LogType, number>
    ),
    topActions,
    errorRate: total > 0 ? (errors / total) * 100 : 0,
  };
}
