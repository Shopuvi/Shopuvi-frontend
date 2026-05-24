"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Store, MapPin, Phone, Tag, ArrowRight, Check, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { businessAPI, productAPI } from "@/lib/api";
import { CATEGORIES } from "@/lib/utils";

type Step = 1 | 2 | 3;

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>(1);
  const [isLoading, setIsLoading] = useState(false);
  const [businessId, setBusinessId] = useState("");

  const [businessForm, setBusinessForm] = useState({
    business_name: "",
    description: "",
    category: "",
    location: "",
    phone: "",
  });

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
  });

  const { user, refreshUser } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const handleCreateBusiness = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessForm.business_name) {
      toast("Business name is required.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await businessAPI.create(businessForm);
      setBusinessId(res.data.id);
      await refreshUser();
      toast("Your storefront is live!", "success");
      setStep(2);
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to create business.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.price) {
      toast("Product name and price are required.", "error");
      return;
    }

    setIsLoading(true);
    try {
      await productAPI.create({
        name: productForm.name,
        description: productForm.description,
        price: parseFloat(productForm.price),
        image_url: productForm.image_url || undefined,
        is_available: true,
      });
      toast("Product added!", "success");
      setStep(3);
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to add product.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  const steps = [
    { number: 1, label: "Your Business" },
    { number: 2, label: "First Product" },
    { number: 3, label: "Go Live" },
  ];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <div className="max-w-lg mx-auto px-4 py-8">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ background: "var(--brand)" }}>
            <Store className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800"
            style={{ fontFamily: "var(--font-syne)" }}>
            Set up your store
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Takes less than 3 minutes
          </p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {steps.map((s, i) => (
            <div key={s.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold transition-all"
                  style={{
                    background: step > s.number ? "var(--brand)" : step === s.number ? "var(--brand)" : "#e5e7eb",
                    color: step >= s.number ? "white" : "#9ca3af",
                  }}>
                  {step > s.number ? <Check className="w-4 h-4" /> : s.number}
                </div>
                <span className="text-xs mt-1 font-medium"
                  style={{ color: step >= s.number ? "var(--brand)" : "#9ca3af" }}>
                  {s.label}
                </span>
              </div>
              {i < steps.length - 1 && (
                <div className="w-16 h-0.5 mb-4 mx-1 transition-all"
                  style={{ background: step > s.number ? "var(--brand)" : "#e5e7eb" }} />
              )}
            </div>
          ))}
        </div>

        {/* Step 1 — Business details */}
        {step === 1 && (
          <div className="bg-white rounded-3xl p-6 shadow-card animate-slide-up">
            <h2 className="font-bold text-gray-800 text-lg mb-1">Tell us about your business</h2>
            <p className="text-gray-400 text-sm mb-6">This becomes your public storefront profile.</p>

            <form onSubmit={handleCreateBusiness} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Business Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nasir Electronics"
                  value={businessForm.business_name}
                  onChange={(e) => setBusinessForm({ ...businessForm, business_name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Category
                </label>
                <select
                  value={businessForm.category}
                  onChange={(e) => setBusinessForm({ ...businessForm, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all bg-white">
                  <option value="">Select a category</option>
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.icon} {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="e.g. Lagos, Nigeria"
                    value={businessForm.location}
                    onChange={(e) => setBusinessForm({ ...businessForm, location: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="tel"
                    placeholder="e.g. 08012345678"
                    value={businessForm.phone}
                    onChange={(e) => setBusinessForm({ ...businessForm, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Tell customers what you sell..."
                  value={businessForm.description}
                  onChange={(e) => setBusinessForm({ ...businessForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                style={{ background: "var(--brand)" }}>
                {isLoading ? (
                  <><span className="spinner" /> Creating storefront...</>
                ) : (
                  <>Create My Storefront <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Step 2 — First product */}
        {step === 2 && (
          <div className="bg-white rounded-3xl p-6 shadow-card animate-slide-up">
            <h2 className="font-bold text-gray-800 text-lg mb-1">Add your first product</h2>
            <p className="text-gray-400 text-sm mb-6">
              Get your store looking great. You can add more later.
            </p>

            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. iPhone 14 Pro"
                  value={productForm.name}
                  onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  placeholder="e.g. 750000"
                  value={productForm.price}
                  onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://example.com/image.jpg"
                    value={productForm.image_url}
                    onChange={(e) => setProductForm({ ...productForm, image_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Paste a link to your product photo
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Describe your product..."
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all">
                  Skip for now
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "var(--brand)" }}>
                  {isLoading ? (
                    <><span className="spinner" /> Adding...</>
                  ) : (
                    <>Add Product <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Step 3 — Go live */}
        {step === 3 && (
          <div className="bg-white rounded-3xl p-6 shadow-card animate-slide-up text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--brand-light)" }}>
              <Check className="w-8 h-8" style={{ color: "var(--brand)" }} />
            </div>

            <h2 className="font-bold text-gray-800 text-xl mb-2"
              style={{ fontFamily: "var(--font-syne)" }}>
              Your store is live! 🎉
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Your storefront is ready at:
            </p>

            <div className="px-4 py-3 rounded-xl mb-6 font-mono text-sm font-semibold"
              style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
              shopuvi.com/@{user?.username}
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90"
                style={{ background: "var(--brand)" }}>
                Go to Dashboard
              </button>
              <button
                onClick={() => router.push(`/@${user?.username}`)}
                className="w-full py-3.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-700 hover:bg-gray-50 transition-all">
                View My Storefront
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
