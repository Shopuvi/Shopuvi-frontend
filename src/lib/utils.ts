import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number | string): string {
  const num = typeof price === "string" ? parseFloat(price) : price;
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}

export function formatTime(date: string): string {
  return new Intl.DateTimeFormat("en-NG", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}

export function getStorefrontUrl(username: string): string {
  return `${process.env.NEXT_PUBLIC_APP_URL}/@${username}`;
}

export const CATEGORIES = [
  { label: "Electronics", icon: "📱", value: "Electronics" },
  { label: "Fashion", icon: "👗", value: "Fashion" },
  { label: "Food & Drinks", icon: "🍔", value: "Food" },
  { label: "Beauty", icon: "💄", value: "Beauty" },
  { label: "Home & Living", icon: "🏠", value: "Home" },
  { label: "Services", icon: "🔧", value: "Services" },
  { label: "Health", icon: "💊", value: "Health" },
  { label: "Sports", icon: "⚽", value: "Sports" },
  { label: "Books", icon: "📚", value: "Books" },
  { label: "Art & Crafts", icon: "🎨", value: "Art" },
];
