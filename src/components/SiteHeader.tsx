"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMarketplace } from "@/context/MarketplaceContext";

const links = [
  { href: "/catalog", label: "Catalog" },
  { href: "/commission", label: "Commission" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useMarketplace();

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <Link href="/" className="brand-mark">
          <span className="brand-mark__word">Fight Gear</span>
          <span className="brand-mark__market">Market</span>
        </Link>
        <nav className="site-nav" aria-label="Primary">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={pathname.startsWith(link.href) ? "is-active" : undefined}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/cart"
            className={`cart-link${pathname.startsWith("/cart") ? " is-active" : ""}`}
          >
            Cart
            <span className="cart-count" aria-live="polite">
              {hydrated ? itemCount : 0}
            </span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
