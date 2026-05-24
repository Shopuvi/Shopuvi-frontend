import Link from "next/link";
import { Store, Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center"
      style={{ background: "var(--bg-secondary)" }}>

      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-12">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "var(--brand)" }}>
          <Store className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl" style={{ color: "var(--brand)", fontFamily: "var(--font-syne)" }}>
          Shopuvi
        </span>
      </Link>

      {/* 404 */}
      <div className="mb-6">
        <p className="text-8xl font-black text-gray-100 leading-none select-none"
          style={{ fontFamily: "var(--font-syne)" }}>
          404
        </p>
      </div>

      <h1 className="text-2xl font-bold text-gray-800 mb-2"
        style={{ fontFamily: "var(--font-syne)" }}>
        Page not found
      </h1>
      <p className="text-gray-400 text-sm max-w-xs leading-relaxed mb-8">
        The page you're looking for doesn't exist or may have been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm text-white transition-all hover:opacity-90"
          style={{ background: "var(--brand)" }}>
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link href="/search"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all">
          <Search className="w-4 h-4" />
          Search Products
        </Link>
      </div>
    </div>
  );
}
