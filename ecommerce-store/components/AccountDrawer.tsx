"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { getProductById } from "@/lib/products";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

interface AccountDrawerProps {
  open: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
  tab: "orders" | "wishlist";
}

export function AccountDrawer({
  open,
  onClose,
  onSelectProduct,
  tab: initialTab,
}: AccountDrawerProps) {
  const { orders, wishlist, toggleWishlist } = useApp();
  const [tab, setTab] = useState(initialTab);

  useEffect(() => {
    setTab(initialTab);
  }, [initialTab, open]);
  const wishlistProducts = wishlist
    .map(getProductById)
    .filter((p): p is Product => !!p);

  return (
    <>
      <div
        className={`overlay ${open ? "overlay--visible" : ""}`}
        onClick={onClose}
      />
      <aside
        className={`cart-sidebar ${open ? "cart-sidebar--open" : ""}`}
        aria-label="Account"
      >
        <div className="flex h-full flex-col bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
            <h2 className="font-display text-xl dark:text-white">Account</h2>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
          <div className="flex border-b border-zinc-100 dark:border-zinc-800">
            {(["orders", "wishlist"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className={`flex-1 py-3 text-xs font-semibold uppercase tracking-wider ${
                  tab === t
                    ? "border-b-2 border-zinc-900 text-zinc-900 dark:border-white dark:text-white"
                    : "text-zinc-400"
                }`}
              >
                {t === "orders" ? `Orders (${orders.length})` : `Wishlist (${wishlist.length})`}
              </button>
            ))}
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {tab === "orders" ? (
              orders.length === 0 ? (
                <p className="py-12 text-center text-sm text-zinc-500">
                  No orders yet. Place your first order to see it here.
                </p>
              ) : (
                <ul className="space-y-4">
                  {orders.map((order) => (
                    <li
                      key={order.id}
                      className="rounded-xl border border-zinc-100 p-4 dark:border-zinc-800"
                    >
                      <div className="flex justify-between text-sm">
                        <span className="font-mono font-medium dark:text-white">
                          #{order.id}
                        </span>
                        <span className="text-zinc-500">{order.date}</span>
                      </div>
                      <p className="mt-1 text-sm font-semibold dark:text-zinc-200">
                        {formatPrice(order.total)} · {order.itemCount} items
                      </p>
                      <ul className="mt-3 space-y-2">
                        {order.items.slice(0, 3).map((item, i) => (
                          <li key={i} className="flex items-center gap-2 text-xs text-zinc-500">
                            <div className="relative h-8 w-8 overflow-hidden rounded bg-zinc-100">
                              <Image src={item.image} alt="" fill sizes="32px" className="object-cover" />
                            </div>
                            {item.name} × {item.quantity}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              )
            ) : wishlistProducts.length === 0 ? (
              <p className="py-12 text-center text-sm text-zinc-500">
                Save items you love — click the heart on any product.
              </p>
            ) : (
              <ul className="space-y-3">
                {wishlistProducts.map((p) => (
                  <li
                    key={p.id}
                    className="flex gap-3 rounded-xl border border-zinc-100 p-3 dark:border-zinc-800"
                  >
                    <button
                      type="button"
                      onClick={() => {
                        onSelectProduct(p);
                        onClose();
                      }}
                      className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-zinc-100"
                    >
                      <Image src={p.image} alt={p.name} fill sizes="56px" className="object-cover" />
                    </button>
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => {
                          onSelectProduct(p);
                          onClose();
                        }}
                        className="text-left text-sm font-medium dark:text-white line-clamp-1"
                      >
                        {p.name}
                      </button>
                      <p className="text-sm font-semibold">{formatPrice(p.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(p.id)}
                      className="text-xs text-zinc-400 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
