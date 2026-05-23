"use client";

import Image from "next/image";
import { getTrendingProducts } from "@/lib/recommendations";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface TrendingStripProps {
  onSelect: (product: Product) => void;
}

export function TrendingStrip({ onSelect }: TrendingStripProps) {
  const trending = getTrendingProducts(4);

  return (
    <section className="border-b border-zinc-200 bg-zinc-50 py-10 dark:border-zinc-800 dark:bg-zinc-900/50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
          Trending Now
        </h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {trending.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className="group flex items-center gap-3 rounded-xl border border-zinc-200 bg-white p-3 text-left transition-shadow hover:shadow-md dark:border-zinc-700 dark:bg-zinc-900"
            >
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-medium text-zinc-900 line-clamp-1 dark:text-white group-hover:underline">
                  {p.name}
                </p>
                <p className="text-xs text-zinc-500">{formatPrice(p.price)}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
