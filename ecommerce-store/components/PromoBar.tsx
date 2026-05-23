export function PromoBar() {
  return (
    <div className="bg-zinc-900 text-center text-xs font-medium tracking-wide text-zinc-300 dark:bg-black">
      <p className="px-4 py-2.5">
        Complimentary shipping on orders over $100 ·{" "}
        <span className="text-white">30-day returns</span> · Secure checkout
      </p>
    </div>
  );
}
