"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shield, X } from "lucide-react";

interface ImpersonationState {
  impersonating: boolean;
  admin?: {
    email: string;
    name: string | null;
  };
}

export default function ImpersonationBanner() {
  const router = useRouter();
  const [state, setState] = useState<ImpersonationState>({ impersonating: false });
  const [ending, setEnding] = useState(false);

  useEffect(() => {
    // Check if impersonating via cookie first (faster)
    const cookies = document.cookie.split(";").reduce((acc, cookie) => {
      const [key, value] = cookie.trim().split("=");
      acc[key] = value;
      return acc;
    }, {} as Record<string, string>);

    if (cookies.impersonating !== "true") {
      return;
    }

    // Get full details from API
    checkImpersonation();
  }, []);

  const checkImpersonation = async () => {
    try {
      const res = await fetch("/api/admin/impersonate");
      const data = await res.json();
      setState(data);
    } catch (error) {
      console.error("Failed to check impersonation:", error);
    }
  };

  const endImpersonation = async () => {
    setEnding(true);
    try {
      const res = await fetch("/api/admin/impersonate", { method: "DELETE" });
      if (res.ok) {
        router.push("/admin/customers");
      }
    } catch (error) {
      console.error("Failed to end impersonation:", error);
    } finally {
      setEnding(false);
    }
  };

  if (!state.impersonating) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-yellow-900 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="w-5 h-5" />
          <span className="font-medium">
            You are viewing as a customer
            {state.admin && (
              <span className="hidden sm:inline">
                {" "}(logged in as {state.admin.name || state.admin.email})
              </span>
            )}
          </span>
        </div>
        <button
          onClick={endImpersonation}
          disabled={ending}
          className="flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-1.5 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {ending ? (
            "Returning..."
          ) : (
            <>
              <X className="w-4 h-4" />
              Exit Impersonation
            </>
          )}
        </button>
      </div>
    </div>
  );
}
