"use client";

import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";
import { getBrandById } from "@/data/catalog";
import { usePortal } from "@/context/PortalContext";

export function CatalogView({
  brand,
  category,
}: {
  brand?: string;
  category?: string;
}) {
  const { catalogProducts, hydrated } = usePortal();

  const filtered = catalogProducts.filter((product) => {
    const productBrand = getBrandById(product.brandId);
    const brandOk =
      !brand || productBrand?.slug === brand || product.brandId === brand;
    const categoryOk = !category || product.category === category;
    return brandOk && categoryOk;
  });

  return (
    <div>
      <header className="page-intro">
        <p className="eyebrow">Catalog</p>
        <h1>Muay Thai gear</h1>
        <p>
          Filter by fictional brand and category. Seed demo products plus
          supplier listings approved by admin appear here.
        </p>
      </header>

      <CatalogFilters brand={brand} category={category} />

      <p className="muted" style={{ marginBottom: "1rem" }}>
        {hydrated ? `Showing ${filtered.length}` : "Loading"} product
        {filtered.length === 1 ? "" : "s"}
        {brand ? ` · brand ${brand}` : ""}
        {category ? ` · ${category}` : ""}
      </p>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <h2>No products match</h2>
          <p>Clear a filter to see more of the demo catalog.</p>
        </div>
      ) : (
        <div className="product-grid">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
