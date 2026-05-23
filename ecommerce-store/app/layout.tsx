import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Cormorant_Garamond } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Atelier — Premium Commerce Experience",
  description:
    "Advanced demo storefront with variants, wishlist, command palette, order history, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${cormorant.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans text-zinc-900 dark:text-zinc-100">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
