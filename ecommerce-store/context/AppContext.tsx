"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { buildLineId, createCartLine } from "@/lib/cart-line";
import type {
  CartItem,
  CartItemOptions,
  OrderRecord,
  Product,
  ViewMode,
} from "@/lib/types";

const KEYS = {
  cart: "atelier-cart-v2",
  wishlist: "atelier-wishlist",
  recent: "atelier-recent",
  orders: "atelier-orders",
  theme: "atelier-theme",
  view: "atelier-view",
};

function read<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown) {
  localStorage.setItem(key, JSON.stringify(value));
}

interface AppContextValue {
  cartItems: CartItem[];
  activeCartItems: CartItem[];
  savedItems: CartItem[];
  itemCount: number;
  subtotal: number;
  addToCart: (product: Product, options?: CartItemOptions) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeFromCart: (lineId: string) => void;
  saveForLater: (lineId: string) => void;
  moveToCart: (lineId: string) => void;
  clearCart: () => void;

  wishlist: string[];
  toggleWishlist: (productId: string) => boolean;
  isWishlisted: (productId: string) => boolean;

  recentIds: string[];
  trackView: (productId: string) => void;

  orders: OrderRecord[];
  addOrder: (order: OrderRecord) => void;

  darkMode: boolean;
  toggleDarkMode: () => void;

  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const AppContext = createContext<AppContextValue | null>(null);

function migrateCartItems(items: CartItem[]): CartItem[] {
  return items.map((item) => {
    if (item.lineId) return item;
    const legacy = item as CartItem & { product: Product; quantity: number };
    return {
      ...legacy,
      lineId: buildLineId(legacy.product.id),
      savedForLater: legacy.savedForLater ?? false,
    };
  });
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [recentIds, setRecentIds] = useState<string[]>([]);
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [darkMode, setDarkMode] = useState(false);
  const [viewMode, setViewModeState] = useState<ViewMode>("grid");
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setCartItems(migrateCartItems(read(KEYS.cart, [])));
    setWishlist(read(KEYS.wishlist, []));
    setRecentIds(read(KEYS.recent, []));
    setOrders(read(KEYS.orders, []));
    setDarkMode(read(KEYS.theme, false));
    setViewModeState(read(KEYS.view, "grid"));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    write(KEYS.cart, cartItems);
    write(KEYS.wishlist, wishlist);
    write(KEYS.recent, recentIds);
    write(KEYS.orders, orders);
    write(KEYS.theme, darkMode);
    write(KEYS.view, viewMode);
  }, [cartItems, wishlist, recentIds, orders, darkMode, viewMode, hydrated]);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const activeCartItems = useMemo(
    () => cartItems.filter((i) => !i.savedForLater),
    [cartItems],
  );

  const savedItems = useMemo(
    () => cartItems.filter((i) => i.savedForLater),
    [cartItems],
  );

  const itemCount = useMemo(
    () => activeCartItems.reduce((s, i) => s + i.quantity, 0),
    [activeCartItems],
  );

  const subtotal = useMemo(
    () =>
      activeCartItems.reduce(
        (s, i) => s + i.product.price * i.quantity,
        0,
      ),
    [activeCartItems],
  );

  const addToCart = useCallback(
    (product: Product, options?: CartItemOptions) => {
      const lineId = buildLineId(product.id, options);
      setCartItems((prev) => {
        const existing = prev.find(
          (i) => i.lineId === lineId && !i.savedForLater,
        );
        if (existing) {
          if (existing.quantity >= product.stock) return prev;
          return prev.map((i) =>
            i.lineId === lineId && !i.savedForLater
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          );
        }
        return [...prev, createCartLine(product, 1, options)];
      });
    },
    [],
  );

  const updateQuantity = useCallback((lineId: string, quantity: number) => {
    setCartItems((prev) => {
      const item = prev.find((i) => i.lineId === lineId);
      if (!item) return prev;
      if (quantity < 1) return prev.filter((i) => i.lineId !== lineId);
      const capped = Math.min(quantity, item.product.stock);
      return prev.map((i) =>
        i.lineId === lineId ? { ...i, quantity: capped } : i,
      );
    });
  }, []);

  const removeFromCart = useCallback((lineId: string) => {
    setCartItems((prev) => prev.filter((i) => i.lineId !== lineId));
  }, []);

  const saveForLater = useCallback((lineId: string) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.lineId === lineId ? { ...i, savedForLater: true } : i,
      ),
    );
  }, []);

  const moveToCart = useCallback((lineId: string) => {
    setCartItems((prev) =>
      prev.map((i) =>
        i.lineId === lineId ? { ...i, savedForLater: false } : i,
      ),
    );
  }, []);

  const clearCart = useCallback(() => {
    setCartItems((prev) => prev.filter((i) => i.savedForLater));
  }, []);

  const toggleWishlist = useCallback((productId: string) => {
    let added = false;
    setWishlist((prev) => {
      if (prev.includes(productId)) {
        return prev.filter((id) => id !== productId);
      }
      added = true;
      return [productId, ...prev];
    });
    return added;
  }, []);

  const isWishlisted = useCallback(
    (productId: string) => wishlist.includes(productId),
    [wishlist],
  );

  const trackView = useCallback((productId: string) => {
    setRecentIds((prev) => {
      const next = [productId, ...prev.filter((id) => id !== productId)];
      return next.slice(0, 8);
    });
  }, []);

  const addOrder = useCallback((order: OrderRecord) => {
    setOrders((prev) => [order, ...prev].slice(0, 20));
  }, []);

  const toggleDarkMode = useCallback(() => setDarkMode((d) => !d), []);

  const setViewMode = useCallback((mode: ViewMode) => setViewModeState(mode), []);

  const value = useMemo(
    () => ({
      cartItems,
      activeCartItems,
      savedItems,
      itemCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveForLater,
      moveToCart,
      clearCart,
      wishlist,
      toggleWishlist,
      isWishlisted,
      recentIds,
      trackView,
      orders,
      addOrder,
      darkMode,
      toggleDarkMode,
      viewMode,
      setViewMode,
    }),
    [
      cartItems,
      activeCartItems,
      savedItems,
      itemCount,
      subtotal,
      addToCart,
      updateQuantity,
      removeFromCart,
      saveForLater,
      moveToCart,
      clearCart,
      wishlist,
      toggleWishlist,
      isWishlisted,
      recentIds,
      trackView,
      orders,
      addOrder,
      darkMode,
      toggleDarkMode,
      viewMode,
      setViewMode,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used within AppProvider");
  return ctx;
}

/** @deprecated Use useApp */
export function useCart() {
  const app = useApp();
  return {
    items: app.activeCartItems,
    itemCount: app.itemCount,
    subtotal: app.subtotal,
    addItem: app.addToCart,
    removeItem: (productId: string) => {
      const line = app.activeCartItems.find((i) => i.product.id === productId);
      if (line) app.removeFromCart(line.lineId);
    },
    updateQuantity: (productId: string, quantity: number) => {
      const line = app.cartItems.find((i) => i.product.id === productId);
      if (line) app.updateQuantity(line.lineId, quantity);
    },
    clearCart: app.clearCart,
  };
}
