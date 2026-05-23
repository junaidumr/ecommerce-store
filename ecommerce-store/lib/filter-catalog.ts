import type { CatalogFilters, Product } from "./types";
import { sortProducts } from "./sort";

export const PRICE_MAX = 350;
export const DEFAULT_FILTERS: CatalogFilters = {
  search: "",
  category: "all",
  sort: "featured",
  minPrice: 0,
  maxPrice: PRICE_MAX,
  minRating: 0,
  inStockOnly: false,
};

export function filterCatalog(
  products: Product[],
  filters: CatalogFilters,
): Product[] {
  const query = filters.search.trim().toLowerCase();

  const filtered = products.filter((p) => {
    if (filters.category !== "all" && p.category !== filters.category) {
      return false;
    }
    if (p.price < filters.minPrice || p.price > filters.maxPrice) {
      return false;
    }
    if (p.rating < filters.minRating) return false;
    if (filters.inStockOnly && p.stock <= 0) return false;
    if (
      query &&
      !p.name.toLowerCase().includes(query) &&
      !p.description.toLowerCase().includes(query) &&
      !p.category.toLowerCase().includes(query)
    ) {
      return false;
    }
    return true;
  });

  return sortProducts(filtered, filters.sort);
}

export function activeFilterCount(filters: CatalogFilters): number {
  let n = 0;
  if (filters.category !== "all") n++;
  if (filters.minPrice > 0) n++;
  if (filters.maxPrice < PRICE_MAX) n++;
  if (filters.minRating > 0) n++;
  if (filters.inStockOnly) n++;
  if (filters.search.trim()) n++;
  return n;
}
