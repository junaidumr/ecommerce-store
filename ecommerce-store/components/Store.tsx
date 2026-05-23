"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Header } from "@/components/Header";
import { PromoBar } from "@/components/PromoBar";
import { Hero } from "@/components/Hero";
import { TrustBar } from "@/components/TrustBar";
import { TrendingStrip } from "@/components/TrendingStrip";
import { ProductCard } from "@/components/ProductCard";
import { CartSidebar } from "@/components/CartSidebar";
import { CheckoutModal } from "@/components/CheckoutModal";
import { ProductDetailModal } from "@/components/ProductDetailModal";
import { OrderSuccessModal } from "@/components/OrderSuccessModal";
import { CommandPalette } from "@/components/CommandPalette";
import { AccountDrawer } from "@/components/AccountDrawer";
import { Filters } from "@/components/Filters";
import { Toast } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { useApp } from "@/context/AppContext";
import { useCatalogUrl } from "@/hooks/useCatalogUrl";
import { PRODUCTS } from "@/lib/products";
import { filterCatalog } from "@/lib/filter-catalog";
import type { CartItemOptions, Product, ToastState } from "@/lib/types";

export function Store() {
  const { addToCart, viewMode, setViewMode, trackView } = useApp();
  const { filters, updateFilters, resetFilters } = useCatalogUrl();
  const catalogRef = useRef<HTMLElement>(null);

  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [commandOpen, setCommandOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [accountTab, setAccountTab] = useState<"orders" | "wishlist">("orders");
  const [detailProduct, setDetailProduct] = useState<Product | null>(null);
  const [orderSuccess, setOrderSuccess] = useState({ open: false, orderId: "" });
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: "",
  });

  const scrollToCatalog = useCallback(() => {
    catalogRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const showToast = useCallback((product: Product) => {
    setToast({
      visible: true,
      message: product.name,
      image: product.image,
      variant: "success",
    });
  }, []);

  useEffect(() => {
    if (!toast.visible) return;
    const timer = setTimeout(
      () => setToast((t) => ({ ...t, visible: false })),
      3200,
    );
    return () => clearTimeout(timer);
  }, [toast.visible, toast.message]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setCommandOpen(true);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const filteredProducts = useMemo(
    () => filterCatalog(PRODUCTS, filters),
    [filters],
  );

  const openProduct = useCallback(
    (product: Product) => {
      trackView(product.id);
      setDetailProduct(product);
    },
    [trackView],
  );

  function handleAddToCart(product: Product, options?: CartItemOptions) {
    addToCart(product, options);
    showToast(product);
  }

  function handleCheckout() {
    setCartOpen(false);
    setCheckoutOpen(true);
  }

  function handleOrderPlaced(orderId: string) {
    setOrderSuccess({ open: true, orderId });
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] dark:bg-zinc-950">
      <PromoBar />
      <Header
        onCartOpen={() => setCartOpen(true)}
        onCatalogClick={scrollToCatalog}
        onCommandOpen={() => setCommandOpen(true)}
        onAccountOpen={(tab) => {
          setAccountTab(tab);
          setAccountOpen(true);
        }}
      />
      <Toast
        message={toast.message}
        image={toast.image}
        visible={toast.visible}
      />

      <CommandPalette
        open={commandOpen}
        onClose={() => setCommandOpen(false)}
        onSelectProduct={(p) => {
          openProduct(p);
          scrollToCatalog();
        }}
        onSelectCategory={(cat) => {
          updateFilters({ category: cat });
          scrollToCatalog();
        }}
      />

      <AccountDrawer
        open={accountOpen}
        onClose={() => setAccountOpen(false)}
        tab={accountTab}
        onSelectProduct={openProduct}
      />

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={handleCheckout}
        onContinueShopping={() => {
          setCartOpen(false);
          scrollToCatalog();
        }}
      />

      <CheckoutModal
        open={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        onOrderPlaced={handleOrderPlaced}
      />

      <ProductDetailModal
        product={detailProduct}
        onClose={() => setDetailProduct(null)}
        onAddToCart={handleAddToCart}
        onSelectRelated={openProduct}
      />

      <OrderSuccessModal
        open={orderSuccess.open}
        orderId={orderSuccess.orderId}
        onClose={() => setOrderSuccess({ open: false, orderId: "" })}
      />

      <main>
        <Hero onShopClick={scrollToCatalog} onProductView={(id) => {
          const p = PRODUCTS.find((x) => x.id === id);
          if (p) openProduct(p);
        }} />
        <TrustBar />
        <TrendingStrip onSelect={openProduct} />

        <section
          id="catalog"
          ref={catalogRef}
          className="mx-auto max-w-7xl scroll-mt-36 px-4 pb-20 sm:px-6 lg:px-8"
        >
          <div className="mb-2 pt-12">
            <h2 className="font-display text-2xl font-medium text-zinc-900 dark:text-white sm:text-3xl">
              The Collection
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Advanced filters · Variants · Shareable URLs
            </p>
          </div>

          <Filters
            filters={filters}
            onChange={updateFilters}
            onReset={resetFilters}
            resultCount={filteredProducts.length}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />

          {filteredProducts.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-white py-20 text-center dark:border-zinc-700 dark:bg-zinc-900">
              <p className="font-display text-xl text-zinc-800 dark:text-white">
                No matches found
              </p>
              <button type="button" onClick={resetFilters} className="btn-secondary mt-6">
                Clear all filters
              </button>
            </div>
          ) : (
            <div
              className={
                viewMode === "grid"
                  ? "mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 lg:grid-cols-3 xl:grid-cols-4"
                  : "mt-8 flex flex-col gap-4"
              }
            >
              {filteredProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  index={index}
                  viewMode={viewMode}
                  onAddToCart={(p) => handleAddToCart(p)}
                  onView={openProduct}
                />
              ))}
            </div>
          )}
        </section>

        <RecentlyViewed onSelect={openProduct} />
      </main>

      <Footer />
    </div>
  );
}
