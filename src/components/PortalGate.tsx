"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { usePortal } from "@/context/PortalContext";
import type { PortalRole } from "@/lib/portal";

export function PortalGate({
  role,
  children,
}: {
  role: PortalRole | PortalRole[];
  children: ReactNode;
}) {
  const { account, hydrated } = usePortal();
  const allowed = Array.isArray(role) ? role : [role];

  if (!hydrated) {
    return <p className="muted">Loading portal…</p>;
  }

  if (!account || !allowed.includes(account.role)) {
    return (
      <div className="empty-state">
        <h1>Sign in required</h1>
        <p>
          This area is for{" "}
          {allowed.map((entry) => entry).join(" or ")} demo accounts. Choose a
          role on the portal sign-in page.
        </p>
        <Link href="/portal" className="btn btn-primary">
          Open portal sign-in
        </Link>
      </div>
    );
  }

  return children;
}
