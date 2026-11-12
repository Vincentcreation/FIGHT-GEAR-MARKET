"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { PortalGate } from "@/components/PortalGate";
import { usePortal } from "@/context/PortalContext";
import { CATEGORY_LABELS, type Category } from "@/lib/types";

function NewDraftForm() {
  const router = useRouter();
  const { createDraft } = usePortal();
  const [name, setName] = useState("");
  const [summary, setSummary] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("gloves");
  const [color, setColor] = useState("#9A1C23");
  const [error, setError] = useState<string | null>(null);

  function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    if (!name.trim()) {
      setError("Product name is required.");
      return;
    }
    const listing = createDraft({ name, summary, description, category, color });
    if (!listing) {
      setError("Could not create draft for this account.");
      return;
    }
    router.push(`/supplier/products/${listing.id}`);
  }

  return (
    <div className="portal-page">
      <header className="page-intro">
        <p className="eyebrow">New listing</p>
        <h1>Create draft</h1>
        <p>Drafts stay private to your brand until you submit them for admin review.</p>
      </header>

      <form className="portal-form" onSubmit={onSubmit}>
        <label>
          Product name
          <input value={name} onChange={(event) => setName(event.target.value)} required />
        </label>
        <label>
          Summary
          <input value={summary} onChange={(event) => setSummary(event.target.value)} />
        </label>
        <label>
          Description
          <textarea
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
        <label>
          Category
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as Category)}
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
        <label>
          Swatch color
          <input
            type="color"
            value={color}
            onChange={(event) => setColor(event.target.value)}
          />
        </label>
        {error ? <p className="form-error">{error}</p> : null}
        <div className="action-row">
          <button type="submit" className="btn btn-primary">
            Save draft
          </button>
          <Link href="/supplier" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}

export default function NewSupplierProductPage() {
  return (
    <PortalGate role="supplier">
      <NewDraftForm />
    </PortalGate>
  );
}
