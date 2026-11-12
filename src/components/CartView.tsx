"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMarketplace } from "@/context/MarketplaceContext";
import { CommissionControls } from "@/components/CommissionControls";
import { formatUsd, rateLabel } from "@/lib/money";
import { calcCommission } from "@/lib/money";

export function CartView() {
  const router = useRouter();
  const {
    brandGroups,
    cartSubtotalUsd,
    commissionRate,
    hydrated,
    updateQuantity,
    removeFromCart,
    placeOrderForBrand,
  } = useMarketplace();
  const [buyerName, setBuyerName] = useState("Alex Demo");
  const [destination, setDestination] = useState("Canada");
  const [error, setError] = useState<string | null>(null);

  if (!hydrated) {
    return <p className="muted">Loading cart…</p>;
  }

  if (brandGroups.length === 0) {
    return (
      <div className="empty-state">
        <h1>Cart is empty</h1>
        <p>Add gloves, shorts, or wraps from the catalog to simulate an order.</p>
        <Link href="/catalog" className="btn btn-primary">
          Browse catalog
        </Link>
      </div>
    );
  }

  function checkoutBrand(brandId: string) {
    setError(null);
    const order = placeOrderForBrand({ brandId, buyerName, destination });
    if (!order) {
      setError("Could not place the simulated order for that brand.");
      return;
    }
    router.push(`/order/${order.id}`);
  }

  return (
    <div className="cart-layout">
      <div className="cart-main">
        <header className="page-intro">
          <p className="eyebrow">Simulated checkout</p>
          <h1>Cart</h1>
          <p>
            One brand per order. If your cart has products from multiple brands,
            place a separate simulated order for each brand.
          </p>
        </header>

        {brandGroups.length > 1 ? (
          <aside className="callout" role="note">
            <strong>Multiple brands in cart.</strong> Checkout below places one
            brand order at a time. Remaining brands stay in the cart so you can
            order them separately.
          </aside>
        ) : null}

        <div className="buyer-fields">
          <label>
            Buyer name
            <input
              value={buyerName}
              onChange={(event) => setBuyerName(event.target.value)}
            />
          </label>
          <label>
            Destination
            <input
              value={destination}
              onChange={(event) => setDestination(event.target.value)}
            />
          </label>
        </div>

        {brandGroups.map((group) => {
          const { commissionUsd, sellerPayoutUsd } = calcCommission(
            group.subtotalUsd,
            commissionRate,
          );
          return (
            <section key={group.brandId} className="brand-cart">
              <div className="brand-cart__head">
                <div>
                  <h2>{group.brandName}</h2>
                  <p className="muted">
                    Items subtotal {formatUsd(group.subtotalUsd)} · Demo shipping
                    $18.00
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => checkoutBrand(group.brandId)}
                >
                  Place simulated order
                </button>
              </div>
              <ul className="cart-lines">
                {group.items.map((item) => (
                  <li key={`${item.productId}-${item.variantId}`}>
                    <div>
                      <p className="cart-lines__name">{item.productName}</p>
                      <p className="muted">
                        {item.variantLabel} · {formatUsd(item.unitPriceUsd)} each
                      </p>
                    </div>
                    <div className="cart-lines__controls">
                      <label>
                        Qty
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuantity(
                              item.productId,
                              item.variantId,
                              Number(event.target.value) || 1,
                            )
                          }
                        />
                      </label>
                      <p>{formatUsd(item.lineTotalUsd)}</p>
                      <button
                        type="button"
                        className="text-btn"
                        onClick={() =>
                          removeFromCart(item.productId, item.variantId)
                        }
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
              <dl className="money-grid money-grid--compact">
                <div>
                  <dt>Commission ({rateLabel(commissionRate)})</dt>
                  <dd>{formatUsd(commissionUsd)}</dd>
                </div>
                <div>
                  <dt>Seller before fees</dt>
                  <dd>{formatUsd(sellerPayoutUsd)}</dd>
                </div>
              </dl>
            </section>
          );
        })}
        {error ? <p className="form-error">{error}</p> : null}
      </div>

      <aside className="cart-aside">
        <div className="summary-card">
          <h2>Cart summary</h2>
          <dl className="money-grid">
            <div>
              <dt>All brands items subtotal</dt>
              <dd>{formatUsd(cartSubtotalUsd)}</dd>
            </div>
            <div>
              <dt>Brands in cart</dt>
              <dd>{brandGroups.length}</dd>
            </div>
          </dl>
          <p className="muted">
            Shipping is estimated per brand order in this demo ($18 flat).
          </p>
        </div>
        <CommissionControls itemsSubtotalUsd={cartSubtotalUsd} />
      </aside>
    </div>
  );
}
