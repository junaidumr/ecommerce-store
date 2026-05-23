"use client";

import { useApp } from "@/context/AppContext";
import { formatPrice } from "@/lib/format";

interface HeaderProps {
  onCartOpen: () => void;
  onCatalogClick: () => void;
  onCommandOpen: () => void;
  onAccountOpen: (tab: "orders" | "wishlist") => void;
}

export function Header({
  onCartOpen,
  onCatalogClick,
  onCommandOpen,
  onAccountOpen,
}: HeaderProps) {
  const { itemCount, subtotal, wishlist, darkMode, toggleDarkMode } = useApp();

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-[#fafaf9]/90 backdrop-blur-xl dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="mx-auto flex h-[4.25rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#" className="flex shrink-0 items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900 font-display text-sm text-white transition-transform group-hover:scale-105 dark:bg-white dark:text-zinc-900">
            A
          </span>
          <span className="hidden font-display text-xl tracking-tight text-zinc-900 dark:text-white sm:inline">
            Atelier
          </span>
        </a>

        <button
          type="button"
          onClick={onCommandOpen}
          className="hidden flex-1 items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-left text-sm text-zinc-400 transition-colors hover:border-zinc-300 md:flex dark:border-zinc-700 dark:bg-zinc-900 dark:hover:border-zinc-600"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search products...
          <kbd className="ml-auto rounded border border-zinc-200 px-1.5 py-0.5 text-[10px] dark:border-zinc-600">
            ⌘K
          </kbd>
        </button>

        <nav className="hidden items-center gap-6 lg:flex" aria-label="Main">
          <button
            type="button"
            onClick={onCatalogClick}
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Shop
          </button>
          <button
            type="button"
            onClick={() => onAccountOpen("orders")}
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            Orders
          </button>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <button
            type="button"
            onClick={onCommandOpen}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 md:hidden dark:hover:bg-zinc-800"
            aria-label="Search"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => onAccountOpen("wishlist")}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Wishlist"
          >
            ♡
            {wishlist.length > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {wishlist.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={toggleDarkMode}
            className="flex h-10 w-10 items-center justify-center rounded-full text-zinc-600 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            aria-label="Toggle theme"
          >
            {darkMode ? "☀" : "☾"}
          </button>

          {itemCount > 0 && (
            <span className="hidden text-sm text-zinc-500 lg:inline">
              {formatPrice(subtotal)}
            </span>
          )}

          <button
            type="button"
            onClick={onCartOpen}
            className="relative flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-3 py-2 text-sm font-medium shadow-sm transition-all hover:shadow-md sm:px-4 dark:border-zinc-700 dark:bg-zinc-900 dark:text-white"
            aria-label={`Open bag, ${itemCount} items`}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span className="hidden sm:inline">Bag</span>
            {itemCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-zinc-900 px-1.5 text-[11px] font-bold text-white dark:bg-white dark:text-zinc-900">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
