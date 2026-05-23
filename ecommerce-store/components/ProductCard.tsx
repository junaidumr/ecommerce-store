"use client";

import Image from "next/image";
import type { Product, ViewMode } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { StarRating } from "@/components/StarRating";
import { ProductBadgeLabel } from "@/components/ProductBadge";
import { useApp } from "@/context/AppContext";

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onView: (product: Product) => void;
  viewMode?: ViewMode;
  index?: number;
}

export function ProductCard({
  product,
  onAddToCart,
  onView,
  viewMode = "grid",
  index = 0,
}: ProductCardProps) {
  const { toggleWishlist, isWishlisted } = useApp();
  const onSale = product.compareAtPrice && product.compareAtPrice > product.price;
  const discount = onSale
    ? Math.round((1 - product.price / product.compareAtPrice!) * 100)
    : 0;
  const lowStock = product.stock <= 5;
  const wishlisted = isWishlisted(product.id);

  if (viewMode === "list") {
    return (
      <article
        className="product-card-animate flex gap-4 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
        style={{ animationDelay: `${Math.min(index, 8) * 40}ms` }}
      >
        <button
          type="button"
          onClick={() => onView(product)}
          className="relative h-28 w-24 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800 sm:h-32 sm:w-28"
        >
          <Image src={product.image} alt={product.name} fill sizes="112px" className="object-cover" />
        </button>
        <div className="flex min-w-0 flex-1 flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">
              {product.category}
            </p>
            <button
              type="button"
              onClick={() => onView(product)}
              className="mt-0.5 text-left font-medium text-zinc-900 dark:text-white"
            >
              {product.name}
            </button>
            <div className="mt-1">
              <StarRating rating={product.rating} reviewCount={product.reviewCount} />
            </div>
            {lowStock && (
              <p className="mt-1 text-xs font-medium text-amber-600">
                Only {product.stock} left in stock
              </p>
            )}
          </div>
          <div className="mt-3 flex items-center gap-3 sm:mt-0">
            <div>
              <span className="text-lg font-semibold">{formatPrice(product.price)}</span>
              {onSale && (
                <span className="ml-2 text-sm text-zinc-400 line-through">
                  {formatPrice(product.compareAtPrice!)}
                </span>
              )}
            </div>
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`rounded-full p-2 ${wishlisted ? "text-red-500" : "text-zinc-400"}`}
              aria-label="Wishlist"
            >
              {wishlisted ? "♥" : "♡"}
            </button>
            <button type="button" onClick={() => onAddToCart(product)} className="btn-primary !py-2 !px-4 text-xs">
              Add
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article
      className="product-card-animate group flex flex-col"
      style={{ animationDelay: `${Math.min(index, 8) * 50}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-zinc-100 ring-1 ring-zinc-900/5 dark:bg-zinc-800 dark:ring-zinc-700">
        <button
          type="button"
          onClick={() => onView(product)}
          className="absolute inset-0 z-10"
          aria-label={`View ${product.name}`}
        />
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product.id);
          }}
          className={`absolute right-3 top-3 z-20 flex h-9 w-9 items-center justify-center rounded-full backdrop-blur-sm transition-colors ${
            wishlisted
              ? "bg-red-500/90 text-white"
              : "bg-white/80 text-zinc-600 hover:bg-white"
          }`}
          aria-label="Toggle wishlist"
        >
          {wishlisted ? "♥" : "♡"}
        </button>

        <div className="absolute left-3 top-3 z-20 flex flex-col gap-1.5">
          {product.badge && <ProductBadgeLabel badge={product.badge} />}
          {onSale && !product.badge && (
            <span className="inline-flex rounded bg-red-600 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
              −{discount}%
            </span>
          )}
        </div>

        {lowStock && (
          <span className="absolute bottom-3 left-3 z-20 rounded bg-amber-500/90 px-2 py-0.5 text-[10px] font-bold text-white">
            {product.stock} left
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 z-20 translate-y-full p-3 transition-transform duration-300 group-hover:translate-y-0">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onView(product);
              }}
              className="flex-1 rounded-lg bg-white/95 py-2.5 text-xs font-semibold text-zinc-900 backdrop-blur-sm"
            >
              Quick View
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onAddToCart(product);
              }}
              className="flex-1 rounded-lg bg-zinc-900 py-2.5 text-xs font-semibold text-white"
            >
              Add to Bag
            </button>
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-500">
          {product.category}
        </p>
        <button
          type="button"
          onClick={() => onView(product)}
          className="mt-1 text-left font-medium text-zinc-900 line-clamp-1 dark:text-white"
        >
          {product.name}
        </button>
        <div className="mt-2">
          <StarRating rating={product.rating} reviewCount={product.reviewCount} />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-base font-semibold text-zinc-900 dark:text-white">
            {formatPrice(product.price)}
          </span>
          {onSale && (
            <span className="text-sm text-zinc-400 line-through">
              {formatPrice(product.compareAtPrice!)}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
