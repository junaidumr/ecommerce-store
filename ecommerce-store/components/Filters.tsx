"use client";

import { useState } from "react";
import { CATEGORIES } from "@/lib/products";
import { SORT_OPTIONS } from "@/lib/sort";
import { activeFilterCount, PRICE_MAX } from "@/lib/filter-catalog";
import type { CatalogFilters, SortOption, ViewMode } from "@/lib/types";

interface FiltersProps {
  filters: CatalogFilters;
  onChange: (patch: Partial<CatalogFilters>) => void;
  onReset: () => void;
  resultCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

export function Filters({
  filters,
  onChange,
  onReset,
  resultCount,
  viewMode,
  onViewModeChange,
}: FiltersProps) {
  const [advancedOpen, setAdvancedOpen] = useState(false);
  const activeCount = activeFilterCount(filters);

  return (
    <div className="sticky top-[4.25rem] z-30 -mx-4 border-b border-zinc-200 bg-[#fafaf9]/95 px-4 py-5 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/95 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative flex-1 lg:max-w-sm">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            placeholder="Search collection..."
            value={filters.search}
            onChange={(e) => onChange({ search: e.target.value })}
            className="input-field pl-10 dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
            aria-label="Search products"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onChange({ category: cat.id })}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-all ${
                filters.category === cat.id
                  ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                  : "bg-white text-zinc-600 ring-1 ring-zinc-200 hover:ring-zinc-400 dark:bg-zinc-900 dark:text-zinc-300 dark:ring-zinc-700"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <select
            value={filters.sort}
            onChange={(e) => onChange({ sort: e.target.value as SortOption })}
            className="input-field w-auto min-w-[9rem] cursor-pointer py-2 text-xs dark:bg-zinc-900 dark:border-zinc-700 dark:text-white"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.id} value={opt.id}>
                {opt.label}
              </option>
            ))}
          </select>

          <div className="flex rounded-lg border border-zinc-200 p-0.5 dark:border-zinc-700">
            {(["grid", "list"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => onViewModeChange(mode)}
                className={`rounded-md px-2.5 py-1.5 ${
                  viewMode === mode
                    ? "bg-zinc-900 text-white dark:bg-white dark:text-zinc-900"
                    : "text-zinc-500"
                }`}
                aria-label={`${mode} view`}
              >
                {mode === "grid" ? "▦" : "☰"}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setAdvancedOpen((o) => !o)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ring-1 transition-all ${
              advancedOpen || activeCount > 0
                ? "bg-zinc-900 text-white ring-zinc-900 dark:bg-white dark:text-zinc-900"
                : "bg-white ring-zinc-200 text-zinc-600 dark:bg-zinc-900 dark:ring-zinc-700"
            }`}
          >
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
        </div>
      </div>

      {advancedOpen && (
        <div className="mt-4 grid gap-4 rounded-xl border border-zinc-200 bg-white p-4 sm:grid-cols-3 dark:border-zinc-800 dark:bg-zinc-900">
          <div>
            <label className="text-xs font-medium text-zinc-500">
              Price: {filters.minPrice} – {filters.maxPrice}
            </label>
            <div className="mt-2 flex gap-2">
              <input
                type="range"
                min={0}
                max={PRICE_MAX}
                value={filters.minPrice}
                onChange={(e) =>
                  onChange({ minPrice: Math.min(Number(e.target.value), filters.maxPrice - 10) })
                }
                className="w-full accent-zinc-900"
              />
              <input
                type="range"
                min={0}
                max={PRICE_MAX}
                value={filters.maxPrice}
                onChange={(e) =>
                  onChange({ maxPrice: Math.max(Number(e.target.value), filters.minPrice + 10) })
                }
                className="w-full accent-zinc-900"
              />
            </div>
          </div>
          <div>
            <label className="text-xs font-medium text-zinc-500">
              Min rating: {filters.minRating > 0 ? `${filters.minRating}+` : "Any"}
            </label>
            <input
              type="range"
              min={0}
              max={5}
              step={0.5}
              value={filters.minRating}
              onChange={(e) => onChange({ minRating: Number(e.target.value) })}
              className="mt-2 w-full accent-zinc-900"
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <label className="flex items-center gap-2 text-sm text-zinc-700 dark:text-zinc-300">
              <input
                type="checkbox"
                checked={filters.inStockOnly}
                onChange={(e) => onChange({ inStockOnly: e.target.checked })}
                className="rounded border-zinc-300"
              />
              In stock only
            </label>
            {activeCount > 0 && (
              <button type="button" onClick={onReset} className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white">
                Reset all filters
              </button>
            )}
          </div>
        </div>
      )}

      <p className="mt-4 text-xs font-medium uppercase tracking-widest text-zinc-500">
        {resultCount} {resultCount === 1 ? "item" : "items"}
      </p>
    </div>
  );
}
