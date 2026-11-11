import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { brands, getBrandBySlug, getProductsByBrand } from "@/data/catalog";

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const brand = getBrandBySlug(slug);
  if (!brand) notFound();

  const brandProducts = getProductsByBrand(brand.id);

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

      <div className="product-grid">
        {brandProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
