"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { DEFAULT_FILTERS, PRICE_MAX } from "@/lib/filter-catalog";
import type { CatalogFilters, SortOption } from "@/lib/types";

function parseFilters(params: URLSearchParams): CatalogFilters {
  return {
    search: params.get("q") ?? DEFAULT_FILTERS.search,
    category: params.get("cat") ?? DEFAULT_FILTERS.category,
    sort: (params.get("sort") as SortOption) ?? DEFAULT_FILTERS.sort,
    minPrice: Number(params.get("min") ?? DEFAULT_FILTERS.minPrice),
    maxPrice: Number(params.get("max") ?? DEFAULT_FILTERS.maxPrice),
    minRating: Number(params.get("rating") ?? DEFAULT_FILTERS.minRating),
    inStockOnly: params.get("stock") === "1",
  };
}

function filtersToParams(filters: CatalogFilters): URLSearchParams {
  const p = new URLSearchParams();
  if (filters.search) p.set("q", filters.search);
  if (filters.category !== "all") p.set("cat", filters.category);
  if (filters.sort !== "featured") p.set("sort", filters.sort);
  if (filters.minPrice > 0) p.set("min", String(filters.minPrice));
  if (filters.maxPrice < PRICE_MAX) p.set("max", String(filters.maxPrice));
  if (filters.minRating > 0) p.set("rating", String(filters.minRating));
  if (filters.inStockOnly) p.set("stock", "1");
  return p;
}

export function useCatalogUrl() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<CatalogFilters>(DEFAULT_FILTERS);

  useEffect(() => {
    setFilters(parseFilters(searchParams));
  }, [searchParams]);

  const updateFilters = useCallback((patch: Partial<CatalogFilters>) => {
    setFilters((prev) => {
      const next = { ...prev, ...patch };
      const params = filtersToParams(next);
      const qs = params.toString();
      const url = qs ? `${window.location.pathname}?${qs}` : window.location.pathname;
      window.history.replaceState(null, "", url);
      return next;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    window.history.replaceState(null, "", window.location.pathname);
  }, []);

  return { filters, updateFilters, resetFilters };
}
