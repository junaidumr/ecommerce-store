"use client";

import { getProductReviews } from "@/lib/reviews";
import { StarRating } from "@/components/StarRating";

interface ReviewsSectionProps {
  productId: string;
  rating: number;
  reviewCount: number;
}

export function ReviewsSection({
  productId,
  rating,
  reviewCount,
}: ReviewsSectionProps) {
  const reviews = getProductReviews(productId);

  return (
    <div className="mt-8 border-t border-zinc-100 pt-8 dark:border-zinc-800">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-widest text-zinc-500">
            Customer Reviews
          </h3>
          <div className="mt-2 flex items-center gap-3">
            <span className="font-display text-3xl text-zinc-900 dark:text-white">
              {rating.toFixed(1)}
            </span>
            <StarRating rating={rating} reviewCount={reviewCount} size="md" />
          </div>
        </div>
      </div>
      <ul className="mt-6 space-y-4">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="rounded-xl border border-zinc-100 bg-zinc-50/50 p-4 dark:border-zinc-800 dark:bg-zinc-800/30"
          >
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-zinc-900 dark:text-white">
                  {review.author}
                </span>
                {review.verified && (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300">
                    Verified
                  </span>
                )}
              </div>
              <time className="text-xs text-zinc-400">{review.date}</time>
            </div>
            <StarRating rating={review.rating} size="sm" />
            <p className="mt-2 text-sm font-medium text-zinc-800 dark:text-zinc-200">
              {review.title}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {review.body}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
