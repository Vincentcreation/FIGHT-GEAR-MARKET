import Link from "next/link";
import { notFound } from "next/navigation";
import type { CSSProperties } from "react";
import { AddToCartForm } from "@/components/AddToCartForm";
import {
  getBrandById,
  getProductBySlug,
  products,
} from "@/data/catalog";
import { CATEGORY_LABELS } from "@/lib/types";

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

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
