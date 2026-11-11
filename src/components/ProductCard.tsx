import Link from "next/link";
import type { CSSProperties } from "react";
import { getBrandById } from "@/data/catalog";
import { CATEGORY_LABELS, type Product } from "@/lib/types";
import { formatUsd } from "@/lib/money";

export function ProductCard({ product }: { product: Product }) {
  const brand = getBrandById(product.brandId);
  const fromPrice = Math.min(...product.variants.map((variant) => variant.priceUsd));

  return (
    <article className="product-card">
      <Link href={`/products/${product.slug}`} className="product-card__media">
        <div
          className="product-swatch"
          style={{ "--swatch": product.color } as CSSProperties}
          aria-hidden
        >
          <span className="product-swatch__label">{CATEGORY_LABELS[product.category]}</span>
        </div>
      </Link>
      <div className="product-card__body">
        {brand ? (
          <Link href={`/brands/${brand.slug}`} className="product-card__brand">
            {brand.name}
          </Link>
        ) : null}
        <h3>
          <Link href={`/products/${product.slug}`}>{product.name}</Link>
        </h3>
        <p>{product.summary}</p>
        <p className="product-card__price">From {formatUsd(fromPrice)}</p>
      </div>
    </article>
  );
}
