import { brands } from "@/data/catalog";
import { BrandPageClient } from "@/components/BrandPageClient";

export function generateStaticParams() {
  return brands.map((brand) => ({ slug: brand.slug }));
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <BrandPageClient slug={slug} />;
}
