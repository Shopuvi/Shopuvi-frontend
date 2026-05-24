"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Store } from "lucide-react";
import { formatPrice, truncate } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  description?: string;
  price: string | number;
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

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden card-hover block">

      {/* Image */}
      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Store className="w-12 h-12 text-gray-200" />
          </div>
        )}

        {/* Availability badge */}
        {!product.is_available && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 text-xs font-semibold px-3 py-1 rounded-full">
              Sold Out
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="font-semibold text-gray-900 text-sm leading-tight mb-1">
          {truncate(product.name, 40)}
        </p>

        {product.description && (
          <p className="text-xs text-gray-400 mb-2 leading-relaxed">
            {truncate(product.description, 55)}
          </p>
        )}

        <p className="font-bold text-base mb-2" style={{ color: "var(--brand)" }}>
          {formatPrice(product.price)}
        </p>

        {/* Vendor info */}
        <div className="flex items-center gap-1.5 pt-2 border-t border-gray-50">
          {product.business.logo_url ? (
            <Image
              src={product.business.logo_url}
              alt={product.business.business_name}
              width={16}
              height={16}
              className="rounded-full object-cover"
            />
          ) : (
            <div className="w-4 h-4 rounded-full flex items-center justify-center text-white text-xs"
              style={{ background: "var(--brand)", fontSize: "8px" }}>
              {product.business.business_name.slice(0, 1).toUpperCase()}
            </div>
          )}
          <span className="text-xs text-gray-500 truncate">
            {truncate(product.business.business_name, 20)}
          </span>
          {product.business.location && (
            <>
              <span className="text-gray-200">·</span>
              <MapPin className="w-3 h-3 text-gray-300 shrink-0" />
              <span className="text-xs text-gray-400 truncate">
                {truncate(product.business.location, 15)}
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
