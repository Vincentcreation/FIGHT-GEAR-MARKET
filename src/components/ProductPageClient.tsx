"use client";

import Link from "next/link";
import type { CSSProperties } from "react";
import { AddToCartForm } from "@/components/AddToCartForm";
import { getBrandById, getProductBySlug as getSeedProduct } from "@/data/catalog";
import { usePortal } from "@/context/PortalContext";
import { CATEGORY_LABELS } from "@/lib/types";

export function ProductPageClient({ slug }: { slug: string }) {
  const { getProductBySlug, hydrated } = usePortal();
  const product = getSeedProduct(slug) ?? (hydrated ? getProductBySlug(slug) : undefined);

  if (!hydrated && !getSeedProduct(slug)) {
    return <p className="muted">Loading product…</p>;
  }

  if (!product) {
    return (
      <div className="empty-state">
        <h1>Product not found</h1>
        <p>This listing is unavailable or still waiting for admin approval.</p>
        <Link href="/catalog" className="btn btn-primary">
          Back to catalog
        </Link>
      </div>
    );
  }

  const brand = getBrandById(product.brandId);

  return (
    <div className="product-layout">
      <div
        className="product-hero-swatch"
        style={{ "--swatch": product.color } as CSSProperties}
        aria-hidden
      />
      <div>
        <header className="page-intro">
          <p className="eyebrow">{CATEGORY_LABELS[product.category]}</p>
          <h1>{product.name}</h1>
          {brand ? (
            <p>
              By{" "}
              <Link href={`/brands/${brand.slug}`}>
                <strong>{brand.name}</strong>
              </Link>
            </p>
          ) : null}
          <p>{product.description}</p>
        </header>
        <AddToCartForm product={product} />
      </div>
    </div>
  );
}
