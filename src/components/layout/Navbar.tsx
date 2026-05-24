"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Search, Menu, X, Store, MessageCircle, LayoutDashboard, LogOut, ExternalLink } from "lucide-react";
import { IMAGES } from "@/lib/images";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim().length < 2) return;
    router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    setSearchQuery("");
    setMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src={IMAGES.logo}
              alt="Shopuvi"
              width={36}
              height={36}
              className="rounded-lg"
            />
            <span className="hidden sm:block font-bold text-xl"
              style={{ color: "var(--brand)", fontFamily: "var(--font-syne)" }}>
              Shopuvi
            </span>
          </Link>

          {/* Search — desktop */}
          <form onSubmit={handleSearch}
            className="hidden md:flex flex-1 max-w-xl items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-100 transition-all">
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            <input type="text" placeholder="Search products, stores..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400" />
          </form>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {isAuthenticated && user ? (
              <>
                <Link href="/messages"
                  className="p-2 rounded-lg text-gray-500 hover:text-green-600 hover:bg-green-50 transition-colors">
                  <MessageCircle className="w-5 h-5" />
                </Link>

                <div className="relative">
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ background: "var(--brand)" }}>
                      {user.username.slice(0, 2).toUpperCase()}
                    </div>
                    <span className="hidden sm:block text-sm font-medium text-gray-700 max-w-24 truncate">
                      {user.username}
                    </span>
                  </button>

                  {dropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-2xl shadow-lg overflow-hidden z-50">
                      <div className="px-4 py-3 border-b border-gray-50">
                        <p className="text-xs text-gray-400 mb-0.5">Signed in as</p>
                        <p className="text-sm font-semibold text-gray-800 truncate">{user.email}</p>
                        <span className="inline-block text-xs px-2 py-0.5 rounded-full font-medium mt-1"
                          style={{
                            background: user.role === "VENDOR" ? "var(--brand-light)" : "var(--gold-light)",
                            color: user.role === "VENDOR" ? "var(--brand)" : "#92400e"
                          }}>
                          {user.role === "VENDOR" ? "Vendor" : "Customer"}
                        </span>
                      </div>

                      <div className="py-1">
                        {user.role === "VENDOR" && (
                          <>
                            <Link href="/dashboard" onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <LayoutDashboard className="w-4 h-4 text-gray-400" />
                              Dashboard
                            </Link>
                            <Link href={`/@${user.username}`} onClick={() => setDropdownOpen(false)}
                              className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                              <ExternalLink className="w-4 h-4 text-gray-400" />
                              My Storefront
                            </Link>
                          </>
                        )}
                        <Link href="/messages" onClick={() => setDropdownOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                          <MessageCircle className="w-4 h-4 text-gray-400" />
                          Messages
                        </Link>
                      </div>

                      <div className="border-t border-gray-50 py-1">
                        <button onClick={() => { setDropdownOpen(false); logout(); }}
                          className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/auth/login"
                  className="text-sm font-medium text-gray-600 hover:text-green-600 px-3 py-2 rounded-lg transition-colors hidden sm:block">
                  Sign In
                </Link>
                <Link href="/auth/register"
                  className="text-sm font-semibold text-black px-4 py-2 rounded-xl transition-all hover:opacity-90 active:scale-95"
                  style={{ background: "var(--gold)" }}>
                  Get Started
                </Link>
              </div>
            )}

            <button onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile search */}
        {menuOpen && (
          <div className="md:hidden pb-4 space-y-3 animate-fade-in">
            <form onSubmit={handleSearch}
              className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus-within:border-green-500 transition-all">
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              <input type="text" placeholder="Search products, stores..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400" />
            </form>
            {!isAuthenticated && (
              <Link href="/auth/login" onClick={() => setMenuOpen(false)}
                className="block text-center text-sm font-medium text-gray-600 py-2">
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>

      {dropdownOpen && (
        <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
      )}
    </nav>
  );
}