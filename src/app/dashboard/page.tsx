"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Store, Plus, Package, MessageCircle, Eye,
  Edit3, Trash2, ToggleLeft, ToggleRight,
  Copy, Check, ExternalLink, TrendingUp
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import { ProductCardSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { businessAPI, productAPI, messageAPI } from "@/lib/api";
import { formatPrice, truncate } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  price: string;
  image_url?: string;
  is_available: boolean;
  description?: string;
}

interface Business {
  id: string;
  business_name: string;
  description?: string;
  category?: string;
  location?: string;
  logo_url?: string;
  products: Product[];
}

export default function DashboardPage() {
  const [business, setBusiness] = useState<Business | null>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) router.replace("/auth/login");
    if (!authLoading && user?.role !== "VENDOR") router.replace("/");
  }, [authLoading, isAuthenticated, user, router]);

  const loadDashboard = useCallback(async () => {
    try {
      setIsLoading(true);
      const [bizRes, msgRes] = await Promise.allSettled([
        businessAPI.getMyBusiness(),
        messageAPI.getInbox(),
      ]);

      if (bizRes.status === "fulfilled") setBusiness(bizRes.value.data);
      else router.replace("/dashboard/onboarding");

      if (msgRes.status === "fulfilled") setConversations(msgRes.value.data.slice(0, 5));
    } catch {
      router.replace("/dashboard/onboarding");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (isAuthenticated && user?.role === "VENDOR") loadDashboard();
  }, [isAuthenticated, user, loadDashboard]);

  const copyStorefrontLink = () => {
    const url = `${window.location.origin}/@${user?.username}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast("Storefront link copied!", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleAvailability = async (product: Product) => {
    setTogglingId(product.id);
    try {
      await productAPI.update(product.id, { is_available: !product.is_available });
      setBusiness((prev) => prev ? {
        ...prev,
        products: prev.products.map((p) =>
          p.id === product.id ? { ...p, is_available: !p.is_available } : p
        ),
      } : prev);
      toast(`${product.name} marked as ${!product.is_available ? "available" : "unavailable"}`, "success");
    } catch {
      toast("Failed to update product.", "error");
    } finally {
      setTogglingId(null);
    }
  };

  const deleteProduct = async (productId: string, name: string) => {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    setDeletingId(productId);
    try {
      await productAPI.delete(productId);
      setBusiness((prev) => prev ? {
        ...prev,
        products: prev.products.filter((p) => p.id !== productId),
      } : prev);
      toast("Product deleted.", "success");
    } catch {
      toast("Failed to delete product.", "error");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-8">
          <div className="skeleton h-32 w-full rounded-2xl mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => <div key={i} className="skeleton h-24 rounded-2xl" />)}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        </div>
      </div>
    );
  }

  const availableCount = business?.products.filter((p) => p.is_available).length || 0;
  const totalCount = business?.products.length || 0;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Business header card */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            {business?.logo_url ? (
              <Image src={business.logo_url} alt={business.business_name}
                width={64} height={64} className="rounded-2xl object-cover shrink-0" />
            ) : (
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shrink-0"
                style={{ background: "var(--brand)" }}>
                {business?.business_name.slice(0, 1)}
              </div>
            )}

            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-gray-800"
                style={{ fontFamily: "var(--font-syne)" }}>
                {business?.business_name}
              </h1>
              <p className="text-gray-400 text-sm">
                {business?.category} {business?.location && `· ${business.location}`}
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button onClick={copyStorefrontLink}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-50 transition-all">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-gray-500" />}
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <Link href={`/@${user?.username}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all hover:opacity-90"
                style={{ background: "var(--brand)" }}>
                <ExternalLink className="w-4 h-4" />
                View Store
              </Link>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Products", value: totalCount, icon: Package, color: "var(--brand)" },
            { label: "Available", value: availableCount, icon: TrendingUp, color: "#10b981" },
            { label: "Messages", value: conversations.length, icon: MessageCircle, color: "#f59e0b" },
            { label: "Store Views", value: "—", icon: Eye, color: "#6366f1" },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-card">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs text-gray-400 font-medium">{stat.label}</p>
                <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: `${stat.color}15` }}>
                  <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Products section */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800" style={{ fontFamily: "var(--font-syne)" }}>
                My Products ({totalCount})
              </h2>
              <Link href="/dashboard/products/new"
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ background: "var(--brand)" }}>
                <Plus className="w-4 h-4" />
                Add Product
              </Link>
            </div>

            {business?.products.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-card">
                <EmptyState
                  icon={Package}
                  title="No products yet"
                  description="Add your first product to start selling on Shopuvi."
                  action={{ label: "Add Product", href: "/dashboard/products/new" }}
                />
              </div>
            ) : (
              <div className="space-y-3">
                {business?.products.map((product) => (
                  <div key={product.id}
                    className="bg-white rounded-2xl p-4 shadow-card flex items-center gap-4">

                    {/* Product image */}
                    <div className="w-14 h-14 rounded-xl overflow-hidden bg-gray-50 shrink-0">
                      {product.image_url ? (
                        <Image src={product.image_url} alt={product.name}
                          width={56} height={56} className="object-cover w-full h-full" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-6 h-6 text-gray-200" />
                        </div>
                      )}
                    </div>

                    {/* Product info */}
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{product.name}</p>
                      <p className="font-bold text-sm" style={{ color: "var(--brand)" }}>
                        {formatPrice(product.price)}
                      </p>
                    </div>

                    {/* Status badge */}
                    <span className="shrink-0 text-xs font-medium px-2.5 py-1 rounded-full"
                      style={{
                        background: product.is_available ? "#dcfce7" : "#f3f4f6",
                        color: product.is_available ? "#16a34a" : "#6b7280",
                      }}>
                      {product.is_available ? "Available" : "Unavailable"}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => toggleAvailability(product)}
                        disabled={togglingId === product.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 transition-all disabled:opacity-50"
                        title="Toggle availability">
                        {product.is_available
                          ? <ToggleRight className="w-5 h-5 text-green-500" />
                          : <ToggleLeft className="w-5 h-5" />}
                      </button>
                      <Link href={`/dashboard/products/${product.id}/edit`}
                        className="p-2 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 transition-all">
                        <Edit3 className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => deleteProduct(product.id, product.name)}
                        disabled={deletingId === product.id}
                        className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all disabled:opacity-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Messages sidebar */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-800" style={{ fontFamily: "var(--font-syne)" }}>
                Recent Messages
              </h2>
              <Link href="/messages"
                className="text-sm font-medium" style={{ color: "var(--brand)" }}>
                View all
              </Link>
            </div>

            <div className="bg-white rounded-2xl shadow-card overflow-hidden">
              {conversations.length === 0 ? (
                <div className="p-8 text-center">
                  <MessageCircle className="w-8 h-8 mx-auto mb-2 text-gray-200" />
                  <p className="text-sm text-gray-400">No messages yet</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <Link key={conv.id} href={`/messages/${conv.id}`}
                    className="flex items-start gap-3 p-4 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0"
                      style={{ background: "var(--brand)" }}>
                      {conv.customer?.username?.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {conv.customer?.username}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {conv.messages?.[0]?.content || "Image message"}
                      </p>
                    </div>
                  </Link>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
