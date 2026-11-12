"use client";

import Link from "next/link";
import { useMarketplace } from "@/context/MarketplaceContext";
import { formatUsd, rateLabel } from "@/lib/money";

export function OrderConfirmation({ orderId }: { orderId: string }) {
  const { getOrder, brandGroups, hydrated } = useMarketplace();
  const order = getOrder(orderId);

  if (!hydrated) {
    return <p className="muted">Loading order…</p>;
  }

  if (!order) {
    return (
      <div className="empty-state">
        <h1>Order not found</h1>
        <p>This simulated order is not in local browser storage.</p>
        <Link href="/catalog" className="btn btn-primary">
          Back to catalog
        </Link>
      </div>
    );
  }

  const remainingBrands = brandGroups.length;

  return (
    <div className="order-confirm">
      <header className="page-intro">
        <p className="eyebrow">Simulated order</p>
        <h1>Order {order.id}</h1>
        <p>
          Demo-only confirmation for <strong>{order.brandName}</strong>. No payment
          was taken.
        </p>
      </header>

      <dl className="meta-grid">
        <div>
          <dt>Buyer</dt>
          <dd>{order.buyerName}</dd>
        </div>
        <div>
          <dt>Destination</dt>
          <dd>{order.destination}</dd>
        </div>
        <div>
          <dt>Status</dt>
          <dd>{order.status}</dd>
        </div>
        <div>
          <dt>Created</dt>
          <dd>{new Date(order.createdAt).toLocaleString()}</dd>
        </div>
      </dl>

      <section className="brand-cart">
        <h2>Items</h2>
        <ul className="cart-lines">
          {order.items.map((item) => (
            <li key={`${item.productId}-${item.variantId}`}>
              <div>
                <p className="cart-lines__name">{item.productName}</p>
                <p className="muted">
                  {item.variantLabel} · qty {item.quantity}
                </p>
              </div>
              <p>{formatUsd(item.lineTotalUsd)}</p>
            </li>
          ))}
        </ul>
        <dl className="money-grid">
          <div>
            <dt>Items subtotal</dt>
            <dd>{formatUsd(order.itemsSubtotalUsd)}</dd>
          </div>
          <div>
            <dt>Demo shipping</dt>
            <dd>{formatUsd(order.shippingUsd)}</dd>
          </div>
          <div>
            <dt>Commission ({rateLabel(order.commissionRate)})</dt>
            <dd>{formatUsd(order.commissionUsd)}</dd>
          </div>
          <div>
            <dt>Seller amount before fees</dt>
            <dd>{formatUsd(order.sellerPayoutUsd)}</dd>
          </div>
        </dl>
      </section>

      {remainingBrands > 0 ? (
        <aside className="callout" role="note">
          <strong>Other brands still in your cart.</strong> Place a separate
          simulated order for each remaining brand from the{" "}
          <Link href="/cart">cart</Link>.
        </aside>
      ) : (
        <aside className="callout callout--quiet" role="note">
          Cart is clear for this browser. To buy another brand, add items from the
          catalog and checkout that brand on its own.
        </aside>
      )}

      <div className="action-row">
        <Link href="/cart" className="btn btn-secondary">
          Return to cart
        </Link>
        <Link href="/commission" className="btn btn-primary">
          Review commission demo
        </Link>
      </div>
    </div>
  );
}
