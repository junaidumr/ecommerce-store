import type { Product, ProductColor } from "./types";

export const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "electronics", label: "Electronics" },
  { id: "clothing", label: "Clothing" },
  { id: "home", label: "Home" },
  { id: "accessories", label: "Accessories" },
] as const;

export const FREE_SHIPPING_THRESHOLD = 100;

const COLORS: ProductColor[] = [
  { name: "Black", hex: "#18181b" },
  { name: "Stone", hex: "#a8a29e" },
  { name: "Navy", hex: "#1e3a5f" },
  { name: "Sand", hex: "#d6d3d1" },
];

type RawProduct = Omit<Product, "images" | "stock"> & {
  images?: string[];
  stock?: number;
};

function stockFromId(id: string): number {
  const n = parseInt(id, 10);
  return 4 + ((n * 7) % 17);
}

function enrich(raw: RawProduct): Product {
  const base = raw.image.split("?")[0];
  const images =
    raw.images ??
    [
      `${raw.image}`,
      `${base}?w=600&h=750&fit=crop&sat=-15`,
      `${base}?w=600&h=750&fit=crop&brightness=1.1`,
    ];

  const clothing = raw.category === "clothing";
  const hasColors =
    raw.category === "clothing" ||
    raw.category === "accessories" ||
    raw.category === "electronics";

  return {
    ...raw,
    images,
    stock: raw.stock ?? stockFromId(raw.id),
    sizes: clothing ? ["XS", "S", "M", "L", "XL"] : undefined,
    colors: hasColors ? COLORS.slice(0, clothing ? 4 : 3) : undefined,
  };
}

const RAW_PRODUCTS: RawProduct[] = [
  {
    id: "1",
    name: "Wireless Headphones Pro",
    price: 149.99,
    compareAtPrice: 199.99,
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=750&fit=crop",
    category: "electronics",
    description:
      "Studio-grade active noise cancellation with 40-hour battery life and multipoint Bluetooth 5.3.",
    rating: 4.8,
    reviewCount: 2847,
    badge: "bestseller",
    featured: true,
  },
  {
    id: "2",
    name: "Smart Watch Series X",
    price: 299.0,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=750&fit=crop",
    category: "electronics",
    description:
      "Titanium case, always-on retina display, and advanced health sensors with 72-hour battery.",
    rating: 4.7,
    reviewCount: 1923,
    badge: "new",
    featured: true,
  },
  {
    id: "3",
    name: "Classic Denim Jacket",
    price: 89.5,
    compareAtPrice: 120.0,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=750&fit=crop",
    category: "clothing",
    description:
      "Japanese selvedge denim with reinforced stitching. Relaxed fit, ages beautifully.",
    rating: 4.6,
    reviewCount: 412,
    badge: "sale",
    featured: true,
  },
  {
    id: "4",
    name: "Minimalist Cotton Tee",
    price: 34.99,
    image:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=750&fit=crop",
    category: "clothing",
    description:
      "GOTS-certified organic cotton. Pre-shrunk with a relaxed drape for everyday wear.",
    rating: 4.5,
    reviewCount: 891,
  },
  {
    id: "5",
    name: "Ceramic Pour-Over Set",
    price: 45.0,
    image:
      "https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e7?w=600&h=750&fit=crop",
    category: "home",
    description:
      "Hand-thrown stoneware dripper and carafe. Includes 100 filters and brew guide.",
    rating: 4.9,
    reviewCount: 156,
    badge: "bestseller",
  },
  {
    id: "6",
    name: "Scented Soy Candle",
    price: 28.0,
    image:
      "https://images.unsplash.com/photo-1602607508640-3a8a3a4e8e3a?w=600&h=750&fit=crop",
    category: "home",
    description:
      "Clean-burning coconut soy blend. Notes of lavender, cedar, and white musk.",
    rating: 4.4,
    reviewCount: 623,
  },
  {
    id: "7",
    name: "Leather Crossbody Bag",
    price: 120.0,
    image:
      "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=750&fit=crop",
    category: "accessories",
    description:
      "Vegetable-tanned full-grain leather. Adjustable strap, interior card slots.",
    rating: 4.7,
    reviewCount: 338,
    featured: true,
  },
  {
    id: "8",
    name: "Polarized Sunglasses",
    price: 65.0,
    compareAtPrice: 85.0,
    image:
      "https://images.unsplash.com/photo-1572635196233-8f0f7580a0a0?w=600&h=750&fit=crop",
    category: "accessories",
    description:
      "CR-39 polarized lenses with anti-reflective coating. Lightweight acetate frame.",
    rating: 4.3,
    reviewCount: 204,
    badge: "sale",
  },
  {
    id: "9",
    name: "Portable Bluetooth Speaker",
    price: 79.99,
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&h=750&fit=crop",
    category: "electronics",
    description:
      "IP67 waterproof with 360° sound. Pair two units for stereo. 12-hour playtime.",
    rating: 4.6,
    reviewCount: 1102,
  },
  {
    id: "10",
    name: "Wool Blend Sweater",
    price: 72.0,
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&h=750&fit=crop",
    category: "clothing",
    description:
      "Merino and cashmere blend. Ribbed crew neck, machine washable on gentle cycle.",
    rating: 4.8,
    reviewCount: 567,
    badge: "new",
  },
  {
    id: "11",
    name: "Desk Plant Set",
    price: 38.5,
    image:
      "https://images.unsplash.com/photo-1485955900006-10f4d024d1b6?w=600&h=750&fit=crop",
    category: "home",
    description:
      "Three low-maintenance succulents in matte ceramic pots. Care card included.",
    rating: 4.5,
    reviewCount: 89,
  },
  {
    id: "12",
    name: "Stainless Steel Water Bottle",
    price: 32.0,
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&h=750&fit=crop",
    category: "accessories",
    description:
      "Double-wall vacuum insulated. Keeps drinks cold 24h or hot 12h. BPA-free.",
    rating: 4.6,
    reviewCount: 2341,
    badge: "bestseller",
  },
];

export const PRODUCTS: Product[] = RAW_PRODUCTS.map(enrich);

export const FEATURED_PRODUCTS = PRODUCTS.filter((p) => p.featured);

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
