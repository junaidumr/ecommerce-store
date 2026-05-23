import type { Product, SortOption } from "./types";

export const SORT_OPTIONS: { id: SortOption; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "rating", label: "Top Rated" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "name", label: "Name A–Z" },
];

export function sortProducts(products: Product[], sort: SortOption): Product[] {
  const list = [...products];
  switch (sort) {
    case "price-asc":
      return list.sort((a, b) => a.price - b.price);
    case "price-desc":
      return list.sort((a, b) => b.price - a.price);
    case "name":
      return list.sort((a, b) => a.name.localeCompare(b.name));
    case "rating":
      return list.sort((a, b) => b.rating - a.rating);
    case "newest":
      return list.sort((a, b) => {
        const aNew = a.badge === "new" ? 1 : 0;
        const bNew = b.badge === "new" ? 1 : 0;
        return bNew - aNew || b.id.localeCompare(a.id);
      });
    case "featured":
    default:
      return list.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.reviewCount - a.reviewCount;
      });
  }
}
