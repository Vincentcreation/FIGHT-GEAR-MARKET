import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import { ProductCard } from "@/components/ProductCard";
import { brands, products } from "@/data/catalog";

export default function HomePage() {
  const featured = products.slice(0, 6);

  return (
    <>
      <section className="hero" aria-label="Fight Gear Market hero">
        <div className="hero__inner">
          <Image
            src="/branding/fgm-logo.png"
            alt="Fight Gear Market"
            width={2172}
            height={724}
            className="hero__logo"
            priority
          />
          <h1>Thai Muay Thai brands in one English storefront.</h1>
          <p>
            Browse gloves, shorts, and hand wraps from three fictional suppliers.
            Filter the catalog, pick a variant, and simulate one-brand orders with
            a configurable demo commission.
          </p>
          <div className="hero__actions">
            <Link href="/catalog" className="btn btn-primary">
              Shop the catalog
            </Link>
            <Link href="/commission" className="btn btn-secondary">
              Open commission demo
            </Link>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <p className="eyebrow">Pilot brands</p>
            <h2>Three fictional Thai labels</h2>
          </div>
          <Link href="/catalog">View all products</Link>
        </div>
        <div className="brand-grid">
          {brands.map((brand) => (
            <Link
              key={brand.id}
              href={`/brands/${brand.slug}`}
              className="brand-tile"
              style={{ "--brand-accent": brand.accent } as CSSProperties}
            >
              <div className="brand-tile__accent" />
              <h3>{brand.name}</h3>
              <p>{brand.tagline}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section__head">
          <div>
            <p className="eyebrow">Featured kit</p>
            <h2>Start with these pieces</h2>
          </div>
        </div>
        <div className="product-grid">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
}
