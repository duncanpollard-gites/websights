"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";

const trades = [
  { id: "plumber", name: "Plumber", icon: "🔧" },
  { id: "electrician", name: "Electrician", icon: "⚡" },
  { id: "builder", name: "Builder", icon: "🏗️" },
  { id: "roofer", name: "Roofer", icon: "🏠" },
  { id: "painter", name: "Painter & Decorator", icon: "🎨" },
  { id: "landscaper", name: "Landscaper", icon: "🌳" },
  { id: "carpenter", name: "Carpenter", icon: "🪚" },
  { id: "plasterer", name: "Plasterer", icon: "🧱" },
  { id: "locksmith", name: "Locksmith", icon: "🔐" },
  { id: "handyman", name: "Handyman", icon: "🛠️" },
  { id: "hairdresser", name: "Hairdresser", icon: "💇" },
  { id: "other", name: "Other", icon: "📋" },
];

const steps = [
  { id: 1, title: "Your Trade" },
  { id: 2, title: "Business Info" },
  { id: 3, title: "Services" },
  { id: 4, title: "Current Website" },
  { id: 5, title: "Create Account" },
];

interface FormData {
  trade: string;
  businessName: string;
  location: string;
  phone: string;
  services: string;
  existingWebsite: string;
  competitors: string;
  email: string;
  password: string;
}

export default function SignupPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    trade: "",
    businessName: "",
    location: "",
    phone: "",
    services: "",
    existingWebsite: "",
    competitors: "",
    email: "",
    password: "",
  });

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // TODO: Submit to Supabase
    console.log("Form submitted:", formData);
    // Redirect to dashboard/builder
    window.location.href = "/dashboard";
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.trade !== "";
      case 2:
        return formData.businessName !== "" && formData.location !== "";
      case 3:
        return formData.services !== "";
      case 4:
        return true; // Optional step
      case 5:
        return formData.email !== "" && formData.password.length >= 8;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">W</span>
            </div>
            <span className="text-xl font-bold text-gray-900">WebSights</span>
          </Link>
          <Link href="/login" className="text-gray-600 hover:text-gray-900">
            Already have an account?
          </Link>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    currentStep > step.id
                      ? "bg-green-500 text-white"
                      : currentStep === step.id
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-500"
                  }`}
                >
                  {currentStep > step.id ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`hidden sm:block ml-2 text-sm ${
                    currentStep >= step.id
                      ? "text-gray-900 font-medium"
                      : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
                {index < steps.length - 1 && (
                  <div
                    className={`w-8 sm:w-16 h-0.5 mx-2 ${
                      currentStep > step.id ? "bg-green-500" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Step 1: Select Trade */}
        {currentStep === 1 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              What trade are you in?
            </h1>
            <p className="text-gray-600 mb-8">
              We'll customise your website for your specific industry.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {trades.map((trade) => (
                <button
                  key={trade.id}
                  onClick={() => updateFormData("trade", trade.id)}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    formData.trade === trade.id
                      ? "border-blue-600 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-white"
                  }`}
                >
                  <span className="text-2xl mb-2 block">{trade.icon}</span>
                  <span className="font-medium text-gray-900">{trade.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Business Info */}
        {currentStep === 2 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Tell us about your business
            </h1>
            <p className="text-gray-600 mb-8">
              This will appear on your website.
            </p>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="businessName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Business Name
                </label>
                <input
                  type="text"
                  id="businessName"
                  value={formData.businessName}
                  onChange={(e) => updateFormData("businessName", e.target.value)}
                  placeholder="e.g. Smith Plumbing Services"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Location (Town/City)
                </label>
                <input
                  type="text"
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateFormData("location", e.target.value)}
                  placeholder="e.g. Beverley, East Yorkshire"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => updateFormData("phone", e.target.value)}
                  placeholder="e.g. 07700 900123"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {currentStep === 3 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              What services do you offer?
            </h1>
            <p className="text-gray-600 mb-8">
              List the main services you want to promote.
            </p>
            <div>
              <label
                htmlFor="services"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Services (one per line or comma-separated)
              </label>
              <textarea
                id="services"
                value={formData.services}
                onChange={(e) => updateFormData("services", e.target.value)}
                placeholder={`e.g.\nBathroom installations\nBoiler repairs & servicing\nEmergency callouts\nCentral heating\nUnblocking drains`}
                rows={6}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-none"
              />
            </div>
          </div>
        )}

        {/* Step 4: Current Website & Competitors */}
        {currentStep === 4 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Any websites to reference?
            </h1>
            <p className="text-gray-600 mb-8">
              Optional: We can analyse your current site and take inspiration from
              competitors.
            </p>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="existingWebsite"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Your Current Website (if you have one)
                </label>
                <input
                  type="url"
                  id="existingWebsite"
                  value={formData.existingWebsite}
                  onChange={(e) =>
                    updateFormData("existingWebsite", e.target.value)
                  }
                  placeholder="e.g. https://myoldsite.co.uk"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll import your content and improve on the design.
                </p>
              </div>
              <div>
                <label
                  htmlFor="competitors"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Competitor or Inspiration Sites
                </label>
                <textarea
                  id="competitors"
                  value={formData.competitors}
                  onChange={(e) => updateFormData("competitors", e.target.value)}
                  placeholder={`e.g.\nhttps://competitor1.co.uk\nhttps://niceplumbersite.com`}
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow resize-none"
                />
                <p className="text-sm text-gray-500 mt-1">
                  We'll take design inspiration from these sites.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Create Account */}
        {currentStep === 5 && (
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Create your account
            </h1>
            <p className="text-gray-600 mb-8">
              Almost there! Create an account to save your site.
            </p>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={formData.email}
                  onChange={(e) => updateFormData("email", e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={(e) => updateFormData("password", e.target.value)}
                  placeholder="Min. 8 characters"
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-shadow"
                />
              </div>
              <p className="text-sm text-gray-500">
                By creating an account, you agree to our{" "}
                <Link href="/terms" className="text-blue-600 hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-blue-600 hover:underline">
                  Privacy Policy
                </Link>
                .
              </p>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-12">
          {currentStep > 1 ? (
            <button
              onClick={prevStep}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}
          {currentStep < steps.length ? (
            <button
              onClick={nextStep}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                canProceed()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Continue
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canProceed()}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-colors ${
                canProceed()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }`}
            >
              Build My Website
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>
    </div>
  );
}
