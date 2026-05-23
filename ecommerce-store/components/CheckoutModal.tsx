"use client";

import Image from "next/image";
import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD } from "@/lib/products";
import { findCoupon, applyCouponDiscount, COUPONS } from "@/lib/coupons";
import { lineOptionsLabel } from "@/lib/cart-line";
import type { OrderRecord } from "@/lib/types";

interface CheckoutModalProps {
  open: boolean;
  onClose: () => void;
  onOrderPlaced: (orderId: string) => void;
}

function generateOrderId() {
  return `ATL-${Date.now().toString(36).toUpperCase().slice(-6)}`;
}

export function CheckoutModal({
  open,
  onClose,
  onOrderPlaced,
}: CheckoutModalProps) {
  const { activeCartItems, subtotal, clearCart, addOrder } = useApp();
  const [step, setStep] = useState<"details" | "review">("details");
  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedCode, setAppliedCode] = useState<string | null>(null);

  const coupon = appliedCode ? findCoupon(appliedCode) ?? null : null;
  const baseShipping =
    activeCartItems.length > 0
      ? subtotal >= FREE_SHIPPING_THRESHOLD
        ? 0
        : 12
      : 0;
  const { discount, shipping } = applyCouponDiscount(
    subtotal,
    baseShipping,
    coupon,
  );
  const tax = (subtotal - discount) * 0.08;
  const total = subtotal - discount + shipping + tax;

  function applyCoupon() {
    const found = findCoupon(couponInput);
    if (!found) {
      setCouponError("Invalid coupon code");
      return;
    }
    if (found.code === "WELCOME25" && subtotal < 150) {
      setCouponError("WELCOME25 requires $150+ subtotal");
      return;
    }
    setAppliedCode(found.code);
    setCouponError("");
  }

  function handlePlaceOrder() {
    const orderId = generateOrderId();
    const record: OrderRecord = {
      id: orderId,
      date: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      total,
      itemCount: activeCartItems.reduce((s, i) => s + i.quantity, 0),
      items: activeCartItems.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
        image: i.product.image,
      })),
    };
    addOrder(record);
    clearCart();
    onOrderPlaced(orderId);
    onClose();
    setStep("details");
    setAppliedCode(null);
    setCouponInput("");
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6">
      <div
        className="absolute inset-0 bg-zinc-900/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
        aria-hidden
      />

      <div
        role="dialog"
        aria-modal="true"
        className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-slide-up dark:bg-zinc-900 sm:rounded-2xl"
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-5 dark:border-zinc-800">
          <div>
            <h2 className="font-display text-xl dark:text-white">Checkout</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Step {step === "details" ? "1" : "2"} of 2
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === "details" ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">First name</span>
                  <input type="text" className="input-field mt-1.5 dark:bg-zinc-800 dark:border-zinc-700" />
                </label>
                <label className="block text-sm">
                  <span className="font-medium text-zinc-700 dark:text-zinc-300">Last name</span>
                  <input type="text" className="input-field mt-1.5 dark:bg-zinc-800 dark:border-zinc-700" />
                </label>
              </div>
              <label className="block text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Email</span>
                <input type="email" className="input-field mt-1.5 dark:bg-zinc-800 dark:border-zinc-700" />
              </label>
              <label className="block text-sm">
                <span className="font-medium text-zinc-700 dark:text-zinc-300">Address</span>
                <input type="text" className="input-field mt-1.5 dark:bg-zinc-800 dark:border-zinc-700" />
              </label>

              <div className="rounded-xl border border-zinc-200 p-4 dark:border-zinc-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Discount code
                </p>
                <div className="mt-2 flex gap-2">
                  <input
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="e.g. ATELIER10"
                    className="input-field flex-1 dark:bg-zinc-800"
                  />
                  <button type="button" onClick={applyCoupon} className="btn-secondary !px-4 shrink-0">
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="mt-1 text-xs text-red-500">{couponError}</p>
                )}
                {appliedCode && (
                  <p className="mt-1 text-xs text-emerald-600">
                    Applied: {appliedCode}
                  </p>
                )}
                <p className="mt-2 text-[10px] text-zinc-400">
                  Try: {COUPONS.map((c) => c.code).join(", ")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setStep("review")}
                disabled={activeCartItems.length === 0}
                className="btn-primary w-full"
              >
                Review Order
              </button>
            </div>
          ) : (
            <>
              <ul className="space-y-4">
                {activeCartItems.map((item) => (
                  <li key={item.lineId} className="flex gap-3">
                    <div className="relative h-14 w-11 overflow-hidden rounded-md bg-zinc-100">
                      <Image src={item.product.image} alt="" fill sizes="44px" className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium dark:text-white">
                        {item.product.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        Qty {item.quantity}
                        {lineOptionsLabel(item) ? ` · ${lineOptionsLabel(item)}` : ""}
                      </p>
                    </div>
                    <p className="text-sm font-medium">
                      {formatPrice(item.product.price * item.quantity)}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="mt-6 space-y-2 rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-800">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Discount</span>
                    <span>−{formatPrice(discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? "Complimentary" : formatPrice(shipping)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Tax</span>
                  <span>{formatPrice(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-zinc-200 pt-3 text-base font-semibold dark:border-zinc-700 dark:text-white">
                  <span>Total</span>
                  <span>{formatPrice(total)}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setStep("details")}
                className="mt-4 text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
              >
                ← Edit details
              </button>
            </>
          )}
        </div>

        {step === "review" && (
          <div className="border-t border-zinc-100 px-6 py-5 dark:border-zinc-800">
            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={activeCartItems.length === 0}
              className="btn-primary w-full"
            >
              Place Order — {formatPrice(total)}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
