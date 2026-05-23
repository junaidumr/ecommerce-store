import type { CartItem, CartItemOptions, Product } from "./types";

export function buildLineId(
  productId: string,
  options?: CartItemOptions,
): string {
  const size = options?.size ?? "_";
  const color = options?.color ?? "_";
  return `${productId}::${size}::${color}`;
}

export function createCartLine(
  product: Product,
  quantity: number,
  options?: CartItemOptions,
): CartItem {
  return {
    lineId: buildLineId(product.id, options),
    product,
    quantity,
    size: options?.size,
    color: options?.color,
  };
}

export function lineOptionsLabel(item: CartItem): string | null {
  const parts: string[] = [];
  if (item.size) parts.push(`Size ${item.size}`);
  if (item.color) parts.push(item.color);
  return parts.length ? parts.join(" · ") : null;
}
