"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, MessageCircle, Share2, Package, Check, Store } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { StorefrontSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import { useToast } from "@/components/ui/Toast";
import { useAuth } from "@/context/AuthContext";
import { businessAPI, messageAPI } from "@/lib/api";
import { CATEGORIES } from "@/lib/utils";
import { IMAGES } from "@/lib/images";
import { useRouter } from "next/navigation";
import { IMAGES as IMG } from "@/lib/images";

interface Business {
  id: string;
  owner_id: string;
  business_name: string;
  description?: string;
  category?: string;
  location?: string;
  logo_url?: string;
  banner_url?: string;
  phone?: string;
  owner: { username: string };
  products: any[];
}

export default function StorefrontClient({ username }: { username: string }) {
  const [business, setBusiness] = useState<Business | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [messaging, setMessaging] = useState(false);
  const [shared, setShared] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    businessAPI.getByUsername(username)
      .then((res) => setBusiness(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setIsLoading(false));
  }, [username]);

  const handleMessage = async () => {
    if (!isAuthenticated) { router.push("/auth/login"); return; }
    if (user?.username === username) { toast("This is your own store.", "info"); return; }
    setMessaging(true);
    try {
      const res = await messageAPI.startConversation(business?.owner_id || "");
      router.push(`/messages/${res.data.id}`);
    } catch {
      toast("Could not start conversation.", "error");
    } finally {
      setMessaging(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: business?.business_name, url });
    } else {
      navigator.clipboard.writeText(url);
      setShared(true);
      toast("Store link copied!", "success");
      setTimeout(() => setShared(false), 2000);
    }
  };

  const categoryEmoji = CATEGORIES.find((c) => c.value === business?.category)?.icon || "🏪";

  if (isLoading) return (
    <div className="min-h-screen">
      <Navbar />
      <StorefrontSkeleton />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen">
      <Navbar />
      <EmptyState
        icon={Store}
        title="Store not found"
        description={`@${username} doesn't exist on Shopuvi yet.`}
        action={{ label: "Browse Marketplace", href: "/" }}
      />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Navbar />

      {/* Banner */}
      <div className="relative h-48 sm:h-64 overflow-hidden">
        <Image
          src={business?.banner_url || IMG.defaultBanner}
          alt={`${business?.business_name} banner`}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0"
          style={{ background: "linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.4) 100%)" }} />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Business header */}
        <div className="relative -mt-12 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4">

            {/* Logo */}
            <div className="w-24 h-24 rounded-2xl border-4 border-white shadow-lg overflow-hidden shrink-0"
              style={{ background: "var(--brand)" }}>
              {business?.logo_url ? (
                <Image src={business.logo_url} alt={business.business_name}
                  width={96} height={96} className="object-cover w-full h-full" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                  {business?.business_name.slice(0, 1)}
                </div>
              )}
            </div>

            <div className="flex-1 pt-2 sm:pt-0 sm:pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h1 className="text-2xl font-bold text-gray-800" style={{ fontFamily: "var(--font-syne)" }}>
                  {business?.business_name}
                </h1>
                {business?.category && (
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
                    {categoryEmoji} {business.category}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {business?.location && (
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5" />{business.location}
                  </span>
                )}
                {business?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5" />{business.phone}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Package className="w-3.5 h-3.5" />
                  {business?.products.length} product{business?.products.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            <div className="flex gap-2 sm:pb-2">
              <button onClick={handleShare}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border border-gray-200 bg-white hover:bg-gray-50 transition-all">
                {shared ? <Check className="w-4 h-4 text-green-500" /> : <Share2 className="w-4 h-4 text-gray-500" />}
                Share
              </button>
              {user?.username !== username && (
                <button onClick={handleMessage} disabled={messaging}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-60"
                  style={{ background: "var(--brand)" }}>
                  {messaging
                    ? <><span className="spinner" /> Opening...</>
                    : <><MessageCircle className="w-4 h-4" /> Message</>}
                </button>
              )}
            </div>
          </div>

          {business?.description && (
            <p className="mt-4 text-gray-600 text-sm leading-relaxed max-w-2xl">
              {business.description}
            </p>
          )}
        </div>

        {/* Products */}
        <div className="pb-16">
          <h2 className="font-bold text-gray-800 text-lg mb-4" style={{ fontFamily: "var(--font-syne)" }}>
            Products
          </h2>
          {business?.products.length === 0 ? (
            <EmptyState icon={Package} title="No products yet"
              description="This store hasn't listed any products yet." />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {business?.products.map((product, i) => (
                <div key={product.id} className="animate-slide-up"
                  style={{ animationDelay: `${i * 0.05}s`, opacity: 0 }}>
                  <ProductCard product={{ ...product, business: { ...business, owner: { username } } }} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}