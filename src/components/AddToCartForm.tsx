"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMarketplace } from "@/context/MarketplaceContext";
import { formatUsd } from "@/lib/money";
import type { Product } from "@/lib/types";

export function AddToCartForm({ product }: { product: Product }) {
  const router = useRouter();
  const { addToCart } = useMarketplace();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState<string | null>(null);

  const selected = useMemo(
    () => product.variants.find((variant) => variant.id === variantId),
    [product.variants, variantId],
  );

  const variantHeading =
    product.variantKind === "weight"
      ? "Glove weight"
      : product.variantKind === "size"
        ? "Size"
        : "Wrap length";

  function handleAddToCart() {
    if (!selected) return;
    addToCart(product.id, selected.id, quantity);
    setMessage(`Added ${quantity} × ${product.name} (${selected.label}) to cart.`);
  }

  return (
    <div className="add-form">
      <div>
        <p className="add-form__legend">{variantHeading}</p>
        <div className="variant-row" role="group" aria-label={variantHeading}>
          {product.variants.map((variant) => (
            <button
              key={variant.id}
              type="button"
              className={
                variant.id === variantId ? "variant-option is-active" : "variant-option"
              }
              aria-pressed={variant.id === variantId}
              onClick={() => setVariantId(variant.id)}
            >
              <span>{variant.label}</span>
              <span className="variant-option__price">{formatUsd(variant.priceUsd)}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="add-form__qty">
        <label htmlFor="qty">Quantity</label>
        <input
          id="qty"
          type="number"
          min={1}
          max={selected?.stock ?? 1}
          value={quantity}
          onChange={(event) => setQuantity(Number(event.target.value) || 1)}
        />
        <p className="muted">
          {selected ? `${selected.stock} in demo stock · SKU ${selected.sku}` : "Select a variant"}
        </p>
      </div>

      <div className="add-form__actions">
        <button
          type="button"
          className="btn btn-primary"
          disabled={!selected}
          onClick={handleAddToCart}
        >
          Add to cart · {selected ? formatUsd(selected.priceUsd * quantity) : "—"}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => router.push("/cart")}
        >
          View cart
        </button>
      </div>
      {message ? <p className="form-feedback" role="status">{message}</p> : null}
    </div>
  );
}
