"use client";

import Image from "next/image";
import { getRelatedProducts } from "@/lib/recommendations";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface ProductRecommendationsProps {
  product: Product;
  onSelect: (product: Product) => void;
}

export function ProductRecommendations({
  product,
  onSelect,
}: ProductRecommendationsProps) {
  const related = getRelatedProducts(product);
  if (related.length === 0) return null;

  return (
    <div className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-800">
      <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
        You May Also Like
      </h3>
      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {related.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => onSelect(p)}
            className="group text-left"
          >
            <div className="relative aspect-square overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <Image
                src={p.image}
                alt={p.name}
                fill
                sizes="120px"
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
  );
}
