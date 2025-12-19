"use client";

import Link from "next/link";
import {
  Globe,
  Mail,
  CreditCard,
  Settings,
  ExternalLink,
  MessageSquare,
  Sparkles
} from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Dashboard Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">W</span>
              </div>
              <span className="text-xl font-bold text-gray-900">WebSights</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">demo@example.com</span>
              <button className="text-gray-600 hover:text-gray-900">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back!</h1>
          <p className="text-gray-600">Manage your website and grow your business.</p>
        </div>

        {/* Site Preview Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Your Website</h2>
                <p className="text-sm text-gray-500">smithplumbing.websights.co.uk</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-sm font-medium rounded-full">
                  Draft
                </span>
                <Link
                  href="/dashboard/site"
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-blue-700 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  Edit with AI
                </Link>
              </div>
            </div>
          </div>

          {/* Site Preview */}
          <div className="aspect-video bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
            <div className="text-center">
              <p className="text-gray-400 text-lg mb-4">Your site preview will appear here</p>
              <Link
                href="/dashboard/site"
                className="text-blue-600 hover:underline font-medium"
              >
                Start building →
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Link
            href="/dashboard/site"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Edit Website</h3>
            <p className="text-sm text-gray-500">Make changes with AI</p>
          </Link>

          <Link
            href="/dashboard/domains"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Domain</h3>
            <p className="text-sm text-gray-500">Connect your domain</p>
          </Link>

          <Link
            href="/dashboard/email"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Mail className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Email</h3>
            <p className="text-sm text-gray-500">Set up business email</p>
          </Link>

          <Link
            href="/dashboard/billing"
            className="bg-white rounded-xl p-6 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all group"
          >
            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <CreditCard className="w-6 h-6" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-1">Go Live</h3>
            <p className="text-sm text-gray-500">Publish your site</p>
          </Link>
        </div>

        {/* AI Chat Prompt */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            What would you like to change?
          </h2>
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder='Try: "Add a testimonials section" or "Change the header colour to blue"'
                className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
              />
            </div>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Update
            </button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Add testimonials
            </button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Add photo gallery
            </button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Add contact form
            </button>
            <button className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 transition-colors">
              Change colours
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
