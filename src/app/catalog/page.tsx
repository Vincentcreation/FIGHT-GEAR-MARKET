import { CatalogView } from "@/components/CatalogView";

type SearchParams = Promise<{ brand?: string; category?: string }>;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  return <CatalogView brand={params.brand} category={params.category} />;
}
