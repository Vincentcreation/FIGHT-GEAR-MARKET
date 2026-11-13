"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { getBrandById } from "@/data/catalog";
import { usePortal } from "@/context/PortalContext";
import { PORTAL_ACCOUNTS } from "@/lib/portal";

export default function PortalSignInPage() {
  const router = useRouter();
  const { account, signIn, signOut, hydrated } = usePortal();

  function choose(accountId: string) {
    signIn(accountId);
    const selected = PORTAL_ACCOUNTS.find((entry) => entry.id === accountId);
    if (selected?.role === "admin") router.push("/admin");
    else router.push("/supplier");
  }

  return (
    <div className="portal-page">
      <header className="page-intro">
        <p className="eyebrow">Supplier portal demo</p>
        <h1>Sign in</h1>
        <p>
          Local demo accounts only. Create a draft as a brand, approve it as
          admin, then confirm it appears in the public catalog. Supabase auth
          comes later.
        </p>
      </header>

      {!hydrated ? <p className="muted">Loading…</p> : null}

      {account ? (
        <aside className="callout" role="status">
          Signed in as <strong>{account.name}</strong>.{" "}
          <button type="button" className="text-btn" onClick={signOut}>
            Sign out
          </button>
        </aside>
      ) : null}

      <div className="account-grid">
        {PORTAL_ACCOUNTS.map((entry) => {
          const brand = entry.brandId ? getBrandById(entry.brandId) : null;
          return (
            <button
              key={entry.id}
              type="button"
              className="account-card"
              onClick={() => choose(entry.id)}
            >
              <p className="eyebrow">{entry.role}</p>
              <h2>{entry.name}</h2>
              <p className="muted">
                {brand
                  ? `Manages ${brand.name} listings only.`
                  : "Reviews pending supplier listings."}
              </p>
            </button>
          );
        })}
      </div>

      <div className="action-row" style={{ marginTop: "1.5rem" }}>
        <Link href="/catalog" className="btn btn-secondary">
          View public catalog
        </Link>
      </div>
    </div>
  );
}
