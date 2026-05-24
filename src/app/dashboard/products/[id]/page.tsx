"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, Image as ImageIcon } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { productAPI } from "@/lib/api";
import { formatPrice } from "@/lib/utils";

export default function ProductFormPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image_url: "",
    is_available: true,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;
  const isEditing = !!productId && productId !== "new";

  useEffect(() => {
    if (!isAuthenticated) router.replace("/auth/login");
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (isEditing) {
      setIsFetching(true);
      productAPI.getById(productId)
        .then((res) => {
          const p = res.data;
          setForm({
            name: p.name,
            description: p.description || "",
            price: p.price.toString(),
            image_url: p.image_url || "",
            is_available: p.is_available,
          });
        })
        .catch(() => {
          toast("Product not found.", "error");
          router.replace("/dashboard");
        })
        .finally(() => setIsFetching(false));
    }
  }, [isEditing, productId, router, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price) {
      toast("Name and price are required.", "error");
      return;
    }

    setIsLoading(true);
    try {
      if (isEditing) {
        await productAPI.update(productId, {
          ...form,
          price: parseFloat(form.price),
          image_url: form.image_url || undefined,
        });
        toast("Product updated successfully.", "success");
      } else {
        await productAPI.create({
          ...form,
          price: parseFloat(form.price),
          image_url: form.image_url || undefined,
        });
        toast("Product added successfully.", "success");
      }
      router.replace("/dashboard");
    } catch (err: any) {
      toast(err.response?.data?.message || "Failed to save product.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <Link href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>

        <div className="bg-white rounded-3xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "var(--brand-light)" }}>
              <Package className="w-5 h-5" style={{ color: "var(--brand)" }} />
            </div>
            <h1 className="text-xl font-bold text-gray-800"
              style={{ fontFamily: "var(--font-syne)" }}>
              {isEditing ? "Edit Product" : "Add New Product"}
            </h1>
          </div>

          {isFetching ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="skeleton h-12 w-full rounded-xl" />
              ))}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. iPhone 14 Pro Max"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Price (₦) *
                </label>
                <input
                  type="number"
                  placeholder="0"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  min="0"
                  step="0.01"
                />
                {form.price && !isNaN(parseFloat(form.price)) && (
                  <p className="text-xs text-gray-400 mt-1">
                    Displays as: <span className="font-semibold" style={{ color: "var(--brand)" }}>
                      {formatPrice(parseFloat(form.price))}
                    </span>
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Product Image URL
                </label>
                <div className="relative">
                  <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="url"
                    placeholder="https://example.com/photo.jpg"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Paste a direct link to your product image
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Description
                </label>
                <textarea
                  placeholder="Describe your product — condition, features, size..."
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl bg-gray-50">
                <div>
                  <p className="text-sm font-medium text-gray-700">Available for purchase</p>
                  <p className="text-xs text-gray-400">Customers can see and inquire about this product</p>
                </div>
                <button
                  type="button"
                  onClick={() => setForm({ ...form, is_available: !form.is_available })}
                  className="relative inline-flex h-6 w-11 items-center rounded-full transition-all"
                  style={{ background: form.is_available ? "var(--brand)" : "#d1d5db" }}>
                  <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform shadow-sm"
                    style={{ transform: form.is_available ? "translateX(1.25rem)" : "translateX(0.25rem)" }} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <Link href="/dashboard"
                  className="flex-1 py-3.5 rounded-xl font-semibold text-sm border border-gray-200 text-gray-500 hover:bg-gray-50 transition-all text-center">
                  Cancel
                </Link>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                  style={{ background: "var(--brand)" }}>
                  {isLoading ? (
                    <><span className="spinner" /> Saving...</>
                  ) : (
                    isEditing ? "Save Changes" : "Add Product"
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
