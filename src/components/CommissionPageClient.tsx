"use client";

import { useMemo, useState } from "react";
import { brands, products } from "@/data/catalog";
import { useMarketplace } from "@/context/MarketplaceContext";
import { CommissionControls } from "@/components/CommissionControls";
import { calcCommission, formatUsd, rateLabel } from "@/lib/money";
import { COMMISSION_RATES } from "@/lib/types";

export function CommissionPageClient() {
  const { commissionRate, cartSubtotalUsd, brandGroups } = useMarketplace();
  const [sampleBrandId, setSampleBrandId] = useState(brands[0]?.id ?? "");

  const sampleSubtotal = useMemo(() => {
    const brandProducts = products.filter((product) => product.brandId === sampleBrandId);
    return brandProducts.reduce((sum, product) => {
      const cheapest = Math.min(...product.variants.map((variant) => variant.priceUsd));
      return sum + cheapest;
    }, 0);
  }, [sampleBrandId]);

  const comparisons = COMMISSION_RATES.map((rate) => {
    const result = calcCommission(sampleSubtotal, rate);
    return { rate, ...result };
  });

  return (
    <div className="commission-page">
      <header className="page-intro">
        <p className="eyebrow">Demo finance view</p>
        <h1>Commission calculator</h1>
        <p>
          Compare 1%, 2%, and 5% on an items subtotal. The selected rate also
          drives cart and order simulations in this browser.
        </p>
      </header>

      <CommissionControls
        itemsSubtotalUsd={cartSubtotalUsd > 0 ? cartSubtotalUsd : sampleSubtotal}
      />

      <section className="sample-panel">
        <div className="sample-panel__head">
          <h2>Sample basket by brand</h2>
          <p>
            Uses the lowest-priced variant of every product from the selected
            fictional brand.
          </p>
        </div>
        <label className="select-field">
          Brand
          <select
            value={sampleBrandId}
            onChange={(event) => setSampleBrandId(event.target.value)}
          >
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </label>
        <p className="muted">Sample items subtotal: {formatUsd(sampleSubtotal)}</p>
        <div className="compare-grid">
          {comparisons.map((row) => (
            <article
              key={row.rate}
              className={
                row.rate === commissionRate ? "compare-card is-active" : "compare-card"
              }
            >
              <h3>{rateLabel(row.rate)}</h3>
              <p>Commission {formatUsd(row.commissionUsd)}</p>
              <p>Seller before fees {formatUsd(row.sellerPayoutUsd)}</p>
            </article>
          ))}
        </div>
      </section>

      {brandGroups.length > 0 ? (
        <section className="sample-panel">
          <h2>Live cart brands</h2>
          <ul className="plain-list">
            {brandGroups.map((group) => {
              const { commissionUsd, sellerPayoutUsd } = calcCommission(
                group.subtotalUsd,
                commissionRate,
              );
              return (
                <li key={group.brandId}>
                  <strong>{group.brandName}</strong> — items {formatUsd(group.subtotalUsd)},
                  commission {formatUsd(commissionUsd)}, seller {formatUsd(sellerPayoutUsd)}
                </li>
              );
            })}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
