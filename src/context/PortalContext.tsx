"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { products as seedProducts } from "@/data/catalog";
import {
  canManageListing,
  defaultVariantKind,
  defaultVariants,
  listingToProduct,
  PORTAL_ACCOUNTS,
  slugify,
  type ListingStatus,
  type PortalAccount,
  type PortalListing,
} from "@/lib/portal";
import type { Category, Product } from "@/lib/types";

const SESSION_KEY = "fgm-portal-session";
const LISTINGS_KEY = "fgm-portal-listings";

type CreateListingInput = {
  name: string;
  summary: string;
  description: string;
  category: Category;
  color: string;
};

type PortalContextValue = {
  hydrated: boolean;
  account: PortalAccount | null;
  listings: PortalListing[];
  publishedProducts: Product[];
  catalogProducts: Product[];
  signIn: (accountId: string) => void;
  signOut: () => void;
  createDraft: (input: CreateListingInput) => PortalListing | null;
  updateDraft: (
    id: string,
    patch: Partial<Pick<PortalListing, "name" | "summary" | "description" | "category" | "color" | "variants" | "variantKind">>,
  ) => PortalListing | null;
  submitForReview: (id: string) => PortalListing | null;
  reviewListing: (
    id: string,
    decision: "published" | "rejected",
    note?: string,
  ) => PortalListing | null;
  getListing: (id: string) => PortalListing | undefined;
  getProductBySlug: (slug: string) => Product | undefined;
  listingsForCurrentSupplier: PortalListing[];
  pendingReviews: PortalListing[];
};

const PortalContext = createContext<PortalContextValue | null>(null);

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function uniqueSlug(base: string, existing: PortalListing[]): string {
  const root = slugify(base) || "new-product";
  let candidate = root;
  let i = 2;
  const taken = new Set([
    ...seedProducts.map((product) => product.slug),
    ...existing.map((listing) => listing.slug),
  ]);
  while (taken.has(candidate)) {
    candidate = `${root}-${i}`;
    i += 1;
  }
  return candidate;
}

export function PortalProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<PortalAccount | null>(null);
  const [listings, setListings] = useState<PortalListing[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const savedAccountId = readJson<string | null>(SESSION_KEY, null);
    const savedListings = readJson<PortalListing[]>(LISTINGS_KEY, []);
    setAccount(PORTAL_ACCOUNTS.find((entry) => entry.id === savedAccountId) ?? null);
    setListings(savedListings);
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (account) window.localStorage.setItem(SESSION_KEY, JSON.stringify(account.id));
    else window.localStorage.removeItem(SESSION_KEY);
  }, [account, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(LISTINGS_KEY, JSON.stringify(listings));
  }, [listings, hydrated]);

  const signIn = useCallback((accountId: string) => {
    const next = PORTAL_ACCOUNTS.find((entry) => entry.id === accountId) ?? null;
    setAccount(next);
  }, []);

  const signOut = useCallback(() => setAccount(null), []);

  const createDraft = useCallback(
    (input: CreateListingInput) => {
      if (!account || account.role !== "supplier" || !account.brandId) return null;
      const now = new Date().toISOString();
      const variantKind = defaultVariantKind(input.category);
      const listing: PortalListing = {
        id: `listing-${Date.now().toString(36)}`,
        slug: uniqueSlug(`${getBrandSlug(account.brandId)}-${input.name}`, listings),
        brandId: account.brandId,
        category: input.category,
        name: input.name.trim(),
        summary: input.summary.trim(),
        description: input.description.trim(),
        variantKind,
        variants: defaultVariants(variantKind),
        color: input.color || "#9A1C23",
        status: "draft",
        createdAt: now,
        updatedAt: now,
        source: "supplier",
      };
      setListings((prev) => [listing, ...prev]);
      return listing;
    },
    [account, listings],
  );

  const updateDraft = useCallback(
    (
      id: string,
      patch: Partial<
        Pick<
          PortalListing,
          "name" | "summary" | "description" | "category" | "color" | "variants" | "variantKind"
        >
      >,
    ) => {
      let updated: PortalListing | null = null;
      setListings((prev) =>
        prev.map((listing) => {
          if (listing.id !== id) return listing;
          if (!canManageListing(account, listing)) return listing;
          if (listing.status === "published") return listing;
          if (account?.role === "supplier" && listing.status === "pending_review") {
            return listing;
          }
          const nextCategory = patch.category ?? listing.category;
          const nextKind =
            patch.variantKind ??
            (patch.category ? defaultVariantKind(nextCategory) : listing.variantKind);
          updated = {
            ...listing,
            ...patch,
            category: nextCategory,
            variantKind: nextKind,
            variants:
              patch.variants ??
              (patch.category && patch.category !== listing.category
                ? defaultVariants(nextKind)
                : listing.variants),
            updatedAt: new Date().toISOString(),
          };
          return updated;
        }),
      );
      return updated;
    },
    [account],
  );

  const submitForReview = useCallback(
    (id: string) => {
      let updated: PortalListing | null = null;
      setListings((prev) =>
        prev.map((listing) => {
          if (listing.id !== id) return listing;
          if (!canManageListing(account, listing)) return listing;
          if (account?.role !== "supplier") return listing;
          if (listing.status !== "draft" && listing.status !== "rejected") return listing;
          const now = new Date().toISOString();
          updated = {
            ...listing,
            status: "pending_review",
            submittedAt: now,
            updatedAt: now,
            reviewNote: undefined,
          };
          return updated;
        }),
      );
      return updated;
    },
    [account],
  );

  const reviewListing = useCallback(
    (id: string, decision: Extract<ListingStatus, "published" | "rejected">, note?: string) => {
      if (account?.role !== "admin") return null;
      let updated: PortalListing | null = null;
      setListings((prev) =>
        prev.map((listing) => {
          if (listing.id !== id) return listing;
          if (listing.status !== "pending_review") return listing;
          const now = new Date().toISOString();
          updated = {
            ...listing,
            status: decision,
            reviewedAt: now,
            updatedAt: now,
            reviewNote: note?.trim() || undefined,
          };
          return updated;
        }),
      );
      return updated;
    },
    [account],
  );

  const getListing = useCallback(
    (id: string) => listings.find((listing) => listing.id === id),
    [listings],
  );

  const publishedProducts = useMemo(
    () =>
      listings
        .filter((listing) => listing.status === "published")
        .map(listingToProduct),
    [listings],
  );

  const catalogProducts = useMemo(
    () => [...publishedProducts, ...seedProducts],
    [publishedProducts],
  );

  const getProductBySlug = useCallback(
    (slug: string) => catalogProducts.find((product) => product.slug === slug),
    [catalogProducts],
  );

  const listingsForCurrentSupplier = useMemo(() => {
    if (!account || account.role !== "supplier" || !account.brandId) return [];
    return listings.filter((listing) => listing.brandId === account.brandId);
  }, [account, listings]);

  const pendingReviews = useMemo(
    () => listings.filter((listing) => listing.status === "pending_review"),
    [listings],
  );

  const value: PortalContextValue = {
    hydrated,
    account,
    listings,
    publishedProducts,
    catalogProducts,
    signIn,
    signOut,
    createDraft,
    updateDraft,
    submitForReview,
    reviewListing,
    getListing,
    getProductBySlug,
    listingsForCurrentSupplier,
    pendingReviews,
  };

  return <PortalContext.Provider value={value}>{children}</PortalContext.Provider>;
}

function getBrandSlug(brandId: string): string {
  const match = brandId.replace(/^brand-/, "");
  return match || "brand";
}

export function usePortal() {
  const context = useContext(PortalContext);
  if (!context) throw new Error("usePortal must be used within PortalProvider");
  return context;
}
