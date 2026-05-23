import type { Review } from "./types";

const REVIEW_POOL: Omit<Review, "id">[] = [
  {
    author: "Sarah M.",
    rating: 5,
    date: "2026-04-12",
    title: "Exceeded expectations",
    body: "Build quality is exceptional. Packaging felt premium and delivery was faster than quoted.",
    verified: true,
  },
  {
    author: "James K.",
    rating: 4,
    date: "2026-03-28",
    title: "Great value",
    body: "Exactly as described. Would recommend sizing up if you're between sizes.",
    verified: true,
  },
  {
    author: "Elena R.",
    rating: 5,
    date: "2026-03-15",
    title: "My new daily favorite",
    body: "I've purchased from many brands — this stands out for attention to detail.",
    verified: true,
  },
  {
    author: "Marcus T.",
    rating: 4,
    date: "2026-02-20",
    title: "Solid purchase",
    body: "Minor delay in shipping but customer support resolved it quickly.",
    verified: false,
  },
];

export function getProductReviews(productId: string): Review[] {
  const offset = parseInt(productId, 10) % REVIEW_POOL.length;
  return REVIEW_POOL.map((r, i) => ({
    ...r,
    id: `${productId}-review-${i}`,
    rating: Math.min(5, Math.max(3, r.rating + ((i + offset) % 2 === 0 ? 0 : -0.5))),
  }));
}
