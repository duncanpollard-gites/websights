"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Eye,
  X,
  Globe,
  Mail,
  Phone,
  MapPin,
  Building,
  CreditCard,
  Calendar,
  ExternalLink,
  UserCog,
} from "lucide-react";

interface Customer {
  id: string;
  email: string;
  business_name: string | null;
  trade: string | null;
  location: string | null;
  phone: string | null;
  created_at: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  site_count: number;
  live_site_count: number;
}

interface CustomerDetails {
  id: string;
  email: string;
  business_name: string | null;
  trade: string | null;
  location: string | null;
  phone: string | null;
  services: string | null;
  created_at: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

interface Site {
  id: string;
  subdomain: string;
  custom_domain: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

interface Pagination {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export default function AdminCustomersPage() {
  const router = useRouter();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [trades, setTrades] = useState<{ trade: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState("");
  const [selectedTrade, setSelectedTrade] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Modal
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDetails | null>(null);
  const [customerSites, setCustomerSites] = useState<Site[]>([]);
  const [modalLoading, setModalLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Impersonation
  const [showImpersonateModal, setShowImpersonateModal] = useState(false);
  const [impersonateUserId, setImpersonateUserId] = useState<string | null>(null);
  const [impersonateUserEmail, setImpersonateUserEmail] = useState<string>("");
  const [impersonateReason, setImpersonateReason] = useState("");
  const [impersonating, setImpersonating] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, [currentPage, search, selectedTrade, selectedStatus]);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "20",
      });
      if (search) params.append("search", search);
      if (selectedTrade) params.append("trade", selectedTrade);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/admin/customers?${params}`);
      const data = await response.json();

      setCustomers(data.customers || []);
      setPagination(data.pagination);
      if (data.filters?.trades) {
        setTrades(data.filters.trades);
      }
    } catch (error) {
      console.error("Failed to fetch customers:", error);
    } finally {
      setLoading(false);
    }
  };

  const viewCustomer = async (customerId: string) => {
    setModalLoading(true);
    setShowModal(true);

    try {
      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customerId }),
      });
      const data = await response.json();

      setSelectedCustomer(data.customer);
      setCustomerSites(data.sites || []);
    } catch (error) {
      console.error("Failed to fetch customer details:", error);
    } finally {
      setModalLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const openImpersonateModal = (userId: string, email: string) => {
    setImpersonateUserId(userId);
    setImpersonateUserEmail(email);
    setImpersonateReason("");
    setShowImpersonateModal(true);
  };

  const startImpersonation = async () => {
    if (!impersonateUserId) return;

    setImpersonating(true);
    try {
      const response = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: impersonateUserId,
          reason: impersonateReason || "Admin review",
        }),
      });

      if (response.ok) {
        // Redirect to user's dashboard
        router.push("/dashboard");
      } else {
        const data = await response.json();
        alert(data.error || "Failed to start impersonation");
      }
    } catch (error) {
      console.error("Impersonation error:", error);
      alert("Failed to start impersonation");
    } finally {
      setImpersonating(false);
      setShowImpersonateModal(false);
    }
  };

  const getStatusBadge = (customer: Customer) => {
    if (customer.stripe_subscription_id) {
      return (
        <span className="px-2 py-1 bg-green-900/50 text-green-400 text-xs rounded-full">
          Subscribed
        </span>
      );
    }
    if (customer.live_site_count > 0) {
      return (
        <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 text-xs rounded-full">
          Live (Free)
        </span>
      );
    }
    return (
      <span className="px-2 py-1 bg-gray-700 text-gray-400 text-xs rounded-full">
        Free
      </span>
    );
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-gray-400">Manage your TradeVista customers</p>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-xl p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[250px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by email, business name, or location..."
                className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          {/* Trade Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <select
              value={selectedTrade}
              onChange={(e) => {
                setSelectedTrade(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 pr-8 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            >
              <option value="">All Trades</option>
              {trades.map((t) => (
                <option key={t.trade} value={t.trade}>
                  {t.trade.charAt(0).toUpperCase() + t.trade.slice(1)} ({t.count})
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white appearance-none cursor-pointer focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          >
            <option value="">All Status</option>
            <option value="subscribed">Subscribed</option>
            <option value="free">Free</option>
          </select>
        </div>
      </div>

      {/* Stats Bar */}
      {pagination && (
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">
            Showing {customers.length} of {pagination.totalCount} customers
          </p>
        </div>
      )}

      {/* Customers Table */}
      <div className="bg-gray-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : customers.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No customers found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-gray-400 text-sm border-b border-gray-700">
                  <th className="p-4">Business</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Trade</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Sites</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined</th>
                  <th className="p-4"></th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                {customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="border-b border-gray-700 hover:bg-gray-750"
                  >
                    <td className="p-4 font-medium text-white">
                      {customer.business_name || "-"}
                    </td>
                    <td className="p-4">{customer.email}</td>
                    <td className="p-4 capitalize">{customer.trade || "-"}</td>
                    <td className="p-4">{customer.location || "-"}</td>
                    <td className="p-4">
                      <span className="flex items-center gap-1">
                        <Globe className="w-4 h-4 text-gray-500" />
                        {customer.live_site_count}/{customer.site_count}
                      </span>
                    </td>
                    <td className="p-4">{getStatusBadge(customer)}</td>
                    <td className="p-4 text-gray-500">
                      {formatDate(customer.created_at)}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => viewCustomer(customer.id)}
                          className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
                          title="View details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openImpersonateModal(customer.id, customer.email)}
                          className="p-2 text-gray-400 hover:text-yellow-400 hover:bg-yellow-900/30 rounded-lg transition-colors"
                          title="Impersonate user"
                        >
                          <UserCog className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-4 border-t border-gray-700 flex items-center justify-between">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1 px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </button>
            <span className="text-gray-400 text-sm">
              Page {pagination.page} of {pagination.totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((p) => Math.min(pagination.totalPages, p + 1))
              }
              disabled={currentPage === pagination.totalPages}
              className="flex items-center gap-1 px-3 py-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Customer Detail Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-700 flex items-center justify-between sticky top-0 bg-gray-800">
              <h2 className="text-xl font-bold text-white">Customer Details</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {modalLoading ? (
              <div className="p-8 flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              </div>
            ) : selectedCustomer ? (
              <div className="p-6 space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-gray-300">
                    <Building className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Business</p>
                      <p className="text-white">
                        {selectedCustomer.business_name || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Mail className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-white">{selectedCustomer.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Phone className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-white">
                        {selectedCustomer.phone || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <MapPin className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-white">
                        {selectedCustomer.location || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <Calendar className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Joined</p>
                      <p className="text-white">
                        {formatDate(selectedCustomer.created_at)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-gray-300">
                    <CreditCard className="w-5 h-5 text-gray-500" />
                    <div>
                      <p className="text-xs text-gray-500">Subscription</p>
                      <p className="text-white">
                        {selectedCustomer.stripe_subscription_id
                          ? "Active"
                          : "None"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Services */}
                {selectedCustomer.services && (
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Services</p>
                    <p className="text-gray-300">{selectedCustomer.services}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {selectedCustomer.stripe_customer_id && (
                    <a
                      href={`https://dashboard.stripe.com/customers/${selectedCustomer.stripe_customer_id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg text-sm transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View in Stripe
                    </a>
                  )}
                  <button
                    onClick={() => {
                      setShowModal(false);
                      openImpersonateModal(selectedCustomer.id, selectedCustomer.email);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white hover:bg-yellow-700 rounded-lg text-sm transition-colors"
                  >
                    <UserCog className="w-4 h-4" />
                    Impersonate User
                  </button>
                </div>

                {/* Sites */}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">
                    Sites ({customerSites.length})
                  </h3>
                  {customerSites.length === 0 ? (
                    <p className="text-gray-500">No sites created yet</p>
                  ) : (
                    <div className="space-y-2">
                      {customerSites.map((site) => (
                        <div
                          key={site.id}
                          className="flex items-center justify-between p-3 bg-gray-700 rounded-lg"
                        >
                          <div>
                            <p className="text-white font-medium">
                              {site.subdomain}.tradevista.co.uk
                            </p>
                            {site.custom_domain && (
                              <p className="text-sm text-gray-400">
                                {site.custom_domain}
                              </p>
                            )}
                          </div>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              site.status === "live"
                                ? "bg-green-900/50 text-green-400"
                                : "bg-gray-600 text-gray-300"
                            }`}
                          >
                            {site.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-gray-500">
                Customer not found
              </div>
            )}
          </div>
        </div>
      )}

      {/* Impersonation Confirmation Modal */}
      {showImpersonateModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl max-w-md w-full">
            <div className="p-6 border-b border-gray-700">
              <h2 className="text-xl font-bold text-white">Impersonate User</h2>
              <p className="text-gray-400 text-sm mt-1">
                You will be logged in as this user and can make changes on their behalf.
              </p>
            </div>

            <div className="p-6 space-y-4">
              <div className="bg-yellow-900/30 border border-yellow-700 rounded-lg p-4">
                <p className="text-yellow-400 text-sm">
                  <strong>Warning:</strong> All actions will be logged. You are about to impersonate:
                </p>
                <p className="text-white font-medium mt-2">{impersonateUserEmail}</p>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Reason for impersonation (optional)
                </label>
                <input
                  type="text"
                  value={impersonateReason}
                  onChange={(e) => setImpersonateReason(e.target.value)}
                  placeholder="e.g., Customer support request, debugging issue..."
                  className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setShowImpersonateModal(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={startImpersonation}
                  disabled={impersonating}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  {impersonating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Starting...
                    </>
                  ) : (
                    <>
                      <UserCog className="w-4 h-4" />
                      Start Impersonation
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
