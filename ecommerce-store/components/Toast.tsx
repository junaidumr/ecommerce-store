"use client";

import Image from "next/image";

interface ToastProps {
  message: string;
  image?: string;
  visible: boolean;
}

export function Toast({ message, image, visible }: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      className={`toast ${visible ? "toast--visible" : ""}`}
    >
      {image ? (
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
          <Image src={image} alt="" fill sizes="40px" className="object-cover" />
        </div>
      ) : (
        <svg
          className="h-5 w-5 shrink-0 text-emerald-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      <div>
        <p className="text-sm font-medium text-zinc-900">{message}</p>
        <p className="text-xs text-zinc-500">Added to your bag</p>
      </div>
    </div>
  );
}
