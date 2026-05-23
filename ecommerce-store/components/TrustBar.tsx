const TRUST_ITEMS = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M5 13l4 4L19 7"
      />
    ),
    title: "Authentic products",
    desc: "Sourced from verified suppliers",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
      />
    ),
    title: "Secure checkout",
    desc: "256-bit SSL encryption",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
      />
    ),
    title: "Easy returns",
    desc: "30-day hassle-free policy",
  },
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z"
      />
    ),
    title: "24/7 support",
    desc: "We're here when you need us",
  },
];

export function TrustBar() {
  return (
    <section className="border-b border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-900">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:grid-cols-4 sm:px-6 lg:px-8">
        {TRUST_ITEMS.map((item) => (
          <div key={item.title} className="flex gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-zinc-100">
              <svg
                className="h-5 w-5 text-zinc-700"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                {item.icon}
              </svg>
            </div>
            <div>
              <p className="text-sm font-semibold text-zinc-900">{item.title}</p>
              <p className="text-xs text-zinc-500">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
