"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, ArrowRight, Store, Zap, Globe, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import { feedAPI } from "@/lib/api";
import { CATEGORIES } from "@/lib/utils";
import { IMAGES } from "@/lib/images";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string;
  image_url?: string;
  is_available: boolean;
  business: {
    id: string;
    business_name: string;
    location?: string;
    logo_url?: string;
    owner: { username: string };
  };
}

// Hero carousel slides
const SLIDES = [
  {
    id: 1,
    image: IMAGES.hero.slide1,
    headline: "Discover. Shop. Support local.",
    subtext: "Browse thousands of products from real businesses near you.",
    cta: { label: "Browse Marketplace", href: "/search?q=", variant: "gold" },
    align: "left",
  },
  {
    id: 2,
    image: IMAGES.hero.slide2,
    headline: "Your store. Your brand. Your customers.",
    subtext: "Set up your free professional storefront in minutes. No tech skills needed.",
    cta: { label: "Open Your Store", href: "/auth/register?role=VENDOR", variant: "gold" },
    align: "left",
  },
  {
    id: 3,
    image: IMAGES.hero.slide3,
    headline: "One marketplace. Endless possibilities.",
    subtext: "Connecting buyers and sellers in one seamless platform.",
    cta: { label: "Get Started", href: "/auth/register", variant: "white" },
    align: "left",
  },
  {
    id: 4,
    image: IMAGES.hero.slide4,
    headline: "Every business deserves to be found.",
    subtext: "Professional storefronts for every size business. Always free.",
    cta: { label: "Join Shopuvi", href: "/auth/register?role=VENDOR", variant: "gold" },
    align: "left",
  },
];

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Auto advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      goToNext();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const goToNext = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToPrev = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
      setIsTransitioning(false);
    }, 300);
  };

  const goToSlide = (index: number) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentSlide(index);
      setIsTransitioning(false);
    }, 300);
  };

  const loadFeed = useCallback(async (pageNum = 1) => {
    try {
      setIsLoading(true);
      const res = await feedAPI.getFeed(pageNum, 12);
      if (pageNum === 1) {
        setProducts(res.data.products);
      } else {
        setProducts((prev) => [...prev, ...res.data.products]);
      }
      setPagination(res.data.pagination);
    } catch {
      // silent
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadFeed(1);
  }, [loadFeed]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
  };

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadFeed(nextPage);
  };

  const slide = SLIDES[currentSlide];

  return (
    <div className="min-h-screen" style={{ background: "var(--bg)" }}>
      <Navbar />

      {/* ── Hero Carousel ──────────────────────────────────────────────────── */}
      <section className="relative h-[85vh] min-h-[500px] max-h-[750px] overflow-hidden">

        {/* Background image */}
        <div className={`absolute inset-0 transition-opacity duration-700 ${isTransitioning ? "opacity-0" : "opacity-100"}`}>
          <Image
            src={slide.image}
            alt={slide.headline}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(6,95,53,0.92) 0%, rgba(6,95,53,0.75) 50%, rgba(6,95,53,0.3) 100%)" }} />
        </div>

        {/* Content */}
        <div className="relative h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
          <div className="max-w-xl">
            <div className={`transition-all duration-500 ${isTransitioning ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"}`}>

              {/* Slide indicator */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold mb-6"
                style={{ background: "rgba(255,255,255,0.15)", color: "#fff" }}>
                <Zap className="w-3 h-3" style={{ color: "var(--gold)" }} />
                Free to join. Free to sell.
              </div>

              {/* Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-4"
                style={{ fontFamily: "var(--font-syne)" }}>
                {slide.headline}
              </h1>

              {/* Subtext */}
              <p className="text-green-100 text-lg mb-8 leading-relaxed">
                {slide.subtext}
              </p>

              {/* Search bar */}
              <form onSubmit={handleSearch}
                className="flex items-center gap-2 bg-white rounded-2xl p-2 shadow-2xl mb-6">
                <Search className="w-5 h-5 text-gray-400 ml-2 shrink-0" />
                <input
                  type="text"
                  placeholder="Search products, stores..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 bg-transparent text-gray-800 text-sm outline-none placeholder-gray-400 py-1"
                />
                <button type="submit"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90 shrink-0"
                  style={{ background: "var(--brand)" }}>
                  Search
                </button>
              </form>

              {/* CTA button */}
              <Link href={slide.cta.href}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
                style={{
                  background: slide.cta.variant === "gold" ? "var(--gold)" : "white",
                  color: slide.cta.variant === "gold" ? "#000" : "var(--brand)",
                }}>
                <Store className="w-4 h-4" />
                {slide.cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation arrows */}
        <button onClick={goToPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/30"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
        <button onClick={goToNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center transition-all hover:bg-white/30"
          style={{ background: "rgba(255,255,255,0.15)" }}>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>

        {/* Slide dots */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2">
          {SLIDES.map((_, i) => (
            <button key={i} onClick={() => goToSlide(i)}
              className="transition-all rounded-full"
              style={{
                width: i === currentSlide ? "24px" : "8px",
                height: "8px",
                background: i === currentSlide ? "var(--gold)" : "rgba(255,255,255,0.5)",
              }} />
          ))}
        </div>
      </section>

      {/* ── Stats Bar ──────────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-3 gap-4 text-center">
            {[
              { icon: Store, label: "Vendors", value: "Growing daily" },
              { icon: Globe, label: "Storefronts", value: "Everywhere" },
              { icon: TrendingUp, label: "Setup time", value: "Under 5 mins" },
            ].map((stat) => (
              <div key={stat.label} className="flex flex-col items-center">
                <stat.icon className="w-5 h-5 mb-1" style={{ color: "var(--brand)" }} />
                <p className="font-bold text-gray-800 text-sm sm:text-base">{stat.value}</p>
                <p className="text-xs text-gray-400">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ─────────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="font-bold text-gray-800 text-lg mb-4"
          style={{ fontFamily: "var(--font-syne)" }}>
          Browse by Category
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => router.push("/search?q=")}
            className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all"
            style={{ background: "var(--brand)", color: "#fff" }}>
            All
          </button>
          {CATEGORIES.map((cat) => (
            <button key={cat.value}
              onClick={() => router.push(`/search?q=${encodeURIComponent(cat.value)}`)}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:bg-gray-100"
              style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}>
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Product Feed ───────────────────────────────────────────────────── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-bold text-gray-800 text-lg"
            style={{ fontFamily: "var(--font-syne)" }}>
            Latest Products
            {pagination && (
              <span className="ml-2 text-sm font-normal text-gray-400">
                ({pagination.total} available)
              </span>
            )}
          </h2>
        </div>

        {isLoading && products.length === 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <EmptyState
            icon={Store}
            title="No products yet"
            description="Be the first vendor to list products on Shopuvi."
            action={{ label: "Open Your Store", href: "/auth/register?role=VENDOR" }}
          />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product, i) => (
                <div key={product.id} className="animate-slide-up"
                  style={{ animationDelay: `${Math.min(i * 0.05, 0.4)}s`, opacity: 0 }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
            {pagination?.has_next && (
              <div className="flex justify-center mt-10">
                <button onClick={loadMore} disabled={isLoading}
                  className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-semibold text-sm border-2 transition-all hover:bg-green-50 disabled:opacity-50"
                  style={{ borderColor: "var(--brand)", color: "var(--brand)" }}>
                  {isLoading ? <><span className="spinner" /> Loading...</> : <>Load More <ArrowRight className="w-4 h-4" /></>}
                </button>
              </div>
            )}
          </>
        )}
      </section>

      {/* ── Vendor CTA Banner ──────────────────────────────────────────────── */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mb-16 rounded-3xl overflow-hidden relative"
        style={{ minHeight: "240px" }}>
        {/* Background image */}
        <div className="absolute inset-0">
          <Image src={IMAGES.vendorCTA} alt="Start selling on Shopuvi" fill className="object-cover" />
          <div className="absolute inset-0"
            style={{ background: "linear-gradient(to right, rgba(6,95,53,0.95) 0%, rgba(6,95,53,0.85) 50%, rgba(6,95,53,0.5) 100%)" }} />
        </div>

        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2"
              style={{ fontFamily: "var(--font-syne)" }}>
              Ready to start selling?
            </h2>
            <p className="text-green-100">
              Join businesses already on Shopuvi. Free forever.
            </p>
          </div>
          <Link href="/auth/register?role=VENDOR"
            className="shrink-0 inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 active:scale-95"
            style={{ background: "var(--gold)", color: "#000" }}>
            <Store className="w-4 h-4" />
            Create Free Store
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}