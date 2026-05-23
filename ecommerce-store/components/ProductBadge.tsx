import type { ProductBadge as BadgeType } from "@/lib/types";

const LABELS: Record<BadgeType, string> = {
  new: "New",
  bestseller: "Best Seller",
  sale: "Sale",
};

const STYLES: Record<BadgeType, string> = {
  new: "bg-zinc-900 text-white",
  bestseller: "bg-amber-500 text-white",
  sale: "bg-red-600 text-white",
};

export function ProductBadgeLabel({ badge }: { badge: BadgeType }) {
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${STYLES[badge]}`}
    >
      {LABELS[badge]}
    </span>
  );
}
