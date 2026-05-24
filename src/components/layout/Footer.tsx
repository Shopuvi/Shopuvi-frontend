import Link from "next/link";
import Image from "next/image";
import { IMAGES } from "@/lib/images";

export default function Footer() {
  return (
    <footer className="border-t border-gray-100 bg-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image src={IMAGES.logo} alt="Shopuvi" width={32} height={32} className="rounded-lg" />
              <span className="font-bold text-xl" style={{ color: "var(--brand)", fontFamily: "var(--font-syne)" }}>
                Shopuvi
              </span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Your business deserves a professional online presence. Set up your storefront in minutes. Free.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-sm">For Vendors</h4>
            <ul className="space-y-3">
              {[
                { label: "Create Store", href: "/auth/register?role=VENDOR" },
                { label: "Dashboard", href: "/dashboard" },
                { label: "Add Products", href: "/dashboard/products/new" },
                { label: "Messages", href: "/messages" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-sm">Marketplace</h4>
            <ul className="space-y-3">
              {[
                { label: "Browse Products", href: "/" },
                { label: "Search", href: "/search" },
                { label: "Electronics", href: "/search?q=electronics" },
                { label: "Fashion", href: "/search?q=fashion" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-4 text-sm">Company</h4>
            <ul className="space-y-3">
              {[
                { label: "About Us", href: "/about" },
                { label: "Privacy Policy", href: "/privacy" },
                { label: "Terms of Service", href: "/terms" },
                { label: "Contact Us", href: "/contact" },
              ].map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="text-sm text-gray-500 hover:text-green-600 transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Shopuvi. All rights reserved.
          </p>
          <p className="text-xs text-gray-400">
            Built for businesses everywhere 🌍
          </p>
        </div>
      </div>
    </footer>
  );
}