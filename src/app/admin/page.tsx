"use client";

import { useState, useEffect } from "react";
import {
  Users,
  Globe,
  CreditCard,
  TrendingUp,
  Loader2,
  Calendar,
  UserPlus,
  Activity,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

interface Analytics {
  overview: {
    totalUsers: number;
    newUsers: number;
    totalSites: number;
    liveSites: number;
    subscribedUsers: number;
    mrr: number;
    todaySignups: number;
    weekSignups: number;
  };
  charts: {
    signups: Array<{ date: string; count: number }>;
    monthlySignups: Array<{ month: string; count: number }>;
    mrrTrend: Array<{ month: string; mrr: number }>;
    tradeDistribution: Array<{ name: string; value: number }>;
    siteStatus: Array<{ name: string; value: number }>;
  };
}

const COLORS = ["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#6366F1", "#14B8A6"];

export default function AdminDashboardPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState("30");

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch(`/api/admin/analytics?period=${period}`);
      const data = await response.json();
      setAnalytics(data);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const overview = analytics?.overview;
  const charts = analytics?.charts;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
          <p className="text-gray-400">Overview of your TradeVista platform</p>
        </div>
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
          <option value="365">Last year</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{overview?.totalUsers || 0}</p>
              <p className="text-gray-400 text-sm">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600/20 text-green-400 rounded-lg flex items-center justify-center">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{overview?.liveSites || 0}</p>
              <p className="text-gray-400 text-sm">Live Sites</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-600/20 text-yellow-400 rounded-lg flex items-center justify-center">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{overview?.newUsers || 0}</p>
              <p className="text-gray-400 text-sm">New ({period}d)</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/20 text-purple-400 rounded-lg flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">
                £{overview?.mrr || 0}
              </p>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">Today</span>
          </div>
          <p className="text-xl font-bold text-white">{overview?.todaySignups || 0} signups</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Activity className="w-4 h-4" />
            <span className="text-sm">This Week</span>
          </div>
          <p className="text-xl font-bold text-white">{overview?.weekSignups || 0} signups</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm">Subscribers</span>
          </div>
          <p className="text-xl font-bold text-white">{overview?.subscribedUsers || 0}</p>
        </div>
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 text-gray-400 mb-1">
            <Globe className="w-4 h-4" />
            <span className="text-sm">Total Sites</span>
          </div>
          <p className="text-xl font-bold text-white">{overview?.totalSites || 0}</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        {/* Signups Over Time */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Signups Over Time</h3>
          <div className="h-64">
            {charts?.signups && charts.signups.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={charts.signups}>
                  <defs>
                    <linearGradient id="signupGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="date"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(value) => new Date(value).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                  />
                  <YAxis stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                    labelStyle={{ color: "#F9FAFB" }}
                    itemStyle={{ color: "#3B82F6" }}
                    labelFormatter={(value) => new Date(value).toLocaleDateString("en-GB")}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    fill="url(#signupGradient)"
                    name="Signups"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data yet</div>
            )}
          </div>
        </div>

        {/* MRR Trend */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">MRR Trend</h3>
          <div className="h-64">
            {charts?.mrrTrend && charts.mrrTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={charts.mrrTrend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis
                    dataKey="month"
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(value) => {
                      const [year, month] = value.split("-");
                      return new Date(parseInt(year), parseInt(month) - 1).toLocaleDateString("en-GB", { month: "short" });
                    }}
                  />
                  <YAxis
                    stroke="#9CA3AF"
                    tick={{ fill: "#9CA3AF", fontSize: 12 }}
                    tickFormatter={(value) => `£${value}`}
                  />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                    labelStyle={{ color: "#F9FAFB" }}
                    formatter={(value) => [`£${value}`, "MRR"]}
                  />
                  <Line type="monotone" dataKey="mrr" stroke="#10B981" strokeWidth={2} dot={{ fill: "#10B981" }} />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data yet</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Trade Distribution */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Users by Trade</h3>
          <div className="h-64">
            {charts?.tradeDistribution && charts.tradeDistribution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={charts.tradeDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                    label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                    labelLine={{ stroke: "#6B7280" }}
                  >
                    {charts.tradeDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data yet</div>
            )}
          </div>
        </div>

        {/* Site Status */}
        <div className="bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Sites by Status</h3>
          <div className="h-64">
            {charts?.siteStatus && charts.siteStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={charts.siteStatus} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                  <XAxis type="number" stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} />
                  <YAxis type="category" dataKey="name" stroke="#9CA3AF" tick={{ fill: "#9CA3AF", fontSize: 12 }} width={80} />
                  <Tooltip
                    contentStyle={{ backgroundColor: "#1F2937", border: "1px solid #374151", borderRadius: "8px" }}
                    labelStyle={{ color: "#F9FAFB" }}
                  />
                  <Bar dataKey="value" fill="#3B82F6" radius={[0, 4, 4, 0]}>
                    {charts.siteStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.name === "Live"
                            ? "#10B981"
                            : entry.name === "Draft"
                            ? "#F59E0B"
                            : "#6B7280"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-500">No data yet</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
