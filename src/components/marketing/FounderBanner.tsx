"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flame, X } from "lucide-react";

interface FounderData {
  remaining: number;
  claimed: number;
  total: number;
  isFull: boolean;
}

export default function FounderBanner() {
  const [data, setData] = useState<FounderData | null>(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check if banner was dismissed in this session
    if (sessionStorage.getItem("founderBannerDismissed")) {
      setDismissed(true);
      return;
    }

    fetchFounderCount();
  }, []);

  const fetchFounderCount = async () => {
    try {
      const response = await fetch("/api/promo/founder-count");
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Failed to fetch founder count:", error);
    }
  };

  const handleDismiss = () => {
    sessionStorage.setItem("founderBannerDismissed", "true");
    setDismissed(true);
  };

  if (dismissed || !data || data.isFull) {
    return null;
  }

  return (
    <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Flame className="w-5 h-5 animate-pulse" />
          <span className="font-medium text-sm md:text-base">
            <span className="font-bold">{data.remaining}</span> of {data.total} free founding member spots remaining!
          </span>
          <span className="hidden md:inline text-white/80 text-sm">
            Get 1 year free when you sign up today
          </span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/signup"
            className="hidden sm:inline-block px-4 py-1.5 bg-white text-orange-600 rounded-full font-semibold text-sm hover:bg-orange-50 transition-colors"
          >
            Claim Your Spot
          </Link>
          <button
            onClick={handleDismiss}
            className="p-1 hover:bg-white/20 rounded transition-colors"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
