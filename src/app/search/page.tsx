"use client";

import { useState, useEffect, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Store, Package, ArrowRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { ProductCardSkeleton } from "@/components/ui/Skeletons";
import EmptyState from "@/components/ui/EmptyState";
import { searchAPI } from "@/lib/api";
import { CATEGORIES } from "@/lib/utils";

export default function SearchPage() {
  const [results, setResults] = useState<{ products: any[]; businesses: any[]; counts: any } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const searchParams = useSearchParams();
  const router = useRouter();

  const q = searchParams.get("q") || "";

  const runSearch = useCallback(async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults(null);
      return;
    }
    setIsLoading(true);
    try {
      const res = await searchAPI.search(searchQuery.trim());
      setResults(res.data);
    } catch {
      setResults({ products: [], businesses: [], counts: { products: 0, businesses: 0 } });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setQuery(q);
    if (q) runSearch(q);
  }, [q, runSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length < 2) return;
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const totalResults = (results?.counts.products || 0) + (results?.counts.businesses || 0);

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-secondary)" }}>
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Search bar */}
        <form onSubmit={handleSearch}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-2xl px-5 py-3.5 mb-6 shadow-card focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
          <Search className="w-5 h-5 text-gray-400 shrink-0" />
          <input
            type="text"
            placeholder="Search products, stores..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 bg-transparent text-gray-800 outline-none placeholder-gray-400"
            autoFocus
          />
          {query && (
            <button type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all hover:opacity-90"
              style={{ background: "var(--brand)" }}>
              Search
            </button>
          )}
        </form>

        {/* Category quick filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.value}
              onClick={() => router.push(`/search?q=${encodeURIComponent(cat.value)}`)}
              className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-white border border-gray-200 text-gray-600 hover:border-green-300 hover:text-green-600 transition-all">
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Results header */}
        {q && !isLoading && results && (
          <p className="text-sm text-gray-400 mb-6">
            {totalResults === 0
              ? `No results for "${q}"`
              : `${totalResults} result${totalResults !== 1 ? "s" : ""} for "${q}"`}
          </p>
        )}

        {isLoading ? (
          <div>
            <div className="skeleton h-5 w-48 rounded mb-6" />
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          </div>
        ) : !q ? (
          /* No search yet — show categories */
          <div>
            <h2 className="font-bold text-gray-800 text-lg mb-4"
              style={{ fontFamily: "var(--font-syne)" }}>
              Browse by Category
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => router.push(`/search?q=${encodeURIComponent(cat.value)}`)}
                  className="flex flex-col items-center gap-2 p-6 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-hover transition-all group">
                  <span className="text-3xl">{cat.icon}</span>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                    {cat.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : totalResults === 0 ? (
          <EmptyState
            icon={Search}
            title="No results found"
            description={`Nothing matched "${q}". Try different keywords or browse by category.`}
            action={{ label: "Browse All Products", href: "/" }}
          />
        ) : (
          <div className="space-y-10">

            {/* Businesses */}
            {results && results.businesses.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-bold text-gray-800"
                    style={{ fontFamily: "var(--font-syne)" }}>
                    Stores ({results.counts.businesses})
                  </h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {results.businesses.map((biz: any) => (
                    <Link key={biz.id} href={`/@${biz.owner?.username}`}
                      className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 hover:border-green-200 hover:shadow-hover transition-all group">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold text-lg shrink-0"
                        style={{ background: "var(--brand)" }}>
                        {biz.logo_url ? (
                          <img src={biz.logo_url} alt={biz.business_name}
                            className="w-full h-full object-cover rounded-xl" />
                        ) : (
                          biz.business_name?.slice(0, 1)
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-800 text-sm group-hover:text-green-600 transition-colors truncate">
                          {biz.business_name}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {biz.category} {biz.location && `· ${biz.location}`}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-green-400 transition-colors shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Products */}
            {results && results.products.length > 0 && (
              <div>
                <h2 className="font-bold text-gray-800 mb-4"
                  style={{ fontFamily: "var(--font-syne)" }}>
                  Products ({results.counts.products})
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {results.products.map((product: any, i: number) => (
                    <div key={product.id}
                      className="animate-slide-up"
                      style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
                      <ProductCard product={product} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
