export interface Coupon {
  code: string;
  label: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
}

export const COUPONS: Coupon[] = [
  { code: "ATELIER10", label: "10% off entire order", type: "percent", value: 10 },
  { code: "WELCOME25", label: "$25 off orders $150+", type: "fixed", value: 25 },
  { code: "FREESHIP", label: "Free shipping", type: "shipping", value: 0 },
];

export function findCoupon(code: string): Coupon | undefined {
  return COUPONS.find((c) => c.code === code.trim().toUpperCase());
}

export function applyCouponDiscount(
  subtotal: number,
  shipping: number,
  coupon: Coupon | null,
): { discount: number; shipping: number } {
  if (!coupon) return { discount: 0, shipping };

  switch (coupon.type) {
    case "percent":
      return { discount: subtotal * (coupon.value / 100), shipping };
    case "fixed":
      if (subtotal < 150) return { discount: 0, shipping };
      return { discount: Math.min(coupon.value, subtotal), shipping };
    case "shipping":
      return { discount: 0, shipping: 0 };
    default:
      return { discount: 0, shipping };
  }
}
