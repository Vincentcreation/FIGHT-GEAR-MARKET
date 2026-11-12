"use client";

import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { getBrandBySlug } from "@/data/catalog";
import { usePortal } from "@/context/PortalContext";

export function BrandPageClient({ slug }: { slug: string }) {
  const brand = getBrandBySlug(slug);
  const { catalogProducts, hydrated } = usePortal();

  if (!brand) {
    return (
      <div className="empty-state">
        <h1>Brand not found</h1>
        <Link href="/catalog" className="btn btn-primary">
          Back to catalog
        </Link>
      </div>
    );
  }

  const brandProducts = catalogProducts.filter(
    (product) => product.brandId === brand.id,
  );

  return (
    <div>
      <header className="page-intro">
        <p className="eyebrow">{brand.origin}</p>
        <h1>{brand.name}</h1>
        <p>{brand.description}</p>
        <p className="muted">{brand.tagline}</p>
      </header>

      <div className="action-row" style={{ marginBottom: "1.5rem" }}>
        <Link href={`/catalog?brand=${brand.slug}`} className="btn btn-secondary">
          Filter catalog to this brand
        </Link>
      </div>

      {!hydrated ? <p className="muted">Loading products…</p> : null}

      <div className="product-grid">
        {brandProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
