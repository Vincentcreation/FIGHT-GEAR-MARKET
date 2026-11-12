"use client";

import Link from "next/link";
import { PortalGate } from "@/components/PortalGate";
import { getBrandById } from "@/data/catalog";
import { usePortal } from "@/context/PortalContext";
import { LISTING_STATUS_LABELS } from "@/lib/portal";

function SupplierDashboard() {
  const { account, listingsForCurrentSupplier, signOut } = usePortal();
  const brand = account?.brandId ? getBrandById(account.brandId) : undefined;

  return (
    <div className="portal-page">
      <header className="page-intro">
        <p className="eyebrow">Supplier workspace</p>
        <h1>{brand?.name ?? "Supplier"}</h1>
        <p>
          Create product drafts for your brand, submit them for review, and track
          approval status. You cannot see or edit another brand&apos;s listings.
        </p>
      </header>

      <div className="action-row" style={{ marginBottom: "1.25rem" }}>
        <Link href="/supplier/products/new" className="btn btn-primary">
          New product draft
        </Link>
        <button type="button" className="btn btn-secondary" onClick={signOut}>
          Sign out
        </button>
        <Link href="/portal" className="btn btn-secondary">
          Switch account
        </Link>
      </div>

      {listingsForCurrentSupplier.length === 0 ? (
        <div className="empty-state">
          <h2>No listings yet</h2>
          <p>Start with a draft. It stays private until an admin publishes it.</p>
        </div>
      ) : (
        <ul className="listing-table">
          {listingsForCurrentSupplier.map((listing) => (
            <li key={listing.id}>
              <div>
                <p className="cart-lines__name">{listing.name}</p>
                <p className="muted">
                  {LISTING_STATUS_LABELS[listing.status]} · {listing.category}
                </p>
              </div>
              <Link href={`/supplier/products/${listing.id}`} className="btn btn-secondary">
                Open
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function SupplierPage() {
  return (
    <PortalGate role="supplier">
      <SupplierDashboard />
    </PortalGate>
  );
}
