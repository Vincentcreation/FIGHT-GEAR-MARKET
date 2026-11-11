"use client";

import { useMarketplace } from "@/context/MarketplaceContext";
import { calcCommission, formatUsd, rateLabel } from "@/lib/money";
import { COMMISSION_RATES } from "@/lib/types";

type Props = {
  itemsSubtotalUsd: number;
  showBreakdown?: boolean;
};

export function CommissionControls({
  itemsSubtotalUsd,
  showBreakdown = true,
}: Props) {
  const { commissionRate, setCommissionRate } = useMarketplace();
  const { commissionUsd, sellerPayoutUsd } = calcCommission(
    itemsSubtotalUsd,
    commissionRate,
  );

  return (
    <section className="commission-panel">
      <div className="commission-panel__head">
        <h2>Demo commission</h2>
        <p>
          Applied to items subtotal only (before shipping). Default is 5%. Seller
          payout shown is before the seller&apos;s own payment fees.
        </p>
      </div>
      <div className="rate-row" role="group" aria-label="Commission rate">
        {COMMISSION_RATES.map((rate) => (
          <button
            key={rate}
            type="button"
            className={rate === commissionRate ? "rate-btn is-active" : "rate-btn"}
            onClick={() => setCommissionRate(rate)}
          >
            {rateLabel(rate)}
          </button>
        ))}
      </div>
      {showBreakdown ? (
        <dl className="money-grid">
          <div>
            <dt>Items subtotal</dt>
            <dd>{formatUsd(itemsSubtotalUsd)}</dd>
          </div>
          <div>
            <dt>Marketplace commission ({rateLabel(commissionRate)})</dt>
            <dd>{formatUsd(commissionUsd)}</dd>
          </div>
          <div>
            <dt>Seller amount before fees</dt>
            <dd>{formatUsd(sellerPayoutUsd)}</dd>
          </div>
        </dl>
      ) : null}
    </section>
  );
}
