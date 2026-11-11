"use client";

import Link from "next/link";
import { useMemo } from "react";
import { brands } from "@/data/catalog";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

type Props = {
  brand?: string;
  category?: string;
};

function buildHref(next: { brand?: string; category?: string }) {
  const params = new URLSearchParams();
  if (next.brand) params.set("brand", next.brand);
  if (next.category) params.set("category", next.category);
  const query = params.toString();
  return query ? `/catalog?${query}` : "/catalog";
}

export function CatalogFilters({ brand, category }: Props) {
  const categories = useMemo(
    () => Object.entries(CATEGORY_LABELS) as Array<[Category, string]>,
    [],
  );

  return (
    <div className="filters">
      <div className="filters__group">
        <p className="filters__label">Brand</p>
        <div className="filter-row">
          <Link
            href={buildHref({ category })}
            className={!brand ? "filter-chip is-active" : "filter-chip"}
          >
            All brands
          </Link>
          {brands.map((entry) => (
            <Link
              key={entry.id}
              href={buildHref({ brand: entry.slug, category })}
              className={brand === entry.slug ? "filter-chip is-active" : "filter-chip"}
            >
              {entry.name}
            </Link>
          ))}
        </div>
      </div>
      <div className="filters__group">
        <p className="filters__label">Category</p>
        <div className="filter-row">
          <Link
            href={buildHref({ brand })}
            className={!category ? "filter-chip is-active" : "filter-chip"}
          >
            All categories
          </Link>
          {categories.map(([value, label]) => (
            <Link
              key={value}
              href={buildHref({ brand, category: value })}
              className={category === value ? "filter-chip is-active" : "filter-chip"}
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
