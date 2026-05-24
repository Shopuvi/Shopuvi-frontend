"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, MessageCircle, Store, MapPin,
  Package, Share2, Check, ShoppingBag
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ProductCardSkeleton } from "@/components/ui/Skeletons";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { productAPI, messageAPI } from "@/lib/api";
import { formatPrice, formatDate, CATEGORIES } from "@/lib/utils";

export default function ProductDetailPage() {
  const [product, setProduct] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [messaging, setMessaging] = useState(false);
  const [shared, setShared] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const productId = params?.id as string;

  useEffect(() => {
    productAPI.getById(productId)
      .then((res) => setProduct(res.data))
      .catch(() => router.replace("/"))
      .finally(() => setIsLoading(false));
  }, [productId, router]);

  const handleMessage = async () => {
    if (!isAuthenticated) {
      router.push(`/auth/login`);
      return;
    }
    if (user?.username === product?.business?.owner?.username) {
      toast("This is your own product.", "info");
      return;
    }
    setMessaging(true);
    try {
      // product.business.owner_id is the vendor's user ID
      const vendorId = product.business?.owner_id || "";
      const res = await messageAPI.startConversation(vendorId);
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
      await navigator.share({ title: product?.name, url });
    } else {
      navigator.clipboard.writeText(url);
      setShared(true);
      toast("Product link copied!", "success");
      setTimeout(() => setShared(false), 2000);
    }
  };

  const categoryEmoji = CATEGORIES.find(
    (c) => c.value === product?.business?.category
  )?.icon || "🏪";

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="skeleton aspect-square rounded-3xl" />
            <div className="space-y-4">
              <div className="skeleton h-8 w-3/4 rounded" />
              <div className="skeleton h-6 w-1/3 rounded" />
              <div className="skeleton h-4 w-full rounded" />
              <div className="skeleton h-4 w-2/3 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Back button */}
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">

          {/* Product image */}
          <div className="relative aspect-square bg-white rounded-3xl overflow-hidden shadow-card">
            {product.image_url ? (
              <Image
                src={product.image_url}
                alt={product.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-24 h-24 text-gray-200" />
              </div>
            )}

            {/* Availability overlay */}
            {!product.is_available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-3xl">
                <span className="bg-white text-gray-700 font-bold px-6 py-3 rounded-2xl text-lg">
                  Sold Out
                </span>
              </div>
            )}
          </div>

          {/* Product info */}
          <div className="flex flex-col">
            {/* Category badge */}
            {product.business?.category && (
              <span className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium mb-4 self-start"
                style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
                {categoryEmoji} {product.business.category}
              </span>
            )}

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 leading-tight"
              style={{ fontFamily: "var(--font-syne)" }}>
              {product.name}
            </h1>

            <p className="text-3xl font-bold mb-4" style={{ color: "var(--brand)" }}>
              {formatPrice(product.price)}
            </p>

            {product.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-6">
                {product.description}
              </p>
            )}

            <p className="text-xs text-gray-300 mb-6">
              Listed {formatDate(product.created_at)}
            </p>

            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleMessage}
                disabled={messaging || !product.is_available}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-sm text-white transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                style={{ background: "var(--brand)" }}>
                {messaging ? (
                  <><span className="spinner" /> Opening chat...</>
                ) : (
                  <><MessageCircle className="w-4 h-4" /> Message Vendor</>
                )}
              </button>
              <button
                onClick={handleShare}
                className="p-3.5 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 transition-all">
                {shared
                  ? <Check className="w-5 h-5 text-green-500" />
                  : <Share2 className="w-5 h-5 text-gray-500" />}
              </button>
            </div>

            {!product.is_available && (
              <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 text-sm text-amber-700 mb-6">
                This product is currently unavailable. Message the vendor to check if it will be restocked.
              </div>
            )}

            {/* Vendor card */}
            <Link href={`/@${product.business?.owner?.username}`}
              className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-green-200 transition-all group shadow-card">
              <div className="w-12 h-12 rounded-xl overflow-hidden shrink-0"
                style={{ background: "var(--brand)" }}>
                {product.business?.logo_url ? (
                  <Image
                    src={product.business.logo_url}
                    alt={product.business.business_name}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white font-bold">
                    {product.business?.business_name?.slice(0, 1)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm group-hover:text-green-600 transition-colors">
                  {product.business?.business_name}
                </p>
                {product.business?.location && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    {product.business.location}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-1 text-xs font-medium"
                style={{ color: "var(--brand)" }}>
                <Store className="w-3.5 h-3.5" />
                View Store
              </div>
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
