"use client";

import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface RecentlyViewedProps {
  onSelect: (product: Product) => void;
}

export function RecentlyViewed({ onSelect }: RecentlyViewedProps) {
  const { recentIds } = useApp();
  const products = recentIds
    .map(getProductById)
    .filter((p): p is Product => !!p);

  if (products.length < 2) return null;

  return (
    <section className="border-t border-zinc-200 bg-white py-12 dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-display text-xl text-zinc-900 dark:text-white">
          Recently Viewed
        </h2>
        <div className="mt-6 flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
          {products.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onSelect(p)}
              className="group w-36 shrink-0 text-left"
            >
              <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800">
                <Image
                  src={p.image}
                  alt={p.name}
                  fill
                  sizes="144px"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <p className="mt-2 text-xs font-medium text-zinc-900 line-clamp-1 dark:text-white">
                {p.name}
              </p>
              <p className="text-xs text-zinc-500">{formatPrice(p.price)}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
