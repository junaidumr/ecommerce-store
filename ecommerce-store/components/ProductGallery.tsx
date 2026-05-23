"use client";

import Image from "next/image";
import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  alt: string;
}

export function ProductGallery({ images, alt }: ProductGalleryProps) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);

  return (
    <div className="flex flex-col gap-3 sm:flex-row-reverse">
      <div
        className={`relative aspect-square flex-1 overflow-hidden rounded-xl bg-zinc-100 dark:bg-zinc-800 ${
          zoom ? "cursor-zoom-out" : "cursor-zoom-in"
        }`}
        onClick={() => setZoom((z) => !z)}
      >
        <Image
          src={images[active]}
          alt={alt}
          fill
          sizes="(max-width: 640px) 100vw, 45vw"
          className={`object-cover transition-transform duration-500 ${
            zoom ? "scale-150" : "scale-100"
          }`}
          priority
        />
      </div>
      <div className="flex gap-2 sm:flex-col">
        {images.map((src, i) => (
          <button
            key={src}
            type="button"
            onClick={() => {
              setActive(i);
              setZoom(false);
            }}
            className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 transition-all sm:h-14 sm:w-14 ${
              active === i
                ? "ring-zinc-900 dark:ring-white"
                : "ring-transparent opacity-70 hover:opacity-100"
            }`}
          >
            <Image src={src} alt="" fill sizes="64px" className="object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
