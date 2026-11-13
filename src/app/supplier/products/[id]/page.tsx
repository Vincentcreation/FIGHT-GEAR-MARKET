"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import { PortalGate } from "@/components/PortalGate";
import { usePortal } from "@/context/PortalContext";
import { LISTING_STATUS_LABELS } from "@/lib/portal";
import { CATEGORY_LABELS, type Category } from "@/lib/types";
import { formatUsd } from "@/lib/money";

function SupplierListingEditor() {
  const params = useParams<{ id: string }>();
  const { getListing, updateDraft, submitForReview, account } = usePortal();
  const listing = getListing(params.id);
  const [message, setMessage] = useState<string | null>(null);

  const editable = useMemo(() => {
    if (!listing || !account) return false;
    if (account.role !== "supplier") return false;
    if (listing.brandId !== account.brandId) return false;
    return listing.status === "draft" || listing.status === "rejected";
  }, [account, listing]);

  if (!listing) {
    return (
      <div className="empty-state">
        <h1>Listing not found</h1>
        <p>It may belong to another brand, or it was never created in this browser.</p>
        <Link href="/supplier" className="btn btn-primary">
          Back to supplier home
        </Link>
      </div>
    );
  }

  if (account?.brandId && listing.brandId !== account.brandId) {
    return (
      <div className="empty-state">
        <h1>Access denied</h1>
        <p>You can only open listings for your own brand.</p>
        <Link href="/supplier" className="btn btn-primary">
          Back to supplier home
        </Link>
      </div>
    );
  }

  function saveField<K extends "name" | "summary" | "description" | "category" | "color">(
    key: K,
    value: string,
  ) {
    if (!editable) return;
    updateDraft(listing!.id, {
      [key]: key === "category" ? (value as Category) : value,
    } as never);
    setMessage("Draft saved.");
  }

  function onSubmit() {
    setMessage(null);
    const updated = submitForReview(listing!.id);
    if (!updated) {
      setMessage("Could not submit this listing.");
      return;
    }
    if (updated.status === "pending_review") {
      setMessage("Submitted for admin review.");
      return;
    }
    setMessage(
      `Submit did not reach review. Current status: ${LISTING_STATUS_LABELS[updated.status]}.`,
    );
  }

  return (
    <div className="portal-page" data-listing-status={listing.status}>
      <header className="page-intro">
        <p className="eyebrow" data-testid="listing-status">
          {LISTING_STATUS_LABELS[listing.status]}
        </p>
        <h1>{listing.name}</h1>
        <p>
          {editable
            ? "Edit the draft, then submit it for admin review."
            : "This listing is locked while it waits for review or after publication."}
        </p>
      </header>

      <form className="portal-form" onSubmit={(event) => event.preventDefault()}>
        <label>
          Product name
          <input
            value={listing.name}
            disabled={!editable}
            onChange={(event) => saveField("name", event.target.value)}
          />
        </label>
        <label>
          Summary
          <input
            value={listing.summary}
            disabled={!editable}
            onChange={(event) => saveField("summary", event.target.value)}
          />
        </label>
        <label>
          Description
          <textarea
            rows={4}
            value={listing.description}
            disabled={!editable}
            onChange={(event) => saveField("description", event.target.value)}
          />
        </label>
        <label>
          Category
          <select
            value={listing.category}
            disabled={!editable}
            onChange={(event) => saveField("category", event.target.value)}
          >
            {(Object.entries(CATEGORY_LABELS) as Array<[Category, string]>).map(
              ([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ),
            )}
          </select>
        </label>
      </form>

      <section className="brand-cart">
        <h2>Variants</h2>
        <ul className="cart-lines">
          {listing.variants.map((variant) => (
            <li key={variant.id}>
              <div>
                <p className="cart-lines__name">{variant.label}</p>
                <p className="muted">
                  SKU {variant.sku} · stock {variant.stock}
                </p>
              </div>
              <p>{formatUsd(variant.priceUsd)}</p>
            </li>
          ))}
        </ul>
      </section>

      {listing.reviewNote ? (
        <aside className="callout" role="note" data-testid="admin-note">
          Admin note: {listing.reviewNote}
        </aside>
      ) : null}

      <div className="action-row">
        {editable ? (
          <button type="button" className="btn btn-primary" onClick={onSubmit}>
            Submit for review
          </button>
        ) : null}
        {listing.status === "published" ? (
          <Link href={`/products/${listing.slug}`} className="btn btn-primary">
            View in catalog
          </Link>
        ) : null}
        <Link href="/supplier" className="btn btn-secondary">
          Back
        </Link>
      </div>
      {message ? (
        <p className="form-feedback" role="status" data-testid="listing-feedback">
          {message}
        </p>
      ) : null}
    </div>
  );
}

export default function SupplierProductPage() {
  return (
    <PortalGate role="supplier">
      <SupplierListingEditor />
    </PortalGate>
  );
}
