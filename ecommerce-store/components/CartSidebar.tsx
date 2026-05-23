"use client";

import Image from "next/image";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/products";
import { lineOptionsLabel } from "@/lib/cart-line";

interface CartSidebarProps {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

export function CartSidebar({
  open,
  onClose,
  onCheckout,
  onContinueShopping,
}: CartSidebarProps) {
  const {
    activeCartItems,
    savedItems,
    subtotal,
    updateQuantity,
    removeFromCart,
    saveForLater,
    moveToCart,
  } = useApp();

  const itemTotal = activeCartItems.reduce((s, i) => s + i.quantity, 0);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const progress = Math.min(100, (subtotal / FREE_SHIPPING_THRESHOLD) * 100);

  return (
    <>
      <div
        className={`overlay ${open ? "overlay--visible" : ""}`}
        onClick={onClose}
        aria-hidden={!open}
      />

      <aside
        className={`cart-sidebar ${open ? "cart-sidebar--open" : ""}`}
        aria-label="Shopping bag"
        aria-hidden={!open}
      >
        <div className="flex h-full flex-col bg-white dark:bg-zinc-900">
          <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
            <div>
              <h2 className="font-display text-xl dark:text-white">Your Bag</h2>
              {activeCartItems.length > 0 && (
                <p className="text-xs text-zinc-500">{itemTotal} items</p>
              )}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-full text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              aria-label="Close bag"
            >
              ✕
            </button>
          </div>

          {activeCartItems.length > 0 && remaining > 0 && (
            <div className="border-b border-zinc-100 px-6 py-4 dark:border-zinc-800">
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                {formatPrice(remaining)} away from{" "}
                <span className="font-semibold text-zinc-900 dark:text-white">
                  free shipping
                </span>
              </p>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
                <div
                  className="h-full rounded-full bg-zinc-900 transition-all duration-500 dark:bg-white"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {activeCartItems.length > 0 && remaining === 0 && (
            <div className="border-b border-emerald-100 bg-emerald-50 px-6 py-3 text-xs font-medium text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
              Complimentary shipping unlocked
            </div>
          )}

          <div className="flex-1 overflow-y-auto px-6 py-4">
            {activeCartItems.length === 0 && savedItems.length === 0 ? (
              <div className="flex h-full flex-col items-center justify-center py-16 text-center">
                <p className="font-medium text-zinc-900 dark:text-white">Your bag is empty</p>
                <p className="mt-1 text-sm text-zinc-500">Discover pieces crafted to last.</p>
                <button type="button" onClick={onContinueShopping} className="btn-primary mt-8">
                  Browse Collection
                </button>
              </div>
            ) : (
              <>
                {activeCartItems.length > 0 && (
                  <ul className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    {activeCartItems.map((item) => {
                      const opts = lineOptionsLabel(item);
                      return (
                        <li key={item.lineId} className="flex gap-4 py-5 first:pt-0">
                          <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100 dark:bg-zinc-800">
                            <Image
                              src={item.product.image}
                              alt={item.product.name}
                              fill
                              sizes="80px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex justify-between gap-2">
                              <div>
                                <h3 className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-2">
                                  {item.product.name}
                                </h3>
                                {opts && (
                                  <p className="text-xs text-zinc-500">{opts}</p>
                                )}
                              </div>
                              <p className="shrink-0 text-sm font-semibold">
                                {formatPrice(item.product.price * item.quantity)}
                              </p>
                            </div>
                            <div className="mt-3 flex items-center justify-between">
                              <div className="qty-control dark:border-zinc-700 dark:bg-zinc-800">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(item.lineId, item.quantity - 1)
                                  }
                                  aria-label="Decrease"
                                >
                                  −
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      item.lineId,
                                      Math.min(item.quantity + 1, item.product.stock),
                                    )
                                  }
                                  disabled={item.quantity >= item.product.stock}
                                  aria-label="Increase"
                                >
                                  +
                                </button>
                              </div>
                              <div className="flex gap-3 text-xs">
                                <button
                                  type="button"
                                  onClick={() => saveForLater(item.lineId)}
                                  className="text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                                >
                                  Save
                                </button>
                                <button
                                  type="button"
                                  onClick={() => removeFromCart(item.lineId)}
                                  className="text-zinc-400 hover:text-red-500"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}

                {savedItems.length > 0 && (
                  <div className="mt-6 border-t border-zinc-100 pt-6 dark:border-zinc-800">
                    <h3 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                      Saved for later ({savedItems.length})
                    </h3>
                    <ul className="mt-4 space-y-4">
                      {savedItems.map((item) => (
                        <li key={item.lineId} className="flex gap-3 opacity-80">
                          <div className="relative h-16 w-14 overflow-hidden rounded-lg bg-zinc-100">
                            <Image
                              src={item.product.image}
                              alt=""
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium dark:text-white line-clamp-1">
                              {item.product.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => moveToCart(item.lineId)}
                              className="mt-1 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:hover:text-white"
                            >
                              Move to bag
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>

          {activeCartItems.length > 0 && (
            <div className="border-t border-zinc-100 px-6 py-6 dark:border-zinc-800">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-semibold dark:text-white">
                  {formatPrice(subtotal)}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                Try ATELIER10, WELCOME25, or FREESHIP at checkout
              </p>
              <button type="button" onClick={onCheckout} className="btn-primary mt-5 w-full">
                Checkout
              </button>
              <button
                type="button"
                onClick={onContinueShopping}
                className="mt-3 w-full text-center text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                Continue shopping
              </button>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
