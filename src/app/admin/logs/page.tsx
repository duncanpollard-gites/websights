"use client";

import { useState, useEffect } from "react";
import {
  Activity,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Shield,
  AlertTriangle,
  Globe,
  Server,
  Loader2,
  X,
} from "lucide-react";

type LogType = "api_call" | "user_action" | "admin_action" | "error" | "system";

interface ActivityLog {
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
  created_at: string;
}

interface LogStats {
  totalLogs: number;
  byType: Record<LogType, number>;
  topActions: { action: string; count: number }[];
  errorRate: number;
}

const logTypeConfig: Record<LogType, { label: string; icon: React.ElementType; color: string }> = {
  api_call: { label: "API Call", icon: Globe, color: "text-blue-400 bg-blue-900/30" },
  user_action: { label: "User Action", icon: User, color: "text-green-400 bg-green-900/30" },
  admin_action: { label: "Admin Action", icon: Shield, color: "text-purple-400 bg-purple-900/30" },
  error: { label: "Error", icon: AlertTriangle, color: "text-red-400 bg-red-900/30" },
  system: { label: "System", icon: Server, color: "text-gray-400 bg-gray-700" },
};

export default function LogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Filters
  const [search, setSearch] = useState("");
  const [logType, setLogType] = useState<LogType | "">("");
  const [showFilters, setShowFilters] = useState(false);

  // Detail modal
  const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  useEffect(() => {
    loadLogs();
  }, [page, logType, search]);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/admin/logs?stats=true");
      const data = await res.json();
      setStats(data.stats);
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  const loadLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("limit", "50");
      if (logType) params.set("logType", logType);
      if (search) params.set("search", search);

      const res = await fetch(`/api/admin/logs?${params}`);
      const data = await res.json();
      setLogs(data.logs || []);
      setTotalPages(data.totalPages || 1);
      setTotal(data.total || 0);
    } catch (error) {
      console.error("Error loading logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    loadLogs();
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const getStatusColor = (status: number | null) => {
    if (!status) return "text-gray-400";
    if (status >= 200 && status < 300) return "text-green-400";
    if (status >= 400 && status < 500) return "text-yellow-400";
    if (status >= 500) return "text-red-400";
    return "text-gray-400";
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Activity Logs</h1>
        <p className="text-gray-400 mt-1">View all system activity and audit trail</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="bg-gray-800 rounded-lg p-4">
            <div className="text-2xl font-bold text-white">{stats.totalLogs.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Logs (30d)</div>
          </div>
          {(Object.entries(stats.byType) as [LogType, number][]).slice(0, 4).map(([type, count]) => {
            const config = logTypeConfig[type];
            const Icon = config.icon;
            return (
              <div key={type} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded ${config.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{count.toLocaleString()}</div>
                    <div className="text-xs text-gray-400">{config.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Filters */}
      <div className="bg-gray-800 rounded-lg p-4 mb-6">
        <form onSubmit={handleSearch} className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search logs..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-gray-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <select
            value={logType}
            onChange={(e) => {
              setLogType(e.target.value as LogType | "");
              setPage(1);
            }}
            className="bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            {Object.entries(logTypeConfig).map(([type, config]) => (
              <option key={type} value={type}>
                {config.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Search
          </button>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-12">
            <Activity className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No logs found</p>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-700">
              {logs.map((log) => {
                const config = logTypeConfig[log.log_type];
                const Icon = config.icon;
                return (
                  <div
                    key={log.id}
                    onClick={() => setSelectedLog(log)}
                    className="p-4 hover:bg-gray-700/50 cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded ${config.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-white">{log.action}</div>
                        {log.description && (
                          <p className="text-sm text-gray-400 truncate">{log.description}</p>
                        )}
                        <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {formatDate(log.created_at)}
                          {log.response_status && (
                            <span className={getStatusColor(log.response_status)}>{log.response_status}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left p-4 text-gray-400 font-medium">Type</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Action</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Description</th>
                    <th className="text-left p-4 text-gray-400 font-medium">User</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Status</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Time</th>
                    <th className="text-left p-4 text-gray-400 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {logs.map((log) => {
                    const config = logTypeConfig[log.log_type];
                    const Icon = config.icon;
                    return (
                      <tr
                        key={log.id}
                        onClick={() => setSelectedLog(log)}
                        className="hover:bg-gray-700/50 cursor-pointer"
                      >
                        <td className="p-4">
                          <div className={`inline-flex items-center gap-2 px-2 py-1 rounded ${config.color}`}>
                            <Icon className="w-3 h-3" />
                            <span className="text-xs">{config.label}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-white font-medium">{log.action}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400 truncate max-w-[200px] block">
                            {log.description || "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400 font-mono text-sm">
                            {log.user_id?.slice(0, 8) || log.admin_user_id || "-"}
                          </span>
                        </td>
                        <td className="p-4">
                          {log.response_status ? (
                            <span className={`font-mono ${getStatusColor(log.response_status)}`}>
                              {log.response_status}
                            </span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-4">
                          {log.response_time_ms ? (
                            <span className="text-gray-400">{log.response_time_ms}ms</span>
                          ) : (
                            "-"
                          )}
                        </td>
                        <td className="p-4">
                          <span className="text-gray-400 text-sm">{formatDate(log.created_at)}</span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between p-4 border-t border-gray-700">
              <div className="text-sm text-gray-400">
                Showing {(page - 1) * 50 + 1} - {Math.min(page * 50, total)} of {total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <span className="text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Log Details</h2>
              <button onClick={() => setSelectedLog(null)} className="text-gray-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Type</label>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded ${logTypeConfig[selectedLog.log_type].color}`}>
                    {logTypeConfig[selectedLog.log_type].label}
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Action</label>
                  <div className="text-white font-medium">{selectedLog.action}</div>
                </div>
              </div>

              {selectedLog.description && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Description</label>
                  <div className="text-white">{selectedLog.description}</div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">User ID</label>
                  <div className="text-white font-mono text-sm">{selectedLog.user_id || "-"}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Admin User ID</label>
                  <div className="text-white font-mono text-sm">{selectedLog.admin_user_id || "-"}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">IP Address</label>
                  <div className="text-white font-mono text-sm">{selectedLog.ip_address || "-"}</div>
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Date/Time</label>
                  <div className="text-white">{formatDate(selectedLog.created_at)}</div>
                </div>
              </div>

              {selectedLog.request_method && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Request</label>
                  <div className="text-white font-mono text-sm">
                    {selectedLog.request_method} {selectedLog.request_path}
                  </div>
                </div>
              )}

              {selectedLog.response_status && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Response Status</label>
                    <div className={`font-mono ${getStatusColor(selectedLog.response_status)}`}>
                      {selectedLog.response_status}
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Response Time</label>
                    <div className="text-white">{selectedLog.response_time_ms}ms</div>
                  </div>
                </div>
              )}

              {selectedLog.user_agent && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">User Agent</label>
                  <div className="text-gray-400 text-sm break-all">{selectedLog.user_agent}</div>
                </div>
              )}

              {selectedLog.error_message && (
                <div>
                  <label className="block text-sm text-red-400 mb-1">Error Message</label>
                  <div className="text-red-300 bg-red-900/20 rounded p-3 font-mono text-sm">
                    {selectedLog.error_message}
                  </div>
                </div>
              )}

              {selectedLog.error_stack && (
                <div>
                  <label className="block text-sm text-red-400 mb-1">Stack Trace</label>
                  <pre className="text-red-300 bg-red-900/20 rounded p-3 font-mono text-xs overflow-x-auto">
                    {selectedLog.error_stack}
                  </pre>
                </div>
              )}

              {selectedLog.metadata && Object.keys(selectedLog.metadata).length > 0 && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Metadata</label>
                  <pre className="text-gray-300 bg-gray-700 rounded p-3 font-mono text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.metadata, null, 2)}
                  </pre>
                </div>
              )}

              {selectedLog.request_body && Object.keys(selectedLog.request_body).length > 0 && (
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Request Body</label>
                  <pre className="text-gray-300 bg-gray-700 rounded p-3 font-mono text-sm overflow-x-auto">
                    {JSON.stringify(selectedLog.request_body, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
