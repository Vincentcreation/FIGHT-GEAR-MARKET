"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { useMarketplace } from "@/context/MarketplaceContext";
import { usePortal } from "@/context/PortalContext";

const links = [
  { href: "/catalog", label: "Catalog" },
  { href: "/commission", label: "Commission" },
  { href: "/portal", label: "Portal" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { itemCount, hydrated } = useMarketplace();
  const { account } = usePortal();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const portalHref =
    account?.role === "admin"
      ? "/admin"
      : account?.role === "supplier"
        ? "/supplier"
        : "/portal";

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
            {links.map((link) => {
              const href = link.href === "/portal" ? portalHref : link.href;
              const active =
                link.href === "/portal"
                  ? pathname.startsWith("/portal") ||
                    pathname.startsWith("/supplier") ||
                    pathname.startsWith("/admin")
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={href}
                  className={active ? "is-active" : undefined}
                >
                  {link.label}
                </Link>
              );
            })}
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
