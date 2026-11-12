"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useMarketplace } from "@/context/MarketplaceContext";

const links = [
  { href: "/catalog", label: "Catalog" },
  { href: "/commission", label: "Commission" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useMarketplace();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header className="site-header">
      <div className="site-header__inner">
        <BrandLogo priority className="site-header__logo" />

        <div className="site-header__actions">
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="site-nav"
            onClick={() => setMenuOpen((open) => !open)}
          >
            Menu
          </button>

          <nav
            id="site-nav"
            className={`site-nav${menuOpen ? " is-open" : ""}`}
            aria-label="Primary"
          >
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={pathname.startsWith(link.href) ? "is-active" : undefined}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/cart"
            className={`cart-link${pathname.startsWith("/cart") ? " is-active" : ""}`}
          >
            Cart
            <span className="cart-count" aria-live="polite">
              {hydrated ? itemCount : 0}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
