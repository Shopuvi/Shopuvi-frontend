"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Store, Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/Toast";
import { authAPI } from "@/lib/api";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    if (isAuthenticated) router.replace("/");
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast("Please enter your email and password.", "error");
      return;
    }

    setIsLoading(true);
    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user);
      toast(`Welcome back, ${res.data.user.username}!`, "success");

      if (res.data.user.role === "VENDOR") {
        router.replace("/dashboard");
      } else {
        router.replace("/");
      }
    } catch (err: any) {
      const message = err.response?.data?.message || "Invalid email or password.";
      toast(message, "error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "var(--bg-secondary)" }}>

      {/* Left panel */}
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
          <h2 className="text-4xl font-bold text-white mb-4"
            style={{ fontFamily: "var(--font-syne)" }}>
            Welcome
            <br />back.
          </h2>
          <p className="text-green-100 text-lg">
            Your storefront is waiting. Pick up right where you left off.
          </p>
        </div>

        <p className="text-green-200 text-sm">
          New to Shopuvi?{" "}
          <Link href="/auth/register" className="text-white font-semibold underline">
            Create an account
          </Link>
        </p>
      </div>

      {/* Right panel */}
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
            Sign in to Shopuvi
          </h1>
          <p className="text-gray-400 text-sm mb-8">
            Don&apos;t have an account?{" "}
            <Link href="/auth/register" className="font-semibold" style={{ color: "var(--brand)" }}>
              Create one free
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoFocus
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-gray-700">Password</label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 transition-all pr-12"
                  autoComplete="current-password"
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
                <><span className="spinner" /> Signing in...</>
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <div className="mt-8 p-4 rounded-xl border border-dashed border-gray-200 text-center">
            <p className="text-xs text-gray-400 mb-2">Are you a vendor?</p>
            <Link href="/auth/register?role=VENDOR"
              className="text-sm font-semibold" style={{ color: "var(--brand)" }}>
              Create your free storefront →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
