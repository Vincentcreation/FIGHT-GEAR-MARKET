"use client";

import Link from "next/link";
import { PortalGate } from "@/components/PortalGate";
import { getBrandById } from "@/data/catalog";
import { usePortal } from "@/context/PortalContext";
import { LISTING_STATUS_LABELS } from "@/lib/portal";
import { formatUsd } from "@/lib/money";

function AdminReviewBoard() {
  const { pendingReviews, listings, reviewListing, signOut } = usePortal();

  return (
    <div className="portal-page">
      <header className="page-intro">
        <p className="eyebrow">Admin review</p>
        <h1>Publication queue</h1>
        <p>
          Approve a pending supplier draft to publish it into the public catalog.
          Rejected listings return to the brand as editable drafts after they copy
          feedback.
        </p>
      </header>

      <div className="action-row" style={{ marginBottom: "1.25rem" }}>
        <button type="button" className="btn btn-secondary" onClick={signOut}>
          Sign out
        </button>
        <Link href="/portal" className="btn btn-secondary">
          Switch account
        </Link>
        <Link href="/catalog" className="btn btn-secondary">
          Open catalog
        </Link>
      </div>

      <section className="section">
        <div className="section__head">
          <h2>Pending review</h2>
        </div>
        {pendingReviews.length === 0 ? (
          <p className="muted">No listings waiting for approval.</p>
        ) : (
          <ul className="listing-table">
            {pendingReviews.map((listing) => {
              const brand = getBrandById(listing.brandId);
              const fromPrice = Math.min(
                ...listing.variants.map((variant) => variant.priceUsd),
              );
              return (
                <li key={listing.id}>
                  <div>
                    <p className="cart-lines__name">{listing.name}</p>
                    <p className="muted">
                      {brand?.name ?? listing.brandId} · {listing.category} · from{" "}
                      {formatUsd(fromPrice)}
                    </p>
                  </div>
                  <div className="action-row">
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        reviewListing(listing.id, "published", "Approved for catalog.")
                      }
                    >
                      Approve
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() =>
                        reviewListing(
                          listing.id,
                          "rejected",
                          "Please revise details, then resubmit.",
                        )
                      }
                    >
                      Reject
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="section">
        <div className="section__head">
          <h2>All supplier listings</h2>
        </div>
        {listings.length === 0 ? (
          <p className="muted">No supplier-created listings in this browser yet.</p>
        ) : (
          <ul className="listing-table">
            {listings.map((listing) => {
              const brand = getBrandById(listing.brandId);
              return (
                <li key={listing.id}>
                  <div>
                    <p className="cart-lines__name">{listing.name}</p>
                    <p className="muted">
                      {brand?.name ?? listing.brandId} ·{" "}
                      {LISTING_STATUS_LABELS[listing.status]}
                    </p>
                  </div>
                  {listing.status === "published" ? (
                    <Link
                      href={`/products/${listing.slug}`}
                      className="btn btn-secondary"
                    >
                      View
                    </Link>
                  ) : (
                    <span className="muted">—</span>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

export default function AdminPage() {
  return (
    <PortalGate role="admin">
      <AdminReviewBoard />
    </PortalGate>
  );
}
