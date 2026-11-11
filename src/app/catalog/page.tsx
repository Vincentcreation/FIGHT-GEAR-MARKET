import { CatalogFilters } from "@/components/CatalogFilters";
import { ProductCard } from "@/components/ProductCard";
import { filterProducts } from "@/data/catalog";

type SearchParams = Promise<{ brand?: string; category?: string }>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const brand = params.brand;
  const category = params.category;
  const filtered = filterProducts({ brand, category });

  return (
    <div>
      <header className="page-intro">
        <p className="eyebrow">Catalog</p>
        <h1>Muay Thai gear</h1>
        <p>
          Filter by fictional brand and category. All prices are demo USD amounts.
        </p>
      </header>

      <CatalogFilters brand={brand} category={category} />

      <p className="muted" style={{ marginBottom: "1rem" }}>
        Showing {filtered.length} product{filtered.length === 1 ? "" : "s"}
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
