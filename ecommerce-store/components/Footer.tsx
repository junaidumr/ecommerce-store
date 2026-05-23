export function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-zinc-900 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <p className="font-display text-xl text-white">Atelier</p>
            <p className="mt-3 text-sm leading-relaxed">
              A premium demo storefront showcasing modern e-commerce UX patterns.
            </p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Shop
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {["New Arrivals", "Best Sellers", "Electronics", "Clothing"].map(
                (link) => (
                  <li key={link}>
                    <a href="#catalog" className="transition-colors hover:text-white">
                      {link}
                    </a>
                  </li>
                ),
              )}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Support
            </h3>
            <ul className="mt-4 space-y-2 text-sm">
              {["Shipping", "Returns", "FAQ", "Contact"].map((link) => (
                <li key={link}>
                  <a href="#" className="transition-colors hover:text-white">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white">
              Newsletter
            </h3>
            <p className="mt-4 text-sm">Early access to drops and exclusive offers.</p>
            <form
              className="mt-3 flex gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 rounded-lg border border-zinc-700 bg-zinc-800 px-3 py-2 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-zinc-500"
              />
              <button type="submit" className="btn-primary shrink-0 !px-4 !py-2 text-xs">
                Join
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-800 pt-8 text-xs sm:flex-row">
          <p>© {new Date().getFullYear()} Atelier Commerce. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white">
              Privacy
            </a>
            <a href="#" className="hover:text-white">
              Terms
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
