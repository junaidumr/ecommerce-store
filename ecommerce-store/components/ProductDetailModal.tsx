"use client";

import { useEffect, useState } from "react";
import type { CartItemOptions, Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { StarRating } from "@/components/StarRating";
import { ProductBadgeLabel } from "@/components/ProductBadge";
import { ProductGallery } from "@/components/ProductGallery";
import { ReviewsSection } from "@/components/ReviewsSection";
import { ProductRecommendations } from "@/components/ProductRecommendations";
import { useApp } from "@/context/AppContext";

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product, options?: CartItemOptions) => void;
  onSelectRelated: (product: Product) => void;
}

export function ProductDetailModal({
  product,
  onClose,
  onAddToCart,
  onSelectRelated,
}: ProductDetailModalProps) {
  const { toggleWishlist, isWishlisted, trackView } = useApp();
  const [size, setSize] = useState<string>();
  const [color, setColor] = useState<string>();

  useEffect(() => {
    if (!product) return;
    document.body.style.overflow = "hidden";
    trackView(product.id);
    setSize(product.sizes?.[2]);
    setColor(product.colors?.[0]?.name);
    return () => {
      document.body.style.overflow = "";
    };
  }, [product, trackView]);

  if (!product) return null;

  const p = product;
  const onSale = p.compareAtPrice && p.compareAtPrice > p.price;
  const lowStock = p.stock <= 5;
  const wishlisted = isWishlisted(p.id);
  const needsSize = p.sizes && !size;
  const needsColor = p.colors && !color;

  function handleAdd() {
    if (needsSize || needsColor) return;
    onAddToCart(p, { size, color });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="product-detail-title"
        className="relative z-10 flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-t-2xl bg-[#fafaf9] shadow-2xl animate-slide-up dark:bg-zinc-950 sm:max-h-[90vh] sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-4 py-3 dark:border-zinc-800 sm:px-6">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
            Product Details
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => toggleWishlist(product.id)}
              className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors ${
                wishlisted
                  ? "border-red-200 bg-red-50 text-red-500"
                  : "border-zinc-200 text-zinc-500 hover:border-zinc-400 dark:border-zinc-700"
              }`}
              aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlisted ? "♥" : "♡"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid gap-6 p-4 sm:grid-cols-2 sm:gap-8 sm:p-8">
            <ProductGallery images={p.images} alt={p.name} />

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  {product.category}
                </span>
                {product.badge && <ProductBadgeLabel badge={product.badge} />}
                {lowStock && (
                  <span className="text-xs font-semibold text-amber-600">
                    Only {product.stock} left
                  </span>
                )}
              </div>

              <h2
                id="product-detail-title"
                className="mt-2 font-display text-2xl font-medium text-zinc-900 dark:text-white sm:text-3xl"
              >
                {product.name}
              </h2>

              <div className="mt-3">
                <StarRating
                  rating={product.rating}
                  reviewCount={product.reviewCount}
                  size="md"
                />
              </div>

              <div className="mt-5 flex items-baseline gap-3">
                <span className="text-2xl font-semibold text-zinc-900 dark:text-white">
                  {formatPrice(product.price)}
                </span>
                {onSale && (
                  <span className="text-lg text-zinc-400 line-through">
                    {formatPrice(product.compareAtPrice!)}
                  </span>
                )}
              </div>

              <p className="mt-6 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
                {product.description}
              </p>

              {product.sizes && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Size
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setSize(s)}
                        className={`min-w-[2.5rem] rounded-lg border px-3 py-2 text-sm font-medium transition-colors ${
                          size === s
                            ? "border-zinc-900 bg-zinc-900 text-white dark:border-white dark:bg-white dark:text-zinc-900"
                            : "border-zinc-200 hover:border-zinc-400 dark:border-zinc-700"
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {product.colors && (
                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Color — {color}
                  </p>
                  <div className="mt-2 flex gap-2">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => setColor(c.name)}
                        title={c.name}
                        className={`h-9 w-9 rounded-full ring-2 ring-offset-2 transition-all dark:ring-offset-zinc-950 ${
                          color === c.name ? "ring-zinc-900 dark:ring-white" : "ring-transparent"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      />
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAdd}
                disabled={!!needsSize || !!needsColor || product.stock === 0}
                className="btn-primary mt-8 w-full disabled:opacity-50"
              >
                {product.stock === 0
                  ? "Out of Stock"
                  : `Add to Bag — ${formatPrice(product.price)}`}
              </button>
            </div>
          </div>

          <div className="border-t border-zinc-100 px-4 dark:border-zinc-800 sm:px-8">
            <ReviewsSection
              productId={product.id}
              rating={product.rating}
              reviewCount={product.reviewCount}
            />
            <ProductRecommendations
              product={product}
              onSelect={onSelectRelated}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
