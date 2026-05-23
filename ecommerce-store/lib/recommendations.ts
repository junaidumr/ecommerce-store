import type { Product } from "./types";
import { PRODUCTS } from "./products";

export function getRelatedProducts(product: Product, limit = 4): Product[] {
  return PRODUCTS.filter(
    (p) => p.id !== product.id && p.category === product.category,
  ).slice(0, limit);
}

export function getTrendingProducts(limit = 4): Product[] {
  return [...PRODUCTS]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, limit);
}
