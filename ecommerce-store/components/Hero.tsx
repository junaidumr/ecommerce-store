"use client";

import Image from "next/image";
import { FEATURED_PRODUCTS } from "@/lib/products";
import { formatPrice } from "@/lib/format";

interface HeroProps {
  onShopClick: () => void;
  onProductView: (id: string) => void;
}

export function Hero({ onShopClick, onProductView }: HeroProps) {
  const spotlight = FEATURED_PRODUCTS[0];

  return (
    <section className="relative overflow-hidden border-b border-zinc-200/80 bg-[#fafaf9] dark:border-zinc-800 dark:bg-zinc-950">
      <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-zinc-200/40 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-amber-100/30 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24 lg:px-8">
        <div>
          <p className="mb-4 inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs font-medium uppercase tracking-widest text-zinc-600">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Spring Collection 2026
          </p>
          <h1 className="font-display text-4xl font-medium leading-[1.1] tracking-tight text-zinc-900 dark:text-white sm:text-5xl lg:text-[3.25rem]">
            Curated goods for
            <br />
            <span className="italic text-zinc-500">considered living</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-zinc-600">
            Independent makers and trusted brands. Every piece selected for
            quality, longevity, and timeless design.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onShopClick}
              className="btn-primary"
            >
              Shop Collection
            </button>
            <button
              type="button"
              onClick={() => spotlight && onProductView(spotlight.id)}
              className="btn-secondary"
            >
              View Spotlight
            </button>
          </div>
          <dl className="mt-12 grid grid-cols-3 gap-6 border-t border-zinc-200 pt-8">
            {[
              { label: "Products", value: "12+" },
              { label: "Avg. rating", value: "4.6★" },
              { label: "Happy customers", value: "18k" },
            ].map((stat) => (
              <div key={stat.label}>
                <dt className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                  {stat.label}
                </dt>
                <dd className="mt-1 font-display text-2xl text-zinc-900">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {spotlight && (
          <button
            type="button"
            onClick={() => onProductView(spotlight.id)}
            className="group relative mx-auto w-full max-w-md text-left lg:max-w-none"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-zinc-100 shadow-2xl shadow-zinc-900/10 ring-1 ring-zinc-900/5 transition-transform duration-500 group-hover:scale-[1.01]">
              <Image
                src={spotlight.image}
                alt={spotlight.name}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="mb-2 inline-block rounded bg-white/20 px-2 py-0.5 text-xs font-medium uppercase tracking-wider backdrop-blur-sm">
                  Editor&apos;s Pick
                </span>
                <p className="font-display text-xl">{spotlight.name}</p>
                <p className="mt-1 text-sm text-white/80">
                  From {formatPrice(spotlight.price)}
                </p>
              </div>
            </div>
          </button>
        )}
      </div>
    </section>
  );
}
