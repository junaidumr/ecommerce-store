import { Suspense } from "react";
import { Store } from "@/components/Store";

function StoreFallback() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#fafaf9]">
      <p className="text-sm text-zinc-500">Loading Atelier…</p>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<StoreFallback />}>
      <Store />
    </Suspense>
  );
}
