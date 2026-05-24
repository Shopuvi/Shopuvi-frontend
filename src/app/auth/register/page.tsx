"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Store, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { authAPI } from "@/lib/api";

export default function RegisterPage() {
  const [role, setRole] = useState<"VENDOR" | "CUSTOMER">("CUSTOMER");
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const roleParam = searchParams.get("role");
    if (roleParam === "VENDOR") setRole("VENDOR");
    if (isAuthenticated) router.replace("/");
  }, [searchParams, isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.username || !form.email || !form.password) {
      toast("Please fill in all fields.", "error");
      return;
    }
    if (form.password.length < 6) {
      toast("Password must be at least 6 characters.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authAPI.register({ ...form, role });
      login(res.data.token, res.data.user);
      toast(`Welcome to Shopuvi, ${res.data.user.username}!`, "success");

      if (role === "VENDOR") {
        router.replace("/dashboard/onboarding");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Registration failed. Please try again.";
      toast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-secondary)" }}>

      {/* Left panel — desktop only */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden flex-col justify-between p-12"
        style={{ background: "linear-gradient(135deg, #0a5c37 0%, #0E7C4A 100%)" }}>
        <Link href="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <span className="text-white font-bold text-2xl" style={{ fontFamily: "var(--font-syne)" }}>
            Shopuvi
          </span>
        </Link>

        <div>
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight"
            style={{ fontFamily: "var(--font-syne)" }}>
            Your business
            <br />deserves to be
            <br />
            <span style={{ color: "#fbbf24" }}>seen.</span>
          </h2>
          <p className="text-green-100 text-lg leading-relaxed mb-8">
            Join thousands of Nigerian businesses already selling on Shopuvi.
          </p>

          {[
            "Free professional storefront",
            "Marketplace discovery — customers find you",
            "Structured messaging with customers",
            "Share your link anywhere",
          ].map((item) => (
            <div key={item} className="flex items-center gap-3 mb-3">
              <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                <ArrowRight className="w-3 h-3 text-white" />
              </div>
              <span className="text-green-100 text-sm">{item}</span>
            </div>
          ))}
        </div>

        <p className="text-green-200 text-sm">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-white font-semibold underline">
            Sign in
          </Link>
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: "var(--brand)" }}>
              <Store className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl" style={{ color: "var(--brand)", fontFamily: "var(--font-syne)" }}>
              Shopuvi
            </span>
          </Link>

          <h1 className="text-2xl font-bold text-gray-800 mb-1"
            style={{ fontFamily: "var(--font-syne)" }}>
            Create your account
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Already have one?{" "}
            <Link href="/auth/login" className="font-semibold" style={{ color: "var(--brand)" }}>
              Sign in
            </Link>
          </p>

          {/* Role selector */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-gray-100 rounded-xl">
            {(["CUSTOMER", "VENDOR"] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRole(r)}
                className="flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all"
                style={{
                  background: role === r ? "white" : "transparent",
                  color: role === r ? "var(--brand)" : "var(--text-muted)",
                  boxShadow: role === r ? "var(--shadow)" : "none",
                }}>
                {r === "VENDOR" ? <Store className="w-4 h-4" /> : <User className="w-4 h-4" />}
                {r === "VENDOR" ? "Vendor" : "Customer"}
              </button>
            ))}
          </div>

          {role === "VENDOR" && (
            <div className="p-3 rounded-xl mb-6 text-sm"
              style={{ background: "var(--brand-light)", color: "var(--brand)" }}>
              <strong>Vendor account</strong> — You will get a free storefront at{" "}
              <span className="font-mono">shopuvi.com/@yourname</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                placeholder="yourname"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value.toLowerCase().replace(/\s/g, "") })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                autoComplete="username"
              />
              {form.username && (
                <p className="text-xs text-gray-400 mt-1">
                  Your storefront: <span className="font-medium" style={{ color: "var(--brand)" }}>
                    shopuvi.com/@{form.username}
                  </span>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all"
                autoComplete="email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Min. 6 characters"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all pr-12"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 rounded-xl font-semibold text-white text-sm transition-all hover:opacity-90 active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2 mt-2"
              style={{ background: "var(--brand)" }}>
              {isLoading ? (
                <><span className="spinner" /> Creating account...</>
              ) : (
                <>
                  {role === "VENDOR" ? "Create My Store" : "Create Account"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <p className="text-xs text-gray-400 text-center mt-6 leading-relaxed">
            By creating an account you agree to our{" "}
            <Link href="/terms" className="underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
