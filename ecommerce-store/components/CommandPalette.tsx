"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { PRODUCTS, CATEGORIES } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  onSelectCategory: (category: string) => void;
}

export function CommandPalette({
  open,
  onClose,
  onSelectProduct,
  onSelectCategory,
}: CommandPaletteProps) {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.includes(q) ||
        p.description.toLowerCase().includes(q),
    ).slice(0, 8);
  }, [query]);

  const categoryHits = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return CATEGORIES.filter(
      (c) => c.id !== "all" && c.label.toLowerCase().includes(q),
    );
  }, [query]);

  const totalItems = categoryHits.length + results.length;

  useEffect(() => {
    if (!open) {
      setQuery("");
      setActiveIndex(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, totalItems - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        e.preventDefault();
        if (activeIndex < categoryHits.length) {
          onSelectCategory(categoryHits[activeIndex].id);
          onClose();
        } else {
          const product = results[activeIndex - categoryHits.length];
          if (product) {
            onSelectProduct(product);
            onClose();
          }
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    open,
    activeIndex,
    categoryHits,
    results,
    totalItems,
    onClose,
    onSelectProduct,
    onSelectCategory,
  ]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-start justify-center px-4 pt-[12vh]">
      <div
        className="absolute inset-0 bg-zinc-900/50 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-label="Command palette"
        className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl dark:border-zinc-700 dark:bg-zinc-900 animate-slide-up"
      >
        <div className="flex items-center gap-3 border-b border-zinc-100 px-4 dark:border-zinc-800">
          <svg
            className="h-5 w-5 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
            placeholder="Search products, categories…"
            className="flex-1 bg-transparent py-4 text-sm outline-none dark:text-white"
          />
          <kbd className="hidden rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] text-zinc-400 sm:inline dark:border-zinc-600">
            ESC
          </kbd>
        </div>
        <ul className="max-h-80 overflow-y-auto p-2">
          {categoryHits.map((cat, i) => (
            <li key={cat.id}>
              <button
                type="button"
                onClick={() => {
                  onSelectCategory(cat.id);
                  onClose();
                }}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm ${
                  activeIndex === i
                    ? "bg-zinc-100 dark:bg-zinc-800"
                    : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                }`}
              >
                <span className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  Category
                </span>
                {cat.label}
              </button>
            </li>
          ))}
          {results.map((product, i) => {
            const idx = categoryHits.length + i;
            return (
              <li key={product.id}>
                <button
                  type="button"
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left ${
                    activeIndex === idx
                      ? "bg-zinc-100 dark:bg-zinc-800"
                      : "hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                  }`}
                >
                  <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md bg-zinc-100">
                    <Image
                      src={product.image}
                      alt=""
                      fill
                      sizes="40px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium dark:text-white">
                      {product.name}
                    </p>
                    <p className="text-xs text-zinc-500">{product.category}</p>
                  </div>
                  <span className="text-sm font-medium dark:text-zinc-200">
                    {formatPrice(product.price)}
                  </span>
                </button>
              </li>
            );
          })}
          {totalItems === 0 && (
            <li className="px-3 py-8 text-center text-sm text-zinc-500">
              No results for &ldquo;{query}&rdquo;
            </li>
          )}
        </ul>
        <p className="border-t border-zinc-100 px-4 py-2 text-[10px] text-zinc-400 dark:border-zinc-800">
          ↑↓ navigate · ↵ select · esc close
        </p>
      </div>
    </div>
  );
}
