import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/components/ui/Toast";

const CDN = "https://res.cloudinary.com/dkb7rzm25/image/upload";

export const metadata: Metadata = {
  title: {
    default: "Shopuvi — Your Business, Your Storefront",
    template: "%s | Shopuvi",
  },
  description:
    "Shopuvi gives every business a professional online storefront and marketplace visibility. Set up in minutes. Start selling today.",
  keywords: ["online store", "marketplace", "small business", "storefront", "sell online", "local business"],
  icons: {
    icon: `${CDN}/file_000000001a9c71f49725af5d3c03bf0b-removebg-preview_ha3tyw.png`,
    shortcut: `${CDN}/file_000000001a9c71f49725af5d3c03bf0b-removebg-preview_ha3tyw.png`,
  },
  openGraph: {
    title: "Shopuvi — Your Business, Your Storefront",
    description: "Set up your professional online store in minutes. Get discovered by thousands of customers.",
    type: "website",
    images: [
      {
        url: `${CDN}/file_00000000cc7c71f49a7a04d4057546de_xbx8yo.jpg`,
        width: 1200,
        height: 630,
        alt: "Shopuvi — Your Business, Your Storefront",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shopuvi — Your Business, Your Storefront",
    description: "Set up your professional online store in minutes.",
    images: [`${CDN}/file_00000000cc7c71f49a7a04d4057546de_xbx8yo.jpg`],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AuthProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </AuthProvider>
      </body>
    </html>
  );
}