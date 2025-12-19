"use client";

import { useState, useEffect } from "react";
import { Users, Globe, CreditCard, TrendingUp, Loader2 } from "lucide-react";

interface Stats {
  totalUsers: number;
  liveSites: number;
  draftSites: number;
  revenue: number;
  recentUsers: Array<{
    id: string;
    email: string;
    business_name: string;
    trade: string;
    created_at: string;
  }>;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Overview of your TradeVista platform</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
              <p className="text-gray-400 text-sm">Total Users</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-600/20 text-green-400 rounded-xl flex items-center justify-center">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats?.liveSites || 0}</p>
              <p className="text-gray-400 text-sm">Live Sites</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-600/20 text-yellow-400 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">{stats?.draftSites || 0}</p>
              <p className="text-gray-400 text-sm">Draft Sites</p>
            </div>
          </div>
        </div>

        <div className="bg-gray-800 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-600/20 text-purple-400 rounded-xl flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <p className="text-3xl font-bold text-white">
                £{((stats?.revenue || 0) / 100).toFixed(0)}
              </p>
              <p className="text-gray-400 text-sm">Monthly Revenue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Users */}
      <div className="bg-gray-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Recent Signups</h2>
        {stats?.recentUsers && stats.recentUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm">
                  <th className="pb-3">Business</th>
                  <th className="pb-3">Email</th>
                  <th className="pb-3">Trade</th>
                  <th className="pb-3">Signed Up</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {stats.recentUsers.map((user) => (
                  <tr key={user.id} className="border-t border-gray-700">
                    <td className="py-3">{user.business_name || "-"}</td>
                    <td className="py-3">{user.email}</td>
                    <td className="py-3 capitalize">{user.trade || "-"}</td>
                    <td className="py-3">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500">No users yet</p>
        )}
      </div>
    </div>
  );
}
